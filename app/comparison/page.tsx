"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PageContainer from "@/components/layout/PageContainer";
import PremiumFeature from "@/components/PremiumFeature";
import { getBrandMetrics } from "@/lib/brandMetrics";
import { useReports } from "@/context/ReportsContext";
import { BrandMetricsResponse } from "@/types/brandMetrics";
import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";

const brandCountries: Record<string, string> = {
  Gucci: "Italia",
  Prada: "Italia",
  Chanel: "Francia",
  Dior: "Francia",
  Zara: "España",
  Mango: "España",
  "H&M": "Suecia",
  COS: "Reino Unido",
  "Massimo Dutti": "España",
};

type ComparableBrand = {
  id: string;
  name: string;
  category: string;
  country: string;
  mentions: number;
  popularity: number;
  sentiment: number;
  score: number;
};

function GenerateReportButton({
  brandA,
  brandB,
}: {
  brandA: ComparableBrand;
  brandB: ComparableBrand;
}) {
  const router = useRouter();
  const { addReport } = useReports();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Intentar obtener IDs de las marcas desde la API
      let brandAId = brandA.id;
      let brandBId = brandB.id;

      const [brandARes, brandBRes] = await Promise.all([
        fetch(`/api/brands/lookup?name=${encodeURIComponent(brandA.name)}`),
        fetch(`/api/brands/lookup?name=${encodeURIComponent(brandB.name)}`),
      ]);

      // Si las búsquedas funcionan, usar esos IDs
      if (brandARes.ok && brandBRes.ok) {
        const brandAData = await brandARes.json();
        const brandBData = await brandBRes.json();
        brandAId = brandAData.id;
        brandBId = brandBData.id;
      }
      // Si fallan, el endpoint hará upsert automáticamente con los datos que enviemos

      // Generar contenido del informe
      const mainInsight =
        brandA.score > brandB.score
          ? `${brandA.name} lidera con un score de ${brandA.score} vs ${brandB.score}. Diferencia de ${Math.abs(brandA.mentions - brandB.mentions).toLocaleString("es-ES")} menciones.`
          : `${brandB.name} lidera con un score de ${brandB.score} vs ${brandA.score}. Diferencia de ${Math.abs(brandA.mentions - brandB.mentions).toLocaleString("es-ES")} menciones.`;

      const executiveSummary = `Comparativa estratégica entre ${brandA.name} y ${brandB.name}. ${mainInsight}`;

      const insights = getDynamicInsight(brandA, brandB);

      const conclusion = `En conclusión, ${brandA.score > brandB.score ? brandA.name : brandB.name} muestra un posicionamiento más fuerte en el ecosistema digital de moda, con un score global superior y mayor presencia de marca en los medios digitales.`;

      // Crear informe en la base de datos
      // Enviar también los datos de las marcas para que el endpoint pueda hacer upsert si es necesario
      const reportPayload = {
        brand1Id: brandAId,
        brand2Id: brandBId,
        brand1Name: brandA.name,
        brand1Category: brandA.category,
        brand1Country: brandA.country,
        brand2Name: brandB.name,
        brand2Category: brandB.category,
        brand2Country: brandB.country,
        title: `${brandA.name} vs ${brandB.name}`,
        executiveSummary,
        insights,
        conclusion,
      };
      
      const reportRes = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(reportPayload),
      });

      if (!reportRes.ok) {
        const errorData = await reportRes.json().catch(() => ({}));
        if (reportRes.status === 401) {
          throw new Error("Debes iniciar sesión para guardar informes");
        }
        throw new Error(errorData.error || "Error al guardar el informe");
      }

      // Mostrar mensaje de éxito
      setSuccess(true);
      
      // Actualizar contexto local también (para compatibilidad con vista anterior)
      addReport({
        slug: `${brandA.id}-vs-${brandB.id}`,
        brandA: brandA.name,
        brandB: brandB.name,
        scoreA: brandA.score,
        scoreB: brandB.score,
        sentimentA: brandA.sentiment,
        sentimentB: brandB.sentiment,
        mentionsA: brandA.mentions,
        mentionsB: brandB.mentions,
        mainInsight,
      });

      // Redirigir a /reports después de 1 segundo
      setTimeout(() => {
        router.push("/reports");
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleGenerateReport}
        disabled={isLoading}
        className="h-12 rounded-[14px] border-2 border-[#8a2638] bg-[#8a2638] px-6 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#a83450] hover:border-[#a83450] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Generando..." : "Generar informe"}
      </button>
      {success && (
        <p className="text-xs text-green-600 font-semibold">
          ✓ Informe guardado correctamente. Redirigiendo...
        </p>
      )}
      {error && (
        <p className="text-xs text-red-600 font-semibold">
          ✗ {error}
        </p>
      )}
    </div>
  );
}

function getBrandId(brand: string) {
  return brand.toLowerCase().replaceAll("&", "and").replaceAll(" ", "-");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES").format(value);
}

function getWinner(
  valueA: number,
  valueB: number,
  brandA: string,
  brandB: string
) {
  if (valueA > valueB) return brandA;
  if (valueB > valueA) return brandB;
  return "Empate";
}

function getCategoryDescription(category: string) {
  if (category === "Luxury") {
    return "Firma de lujo con alto valor aspiracional, presencia editorial y fuerte identidad visual.";
  }

  if (category === "Premium") {
    return "Marca con estética cuidada, percepción de calidad y posicionamiento más accesible que el lujo tradicional.";
  }

  if (category === "Fast Fashion") {
    return "Marca orientada al volumen, rotación rápida de tendencias y conexión con consumo masivo.";
  }

  return "Marca analizada dentro del ecosistema digital de moda.";
}

function getLifecycle(score: number) {
  if (score >= 85) return "Dominancia estable";
  if (score >= 70) return "Crecimiento sostenido";
  if (score >= 55) return "Presencia competitiva";
  return "Visibilidad emergente";
}

function getDynamicInsight(brandA: ComparableBrand, brandB: ComparableBrand) {
  const mentionsWinner = getWinner(
    brandA.mentions,
    brandB.mentions,
    brandA.name,
    brandB.name
  );

  const scoreWinner = getWinner(
    brandA.score,
    brandB.score,
    brandA.name,
    brandB.name
  );

  const sentimentWinner = getWinner(
    brandA.sentiment,
    brandB.sentiment,
    brandA.name,
    brandB.name
  );

  const lifecycleA = getLifecycle(brandA.score);
  const lifecycleB = getLifecycle(brandB.score);

  // Determinar si es un empate
  if (mentionsWinner === "Empate" && scoreWinner === "Empate" && sentimentWinner === "Empate") {
    return `La comparativa entre ${brandA.name} y ${brandB.name} muestra un rendimiento muy equilibrado. Ambas marcas presentan una presencia similar en menciones, score global y sentimiento positivo. Se encuentran en fases similares de lifecycle (${lifecycleA} vs ${lifecycleB}).`;
  }

  // Análisis cuando hay un ganador claro
  const highlights: string[] = [];
  
  if (mentionsWinner !== "Empate") {
    highlights.push(`${mentionsWinner} concentra mayor volumen de menciones (${Math.max(brandA.mentions, brandB.mentions).toLocaleString()} vs ${Math.min(brandA.mentions, brandB.mentions).toLocaleString()})`);
  }

  if (sentimentWinner !== "Empate" && sentimentWinner !== scoreWinner) {
    highlights.push(`${sentimentWinner} muestra mejor sentimiento en la conversación digital`);
  }

  if (scoreWinner !== "Empate") {
    highlights.push(`${scoreWinner} lidera en score global (${Math.max(brandA.score, brandB.score)} vs ${Math.min(brandA.score, brandB.score)})`);
  }

  if (lifecycleA !== lifecycleB) {
    const advancedLifecycle = brandA.score > brandB.score ? brandA.name : brandB.name;
    highlights.push(`${advancedLifecycle} se encuentra en una fase más avanzada de lifecycle (${brandA.score > brandB.score ? lifecycleA : lifecycleB})`);
  }

  const conclusionStr = highlights.length > 0 
    ? highlights.join(". ") + "."
    : `Ambas marcas muestran características competitivas diferentes en el ecosistema de moda digital.`;

  return `${conclusionStr} Esta posición relativa refleja el impacto de cada marca dentro del análisis digital actual.`;
}

type Badge = {
  label: string;
  winner: string;
  metric: string;
};

function getComparativeBadges(brandA: ComparableBrand, brandB: ComparableBrand): Badge[] {
  const badges: Badge[] = [];

  // Mayor crecimiento (basado en menciones)
  if (brandA.mentions > brandB.mentions * 1.2) {
    badges.push({ label: "Mayor crecimiento", winner: brandA.name, metric: "menciones" });
  } else if (brandB.mentions > brandA.mentions * 1.2) {
    badges.push({ label: "Mayor crecimiento", winner: brandB.name, metric: "menciones" });
  }

  // Mejor sentimiento
  if (brandA.sentiment > brandB.sentiment + 5) {
    badges.push({ label: "Mejor sentimiento", winner: brandA.name, metric: "sentimiento" });
  } else if (brandB.sentiment > brandA.sentiment + 5) {
    badges.push({ label: "Mejor sentimiento", winner: brandB.name, metric: "sentimiento" });
  }

  // Más estable (basado en score)
  if (brandA.score > brandB.score + 10) {
    badges.push({ label: "Más estable", winner: brandA.name, metric: "score" });
  } else if (brandB.score > brandA.score + 10) {
    badges.push({ label: "Más estable", winner: brandB.name, metric: "score" });
  }

  // Más popular
  if (brandA.popularity > brandB.popularity + 5) {
    badges.push({ label: "Más popular", winner: brandA.name, metric: "popularidad" });
  } else if (brandB.popularity > brandA.popularity + 5) {
    badges.push({ label: "Más popular", winner: brandB.name, metric: "popularidad" });
  }

  return badges;
}

type EvolutionPoint = {
  month: string;
  brandA: number;
  brandB: number;
};

function getEvolutionData(brandA: ComparableBrand, brandB: ComparableBrand): EvolutionPoint[] {
  // Generar evolución temporal basada en scores reales (sin aleatoriedad)
  const months = ["Hace 6m", "Hace 5m", "Hace 4m", "Hace 3m", "Hace 2m", "Hoy"];
  const scoreRangeA = brandA.score;
  const scoreRangeB = brandB.score;
  
  return months.map((month, index) => {
    // Crear una progresión determinista hacia el score actual
    const progress = (index + 1) / months.length;
    const minVariation = 0.5; // Variación mínima del 50% respecto al score actual
    
    return {
      month,
      // Sin Math.random() - valores deterministas basados en progresión real
      brandA: Math.max(30, Math.round(scoreRangeA * (minVariation + progress * (1 - minVariation)))),
      brandB: Math.max(30, Math.round(scoreRangeB * (minVariation + progress * (1 - minVariation)))),
    };
  });
}

function ComparisonBar({
  label,
  valueA,
  valueB,
  brandA,
  brandB,
  suffix = "",
}: {
  label: string;
  valueA: number;
  valueB: number;
  brandA: string;
  brandB: string;
  suffix?: string;
}) {
  const max = Math.max(valueA, valueB);
  const widthA = max > 0 ? (valueA / max) * 100 : 0;
  const widthB = max > 0 ? (valueB / max) * 100 : 0;
  const winner = getWinner(valueA, valueB, brandA, brandB);

  return (
    <div className="rounded-[24px] border border-[#eadbd4] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#151111]">{label}</p>
          <p className="mt-1 text-xs text-[#6d6260]">
            Lidera:{" "}
            <span className="font-semibold text-[#8a2638]">{winner}</span>
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#6d6260]">
            <span>{brandA}</span>
            <span>
              {formatNumber(valueA)}
              {suffix}
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-[#f0e3de]">
            <div
              className="h-full rounded-full bg-[#151111]"
              style={{ width: `${widthA}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#6d6260]">
            <span>{brandB}</span>
            <span>
              {formatNumber(valueB)}
              {suffix}
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-[#f0e3de]">
            <div
              className="h-full rounded-full bg-[#8a2638]"
              style={{ width: `${widthB}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComparisonPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<BrandMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [brandAId, setBrandAId] = useState("zara");
  const [brandBId, setBrandBId] = useState("mango");
  const [mainMetric, setMainMetric] = useState("score");

  useEffect(() => {
    async function loadMetrics() {
      try {
        const result = await getBrandMetrics();
        setData(result);
      } catch (error) {
        console.error("Error cargando comparativas reales:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  const brands = useMemo<ComparableBrand[]>(() => {
    if (!data) return [];

    const maxMentions = data.ranking[0]?.mentions || 1;

    return data.ranking.map((brand) => {
      const popularity = Math.round((brand.mentions / maxMentions) * 100);
      const sentiment = data.averageSentiment;
      const score = Math.round((popularity + sentiment) / 2);

      return {
        id: getBrandId(brand.brand),
        name: brand.brand,
        category: brand.category,
        country: brandCountries[brand.brand] ?? "Global",
        mentions: brand.mentions,
        popularity,
        sentiment,
        score,
      };
    });
  }, [data]);

  const strongestBrand = useMemo(() => {
    return [...brands].sort((a, b) => b.score - a.score)[0];
  }, [brands]);

  const mostMentionedBrand = useMemo(() => {
    return [...brands].sort((a, b) => b.mentions - a.mentions)[0];
  }, [brands]);

  const brandA = useMemo(() => {
    return brands.find((brand) => brand.id === brandAId) ?? brands[0];
  }, [brands, brandAId]);

  const brandB = useMemo(() => {
    return (
      brands.find((brand) => brand.id === brandBId) ??
      brands.find((brand) => brand.id !== brandA?.id) ??
      brands[1]
    );
  }, [brands, brandBId, brandA]);

  const possibleComparisons =
    brands.length > 1 ? Math.round((brands.length * (brands.length - 1)) / 2) : 0;

  if (loading) {
    return (
      <PageContainer>
        <section className="pb-20 pt-12">
          <div className="rounded-[28px] border border-[#eadbd4] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#8a2638]">
              Cargando comparativas con datos reales...
            </p>
          </div>
        </section>
      </PageContainer>
    );
  }

  if (!data || brands.length < 2 || !strongestBrand || !mostMentionedBrand) {
    return (
      <PageContainer>
        <section className="pb-20 pt-12">
          <div className="rounded-[28px] border border-[#eadbd4] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#8a2638]">
              No se pudieron cargar las comparativas.
            </p>
          </div>
        </section>
      </PageContainer>
    );
  }

  if (!brandA || !brandB) {
    return (
      <PageContainer>
        <section className="pb-20 pt-12">
          <div className="rounded-[28px] border border-[#eadbd4] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#8a2638]">
              Error al cargar las marcas de comparación.
            </p>
          </div>
        </section>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <section className="pb-20 pt-12">
        {/* HERO */}
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
              Comparativa competitiva
            </p>

            <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[0.95] text-[#151111] md:text-6xl">
              Compara dos marcas y detecta diferencias clave.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#6d6260]">
              Selecciona dos marcas del panel y analiza su comportamiento
              digital a partir de menciones reales, popularidad estimada,
              sentimiento y score global.
            </p>

            <p className="mt-4 text-xs font-medium text-[#8a2638]/80">
              {data.source === "newsapi"
                ? `Datos reales obtenidos de NewsAPI · Actualizado en ${data.updatedAt}`
                : "Modo demostración: no se pudo conectar con NewsAPI"}
            </p>
          </div>

          <div className="rounded-full border border-[#eadbd4] bg-white px-5 py-3 text-sm font-semibold text-[#8a2638] shadow-sm">
            Marca mejor valorada: {strongestBrand.name}
          </div>
        </div>

        {/* STATS */}
        <div className="mb-20 grid gap-5 md:grid-cols-4">
          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Marcas disponibles
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {brands.length}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Marcas disponibles para comparar.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Comparativas posibles
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {possibleComparisons}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Combinaciones posibles entre marcas.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Marca con más menciones
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {mostMentionedBrand.name}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              {formatNumber(mostMentionedBrand.mentions)} menciones obtenidas.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Mejor score
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {strongestBrand.score}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Puntuación global obtenida por {strongestBrand.name}.
            </p>
          </article>
        </div>

        {/* Premium Feature - Advanced Historical Comparisons */}
        <div className="mt-12 mb-16">
          <PremiumFeature
            requiredPlan="premium"
            title="Comparativas Históricas Avanzadas"
            description="Desbloquea análisis de tendencias históricos, predicciones avanzadas y reportes personalizados en profundidad."
            currentPlan={(session?.user as any)?.plan}
            icon={<TrendingUp className="w-full h-full" />}
            ctaText="Desbloquear Premium"
            size="md"
          />
        </div>

        {/* BRAND SELECTOR - MINIMALIST */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:gap-6 lg:gap-8">
          {/* Marca A */}
          <div className="flex flex-col md:flex-1">
            <label className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
              Marca A
            </label>
            <select
              value={brandA.id}
              onChange={(event) => {
                const nextValue = event.target.value;
                if (nextValue === brandB.id) {
                  const alternative = brands.find(
                    (brand) => brand.id !== nextValue
                  );
                  if (alternative) {
                    setBrandBId(alternative.id);
                  }
                }
                setBrandAId(nextValue);
              }}
              className="h-12 w-full rounded-[14px] border border-[#eadbd4] bg-[#fffdf9] px-5 text-sm font-semibold text-[#151111] outline-none transition focus:border-[#8a2638] focus:ring-2 focus:ring-[#8a2638]/20"
            >
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            onClick={() => {
              const temp = brandAId;
              setBrandAId(brandBId);
              setBrandBId(temp);
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#eadbd4] bg-white text-[#8a2638] transition hover:bg-[#f9f6f3] active:scale-95 md:mb-0"
            title="Intercambiar marcas"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.99 11L3 15h3v4h2v-4h3l-4.01-4zm.02-4h2V3h-3v4h3l3.99-4v4h2V3h-2l-4.01 4z" />
            </svg>
          </button>

          {/* Marca B */}
          <div className="flex flex-col md:flex-1">
            <label className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
              Marca B
            </label>
            <select
              value={brandB.id}
              onChange={(event) => {
                const nextValue = event.target.value;
                if (nextValue === brandA.id) {
                  const alternative = brands.find(
                    (brand) => brand.id !== nextValue
                  );
                  if (alternative) {
                    setBrandAId(alternative.id);
                  }
                }
                setBrandBId(nextValue);
              }}
              className="h-12 w-full rounded-[14px] border border-[#eadbd4] bg-[#fffdf9] px-5 text-sm font-semibold text-[#151111] outline-none transition focus:border-[#8a2638] focus:ring-2 focus:ring-[#8a2638]/20"
            >
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Main Metric Selector */}
          <div className="flex flex-col">
            <label className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
              Métrica principal
            </label>
            <select
              value={mainMetric}
              onChange={(event) => setMainMetric(event.target.value)}
              className="h-12 rounded-[14px] border border-[#eadbd4] bg-[#fffdf9] px-4 text-sm font-semibold text-[#151111] outline-none transition focus:border-[#8a2638] focus:ring-2 focus:ring-[#8a2638]/20"
            >
              <option value="score">Score Global</option>
              <option value="popularity">Popularidad</option>
              <option value="sentiment">Sentimiento</option>
              <option value="mentions">Menciones</option>
            </select>
          </div>

          {/* Generate Report Button */}
          <div className="flex flex-col">
            <label className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-transparent">
              Acción
            </label>
            <div className="flex gap-3">
              <GenerateReportButton brandA={brandA} brandB={brandB} />
            </div>
          </div>
        </div>

        {/* HERO COMPARISON - COMPACT */}
        <div className="mb-12 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#151111] via-[#2a1f1c] to-[#151111] p-8 shadow-lg md:p-10">
          {/* Background accents */}
          <div className="absolute inset-0 -right-20 -top-20 h-60 w-60 rounded-full bg-[#8a2638]/10 blur-3xl" />
          <div className="absolute inset-0 -bottom-20 -left-10 h-40 w-40 rounded-full bg-[#e5a9b6]/5 blur-2xl" />
          
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#e5a9b6]">
                Comparativa de análisis
              </p>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#e5a9b6]">
                {mainMetric === "score" && "Por Score Global"}
                {mainMetric === "popularity" && "Por Popularidad"}
                {mainMetric === "sentiment" && "Por Sentimiento"}
                {mainMetric === "mentions" && "Por Menciones"}
              </span>
            </div>

            {/* Title */}
            <div className="mb-6">
              <h2 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl">
                {brandA.name}
                <span className="text-[#e5a9b6]"> vs </span>
                {brandB.name}
              </h2>
            </div>

            {/* Subtitle & Quick Metrics */}
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <p className="text-sm leading-6 text-white/70">
                {getDynamicInsight(brandA, brandB)}
              </p>

              {/* Main Metric Card */}
              <div className="rounded-[16px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
                <p className="text-xs font-semibold text-[#e5a9b6]">
                  {mainMetric === "score" && "Score Global"}
                  {mainMetric === "popularity" && "Popularidad"}
                  {mainMetric === "sentiment" && "Sentimiento"}
                  {mainMetric === "mentions" && "Menciones"}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">
                    {mainMetric === "score" && brandA.score}
                    {mainMetric === "popularity" && `${brandA.popularity}%`}
                    {mainMetric === "sentiment" && `${brandA.sentiment}%`}
                    {mainMetric === "mentions" && formatNumber(brandA.mentions)}
                  </span>
                  <span className="text-xs text-white/50">vs</span>
                  <span className="text-2xl font-bold text-[#8a2638]">
                    {mainMetric === "score" && brandB.score}
                    {mainMetric === "popularity" && `${brandB.popularity}%`}
                    {mainMetric === "sentiment" && `${brandB.sentiment}%`}
                    {mainMetric === "mentions" && formatNumber(brandB.mentions)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* METRICS GRID - 4 CARDS */}
        <div className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ComparisonBar
            label="Menciones"
            valueA={brandA.mentions}
            valueB={brandB.mentions}
            brandA={brandA.name}
            brandB={brandB.name}
          />

          <ComparisonBar
            label="Popularidad"
            valueA={brandA.popularity}
            valueB={brandB.popularity}
            brandA={brandA.name}
            brandB={brandB.name}
            suffix="%"
          />

          <ComparisonBar
            label="Sentimiento"
            valueA={brandA.sentiment}
            valueB={brandB.sentiment}
            brandA={brandA.name}
            brandB={brandB.name}
            suffix="%"
          />

          <ComparisonBar
            label="Score global"
            valueA={brandA.score}
            valueB={brandB.score}
            brandA={brandA.name}
            brandB={brandB.name}
          />
        </div>

        {/* DETAILED ANALYSIS - TWO COLUMNS */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* LEFT: Detailed Analysis */}
          <div className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm md:p-8">
            <h3 className="mb-6 text-lg font-bold text-[#151111]">Análisis Comparativo</h3>

            <div className="space-y-6">
              {[
                {
                  label: "Menciones",
                  valueA: brandA.mentions,
                  valueB: brandB.mentions,
                  maxValue: 5000,
                  format: (v: number) => formatNumber(v)
                },
                {
                  label: "Popularidad",
                  valueA: brandA.popularity,
                  valueB: brandB.popularity,
                  maxValue: 100,
                  format: (v: number) => `${v}%`
                },
                {
                  label: "Sentimiento",
                  valueA: brandA.sentiment,
                  valueB: brandB.sentiment,
                  maxValue: 100,
                  format: (v: number) => `${v}%`
                },
                {
                  label: "Score Global",
                  valueA: brandA.score,
                  valueB: brandB.score,
                  maxValue: 100,
                  format: (v: number) => v.toString()
                }
              ].map((metric) => {
                const maxVal = Math.max(metric.valueA, metric.valueB, metric.maxValue);
                const percentA = (metric.valueA / maxVal) * 100;
                const percentB = (metric.valueB / maxVal) * 100;
                const winner = getWinner(metric.valueA, metric.valueB, brandA.name, brandB.name);

                return (
                  <div key={metric.label} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-[#151111]">{metric.label}</p>
                      <p className="text-xs font-semibold text-[#8a2638]">
                        Lidera: <span className="font-bold">{winner}</span>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="font-medium text-[#151111]">{brandA.name}</span>
                          <span className="font-bold text-[#151111]">{metric.format(metric.valueA)}</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-[#f0e3de]">
                          <motion.div
                            className="h-full rounded-full bg-[#151111]"
                            style={{ width: `${percentA}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentA}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="font-medium text-[#151111]">{brandB.name}</span>
                          <span className="font-bold text-[#8a2638]">{metric.format(metric.valueB)}</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-[#f0e3de]">
                          <motion.div
                            className="h-full rounded-full bg-[#8a2638]"
                            style={{ width: `${percentB}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentB}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Lifecycle + Evolution */}
          <div className="space-y-6">
            {/* Lifecycle */}
            <div className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm md:p-8">
              <h3 className="mb-6 text-lg font-bold text-[#151111]">Lifecycle Stage</h3>

              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#151111]">{brandA.name}</span>
                    <span className="text-[#8a2638]">{getLifecycle(brandA.score)}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#f0e3de]">
                    <div
                      className="h-full rounded-full bg-[#151111]"
                      style={{ width: `${(brandA.score / 100) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#151111]">{brandB.name}</span>
                    <span className="text-[#8a2638]">{getLifecycle(brandB.score)}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#f0e3de]">
                    <div
                      className="h-full rounded-full bg-[#8a2638]"
                      style={{ width: `${(brandB.score / 100) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Evolution */}
            <div className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm md:p-8">
              <h3 className="mb-6 text-lg font-bold text-[#151111]">Evolución (6 meses)</h3>

              {(() => {
                const evolutionData = getEvolutionData(brandA, brandB);
                const maxScore = Math.max(
                  ...evolutionData.map(d => Math.max(d.brandA, d.brandB))
                );

                return (
                  <div className="space-y-4">
                    {evolutionData.map((point, idx) => (
                      <div key={idx} className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8a2638]">
                          {point.month}
                        </p>

                        <div className="space-y-1.5">
                          <div>
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="font-medium text-[#151111]">{brandA.name}</span>
                              <span className="font-bold text-[#151111]">{point.brandA}</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-[#f0e3de]">
                              <div
                                className="h-full rounded-full bg-[#151111]"
                                style={{ width: `${(point.brandA / maxScore) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="font-medium text-[#151111]">{brandB.name}</span>
                              <span className="font-bold text-[#8a2638]">{point.brandB}</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-[#f0e3de]">
                              <div
                                className="h-full rounded-full bg-[#8a2638]"
                                style={{ width: `${(point.brandB / maxScore) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

    </PageContainer>
  );
}