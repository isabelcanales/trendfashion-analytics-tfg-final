"use client";

import { motion } from "motion/react";

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

function getStateColor(state: string) {
  switch (state) {
    case "Emergente":
      return { bg: "bg-[#f7ece8]", text: "text-[#8a2638]" };
    case "En crecimiento":
      return { bg: "bg-[#151111]", text: "text-white" };
    case "Consolidada":
      return { bg: "bg-[#eadbd4]", text: "text-[#151111]" };
    case "En descenso":
      return { bg: "bg-[#fbf7f4]", text: "text-[#6d6260]" };
    default:
      return { bg: "bg-[#f0e3de]", text: "text-[#6d6260]" };
  }
}

function getStateIcon(state: string) {
  switch (state) {
    case "Emergente":
      return "✨";
    case "En crecimiento":
      return "📈";
    case "Consolidada":
      return "⭐";
    case "En descenso":
      return "📉";
    default:
      return "•";
  }
}

interface TrendDetailCardProps {
  trend: TimelineEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TrendDetailCard({
  trend,
  isOpen,
  onClose,
}: TrendDetailCardProps) {
  if (!trend) return null;

  const { bg, text } = getStateColor(trend.state);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0.95, opacity: isOpen ? 1 : 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white shadow-2xl"
      >
        <div className="space-y-8 p-8">
          {/* HEADER */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-3">
                <span className={`rounded-full ${bg} px-3 py-1 text-xs font-bold ${text}`}>
                  {getStateIcon(trend.state)} {trend.state}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-[#8a2638]">
                  {trend.category}
                </span>
              </div>

              <h1 className="font-serif text-4xl font-bold text-[#151111]">
                {trend.name}
              </h1>

              <p className="mt-2 text-sm text-[#6d6260]">
                Tendencia desde {trend.period}
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f7ece8] transition"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          {/* DESCRIPTION */}
          <div className="border-t border-[#f0e3de] pt-6">
            <h2 className="mb-3 font-serif text-lg font-bold text-[#151111]">
              Qué es
            </h2>
            <p className="text-sm leading-6 text-[#6d6260]">
              {trend.description}
            </p>
          </div>

          {/* DETAILED EXPLANATION */}
          <div className="border-t border-[#f0e3de] pt-6">
            <h2 className="mb-3 font-serif text-lg font-bold text-[#151111]">
              Análisis profundo
            </h2>
            <p className="text-sm leading-7 text-[#3a2f2c]">
              {trend.explanation}
            </p>
          </div>

          {/* METRICS GRID */}
          <div className="border-t border-[#f0e3de] pt-6">
            <h2 className="mb-4 font-serif text-lg font-bold text-[#151111]">
              Métricas de tendencia
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-[#eadbd4] bg-[#fbf5f2] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8a2638]">
                  Popularidad
                </p>
                <p className="mt-2 text-3xl font-bold text-[#151111]">
                  {trend.popularity}%
                </p>
                <p className="mt-1 text-xs text-[#6d6260]">
                  Nivel de presencia digital
                </p>
              </div>

              <div className="rounded-2xl border border-[#eadbd4] bg-[#fbf5f2] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8a2638]">
                  Crecimiento
                </p>
                <p className="mt-2 text-3xl font-bold text-[#151111]">
                  +{trend.growth}%
                </p>
                <p className="mt-1 text-xs text-[#6d6260]">
                  Incremento reciente
                </p>
              </div>

              <div className="rounded-2xl border border-[#eadbd4] bg-[#fbf5f2] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8a2638]">
                  Menciones
                </p>
                <p className="mt-2 text-3xl font-bold text-[#151111]">
                  {(trend.metrics.mentions / 1000).toFixed(0)}K
                </p>
                <p className="mt-1 text-xs text-[#6d6260]">
                  En redes sociales
                </p>
              </div>

              <div className="rounded-2xl border border-[#eadbd4] bg-[#fbf5f2] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8a2638]">
                  Engagement
                </p>
                <p className="mt-2 text-3xl font-bold text-[#151111]">
                  {trend.metrics.engagement ?? "--"}%
                </p>
                <p className="mt-1 text-xs text-[#6d6260]">
                  Tasa de interacción
                </p>
              </div>

              <div className="rounded-2xl border border-[#eadbd4] bg-[#fbf5f2] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8a2638]">
                  Sentimiento
                </p>
                <p className="mt-2 text-3xl font-bold text-[#151111]">
                  {trend.metrics.sentiment ?? "--"}%
                </p>
                <p className="mt-1 text-xs text-[#6d6260]">
                  Positivo
                </p>
              </div>

              <div className="rounded-2xl border border-[#eadbd4] bg-[#fbf5f2] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8a2638]">
                  Alcance
                </p>
                <p className="mt-2 text-3xl font-bold text-[#151111]">
                  {trend.metrics.reach ?? "--"}
                </p>
                <p className="mt-1 text-xs text-[#6d6260]">
                  Alcance potencial
                </p>
              </div>
            </div>
          </div>

          {/* RELATED BRANDS */}
          <div className="border-t border-[#f0e3de] pt-6">
            <h2 className="mb-4 font-serif text-lg font-bold text-[#151111]">
              Marcas asociadas
            </h2>
            <div className="flex flex-wrap gap-2">
              {trend.brands.map((brand) => (
                <span
                  key={brand}
                  className="rounded-full bg-[#f7ece8] px-4 py-2 text-xs font-semibold text-[#8a2638]"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

          {/* EVOLUTION CHART */}
          <div className="border-t border-[#f0e3de] pt-6">
            <h2 className="mb-4 font-serif text-lg font-bold text-[#151111]">
              Evolución en últimos meses
            </h2>
            {trend.timeline && trend.timeline.length > 0 ? (
              <div className="flex items-end justify-between gap-2">
                {trend.timeline.map((point, idx) => {
                  const maxValue = Math.max(...trend.timeline!.map((p) => p.value));
                  const height = (point.value / maxValue) * 100;

                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className="relative h-32 w-8 rounded bg-[#f0e3de]">
                      <div
                        className="absolute bottom-0 w-full rounded bg-[#8a2638] transition-all"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <p className="text-xs font-semibold text-[#6d6260]">
                      {point.month}
                    </p>
                  </div>
                );
              })}
              </div>
            ) : (
              <p className="text-sm italic text-[#9d8c8a]">
                No hay datos de evolución disponibles
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="border-t border-[#f0e3de] pt-6">
            <p className="mb-3 text-sm text-[#6d6260]">
              Esta información te ayuda a identificar dónde enfocarte en tus próximas colecciones
              o campañas de marketing.
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-[#8a2638] px-4 py-3 font-semibold text-white transition hover:bg-[#6a1f2a]"
            >
              Cerrar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
