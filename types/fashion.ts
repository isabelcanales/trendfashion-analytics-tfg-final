export type BrandCategory = "Luxury" | "Fast Fashion" | "Premium";
export type MetricType = "mentions" | "popularity" | "sentiment";

export type FashionBrand = {
  id: string;
  name: string;
  category: BrandCategory;
  country: string;
  score: number;
  mentions: number;
  popularity: number;
  sentiment: number;
};

export type FashionTrendPoint = {
  month: string;
  brand: string;
  category: BrandCategory;
  mentions: number;
  popularity: number;
  sentiment: number;
};