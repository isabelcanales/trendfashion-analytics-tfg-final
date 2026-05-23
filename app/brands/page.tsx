"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import PageContainer from "@/components/layout/PageContainer";
import { FavoriteBrandButton } from "@/components/FavoriteBrandButton";
import { getBrandMetrics } from "@/lib/brandMetrics";
import { BrandMetricsResponse } from "@/types/brandMetrics";

const categoryLabels = ["Todas", "Luxury", "Premium", "Fast Fashion"] as const;

type CategoryLabel = (typeof categoryLabels)[number];

type BrandCardItem = {
  id: string;
  name: string;
  category: string;
  country: string;
  mentions: number;
  popularity: number;
  sentiment: number;
  score: number;
};

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

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES").format(value);
}

function getBrandId(brand: string) {
  return brand.toLowerCase().replaceAll("&", "and").replaceAll(" ", "-");
}

function getCategoryDescription(category: string) {
  if (category === "Luxury") {
    return "Marcas de lujo con alta presencia editorial, fuerte identidad visual y gran impacto aspiracional.";
  }

  if (category === "Premium") {
    return "Marcas con posicionamiento cuidado, estética refinada y una audiencia digital más segmentada.";
  }

  if (category === "Fast Fashion") {
    return "Marcas con gran volumen de menciones, alta rotación de tendencias y fuerte conexión con consumo masivo.";
  }

  return "Marca analizada dentro del ecosistema digital de moda.";
}

function getSentimentText(sentiment: number) {
  if (sentiment >= 80) return "Muy positivo";
  if (sentiment >= 70) return "Estable";
  return "Mejorable";
}

function getBrandAccent(category: string) {
  if (category === "Luxury") return "from-[#151111] via-[#8a2638] to-[#d8a7b1]";
  if (category === "Premium") return "from-[#8a2638] via-[#c8a96a] to-[#f7ece8]";
  if (category === "Fast Fashion")
    return "from-[#151111] via-[#6d6260] to-[#eadbd4]";

  return "from-[#151111] via-[#8a2638] to-[#eadbd4]";
}

export default function BrandsPage() {
  const [data, setData] = useState<BrandMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryLabel>("Todas");

  useEffect(() => {
    async function loadMetrics() {
      try {
        const result = await getBrandMetrics();
        setData(result);
      } catch (error) {
        console.error("Error cargando métricas reales:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  const brands = useMemo(() => {
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

  const filteredBrands = useMemo(() => {
    if (selectedCategory === "Todas") {
      return brands;
    }

    return brands.filter((brand) => brand.category === selectedCategory);
  }, [brands, selectedCategory]);

  const sortedBrands = useMemo(() => {
    return [...filteredBrands].sort((a, b) => b.mentions - a.mentions);
  }, [filteredBrands]);

  const globalSortedBrands = useMemo(() => {
    return [...brands].sort((a, b) => b.mentions - a.mentions);
  }, [brands]);

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

  const topBrand = globalSortedBrands[0];

  if (loading) {
    return (
      <PageContainer>
        <section className="pb-20 pt-12">
          <div className="rounded-[28px] border border-[#eadbd4] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#8a2638]">
              Cargando datos reales de marcas...
            </p>
          </div>
        </section>
      </PageContainer>
    );
  }

  if (!data || !brands.length) {
    return (
      <PageContainer>
        <section className="pb-20 pt-12">
          <div className="rounded-[28px] border border-[#eadbd4] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#8a2638]">
              No se pudieron cargar los datos de marcas.
            </p>
          </div>
        </section>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <section className="pb-20 pt-12">
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
              Mapa de marcas
            </p>

            <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[0.95] text-[#151111] md:text-6xl">
              Análisis digital de marcas de moda.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#6d6260]">
              Consulta el rendimiento de marcas luxury, premium y fast fashion a
              partir de menciones reales, popularidad estimada y sentimiento
              calculado desde titulares y descripciones.
            </p>

            <p className="mt-4 text-xs font-medium text-[#8a2638]/80">
              {data.source === "newsapi"
                ? `Datos reales obtenidos de NewsAPI · Actualizado en ${data.updatedAt}`
                : "Modo demostración: no se pudo conectar con NewsAPI"}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-full border border-[#eadbd4] bg-white px-5 py-3 text-sm font-semibold text-[#8a2638] shadow-sm"
          >
            <span className="relative z-10">Marca líder: {topBrand.name}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#f7ece8] via-white to-[#eadbd4] opacity-70" />
          </motion.div>
        </div>

        {/* SOURCE INDICATOR */}
        {data.source === "newsapi" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 rounded-lg border border-[#d4e4d4] bg-[#f0f7f0] px-4 py-3 text-xs text-[#2d5a2d]"
          >
            ✓ Datos en tiempo real desde NewsAPI
          </motion.div>
        )}
        
        {data.source === "database" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 rounded-lg border border-[#f0e4d4] bg-[#f7f3f0] px-4 py-3 text-xs text-[#8a5a2d]"
          >
            ⚠️ Últimas noticias guardadas (NewsAPI no disponible)
          </motion.div>
        )}
        
        {data.source === "fallback" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 rounded-lg border border-[#f7ece8] bg-[#fbf7f4] px-4 py-3 text-xs text-[#8a2638]"
          >
            ⚠️ Datos de demostración por falta de conexión con la fuente externa. Los datos reales se cargarán cuando NewsAPI esté disponible.
          </motion.div>
        )}

        <div className="mb-12 grid gap-5 md:grid-cols-4">
          <StatCard
            label="Marcas visibles"
            value={filteredBrands.length.toString()}
            description="Marcas mostradas según el segmento seleccionado."
            delay={0}
          />

          <StatCard
            label="Menciones totales"
            value={`${formatNumber(totalMentions)}+`}
            description="Volumen acumulado del segmento seleccionado."
            delay={0.06}
          />

          <StatCard
            label="Popularidad media"
            value={`${averagePopularity}%`}
            description="Índice calculado según presencia mediática."
            delay={0.12}
          />

          <StatCard
            label="Sentimiento medio"
            value={`${averageSentiment}%`}
            description="Estimación basada en titulares y descripciones."
            delay={0.18}
          />
        </div>

        <div className="mb-10 rounded-[28px] border border-[#eadbd4] bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                Segmentación
              </p>

              <h2 className="font-serif text-3xl font-bold text-[#151111]">
                Categorías principales
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {categoryLabels.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    selectedCategory === category
                      ? "bg-[#151111] text-white shadow-sm"
                      : "bg-[#f7ece8] text-[#8a2638] hover:bg-[#eadbd4]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-6 text-[#6d6260]">
            Esta sección permite observar la distribución de marcas por
            posicionamiento y comparar su rendimiento digital según el segmento
            al que pertenecen.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                  Ranking completo
                </p>

                <h2 className="font-serif text-3xl font-bold text-[#151111]">
                  {selectedCategory === "Todas"
                    ? "Marcas monitorizadas"
                    : `Marcas ${selectedCategory}`}
                </h2>
              </div>
            </div>

            <motion.div layout className="grid gap-5 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {sortedBrands.map((brand, index) => (
                  <motion.div
                    layout
                    key={brand.id}
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 18, scale: 0.96 }}
                    transition={{
                      duration: 0.38,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <InteractiveBrandCard brand={brand} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          <aside className="h-fit overflow-hidden rounded-[32px] bg-[#151111] p-7 text-white shadow-xl lg:sticky lg:top-28">
            <div className="pointer-events-none absolute" />

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#d9a7b0]">
              Ranking actual
            </p>

            <h2 className="mb-8 font-serif text-3xl font-bold">
              Top marcas destacadas
            </h2>

            <div className="space-y-6">
              {sortedBrands.slice(0, 6).map((brand, index) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.id}`}
                  className="group block rounded-2xl p-2 transition hover:bg-white/5"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold transition group-hover:bg-[#e5a9b6] group-hover:text-[#151111]">
                        {index + 1}
                      </span>

                      <div>
                        <p className="font-bold">{brand.name}</p>
                        <p className="text-xs text-white/50">
                          {brand.category}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-bold">{brand.score}</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${brand.score}%` }}
                      transition={{
                        duration: 0.7,
                        delay: index * 0.04,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="h-full rounded-full bg-[#e5a9b6]"
                    />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="mb-2 text-sm font-bold text-[#e5a9b6]">
                Lectura rápida
              </p>

              <p className="text-sm leading-6 text-white/70">
                El ranking se ordena por menciones reales obtenidas desde la
                API. La popularidad se calcula en relación con la marca con más
                presencia mediática.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </PageContainer>
  );
}

function StatCard({
  label,
  value,
  description,
  delay,
}: {
  label: string;
  value: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <p className="mb-3 text-sm font-semibold text-[#8a2638]">{label}</p>

      <h2 className="text-4xl font-bold text-[#151111]">{value}</h2>

      <p className="mt-4 text-sm leading-6 text-[#6d6260]">{description}</p>
    </motion.article>
  );
}

function InteractiveBrandCard({
  brand,
  index,
}: {
  brand: BrandCardItem;
  index: number;
}) {
  const [transform, setTransform] = useState(
    "perspective(1100px) rotateX(0deg) rotateY(0deg) scale(1)"
  );

  const [glowPosition, setGlowPosition] = useState({
    x: "50%",
    y: "50%",
    opacity: 0,
  });

  function handleMouseMove(event: React.MouseEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const xPercent = x / rect.width;
    const yPercent = y / rect.height;

    const rotateY = (xPercent - 0.5) * 12;
    const rotateX = (0.5 - yPercent) * 12;

    setTransform(
      `perspective(1100px) rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.018)`
    );

    setGlowPosition({
      x: `${x}px`,
      y: `${y}px`,
      opacity: 1,
    });
  }

  function handleMouseLeave() {
    setTransform("perspective(1100px) rotateX(0deg) rotateY(0deg) scale(1)");

    setGlowPosition({
      x: "50%",
      y: "50%",
      opacity: 0,
    });
  }

  return (
    <Link
      href={`/brands/${brand.id}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
      className="group relative block overflow-hidden rounded-[28px] border border-[#eadbd4] bg-white p-6 shadow-sm transition-[box-shadow,transform] duration-300 will-change-transform hover:shadow-[0_26px_70px_rgba(70,30,25,0.14)]"
    >
      <div
        className="pointer-events-none absolute h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d8a7b1]/35 blur-3xl transition-opacity duration-300"
        style={{
          left: glowPosition.x,
          top: glowPosition.y,
          opacity: glowPosition.opacity,
        }}
      />

      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${getBrandAccent(
          brand.category
        )}`}
      />

      <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full border border-[#eadbd4] bg-[#f7ece8]/70 transition duration-500 group-hover:scale-125" />

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className="mb-4 inline-flex rounded-full bg-[#f7ece8] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
              #{index + 1} · {brand.category}
            </span>

            <h3 className="font-serif text-3xl font-bold text-[#151111] transition group-hover:text-[#8a2638]">
              {brand.name}
            </h3>

            <p className="mt-2 text-sm text-[#6d6260]">{brand.country}</p>
          </div>

          <div className="flex items-center gap-2">
            <FavoriteBrandButton brandName={brand.name} />
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#151111] text-lg font-bold text-white transition duration-300 group-hover:scale-110 group-hover:bg-[#8a2638]">
              {brand.score}
            </div>
          </div>
        </div>

        <p className="mb-6 text-sm leading-6 text-[#6d6260]">
          {getCategoryDescription(brand.category)}
        </p>

        <div className="mb-6 grid grid-cols-3 gap-3">
          <MetricBox label="Menciones" value={formatNumber(brand.mentions)} />
          <MetricBox label="Popularidad" value={`${brand.popularity}%`} />
          <MetricBox label="Sentimiento" value={`${brand.sentiment}%`} />
        </div>

        <div className="space-y-4">
          <ProgressMetric
            label="Popularidad"
            value={brand.popularity}
            color="bg-[#151111]"
          />

          <ProgressMetric
            label="Sentimiento"
            value={brand.sentiment}
            text={getSentimentText(brand.sentiment)}
            color="bg-[#8a2638]"
          />
        </div>

        <div className="mt-6 border-t border-[#f0e3de] pt-4">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#8a2638]">
            Ver detalle de marca →
          </span>
        </div>
      </div>
    </Link>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#fbf7f4] p-4 transition group-hover:bg-[#f7ece8]">
      <p className="text-xs font-semibold text-[#8a2638]">{label}</p>
      <p className="mt-2 text-lg font-bold text-[#151111]">{value}</p>
    </div>
  );
}

function ProgressMetric({
  label,
  value,
  text,
  color,
}: {
  label: string;
  value: number;
  text?: string;
  color: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#6d6260]">
        <span>{label}</span>
        <span>{text ?? `${value}%`}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#f0e3de]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}