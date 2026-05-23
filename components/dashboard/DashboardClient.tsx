"use client";

import { useEffect, useMemo, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import TrendChart from "@/components/dashboard/TrendChart";
import BrandRankingTable from "@/components/dashboard/BrandRankingTable";
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import FashionMetricCard from "@/components/home/FashionMetricCard";
import Reveal from "@/components/animations/Reveal";
import { getBrandMetrics } from "@/lib/brandMetrics";
import { BrandCategory, BrandMetricsResponse } from "@/types/brandMetrics";
import { MetricType } from "@/types/fashion";

type CategoryFilter = BrandCategory | "Todas";

type DashboardBrand = {
  name: string;
  category: BrandCategory;
  mentions: number;
  popularity: number;
  sentiment: number;
};

function getMetricValue(brand: DashboardBrand, metric: MetricType) {
  if (metric === "mentions") return brand.mentions;
  if (metric === "popularity") return brand.popularity;
  if (metric === "sentiment") return brand.sentiment;

  return brand.mentions;
}

function filterChartDataByBrands(
  chartData: Record<string, string | number>[],
  visibleBrands: string[]
) {
  return chartData.map((row) => {
    const filteredRow: Record<string, string | number> = {
      month: row.month,
    };

    visibleBrands.forEach((brand) => {
      if (row[brand] !== undefined) {
        filteredRow[brand] = row[brand];
      }
    });

    return filteredRow;
  });
}

export default function DashboardClient() {
  const [category, setCategory] = useState<CategoryFilter>("Todas");
  const [metric, setMetric] = useState<MetricType>("mentions");
  const [brandMetrics, setBrandMetrics] = useState<BrandMetricsResponse | null>(
    null
  );
  const [source, setSource] = useState<"newsapi" | "database" | "fallback">("fallback");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  async function loadBrandMetrics() {
    try {
      const data = await getBrandMetrics();
      setBrandMetrics(data);
      setSource(data.source || "fallback");
    } catch (error) {
      console.error("Error loading brand metrics:", error);
      setBrandMetrics(null);
      setSource("fallback");
    } finally {
      setIsLoading(false);
    }
  }

  loadBrandMetrics();
}, []);

  const allBrands = useMemo<DashboardBrand[]>(() => {
    if (!brandMetrics) return [];

    const maxMentions = brandMetrics.ranking[0]?.mentions || 1;

    return brandMetrics.ranking.map((brand) => {
      const popularity = Math.round((brand.mentions / maxMentions) * 100);

      return {
        name: brand.brand,
        category: brand.category,
        mentions: brand.mentions,
        popularity,
        sentiment: brandMetrics.averageSentiment,
      };
    });
  }, [brandMetrics]);

  const filteredBrands = useMemo(() => {
    if (category === "Todas") return allBrands;

    return allBrands.filter((brand) => brand.category === category);
  }, [allBrands, category]);

  const filteredTrendData = useMemo(() => {
    if (!brandMetrics) return [];

    const visibleBrands = filteredBrands.map((brand) => brand.name);

    return filterChartDataByBrands(brandMetrics.chartData, visibleBrands);
  }, [brandMetrics, filteredBrands]);

  const totalMentions = useMemo(() => {
    return filteredBrands.reduce((total, brand) => total + brand.mentions, 0);
  }, [filteredBrands]);

  const averagePopularity = useMemo(() => {
    if (!filteredBrands.length) return 0;

    return Math.round(
      filteredBrands.reduce((total, brand) => total + brand.popularity, 0) /
        filteredBrands.length
    );
  }, [filteredBrands]);

  const averageSentiment = useMemo(() => {
    if (!filteredBrands.length) return 0;

    return Math.round(
      filteredBrands.reduce((total, brand) => total + brand.sentiment, 0) /
        filteredBrands.length
    );
  }, [filteredBrands]);

  const ranking = useMemo(() => {
    return filteredBrands
      .map((brand) => ({
        name: brand.name,
        score: getMetricValue(brand, metric),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [filteredBrands, metric]);

  const dashboardStats = [
    {
      label: "Menciones totales",
      value: totalMentions,
      suffix: "+",
      description:
        brandMetrics?.source === "newsapi"
          ? "Noticias reales encontradas sobre marcas de moda."
          : "Datos de respaldo si la API no responde.",
    },
    {
      label: "Popularidad media",
      value: averagePopularity,
      suffix: "%",
      description: "Índice calculado según presencia mediática.",
    },
    {
      label: "Sentimiento medio",
      value: averageSentiment,
      suffix: "%",
      description: "Estimación basada en titulares y descripciones.",
    },
  ];

  return (
    <PageContainer>
      <Reveal>
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#7A2E3A]">
              Panel principal
            </p>

            <h1 className="font-serif text-5xl font-bold tracking-[-0.05em] text-[#171314]">
              Dashboard de tendencias
            </h1>

            <p className="mt-4 max-w-2xl text-[#6b625f]">
              Visualiza la evolución de marcas, menciones, popularidad y
              sentimiento digital en el sector moda.
            </p>
          </div>

          <div className="rounded-full border border-[#eadfd3] bg-[#fffdf9]/80 px-5 py-3 text-sm font-semibold text-[#7A2E3A]">
            Última actualización: {brandMetrics?.updatedAt ?? "Cargando..."}
          </div>
        </div>
      </Reveal>

      {/* SOURCE INDICATOR */}
      {source === "newsapi" && (
        <Reveal delay={0.02}>
          <div className="mb-6 rounded-lg border border-[#d4e4d4] bg-[#f0f7f0] px-4 py-3 text-xs text-[#2d5a2d]">
            ✓ Datos en tiempo real desde NewsAPI
          </div>
        </Reveal>
      )}
      
      {source === "database" && (
        <Reveal delay={0.02}>
          <div className="mb-6 rounded-lg border border-[#f0e4d4] bg-[#f7f3f0] px-4 py-3 text-xs text-[#8a5a2d]">
            ⚠️ Últimas noticias guardadas (NewsAPI no disponible)
          </div>
        </Reveal>
      )}
      
      {source === "fallback" && (
        <Reveal delay={0.02}>
          <div className="mb-6 rounded-lg border border-[#f7ece8] bg-[#fbf7f4] px-4 py-3 text-xs text-[#8a2638]">
            ⚠️ Datos de demostración por falta de conexión con la fuente externa. Los datos reales se cargarán cuando NewsAPI esté disponible.
          </div>
        </Reveal>
      )}

      <Reveal delay={0.06}>
        <DashboardFilters
          category={category}
          metric={metric}
          onCategoryChange={setCategory}
          onMetricChange={setMetric}
        />
      </Reveal>

      {isLoading && (
        <div className="mb-8 rounded-[28px] border border-[#eadfd3] bg-[#fffdf9] p-6 text-sm font-semibold text-[#7A2E3A]">
          Cargando métricas reales...
        </div>
      )}

      {!isLoading && !brandMetrics && (
        <div className="mb-8 rounded-[28px] border border-[#eadfd3] bg-[#fffdf9] p-6 text-sm font-semibold text-[#7A2E3A]">
          No se pudieron cargar las métricas reales.
        </div>
      )}

      <div className="mb-8 grid gap-5 md:grid-cols-3">
        {dashboardStats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.08}>
            <FashionMetricCard {...stat} />
          </Reveal>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal delay={0.1}>
          <TrendChart data={filteredTrendData} metric={metric} />
        </Reveal>

        <Reveal delay={0.18}>
          <BrandRankingTable data={ranking} />
        </Reveal>
      </div>

      {brandMetrics && (
        <p className="mt-6 text-xs font-medium text-[#8a7a75]">
          Fuente de datos:{" "}
          {brandMetrics.source === "newsapi"
            ? "NewsAPI, presencia en medios digitales."
            : "Datos simulados de respaldo porque NewsAPI no respondió."}
        </p>
      )}
    </PageContainer>
  );
}