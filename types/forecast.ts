export type MetricType = "popularity" | "sentiment" | "mentions" | "score";

export type TrendStatus = "Emergente" | "En crecimiento" | "Consolidada" | "En declive";

export interface TrendPrediction {
  brand: string;
  metric: MetricType;
  currentValue: number;
  predictedValue: number;
  growthProbability: number; // 0-100
  estimatedVariation: number; // -100 to 100
  confidenceLevel: number; // 0-100
  timeHorizon: "corto" | "medio" | "largo";
  status: TrendStatus;
  insights: string[];
  generatedAt: Date;
}

export interface BrandMetricData {
  brand: string;
  popularity: number;
  sentiment: number;
  mentions: number;
  score: number;
}
