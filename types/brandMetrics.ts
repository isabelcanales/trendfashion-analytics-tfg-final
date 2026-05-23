export type BrandCategory = "Luxury" | "Fast Fashion" | "Premium";

export type BrandRankingItem = {
  brand: string;
  mentions: number;
  category: BrandCategory;
};

export type BrandChartPoint = Record<string, string | number>;

export type BrandMetricsResponse = {
  updatedAt: string;
  totalMentions: number;
  averagePopularity: number;
  averageSentiment: number;
  ranking: BrandRankingItem[];
  chartData: BrandChartPoint[];
  source: "newsapi" | "database" | "fallback";
};