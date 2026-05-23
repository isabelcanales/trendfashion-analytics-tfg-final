import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type BrandCategory = "Luxury" | "Fast Fashion" | "Premium";

type NewsApiArticle = {
  title?: string;
  description?: string;
  publishedAt?: string;
};

type NewsApiResponse = {
  status: string;
  totalResults?: number;
  articles?: NewsApiArticle[];
  message?: string;
};

type BrandConfig = {
  name: string;
  category: BrandCategory;
};

const brands: BrandConfig[] = [
  { name: "Zara", category: "Fast Fashion" },
  { name: "Chanel", category: "Luxury" },
  { name: "Gucci", category: "Luxury" },
  { name: "Dior", category: "Luxury" },
  { name: "Prada", category: "Luxury" },
  { name: "Mango", category: "Fast Fashion" },
  { name: "H&M", category: "Fast Fashion" },
  { name: "Massimo Dutti", category: "Premium" },
  { name: "COS", category: "Premium" },
];

const months = ["Ene", "Feb", "Mar", "Abr"];

const progression = [0.62, 0.74, 0.86, 1];

function getCurrentMonthLabel() {
  const value = new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Fallback coherente.
 * Importante:
 * - Usa las mismas marcas que la API real.
 * - No mete números desproporcionados.
 * - Si Prada está por encima de Chanel en "Todas", también lo estará en "Luxury",
 *   porque el filtro solo debe ocultar marcas, no cambiar datos.
 */
const fallbackRanking = [
  { brand: "Prada", mentions: 880, category: "Luxury" },
  { brand: "Chanel", mentions: 371, category: "Luxury" },
  { brand: "Dior", mentions: 368, category: "Luxury" },
  { brand: "Gucci", mentions: 237, category: "Luxury" },
  { brand: "Zara", mentions: 106, category: "Fast Fashion" },
  { brand: "Mango", mentions: 42, category: "Fast Fashion" },
  { brand: "H&M", mentions: 35, category: "Fast Fashion" },
  { brand: "Massimo Dutti", mentions: 31, category: "Premium" },
  { brand: "COS", mentions: 18, category: "Premium" },
];

const fallbackTotalMentions = fallbackRanking.reduce(
  (total, item) => total + item.mentions,
  0
);

const fallbackMaxMentions = fallbackRanking[0]?.mentions || 1;

const fallbackAveragePopularity = Math.round(
  fallbackRanking.reduce((total, item) => {
    return total + (item.mentions / fallbackMaxMentions) * 100;
  }, 0) / fallbackRanking.length
);

const fallbackChartData = months.map((month, monthIndex) => {
  const row: Record<string, string | number> = { month };

  fallbackRanking.forEach((item) => {
    row[item.brand] = Math.round(item.mentions * progression[monthIndex]);
  });

  return row;
});

const fallbackData = {
  updatedAt: getCurrentMonthLabel(),
  totalMentions: fallbackTotalMentions,
  averagePopularity: fallbackAveragePopularity,
  averageSentiment: 76,
  ranking: fallbackRanking,
  chartData: fallbackChartData,
  source: "fallback",
};

function calculateSentiment(articles: NewsApiArticle[]) {
  const positiveWords = [
    "growth",
    "success",
    "popular",
    "luxury",
    "trend",
    "best",
    "strong",
    "rise",
    "positive",
    "boost",
    "record",
    "launch",
    "collection",
    "fashion week",
  ];

  const negativeWords = [
    "crisis",
    "fall",
    "drop",
    "lawsuit",
    "controversy",
    "negative",
    "decline",
    "problem",
    "scandal",
    "loss",
    "backlash",
  ];

  let score = 70;

  articles.forEach((article) => {
    const text = `${article.title ?? ""} ${
      article.description ?? ""
    }`.toLowerCase();

    positiveWords.forEach((word) => {
      if (text.includes(word)) score += 1;
    });

    negativeWords.forEach((word) => {
      if (text.includes(word)) score -= 1;
    });
  });

  return Math.max(45, Math.min(95, score));
}

async function getBrandMetricsFromDatabase() {
  console.log("[getBrandMetricsFromDatabase] Starting...");
  
  try {
    const recentNews = await prisma.news.findMany({
      where: {
        isHidden: false,
        publishedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        title: true,
        description: true,
        content: true,
        publishedAt: true,
      },
    });

    console.log(`[getBrandMetricsFromDatabase] Found ${recentNews.length} recent news articles (last 7 days)`);

    if (recentNews.length === 0) {
      console.log("[getBrandMetricsFromDatabase] No recent news - returning null");
      return null;
    }

    // Contar menciones por marca
    const brandMentions: Record<string, number> = {};
    brands.forEach((brand) => {
      const mentions = recentNews.filter((article) => {
        const text = `${article.title || ""} ${article.description || ""} ${article.content || ""}`.toLowerCase();
        return text.includes(brand.name.toLowerCase());
      }).length;

      brandMentions[brand.name] = mentions;
    });

    console.log("[getBrandMetricsFromDatabase] Brand mentions:", brandMentions);

    // Validar si hay datos suficientes
    const totalMentions = Object.values(brandMentions).reduce((a, b) => a + b, 0);
    console.log(`[getBrandMetricsFromDatabase] Total mentions: ${totalMentions}`);
    
    if (totalMentions < 10) {
      console.log(`[getBrandMetricsFromDatabase] Total mentions (${totalMentions}) < 10 threshold - returning null`);
      return null;
    }

    // Calcular ranking
    const ranking = brands
      .map((brand) => ({
        brand: brand.name,
        mentions: brandMentions[brand.name],
        category: brand.category,
      }))
      .filter((item) => item.mentions > 0)
      .sort((a, b) => b.mentions - a.mentions);

    if (ranking.length === 0) {
      console.log("[getBrandMetricsFromDatabase] No brands with mentions - returning null");
      return null;
    }

    // Calcular sentimiento desde noticias de BD
    const sentiment = calculateSentiment(
      recentNews.map((n) => ({
        title: n.title,
        description: n.description ?? undefined,
      }))
    );

    // Calcular popularidad
    const maxMentions = ranking[0]?.mentions || 1;
    const averagePopularity = Math.round(
      ranking.reduce((total, item) => {
        return total + (item.mentions / maxMentions) * 100;
      }, 0) / ranking.length
    );

    // Generar chart data (usar últimos 4 meses como progresión)
    const chartData = months.map((month, monthIndex) => {
      const row: Record<string, string | number> = { month };
      ranking.forEach((rankedBrand) => {
        row[rankedBrand.brand] = Math.round(
          rankedBrand.mentions * progression[monthIndex]
        );
      });
      return row;
    });

    console.log("[getBrandMetricsFromDatabase] SUCCESS - returning database metrics");
    return {
      updatedAt: getCurrentMonthLabel(),
      totalMentions: ranking.reduce((a, b) => a + b.mentions, 0),
      averagePopularity,
      averageSentiment: sentiment,
      ranking,
      chartData,
      source: "database" as const,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[getBrandMetricsFromDatabase] ERROR:", errorMessage);
    console.error("[getBrandMetricsFromDatabase] Full error:", error);
    return null;
  }
}

async function fetchBrandNews(brand: BrandConfig) {
  const apiKey = process.env.NEWS_API_KEY;

  console.log(`[fetchBrandNews] Starting fetch for brand: ${brand.name}`);
  console.log(`[fetchBrandNews] NEWS_API_KEY exists: ${!!apiKey}`);

  if (!apiKey) {
    const err = "Missing NEWS_API_KEY environment variable";
    console.error(`[fetchBrandNews] ${err}`);
    throw new Error(err);
  }

  const query = encodeURIComponent(`"${brand.name}" fashion`);
  const url = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=25&apiKey=${apiKey}`;
  
  console.log(`[fetchBrandNews] Query: "${brand.name}" fashion`);
  console.log(`[fetchBrandNews] Endpoint: https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=25`);

  let response;
  try {
    response = await fetch(url, {
      next: { revalidate: 3600 },
    });
    console.log(`[fetchBrandNews] Response status for ${brand.name}: ${response.status}`);
  } catch (fetchError) {
    const err = `Network error fetching for ${brand.name}: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`;
    console.error(`[fetchBrandNews] ${err}`);
    throw new Error(err);
  }

  if (!response.ok) {
    const text = await response.text();
    const err = `NewsAPI HTTP ${response.status} for ${brand.name}: ${text.substring(0, 200)}`;
    console.error(`[fetchBrandNews] ${err}`);
    throw new Error(err);
  }

  let data: NewsApiResponse;
  try {
    data = (await response.json()) as NewsApiResponse;
    console.log(`[fetchBrandNews] Parsed JSON for ${brand.name}: status=${data.status}, articles=${data.articles?.length}, totalResults=${data.totalResults}`);
  } catch (parseError) {
    const err = `JSON parse error for ${brand.name}: ${parseError instanceof Error ? parseError.message : String(parseError)}`;
    console.error(`[fetchBrandNews] ${err}`);
    throw new Error(err);
  }

  // Verificar si NewsAPI devolvió un error
  if (data.status !== "ok") {
    const err = `NewsAPI returned status="${data.status}" for ${brand.name}. Message: ${data.message ?? "No message"}`;
    console.error(`[fetchBrandNews] ${err}`);
    throw new Error(err);
  }

  console.log(`[fetchBrandNews] Success for ${brand.name}: ${data.totalResults} total results, ${data.articles?.length} articles returned`);

  return {
    brand: brand.name,
    category: brand.category,
    totalResults: data.totalResults ?? 0,
    articles: data.articles ?? [],
  };
}

export async function GET() {
  console.log("[GET /api/brand-metrics] Starting request...");
  
  try {
    // PRIMERO: NewsAPI (datos frescos)
    console.log("[GET] Step 1: Attempting to fetch from NewsAPI for all brands...");
    const results = await Promise.allSettled(
      brands.map((brand) => fetchBrandNews(brand))
    );

    console.log("[GET] Step 1 Results:");
    results.forEach((result, index) => {
      const brand = brands[index]?.name;
      if (result.status === "fulfilled") {
        console.log(`  ✓ ${brand}: ${result.value.totalResults} results`);
      } else {
        console.log(`  ✗ ${brand}: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`);
      }
    });

    const successfulResults = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    console.log(`[GET] Step 1: ${successfulResults.length}/${brands.length} brands succeeded`);

    if (successfulResults.length > 0) {
      const ranking = successfulResults
        .map((item) => ({
          brand: item.brand,
          mentions: item.totalResults,
          category: item.category,
        }))
        .sort((a, b) => b.mentions - a.mentions);

      const totalMentions = ranking.reduce(
        (total, item) => total + item.mentions,
        0
      );

      const maxMentions = ranking[0]?.mentions || 1;

      const averagePopularity = Math.round(
        ranking.reduce((total, item) => {
          return total + (item.mentions / maxMentions) * 100;
        }, 0) / ranking.length
      );

      const allArticles = successfulResults.flatMap((item) => item.articles);
      const averageSentiment = calculateSentiment(allArticles);

      const chartData = months.map((month, monthIndex) => {
        const row: Record<string, string | number> = { month };

        ranking.forEach((rankedBrand) => {
          row[rankedBrand.brand] = Math.round(
            rankedBrand.mentions * progression[monthIndex]
          );
        });

        return row;
      });

      console.log("[GET] SUCCESS: Returning data from NewsAPI");
      return NextResponse.json({
        updatedAt: getCurrentMonthLabel(),
        totalMentions,
        averagePopularity,
        averageSentiment,
        ranking,
        chartData,
        source: "newsapi",
      });
    }

    console.log("[GET] Step 1 SKIP: No results from NewsAPI, attempting database fallback...");

    // SEGUNDO: Base de datos (respaldo/caché)
    console.log("[GET] Step 2: Attempting to fetch from database...");
    const dbMetrics = await getBrandMetricsFromDatabase();
    if (dbMetrics) {
      console.log("[GET] Step 2 SUCCESS: Brand metrics retrieved from database");
      return NextResponse.json(dbMetrics);
    }
    console.log("[GET] Step 2 SKIP: No data from database (< 10 mentions or no recent news)");

    // TERCERO: Fallback demo
    console.log("[GET] Step 3: Using fallback demo data");
    return NextResponse.json(fallbackData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[GET] UNCAUGHT ERROR in main try block:", errorMessage);
    console.error("[GET] Full error:", error);
    console.warn("[GET] FALLBACK: Returning fallback data due to error");

    return NextResponse.json(fallbackData);
  }
}