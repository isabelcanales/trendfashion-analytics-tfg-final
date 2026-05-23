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

interface TrendTimelineItemProps {
  trend: TimelineEvent;
  index: number;
  isEven: boolean;
  onClick: (trend: TimelineEvent) => void;
}

export function TrendTimelineItem({
  trend,
  index,
  isEven,
  onClick,
}: TrendTimelineItemProps) {
  const { bg, text } = getStateColor(trend.state);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative flex w-full items-center justify-center"
    >
      {/* Versión móvil */}
      <div className="flex w-full flex-col items-center gap-2 md:hidden">
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => onClick(trend)}
          className="w-full max-w-2xl cursor-pointer rounded-2xl border border-[#eadbd4] bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className={`rounded-full ${bg} px-2 py-0.5 text-xs font-bold ${text}`}>
              {getStateIcon(trend.state)} {trend.state}
            </span>
            <span className="text-xs uppercase tracking-[0.15em] text-[#8a2638]">
              {trend.category}
            </span>
          </div>

          <h3 className="mb-1 font-serif text-lg font-bold text-[#151111]">
            {trend.name}
          </h3>

          <p className="mb-3 text-sm text-[#6d6260]">{trend.description}</p>

          <div className="mb-3 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#8a2638]">Popularidad</span>
              <div className="h-1 w-20 overflow-hidden rounded-full bg-[#eadbd4]">
                <div
                  className="h-full bg-[#8a2638]"
                  style={{ width: `${trend.popularity}%` }}
                />
              </div>
              <span className="font-bold text-[#151111]">{trend.popularity}%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8a2638]">Crecimiento</span>
              {trend.growth !== null ? (
                <>
                  <div className="h-1 w-20 overflow-hidden rounded-full bg-[#eadbd4]">
                    <div
                      className="h-full bg-[#8a2638]"
                      style={{ width: `${trend.growth}%` }}
                    />
                  </div>
                  <span className="font-bold text-[#151111]">+{trend.growth}%</span>
                </>
              ) : (
                <span className="text-xs italic text-[#9d8c8a]">Sin datos</span>
              )}
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#8a2638]">
              Marcas
            </p>
            <div className="flex flex-wrap gap-1">
              {trend.brands.slice(0, 2).map((brand) => (
                <span
                  key={brand}
                  className="rounded-full bg-[#f7ece8] px-2 py-0.5 text-xs text-[#8a2638]"
                >
                  {brand}
                </span>
              ))}
              {trend.brands.length > 2 && (
                <span className="rounded-full bg-[#f7ece8] px-2 py-0.5 text-xs text-[#8a2638]">
                  +{trend.brands.length - 2}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onClick(trend)}
            className="text-xs font-semibold text-[#8a2638] hover:text-[#6a1f2a] transition"
          >
            Ver detalle →
          </button>
        </motion.div>

        <div className="rounded-full bg-[#f7ece8] px-3 py-1">
          <p className="text-xs font-bold text-[#8a2638]">{trend.date}</p>
        </div>
      </div>

      {/* Versión desktop - Timeline alternada */}
      <div className="hidden w-full items-center justify-center md:flex">
        {isEven ? (
          // Tarjeta a la izquierda
          <>
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => onClick(trend)}
              className="w-full max-w-4xl cursor-pointer rounded-2xl border border-[#eadbd4] bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className={`rounded-full ${bg} px-2 py-0.5 text-xs font-bold ${text}`}>
                  {getStateIcon(trend.state)} {trend.state}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-[#8a2638]">
                  {trend.category}
                </span>
              </div>

              <h3 className="mb-2 font-serif text-lg font-bold text-[#151111]">
                {trend.name}
              </h3>

              <p className="mb-4 text-sm text-[#6d6260]">{trend.description}</p>

              <div className="mb-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#8a2638]">Popularidad</span>
                  <div className="h-1 w-16 overflow-hidden rounded-full bg-[#eadbd4]">
                    <div
                      className="h-full bg-[#8a2638]"
                      style={{ width: `${trend.popularity}%` }}
                    />
                  </div>
                  <span className="min-w-[2.5rem] text-right font-bold text-[#151111]">
                    {trend.popularity}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8a2638]">Crecimiento</span>
                  {trend.growth !== null ? (
                    <>
                      <div className="h-1 w-16 overflow-hidden rounded-full bg-[#eadbd4]">
                        <div
                          className="h-full bg-[#8a2638]"
                          style={{ width: `${trend.growth}%` }}
                        />
                      </div>
                      <span className="min-w-[2.5rem] text-right font-bold text-[#151111]">
                        +{trend.growth}%
                      </span>
                    </>
                  ) : (
                    <span className="min-w-[2.5rem] text-right text-xs italic text-[#9d8c8a]">
                      Sin datos
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8a2638]">
                  Marcas
                </p>
                <div className="flex flex-wrap gap-1">
                  {trend.brands.slice(0, 2).map((brand) => (
                    <span
                      key={brand}
                      className="rounded-full bg-[#f7ece8] px-2 py-1 text-xs text-[#8a2638]"
                    >
                      {brand}
                    </span>
                  ))}
                  {trend.brands.length > 2 && (
                    <span className="rounded-full bg-[#f7ece8] px-2 py-1 text-xs text-[#8a2638]">
                      +{trend.brands.length - 2}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onClick(trend)}
                className="text-xs font-semibold text-[#8a2638] hover:text-[#6a1f2a] transition"
              >
                Ver detalle →
              </button>
            </motion.div>

            {/* Centro - Línea y punto */}
            <div className="flex w-40 flex-col items-center justify-center gap-0">
              <div className="h-10 w-0.5 bg-[#8a2638]" />
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-5 w-5 rounded-full border-2 border-[#8a2638] bg-white"
              />
              <div className="h-10 w-0.5 bg-[#eadbd4]" />
            </div>

            {/* Fecha a la derecha */}
            <div className="w-40 text-right">
              <div className="inline-block rounded-full bg-[#f7ece8] px-2 py-0.5">
                <p className="text-xs font-bold text-[#8a2638]">{trend.date}</p>
              </div>
            </div>
          </>
        ) : (
          // Tarjeta a la derecha
          <>
            {/* Fecha a la izquierda */}
            <div className="w-40 text-left">
              <div className="inline-block rounded-full bg-[#f7ece8] px-2 py-0.5">
                <p className="text-xs font-bold text-[#8a2638]">{trend.date}</p>
              </div>
            </div>

            {/* Centro - Línea y punto */}
            <div className="flex w-40 flex-col items-center justify-center gap-0">
              <div className="h-10 w-0.5 bg-[#eadbd4]" />
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-5 w-5 rounded-full border-2 border-[#8a2638] bg-white"
              />
              <div className="h-10 w-0.5 bg-[#8a2638]" />
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => onClick(trend)}
              className="w-full max-w-4xl cursor-pointer rounded-2xl border border-[#eadbd4] bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className={`rounded-full ${bg} px-2 py-0.5 text-xs font-bold ${text}`}>
                  {getStateIcon(trend.state)} {trend.state}
                </span>
                <span className="text-xs uppercase tracking-[0.15em] text-[#8a2638]">
                  {trend.category}
                </span>
              </div>

              <h3 className="mb-1 font-serif text-lg font-bold text-[#151111]">
                {trend.name}
              </h3>

              <p className="mb-3 text-sm text-[#6d6260]">{trend.description}</p>

              <div className="mb-3 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#8a2638]">Popularidad</span>
                  <div className="h-1 w-16 overflow-hidden rounded-full bg-[#eadbd4]">
                    <div
                      className="h-full bg-[#8a2638]"
                      style={{ width: `${trend.popularity}%` }}
                    />
                  </div>
                  <span className="min-w-[2.5rem] text-right font-bold text-[#151111]">
                    {trend.popularity}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8a2638]">Crecimiento</span>
                  {trend.growth !== null ? (
                    <>
                      <div className="h-1 w-16 overflow-hidden rounded-full bg-[#eadbd4]">
                        <div
                          className="h-full bg-[#8a2638]"
                          style={{ width: `${trend.growth}%` }}
                        />
                      </div>
                      <span className="min-w-[2.5rem] text-right font-bold text-[#151111]">
                        +{trend.growth}%
                      </span>
                    </>
                  ) : (
                    <span className="min-w-[2.5rem] text-right text-xs italic text-[#9d8c8a]">
                      Sin datos
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#8a2638]">
                  Marcas
                </p>
                <div className="flex flex-wrap gap-1">
                  {trend.brands.slice(0, 2).map((brand) => (
                    <span
                      key={brand}
                      className="rounded-full bg-[#f7ece8] px-2 py-0.5 text-xs text-[#8a2638]"
                    >
                      {brand}
                    </span>
                  ))}
                  {trend.brands.length > 2 && (
                    <span className="rounded-full bg-[#f7ece8] px-2 py-0.5 text-xs text-[#8a2638]">
                      +{trend.brands.length - 2}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onClick(trend)}
                className="text-xs font-semibold text-[#8a2638] hover:text-[#6a1f2a] transition"
              >
                Ver detalle →
              </button>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
