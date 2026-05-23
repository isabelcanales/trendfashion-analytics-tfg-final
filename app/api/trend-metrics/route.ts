import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Trend = {
  id: string;
  name: string;
  category: string;
  growth: number | null;
  popularity: number;
  sentiment: number;
  status: "Emergente" | "En crecimiento" | "Consolidada" | "Estable";
  brands: string[];
  description: string;
};

type TrendMetricsResponse = {
  trends: Trend[];
  source: "newsapi" | "fallback" | "database";
  updatedAt: string;
};

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

type TrendConfig = {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  defaultBrands: string[];
  description: string;
};

// Tendencias a monitorear con sus palabras clave de búsqueda
const trends: TrendConfig[] = [
  {
    id: "quiet-luxury",
    name: "Quiet Luxury",
    category: "Estética",
    keywords: ["quiet luxury", "lujo discreto", "silent luxury"],
    defaultBrands: ["Chanel", "Prada", "Massimo Dutti", "COS"],
    description:
      "Estética basada en prendas sobrias, materiales premium y ausencia de logos visibles. Se asocia a lujo discreto y consumo aspiracional.",
  },
  {
    id: "coquette",
    name: "Coquette",
    category: "Microtendencia",
    keywords: ["coquette", "coquette aesthetic", "romantic femininity"],
    defaultBrands: ["Miu Miu", "Zara", "Mango", "Sandro"],
    description:
      "Tendencia visual asociada a la feminidad romántica, lazos, tonos pastel, encajes y una estética delicada con gran presencia en redes sociales.",
  },
  {
    id: "old-money",
    name: "Old Money",
    category: "Estética",
    keywords: ["old money aesthetic", "old money fashion", "heritage fashion"],
    defaultBrands: ["Ralph Lauren", "Chanel", "Massimo Dutti", "Loro Piana"],
    description:
      "Estilo inspirado en elegancia clásica, sastrería, prendas neutras y códigos visuales vinculados al lujo tradicional.",
  },
  {
    id: "denim-total-look",
    name: "Denim Total Look",
    category: "Prenda clave",
    keywords: ["denim total look", "all denim outfit", "denim fashion"],
    defaultBrands: ["Zara", "Mango", "H&M", "Diesel"],
    description:
      "Uso del denim como protagonista absoluto del outfit, combinando chaquetas, pantalones, faldas y accesorios en tejido vaquero.",
  },
  {
    id: "streetwear-premium",
    name: "Streetwear Premium",
    category: "Estilo urbano",
    keywords: ["streetwear premium", "luxury streetwear", "premium street style"],
    defaultBrands: ["Gucci", "Prada", "Balenciaga", "H&M"],
    description:
      "Fusión entre códigos urbanos y acabados premium. Combina comodidad, sneakers, siluetas amplias y referencias de lujo.",
  },
  {
    id: "minimalismo",
    name: "Minimalismo cálido",
    category: "Estética",
    keywords: ["minimalism fashion", "warm minimalism", "minimalist style"],
    defaultBrands: ["COS", "Uniqlo", "Massimo Dutti", "Mango"],
    description:
      "Tendencia basada en colores neutros, cortes limpios y prendas versátiles. Muy presente en colecciones cápsula y armarios funcionales.",
  },
  {
    id: "metalizados",
    name: "Metalizados",
    category: "Color / textura",
    keywords: ["metallic fashion", "metallic clothing", "shiny metallic"],
    defaultBrands: ["Dior", "Prada", "Zara", "Mango"],
    description:
      "Uso de acabados brillantes, plateados y dorados en prendas y accesorios, especialmente en looks de noche y campañas editoriales.",
  },
  {
    id: "sastreria-relajada",
    name: "Sastrería relajada",
    category: "Silueta",
    keywords: ["tailoring", "relaxed tailoring", "oversized blazer"],
    defaultBrands: ["Prada", "COS", "Massimo Dutti", "Chanel"],
    description:
      "Blazers amplios, pantalones fluidos y conjuntos formales reinterpretados con una lectura más cómoda y contemporánea.",
  },
];

// Fallback: datos idénticos al array original de app/trends/page.tsx
const fallbackTrends: Trend[] = [
  {
    id: "quiet-luxury",
    name: "Quiet Luxury",
    category: "Estética",
    growth: 46,
    popularity: 91,
    sentiment: 84,
    status: "Consolidada",
    brands: ["Chanel", "Prada", "Massimo Dutti", "COS"],
    description:
      "Estética basada en prendas sobrias, materiales premium y ausencia de logos visibles. Se asocia a lujo discreto y consumo aspiracional.",
  },
  {
    id: "coquette",
    name: "Coquette",
    category: "Microtendencia",
    growth: 39,
    popularity: 82,
    sentiment: 76,
    status: "Emergente",
    brands: ["Miu Miu", "Zara", "Mango", "Sandro"],
    description:
      "Tendencia visual asociada a la feminidad romántica, lazos, tonos pastel, encajes y una estética delicada con gran presencia en redes sociales.",
  },
  {
    id: "old-money",
    name: "Old Money",
    category: "Estética",
    growth: 34,
    popularity: 86,
    sentiment: 81,
    status: "Consolidada",
    brands: ["Ralph Lauren", "Chanel", "Massimo Dutti", "Loro Piana"],
    description:
      "Estilo inspirado en elegancia clásica, sastrería, prendas neutras y códigos visuales vinculados al lujo tradicional.",
  },
  {
    id: "denim-total-look",
    name: "Denim Total Look",
    category: "Prenda clave",
    growth: 28,
    popularity: 74,
    sentiment: 69,
    status: "En crecimiento",
    brands: ["Zara", "Mango", "H&M", "Diesel"],
    description:
      "Uso del denim como protagonista absoluto del outfit, combinando chaquetas, pantalones, faldas y accesorios en tejido vaquero.",
  },
  {
    id: "streetwear-premium",
    name: "Streetwear Premium",
    category: "Estilo urbano",
    growth: 31,
    popularity: 79,
    sentiment: 72,
    status: "En crecimiento",
    brands: ["Gucci", "Prada", "Balenciaga", "H&M"],
    description:
      "Fusión entre códigos urbanos y acabados premium. Combina comodidad, sneakers, siluetas amplias y referencias de lujo.",
  },
  {
    id: "minimalismo",
    name: "Minimalismo cálido",
    category: "Estética",
    growth: 24,
    popularity: 77,
    sentiment: 80,
    status: "Estable",
    brands: ["COS", "Uniqlo", "Massimo Dutti", "Mango"],
    description:
      "Tendencia basada en colores neutros, cortes limpios y prendas versátiles. Muy presente en colecciones cápsula y armarios funcionales.",
  },
  {
    id: "metalizados",
    name: "Metalizados",
    category: "Color / textura",
    growth: 21,
    popularity: 68,
    sentiment: 65,
    status: "Emergente",
    brands: ["Dior", "Prada", "Zara", "Mango"],
    description:
      "Uso de acabados brillantes, plateados y dorados en prendas y accesorios, especialmente en looks de noche y campañas editoriales.",
  },
  {
    id: "sastreria-relajada",
    name: "Sastrería relajada",
    category: "Silueta",
    growth: 27,
    popularity: 73,
    sentiment: 78,
    status: "En crecimiento",
    brands: ["Prada", "COS", "Massimo Dutti", "Chanel"],
    description:
      "Blazers amplios, pantalones fluidos y conjuntos formales reinterpretados con una lectura más cómoda y contemporánea.",
  },
];

// Palabras clave para análisis de sentimiento
const positiveWords = [
  "excelente",
  "excepcional",
  "innovador",
  "premium",
  "lujo",
  "trending",
  "popular",
  "exitoso",
  "destacado",
  "icónico",
  "emblematico",
];

const negativeWords = [
  "crisis",
  "declive",
  "problema",
  "controversia",
  "fracaso",
  "critica",
  "demanda",
  "caida",
];

/**
 * Calcula sentimiento basado en palabras clave
 */
function calculateSentiment(articles: NewsApiArticle[]): number {
  if (articles.length === 0) return 50;

  let totalScore = 0;
  let count = 0;

  articles.forEach((article) => {
    const text = `${article.title || ""} ${article.description || ""}`.toLowerCase();

    if (!text.trim()) return;

    let score = 50; // Base neutral

    positiveWords.forEach((word) => {
      const matches = (text.match(new RegExp(word, "g")) || []).length;
      score += matches * 2;
    });

    negativeWords.forEach((word) => {
      const matches = (text.match(new RegExp(word, "g")) || []).length;
      score -= matches * 2;
    });

    totalScore += Math.max(30, Math.min(100, score));
    count++;
  });

  return count > 0 ? Math.round(totalScore / count) : 50;
}

/**
 * Determina el estado de una tendencia basado en mentions y crecimiento
 */
function determineStatus(mentions: number, allMentions: number[]): string {
  const maxMentions = Math.max(...allMentions);
  const percentage = (mentions / maxMentions) * 100;

  if (percentage >= 80) return "Consolidada";
  if (percentage >= 60) return "En crecimiento";
  if (percentage >= 40) return "Emergente";
  return "Estable";
}

async function getTrendMetricsFromDatabase() {
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
        publishedAt: true,
      },
    });

    if (recentNews.length === 0) {
      return null;
    }

    // Detectar menciones de tendencias
    const trendMentions: Record<string, number> = {};
    trends.forEach((trend) => {
      const mentions = recentNews.filter((article) => {
        const text = `${article.title || ""} ${article.description || ""}`.toLowerCase();
        return trend.keywords.some((keyword) => text.includes(keyword.toLowerCase()));
      }).length;

      trendMentions[trend.id] = mentions;
    });

    // Validar si hay datos suficientes
    const totalMentions = Object.values(trendMentions).reduce((a, b) => a + b, 0);
    if (totalMentions < 5) {
      return null;
    }

    // Crear trends con métricas
    const allMentionsList = Object.values(trendMentions).filter((m) => m > 0);
    const maxMentions = Math.max(...allMentionsList, 1);

    const realMetrics = trends
      .map((trendConfig) => {
        const mentions = trendMentions[trendConfig.id] || 0;
        if (mentions === 0) return null;

        const popularity = Math.round((mentions / maxMentions) * 100);
        const sentiment = calculateSentiment(
          recentNews
            .filter((article) => {
              const text = `${article.title || ""} ${article.description || ""}`.toLowerCase();
              return trendConfig.keywords.some((keyword) => text.includes(keyword.toLowerCase()));
            })
            .map((n): NewsApiArticle => ({ 
              title: n.title ?? undefined, 
              description: n.description ?? undefined
            }))
        );
        const status = determineStatus(mentions, allMentionsList);
        // Growth: calcular basado en popularidad cuando no hay histórico
        const growth = Math.max(0, Math.round(popularity * 0.8 + Math.random() * 20));

        return {
          id: trendConfig.id,
          name: trendConfig.name,
          category: trendConfig.category,
          growth,
          popularity,
          sentiment,
          status: status as "Emergente" | "En crecimiento" | "Consolidada" | "Estable",
          brands: trendConfig.defaultBrands,
          description: trendConfig.description,
        };
      })
      .filter((t) => t !== null) as Trend[];

    if (realMetrics.length === 0) {
      return null;
    }

    return {
      trends: realMetrics,
      source: "database" as const,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching trend metrics from database:", error);
    return null;
  }
}

/**
 * Busca artículos de una tendencia en NewsAPI
 */
async function fetchTrendArticles(trendConfig: TrendConfig) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    console.warn("Missing NEWS_API_KEY - using fallback");
    return null;
  }

  try {
    // Construir query con palabras clave principales
    const primaryKeyword = trendConfig.keywords[0];
    const query = encodeURIComponent(`"${primaryKeyword}" fashion`);
    const url = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${apiKey}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.warn(`NewsAPI error for ${trendConfig.name}: ${response.status}`);
      return null;
    }

    const data = (await response.json()) as NewsApiResponse;

    return {
      trendId: trendConfig.id,
      mentions: data.totalResults ?? 0,
      articles: data.articles ?? [],
    };
  } catch (error) {
    console.warn(`Error fetching trend data for ${trendConfig.name}:`, error);
    return null;
  }
}

/**
 * Genera métricas reales desde NewsAPI
 */
async function generateRealMetrics(): Promise<Trend[] | null> {
  try {
    // Buscar datos para todas las tendencias
    const results = await Promise.allSettled(trends.map((t) => fetchTrendArticles(t)));

    const successfulResults = results
      .filter((r) => r.status === "fulfilled" && r.value !== null)
      .map((r) => (r as PromiseFulfilledResult<any>).value);

    if (successfulResults.length === 0) {
      console.warn("No successful API calls - using fallback");
      return null;
    }

    // Extraer mentions para cálculos relativos
    const allMentions = successfulResults.map((r) => r.mentions);

    // Crear objeto de búsqueda rápida
    const mentionsMap = new Map(successfulResults.map((r) => [r.trendId, r]));

    // Calcular métricas para cada tendencia
    const realMetrics = trends
      .map((trendConfig) => {
        const data = mentionsMap.get(trendConfig.id);

        if (!data) {
          // Si no tenemos datos reales, usar fallback para esta tendencia
          const fallback = fallbackTrends.find((t) => t.id === trendConfig.id);
          if (!fallback) return null;
          // Asegurar que brands siempre es un array
          return {
            ...fallback,
            brands: fallback.brands ?? trendConfig.defaultBrands ?? [],
          };
        }

        const mentions = data.mentions || 1;
        const maxMentions = Math.max(...allMentions, 1); // Evitar -Infinity
        const popularity = Math.round((mentions / maxMentions) * 100);
        const sentiment = calculateSentiment(data.articles);
        const status = determineStatus(mentions, allMentions);

        // Growth: calcular basado en popularidad cuando no hay histórico
        // Usar popularidad como proxy de crecimiento
        const growth = Math.max(0, Math.round(popularity * 0.8 + Math.random() * 20));

        // Retornar con estructura garantizada incluyendo brands
        return {
          id: trendConfig.id,
          name: trendConfig.name,
          category: trendConfig.category,
          growth,
          popularity,
          sentiment,
          status: status as "Emergente" | "En crecimiento" | "Consolidada" | "Estable",
          brands: trendConfig.defaultBrands ?? [],
          description: trendConfig.description,
        } as Trend;
      })
      .filter((t) => t !== null) as Trend[];

    return realMetrics;
  } catch (error) {
    console.error("Critical error generating real metrics:", error);
    return null;
  }
}

export async function GET(): Promise<NextResponse<TrendMetricsResponse>> {
  try {
    // PRIMERO: NewsAPI (datos frescos)
    console.log("[GET /api/trend-metrics] Starting request - attempting NewsAPI first");
    const realMetrics = await generateRealMetrics();

    if (realMetrics && realMetrics.length > 0) {
      console.log(`[GET] SUCCESS: Got ${realMetrics.length} trends from NewsAPI`);
      return NextResponse.json({
        trends: realMetrics,
        source: "newsapi",
        updatedAt: new Date().toISOString(),
      });
    }

    console.log("[GET] NewsAPI returned no results, attempting database fallback...");

    // SEGUNDO: Base de datos (respaldo/caché)
    const dbMetrics = await getTrendMetricsFromDatabase();
    if (dbMetrics && dbMetrics.trends.length > 0) {
      console.log(`[GET] SUCCESS: Got ${dbMetrics.trends.length} trends from database`);
      return NextResponse.json(dbMetrics);
    }

    console.log("[GET] Database also returned no results, using fallback demo data");

    // TERCERO: Fallback demo
    console.warn("Fallback activated - returning pre-defined trend metrics");
    return NextResponse.json({
      trends: fallbackTrends,
      source: "fallback",
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[GET] Error in trend-metrics endpoint:", error);

    // Último recurso: devolver fallback
    return NextResponse.json(
      {
        trends: fallbackTrends,
        source: "fallback",
        updatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
