/**
 * REAL FASHION METRICS SERVICE
 * 
 * Fuente única de verdad para todas las métricas de marcas.
 * - Obtiene datos reales de NewsAPI
 * - Calcula menciones, popularidad, sentimiento, score
 * - NO usa datos hardcodeados
 * - Si NewsAPI falla, devuelve error honesto (no fallback fake)
 */

export interface BrandMetrics {
  brand: string;
  slug: string;
  category: string;
  mentions: number;           // Número real de artículos encontrados
  popularity: number;          // Porcentaje relativo (0-100)
  sentiment: number;           // Análisis de sentimiento (0-100)
  score: number;              // Score global (0-100)
  updatedAt: string;
  source: "newsapi" | "cache" | "error";
}

export interface BrandMetricsResponse {
  status: "success" | "error" | "partial";
  source: "newsapi" | "cache" | "error";
  message?: string;
  ranking: BrandMetrics[];
  updatedAt: string;
  totalMentions: number;
  averagePopularity: number;
  averageSentiment: number;
}

interface NewsApiResponse {
  status: string;
  totalResults?: number;
  articles?: Array<{
    title?: string;
    description?: string;
    content?: string;
    publishedAt?: string;
  }>;
  message?: string;
}

// Palabras clave para análisis de sentimiento
const POSITIVE_WORDS = [
  "excelente",
  "excepcional",
  "innovador",
  "premium",
  "lujo",
  "trending",
  "popular",
  "exitoso",
  "destacado",
  "lider",
  "dominante",
  "preferido",
  "admirado",
  "icónico",
  "emblematico",
  "influencia",
  "éxito",
  "ganador",
  "brillante",
  "espectacular",
];

const NEGATIVE_WORDS = [
  "crisis",
  "declive",
  "problema",
  "controversia",
  "fracaso",
  "critica",
  "demanda",
  "perdida",
  "caida",
  "desastre",
  "escándalo",
  "polémica",
  "colapso",
  "ruina",
  "desventura",
];

/**
 * Calcula sentimiento basado en análisis de palabras clave
 * en títulos y descripciones de artículos
 */
function calculateSentimentFromArticles(articles: NewsApiResponse["articles"] = []): number {
  if (articles.length === 0) return 50; // Neutral si no hay artículos

  let totalScore = 0;
  let textCount = 0;

  articles.forEach((article) => {
    const text = `${article.title || ""} ${article.description || ""}`.toLowerCase();
    
    if (!text.trim()) return;

    let articleScore = 50; // Base neutral
    let keywordCount = 0;

    // Contar palabras positivas
    POSITIVE_WORDS.forEach((word) => {
      const matches = (text.match(new RegExp(word, "g")) || []).length;
      articleScore += matches * 3;
      keywordCount += matches;
    });

    // Restar palabras negativas
    NEGATIVE_WORDS.forEach((word) => {
      const matches = (text.match(new RegExp(word, "g")) || []).length;
      articleScore -= matches * 2;
      keywordCount += matches;
    });

    // Normalizar score a 0-100
    articleScore = Math.max(0, Math.min(100, articleScore));
    totalScore += articleScore;
    textCount++;
  });

  return textCount > 0 ? Math.round(totalScore / textCount) : 50;
}

/**
 * Fetch real metrics for a single brand from NewsAPI
 */
async function fetchBrandMetricsFromNews(
  brandName: string,
  slug: string,
  category: string
): Promise<BrandMetrics | null> {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      console.error(`❌ NEWS_API_KEY no configurada para ${brandName}`);
      return null;
    }

    // Query: brand name + fashion keywords
    const query = encodeURIComponent(
      `"${brandName}" AND (moda OR fashion OR lujo OR luxury OR pasarela OR colección OR tendencias OR estilo)`
    );
    
    const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=es,en&pageSize=100`;
    
    const response = await fetch(url, {
      headers: { "X-API-Key": apiKey },
      next: { revalidate: 3600 }, // Revalidar cada hora
    });

    const data = (await response.json()) as NewsApiResponse;

    if (data.status === "error") {
      console.error(`❌ Error NewsAPI para ${brandName}:`, data.message);
      return null;
    }

    const mentions = data.totalResults || 0;
    const articles = data.articles || [];
    const sentiment = calculateSentimentFromArticles(articles);

    return {
      brand: brandName,
      slug,
      category,
      mentions,
      popularity: 0, // Se calcula después (relativo al máximo)
      sentiment,
      score: 0, // Se calcula después
      updatedAt: new Date().toISOString(),
      source: "newsapi",
    };
  } catch (error) {
    console.error(`❌ Error fetching metrics para ${brandName}:`, error);
    return null;
  }
}

/**
 * Get real metrics for all brands
 * NO FALLBACK - if newsapi fails, returns error
 */
export async function getRealBrandMetrics(): Promise<BrandMetricsResponse> {
  const brandsToFetch = [
    { name: "Zara", slug: "zara", category: "Fast Fashion" },
    { name: "Chanel", slug: "chanel", category: "Luxury" },
    { name: "Gucci", slug: "gucci", category: "Luxury" },
    { name: "Dior", slug: "dior", category: "Luxury" },
    { name: "Prada", slug: "prada", category: "Luxury" },
    { name: "Mango", slug: "mango", category: "Fast Fashion" },
    { name: "H&M", slug: "hm", category: "Fast Fashion" },
    { name: "Massimo Dutti", slug: "massimo-dutti", category: "Premium" },
    { name: "COS", slug: "cos", category: "Premium" },
  ];

  try {
    // Fetch all brands in parallel
    const results = await Promise.allSettled(
      brandsToFetch.map((brand) =>
        fetchBrandMetricsFromNews(brand.name, brand.slug, brand.category)
      )
    );

    // Filter successful results
    const successfulMetrics = results
      .map((result) => (result.status === "fulfilled" ? result.value : null))
      .filter((metric): metric is BrandMetrics => metric !== null);

    if (successfulMetrics.length === 0) {
      return {
        status: "error",
        source: "error",
        message:
          "No se pudieron obtener métricas reales de NewsAPI. Verifica NEWS_API_KEY y disponibilidad del servicio.",
        ranking: [],
        updatedAt: new Date().toISOString(),
        totalMentions: 0,
        averagePopularity: 0,
        averageSentiment: 0,
      };
    }

    // Sort by mentions
    successfulMetrics.sort((a, b) => b.mentions - a.mentions);

    // Calculate relative metrics
    const maxMentions = successfulMetrics[0]?.mentions || 1;
    const maxSentiment = Math.max(...successfulMetrics.map((m) => m.sentiment));
    const minSentiment = Math.min(...successfulMetrics.map((m) => m.sentiment));
    const sentimentRange = maxSentiment - minSentiment || 1;

    const normalizedMetrics = successfulMetrics.map((metric) => {
      // Popularidad: porcentaje relativo respecto a la marca con más menciones
      const popularity = Math.round((metric.mentions / maxMentions) * 100);

      // Score: combinación ponderada de popularidad + sentimiento normalizado
      const normalizedSentiment = Math.round(
        ((metric.sentiment - minSentiment) / sentimentRange) * 100
      );
      const score = Math.round(popularity * 0.6 + normalizedSentiment * 0.4);

      return {
        ...metric,
        popularity: Math.max(0, Math.min(100, popularity)),
        sentiment: metric.sentiment,
        score: Math.max(0, Math.min(100, score)),
      };
    });

    // Calculate aggregates
    const totalMentions = normalizedMetrics.reduce((sum, m) => sum + m.mentions, 0);
    const averagePopularity = Math.round(
      normalizedMetrics.reduce((sum, m) => sum + m.popularity, 0) /
        normalizedMetrics.length
    );
    const averageSentiment = Math.round(
      normalizedMetrics.reduce((sum, m) => sum + m.sentiment, 0) /
        normalizedMetrics.length
    );

    return {
      status: "success",
      source: "newsapi",
      ranking: normalizedMetrics,
      updatedAt: new Date().toISOString(),
      totalMentions,
      averagePopularity,
      averageSentiment,
    };
  } catch (error) {
    console.error("❌ Critical error in getRealBrandMetrics:", error);
    return {
      status: "error",
      source: "error",
      message: "Error crítico al obtener métricas reales. Contacta con soporte.",
      ranking: [],
      updatedAt: new Date().toISOString(),
      totalMentions: 0,
      averagePopularity: 0,
      averageSentiment: 0,
    };
  }
}

/**
 * Get real metrics for a single brand
 */
export async function getRealBrandMetricsBySlug(
  slug: string
): Promise<BrandMetrics | null> {
  const allMetrics = await getRealBrandMetrics();

  if (allMetrics.status !== "success") {
    return null;
  }

  return allMetrics.ranking.find((m) => m.slug === slug) || null;
}

/**
 * Get brand info from slug (nombre, categoría, país)
 */
export function getBrandInfoBySlug(slug: string) {
  const brands: Record<
    string,
    { name: string; category: string; country: string }
  > = {
    zara: { name: "Zara", category: "Fast Fashion", country: "España" },
    chanel: { name: "Chanel", category: "Luxury", country: "Francia" },
    gucci: { name: "Gucci", category: "Luxury", country: "Italia" },
    dior: { name: "Dior", category: "Luxury", country: "Francia" },
    prada: { name: "Prada", category: "Luxury", country: "Italia" },
    mango: { name: "Mango", category: "Fast Fashion", country: "España" },
    "hm": { name: "H&M", category: "Fast Fashion", country: "Suecia" },
    "massimo-dutti": {
      name: "Massimo Dutti",
      category: "Premium",
      country: "España",
    },
    cos: { name: "COS", category: "Premium", country: "Dinamarca" },
  };

  return brands[slug] || null;
}
