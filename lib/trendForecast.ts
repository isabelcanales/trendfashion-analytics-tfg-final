import { MetricType, TrendPrediction, TrendStatus } from "@/types/forecast";

const brandNames: Record<string, string> = {
  zara: "Zara",
  chanel: "Chanel",
  gucci: "Gucci",
  dior: "Dior",
  prada: "Prada",
  mango: "Mango",
  "h-m": "H&M",
  hm: "H&M",
  "massimo-dutti": "Massimo Dutti",
  cos: "COS",
};

const baseMetrics: Record<
  string,
  { popularity: number; sentiment: number; mentions: number; score: number }
> = {
  zara: { popularity: 88, sentiment: 74, mentions: 82, score: 84 },
  chanel: { popularity: 91, sentiment: 86, mentions: 79, score: 89 },
  gucci: { popularity: 86, sentiment: 78, mentions: 84, score: 85 },
  dior: { popularity: 89, sentiment: 84, mentions: 76, score: 87 },
  prada: { popularity: 83, sentiment: 81, mentions: 72, score: 82 },
  mango: { popularity: 76, sentiment: 73, mentions: 68, score: 74 },
  "h-m": { popularity: 79, sentiment: 69, mentions: 80, score: 77 },
  hm: { popularity: 79, sentiment: 69, mentions: 80, score: 77 },
  "massimo-dutti": { popularity: 72, sentiment: 78, mentions: 61, score: 75 },
  cos: { popularity: 70, sentiment: 76, mentions: 58, score: 73 },
};

export async function generateTrendPrediction(
  brandSlug: string,
  metric: MetricType = "score",
  timeHorizon: "corto" | "medio" | "largo" = "medio"
): Promise<TrendPrediction> {
  const normalizedSlug = brandSlug.toLowerCase();
  const brand = brandNames[normalizedSlug] ?? brandSlug;
  const metrics = baseMetrics[normalizedSlug] ?? {
    popularity: 75,
    sentiment: 72,
    mentions: 65,
    score: 74,
  };

  const currentValue = metrics[metric] ?? metrics.score;

  const horizonMultiplier = {
    corto: 0.8,
    medio: 1,
    largo: 1.25,
  }[timeHorizon];

  const estimatedVariation = Number(
    ((6 + (currentValue % 5)) * horizonMultiplier).toFixed(1)
  );

  const predictedValue = Math.min(
    100,
    Math.round(currentValue + estimatedVariation)
  );

  const growthProbability = Math.min(
    96,
    Math.round(68 + estimatedVariation * 2)
  );

  const confidenceLevel = Math.min(
    94,
    Math.round(76 + currentValue / 10)
  );

  const status = getTrendStatus(currentValue, predictedValue);

  return {
    brand,
    metric,
    currentValue,
    predictedValue,
    growthProbability,
    estimatedVariation,
    confidenceLevel,
    timeHorizon,
    status,
    insights: [
      `Se proyecta un incremento del ${Math.round(
        estimatedVariation
      )}% en ${getMetricLabel(metric).toLowerCase()} para ${brand}, posicionándola como una marca con fuerte potencial de crecimiento.`,
      `${brand} puede reforzar su estrategia mediante presencia digital, narrativa de marca y conexión con comunidades interesadas en moda.`,
      `La evolución estimada indica una tendencia ${status.toLowerCase()} en el horizonte ${timeHorizon}.`,
    ],
    generatedAt: new Date(),
  };
}

function getTrendStatus(
  currentValue: number,
  predictedValue: number
): TrendStatus {
  const diff = predictedValue - currentValue;

  if (currentValue >= 85) return "Consolidada";
  if (diff >= 7) return "En crecimiento";
  if (currentValue < 70 && diff > 3) return "Emergente";
  if (diff < -3) return "En declive";

  return "En crecimiento";
}

export function getMetricLabel(metric: MetricType): string {
  const labels: Record<MetricType, string> = {
    popularity: "Popularidad",
    sentiment: "Sentimiento",
    mentions: "Menciones",
    score: "Score global",
  };

  return labels[metric] ?? "Score global";
}

export function getMetricColor(metric: MetricType): string {
  const colors: Record<MetricType, string> = {
    popularity: "#8a2638",
    sentiment: "#c98a98",
    mentions: "#151111",
    score: "#9f233d",
  };

  return colors[metric] ?? "#8a2638";
}