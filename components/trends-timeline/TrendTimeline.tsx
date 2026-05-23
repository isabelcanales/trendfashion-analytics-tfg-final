"use client";

import { TrendTimelineItem } from "./TrendTimelineItem";

type TimelineEvent = {
  id: string;
  name: string;
  category: string;
  state: "Emergente" | "En crecimiento" | "Consolidada" | "En descenso" | "Estable";
  popularity: number;
  growth: number | null;
  date: string;
  period: string;
  description: string;
  explanation?: string;
  brands: string[];
  metrics: {
    mentions: number;
    engagement?: number;
    sentiment?: number;
    reach?: number;
  };
  timeline?: Array<{ month: string; value: number }>;
};

interface TrendTimelineProps {
  trends: TimelineEvent[];
  onSelectTrend: (trend: TimelineEvent) => void;
}

export function TrendTimeline({ trends, onSelectTrend }: TrendTimelineProps) {
  if (trends.length === 0) {
    return (
      <div className="rounded-2xl border border-[#eadbd4] bg-white p-12 text-center">
        <p className="text-[#6d6260]">
          No hay tendencias que coincidan con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12">
      {trends.map((trend, index) => (
        <TrendTimelineItem
          key={trend.id}
          trend={trend}
          index={index}
          isEven={index % 2 === 0}
          onClick={onSelectTrend}
        />
      ))}
    </div>
  );
}
