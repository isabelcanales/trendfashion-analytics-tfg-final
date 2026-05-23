"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import PageContainer from "@/components/layout/PageContainer";
import { TrendTimeline } from "@/components/trends-timeline/TrendTimeline";
import { TimelineFilters } from "@/components/trends-timeline/TimelineFilters";
import { TrendDetailCard } from "@/components/trends-timeline/TrendDetailCard";

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

const categories = [
  "Todas",
  "Estética",
  "Microtendencia",
  "Prenda clave",
  "Color / textura",
  "Estilo urbano",
  "Silueta",
];

const states = [
  "Todos",
  "Emergente",
  "En crecimiento",
  "Consolidada",
  "En descenso",
];

function determineStatus(popularity: number): "Emergente" | "En crecimiento" | "Consolidada" | "Estable" {
  if (popularity >= 80) return "Consolidada";
  if (popularity >= 60) return "En crecimiento";
  if (popularity >= 40) return "Emergente";
  return "Estable";
}

export default function TrendsTimelinePage() {
  const [selectedState, setSelectedState] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedTrend, setSelectedTrend] = useState<TimelineEvent | null>(null);
  const [trendData, setTrendData] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<"newsapi" | "database" | "fallback">("fallback");

  // Cargar datos desde API
  useEffect(() => {
    async function loadTrends() {
      try {
        const response = await fetch("/api/trend-metrics", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch trends");
        }

        const data = await response.json();
        
        if (!data.trends || data.trends.length === 0) {
          setTrendData([]);
          setSource("fallback");
          setIsLoading(false);
          return;
        }
        
        // Transformar datos de la API al formato TimelineEvent
        const today = new Date();
        const transformed = data.trends.map((trend: any) => ({
          id: trend.id,
          name: trend.name,
          category: trend.category,
          state: trend.status || determineStatus(trend.popularity),
          popularity: trend.popularity,
          growth: trend.growth, // Puede ser null
          date: today.toLocaleDateString("es-ES", { month: "long", year: "numeric" }),
          period: `2024 - Presente`,
          description: trend.description,
          explanation: trend.description, // Si la API no tiene explanation, usar description
          brands: trend.brands || [],
          metrics: {
            mentions: 0, // Placeholder si la API no proporciona
          },
          timeline: [], // Placeholder si la API no proporciona
        }));

        setTrendData(transformed);
        setSource(data.source || "fallback");
      } catch (error) {
        console.error("Error loading trends:", error);
        setTrendData([]);
        setSource("fallback");
      } finally {
        setIsLoading(false);
      }
    }

    loadTrends();
  }, []);

  // Filtrar tendencias basado en estado y categoría
  const filteredTrends = useMemo(() => {
    return trendData.filter((trend) => {
      const stateMatch =
        selectedState === "Todos" || trend.state === selectedState;
      const categoryMatch =
        selectedCategory === "Todas" || trend.category === selectedCategory;
      return stateMatch && categoryMatch;
    });
  }, [selectedState, selectedCategory, trendData]);

  // Ordenar por fecha (más recientes primero)
  const sortedTrends = useMemo(() => {
    return [...filteredTrends].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }, [filteredTrends]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const emergingCount = filteredTrends.filter(
      (t) => t.state === "Emergente"
    ).length;
    const growingCount = filteredTrends.filter(
      (t) => t.state === "En crecimiento"
    ).length;
    const avgPopularity = Math.round(
      filteredTrends.reduce((sum, t) => sum + t.popularity, 0) /
        (filteredTrends.length || 1)
    );
    
    // Calcular growth promedio - ignorar valores null
    const validGrowths = filteredTrends
      .filter((t) => t.growth !== null)
      .map((t) => t.growth as number);
    
    const avgGrowth = validGrowths.length > 0
      ? Math.round(validGrowths.reduce((a, b) => a + b, 0) / validGrowths.length)
      : 0;

    return { emergingCount, growingCount, avgPopularity, avgGrowth };
  }, [filteredTrends]);

  return (
    <PageContainer>
      <section className="pb-20 pt-12">
        {/* HERO SECTION */}
        <div className="mb-14">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
            Análisis profesional
          </p>

          <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[0.95] text-[#151111] md:text-6xl">
            Timeline de tendencias
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#6d6260]">
            Visualiza cómo evolucionan las principales tendencias de moda según
            su crecimiento, popularidad y estado actual. Entiende dónde nace cada
            tendencia, cómo crece y se consolida en el mercado.
          </p>
        </div>

        {/* SOURCE INDICATOR */}
        {source === "newsapi" && (
          <div className="mb-6 rounded-lg border border-[#d4e4d4] bg-[#f0f7f0] px-4 py-3 text-xs text-[#2d5a2d]">
            ✓ Datos en tiempo real desde NewsAPI
          </div>
        )}
        
        {source === "database" && (
          <div className="mb-6 rounded-lg border border-[#f0e4d4] bg-[#f7f3f0] px-4 py-3 text-xs text-[#8a5a2d]">
            ⚠️ Últimas noticias guardadas (NewsAPI no disponible)
          </div>
        )}
        
        {source === "fallback" && (
          <div className="mb-6 rounded-lg border border-[#f7ece8] bg-[#fbf7f4] px-4 py-3 text-xs text-[#8a2638]">
            ⚠️ Datos de demostración por falta de conexión con la fuente externa. Los datos reales se cargarán cuando NewsAPI esté disponible.
          </div>
        )}

        {/* LOADING STATE */}
        {isLoading && (
          <div className="mb-6 rounded-lg border border-[#eadbd4] bg-white px-4 py-3 text-xs text-[#6d6260]">
            Cargando tendencias...
          </div>
        )}

        {/* STATS CARDS */}
        <div className="mb-14 grid gap-4 md:grid-cols-4">
          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8a2638]">
              Tendencias visibles
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {filteredTrends.length}
            </h2>
            <p className="mt-3 text-xs text-[#6d6260]">
              Según filtros activos
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8a2638]">
              Emergentes
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {stats.emergingCount}
            </h2>
            <p className="mt-3 text-xs text-[#6d6260]">
              Oportunidades de crecimiento
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8a2638]">
              Popularidad media
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {stats.avgPopularity}%
            </h2>
            <p className="mt-3 text-xs text-[#6d6260]">
              Presencia digital promedio
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8a2638]">
              Crecimiento medio
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              +{stats.avgGrowth}%
            </h2>
            <p className="mt-3 text-xs text-[#6d6260]">
              Velocidad de expansión
            </p>
          </article>
        </div>

        {/* FILTERS */}
        <div className="mb-14">
          <TimelineFilters
            selectedState={selectedState}
            selectedCategory={selectedCategory}
            onStateChange={setSelectedState}
            onCategoryChange={setSelectedCategory}
            totalTrends={filteredTrends.length}
          />
        </div>

        {/* TIMELINE */}
        <div className="relative">
          <TrendTimeline
            trends={sortedTrends}
            onSelectTrend={setSelectedTrend}
          />
        </div>

        {/* VALUE PROPOSITION */}
        <div className="mt-20 rounded-[28px] border border-[#eadbd4] bg-gradient-to-br from-[#fbf5f2] to-[#f7ece8] p-8 md:p-12">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#8a2638]">
              Para tu negocio
            </p>

            <h2 className="mb-4 font-serif text-3xl font-bold text-[#151111]">
              Toma decisiones basadas en datos
            </h2>

            <p className="mb-6 text-base leading-7 text-[#6d6260]">
              Este timeline te permite:
            </p>

            <ul className="space-y-3 text-sm text-[#3a2f2c]">
              <li className="flex gap-3">
                <span className="font-bold text-[#8a2638]">→</span>
                <span>
                  <strong>Identificar oportunidades tempranas</strong>: Descubre
                  tendencias emergentes antes de que se consoliden.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[#8a2638]">→</span>
                <span>
                  <strong>Planificar colecciones:</strong> Alinea tus diseños con
                  el ciclo de vida de las tendencias.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[#8a2638]">→</span>
                <span>
                  <strong>Comunicación estratégica:</strong> Asocia tus marcas con
                  tendencias en el estado adecuado del ciclo.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[#8a2638]">→</span>
                <span>
                  <strong>Evitar sobrexponer tendencias obsoletas:</strong> Identifica
                  cuándo una tendencia está en declive.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        <TrendDetailCard
          trend={selectedTrend}
          isOpen={selectedTrend !== null}
          onClose={() => setSelectedTrend(null)}
        />
      </AnimatePresence>
    </PageContainer>
  );
}
