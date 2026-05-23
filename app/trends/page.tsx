"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import PageContainer from "@/components/layout/PageContainer";
import TrendMagazine from "@/components/trends/TrendMagazine";

type Trend = {
  id: string;
  name: string;
  category: string;
  growth: number;
  popularity: number;
  sentiment: number;
  status: "Emergente" | "En crecimiento" | "Consolidada" | "Estable";
  brands: string[];
  description: string;
};

const statusLabels = [
  "Todas",
  "Emergente",
  "En crecimiento",
  "Consolidada",
  "Estable",
] as const;

type StatusFilter = (typeof statusLabels)[number];

function getStatusStyles(status: string) {
  if (status === "Emergente") {
    return "bg-[#f7ece8] text-[#8a2638]";
  }

  if (status === "En crecimiento") {
    return "bg-[#151111] text-white";
  }

  if (status === "Consolidada") {
    return "bg-[#eadbd4] text-[#151111]";
  }

  return "bg-[#fbf7f4] text-[#6d6260]";
}

function getTrendInsight(status: string) {
  if (status === "Emergente") {
    return "Alta capacidad de crecimiento y fuerte visibilidad en redes sociales.";
  }

  if (status === "En crecimiento") {
    return "Tendencia en fase de expansión, con presencia creciente en marcas y contenidos.";
  }

  if (status === "Consolidada") {
    return "Estética ya asentada, con presencia estable en comunicación editorial y consumo aspiracional.";
  }

  return "Tendencia estable, útil para construir armarios funcionales y propuestas atemporales.";
}

function chunkTrends(items: Trend[], size: number) {
  const chunks: Trend[][] = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
}

export default function TrendsPage() {
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("Todas");
  const [trendData, setTrendData] = useState<{
    trends: Trend[];
    source?: "newsapi" | "database" | "fallback";
    updatedAt?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos de tendencias desde la API
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
        setTrendData(data);
      } catch (error) {
        console.error("Error loading trends:", error);
        // Si falla, usar fallback
        setTrendData({
          trends: [],
          source: "fallback",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadTrends();
  }, []);

  const trends = trendData?.trends ?? [];
  const dataSource = trendData?.source ?? "fallback";

  const filteredTrends = useMemo(() => {
    if (selectedStatus === "Todas") {
      return trends;
    }

    return trends.filter((trend) => trend.status === selectedStatus);
  }, [selectedStatus, trends]);

  const globalSortedTrends = useMemo(() => {
    return [...trends].sort((a, b) => {
      const growthA = a.growth ?? 0;
      const growthB = b.growth ?? 0;
      return growthB - growthA;
    });
  }, [trends]);

  const topTrend = globalSortedTrends[0] || {
    id: "loading",
    name: "Cargando...",
    category: "Datos",
    growth: 0,
    popularity: 0,
    sentiment: 50,
    status: "Estable" as const,
    brands: [],
    description: "Analizando datos de tendencias",
  };

  const averageGrowth = useMemo(() => {
    if (!filteredTrends.length) return 0;

    return Math.round(
      filteredTrends.reduce((total, trend) => total + trend.growth, 0) /
        filteredTrends.length
    );
  }, [filteredTrends]);

  const averagePopularity = useMemo(() => {
    if (!filteredTrends.length) return 0;

    return Math.round(
      filteredTrends.reduce((total, trend) => total + trend.popularity, 0) /
        filteredTrends.length
    );
  }, [filteredTrends]);

  const averageSentiment = useMemo(() => {
    if (!filteredTrends.length) return 0;

    return Math.round(
      filteredTrends.reduce((total, trend) => total + trend.sentiment, 0) /
        filteredTrends.length
    );
  }, [filteredTrends]);

  return (
    <PageContainer>
      {/* DATA SOURCE INDICATOR */}
      {dataSource === "newsapi" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 rounded-lg border border-[#d4e4d4] bg-[#f0f7f0] px-4 py-3 text-xs text-[#2d5a2d]"
        >
          ✓ Datos en tiempo real desde NewsAPI
        </motion.div>
      )}

      {dataSource === "database" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 rounded-lg border border-[#f0e4d4] bg-[#f7f3f0] px-4 py-3 text-xs text-[#8a5a2d]"
        >
          ⚠️ Últimas noticias guardadas (NewsAPI no disponible)
        </motion.div>
      )}

      {dataSource === "fallback" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 rounded-lg border border-[#f7ece8] bg-[#fbf7f4] px-4 py-3 text-xs text-[#8a2638]"
        >
          ⚠️ Datos de demostración por falta de conexión con la fuente externa. Los datos reales se cargarán cuando NewsAPI esté disponible.
        </motion.div>
      )}

      <section className="pb-20 pt-12">
        {/* HERO */}
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
              Radar de tendencias
            </p>

            <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[0.95] text-[#151111] md:text-6xl">
              Tendencias emergentes del ecosistema moda.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#6d6260]">
              Visualiza estilos, microtendencias y categorías con mayor
              crecimiento dentro del comportamiento digital del sector moda.
            </p>
          </div>

          <div className="rounded-full border border-[#eadbd4] bg-white px-5 py-3 text-sm font-semibold text-[#8a2638] shadow-sm">
            Tendencia líder: {topTrend.name}
          </div>
        </div>

        {/* FILTER */}
        <div className="mb-10 rounded-[28px] border border-[#eadbd4] bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                Clasificación
              </p>

              <h2 className="font-serif text-3xl font-bold text-[#151111]">
                Estado de las tendencias
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusLabels.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    selectedStatus === status
                      ? "bg-[#151111] text-white"
                      : "bg-[#f7ece8] text-[#8a2638] hover:bg-[#eadbd4]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* STATS */}
          <div className="mb-12 grid gap-5 md:grid-cols-4">
            <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-[#8a2638]">
                Tendencias visibles
              </p>

              <h2 className="text-4xl font-bold text-[#151111]">
                {filteredTrends.length}
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#6d6260]">
                Estilos mostrados según el estado seleccionado.
              </p>
            </article>

            <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-[#8a2638]">
                Crecimiento medio
              </p>

              <h2 className="text-4xl font-bold text-[#151111]">
                +{averageGrowth}%
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#6d6260]">
                Incremento medio de presencia digital.
              </p>
            </article>

            <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-[#8a2638]">
                Popularidad media
              </p>

              <h2 className="text-4xl font-bold text-[#151111]">
                {averagePopularity}%
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#6d6260]">
                Nivel medio de interés generado por las tendencias.
              </p>
            </article>

            <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-[#8a2638]">
                Sentimiento medio
              </p>

              <h2 className="text-4xl font-bold text-[#151111]">
                {averageSentiment}%
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#6d6260]">
                Percepción positiva asociada a los estilos analizados.
              </p>
            </article>
          </div>

          <p className="max-w-3xl text-sm leading-6 text-[#6d6260]">
            Las tendencias se clasifican según su nivel de crecimiento,
            estabilidad y presencia dentro de marcas, noticias y conversaciones
            digitales del sector.
          </p>
        </div>

      
        {/* TREND MAGAZINE */}
        <div className="mb-10">
          <TrendMagazine
            trends={filteredTrends}
            selectedStatus={selectedStatus}
          />
        </div>
        {/* FEATURED TREND */}
        <section className="mb-10 overflow-hidden rounded-[36px] border border-[#eadbd4] bg-[#fffdf9] shadow-[0_24px_70px_rgba(60,35,30,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="flex min-h-[360px] flex-col justify-between bg-[#151111] p-8 text-white md:p-10">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#e5a9b6]">
                  Tendencia líder
                </p>

                <h2 className="font-serif text-5xl font-bold leading-none md:text-6xl">
                  {topTrend.name}
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
                  {topTrend.description}
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusStyles(
                    topTrend.status
                  )}`}
                >
                  {topTrend.status}
                </span>

                {(topTrend.brands ?? []).map((brand) => (
                  <span
                    key={brand}
                    className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/80"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-5 p-8 md:grid-cols-3 md:p-10">
              <article className="rounded-[28px] bg-[#fbf7f4] p-6">
                <p className="mb-4 text-sm font-semibold text-[#8a2638]">
                  Crecimiento
                </p>

                <h3 className="text-5xl font-bold text-[#151111]">
                  +{topTrend.growth}%
                </h3>

                <p className="mt-4 text-sm leading-6 text-[#6d6260]">
                  Es la tendencia con mayor incremento del radar actual.
                </p>
              </article>

              <article className="rounded-[28px] bg-[#fbf7f4] p-6">
                <p className="mb-4 text-sm font-semibold text-[#8a2638]">
                  Popularidad
                </p>

                <h3 className="text-5xl font-bold text-[#151111]">
                  {topTrend.popularity}%
                </h3>

                <p className="mt-4 text-sm leading-6 text-[#6d6260]">
                  Alta presencia en conversación digital y referencias de marca.
                </p>
              </article>

              <article className="rounded-[28px] bg-[#fbf7f4] p-6">
                <p className="mb-4 text-sm font-semibold text-[#8a2638]">
                  Sentimiento
                </p>

                <h3 className="text-5xl font-bold text-[#151111]">
                  {topTrend.sentiment}%
                </h3>

                <p className="mt-4 text-sm leading-6 text-[#6d6260]">
                  Percepción positiva vinculada a estética, calidad y deseo.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* RADAR */}
        <section className="mb-10 rounded-[36px] bg-[#151111] p-8 text-white shadow-xl md:p-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-[#e5a9b6]">
                Radar actual
              </p>

              <h2 className="font-serif text-4xl font-bold">
                Mapa de crecimiento digital
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-white/60">
              Comparativa de crecimiento entre las tendencias monitorizadas en
              el periodo actual.
            </p>
          </div>

          <div className="space-y-5">
            {globalSortedTrends.map((trend, index) => (
              <div
                key={trend.id}
                className="grid gap-3 md:grid-cols-[220px_1fr_70px]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                    {index + 1}
                  </span>

                  <div>
                    <p className="font-bold">{trend.name}</p>
                    <p className="text-xs text-white/45">{trend.status}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#e5a9b6]"
                      style={{ width: `${trend.growth * 2}%` }}
                    />
                  </div>
                </div>

                <p className="text-right text-sm font-bold">
                  +{trend.growth}%
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </PageContainer>
  );
}

function TrendBookSection({
  trends,
  selectedStatus,
}: {
  trends: Trend[];
  selectedStatus: StatusFilter;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [turnAnimationKey, setTurnAnimationKey] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const [turningTrends, setTurningTrends] = useState<Trend[]>([]);
  const [turningFromPage, setTurningFromPage] = useState(0);

  const pages = useMemo(() => chunkTrends(trends, 2), [trends]);

  useEffect(() => {
    setCurrentPage(0);
    setIsBookOpen(false);
    setTurnAnimationKey(0);
    setIsTurning(false);
    setTurningFromPage(0);
  }, [selectedStatus]);

  const safeCurrentPage = Math.min(currentPage, Math.max(pages.length - 1, 0));
  const currentTrends = pages[safeCurrentPage] ?? [];

  function turnToPage(nextPage: number, nextDirection: "next" | "previous") {
    if (pages.length <= 1 || isTurning) return;

    // Guardar el contenido antiguo para la animación
    const oldPageTrends = pages[safeCurrentPage] ?? [];
    setTurningTrends(oldPageTrends);
    setTurningFromPage(safeCurrentPage);

    // Cambiar página inmediatamente
    setCurrentPage(nextPage);
    setDirection(nextDirection);
    setIsTurning(true);
    setTurnAnimationKey((key) => key + 1);

    // Esperar al final de la animación para permitir nuevos clicks
    window.setTimeout(() => {
      setIsTurning(false);
    }, 750);
  }

  function goToPreviousPage() {
    const nextPage =
      safeCurrentPage === 0 ? pages.length - 1 : safeCurrentPage - 1;
    turnToPage(nextPage, "previous");
  }

  function goToNextPage() {
    const nextPage =
      safeCurrentPage === pages.length - 1 ? 0 : safeCurrentPage + 1;
    turnToPage(nextPage, "next");
  }

  function goToPage(page: number) {
    if (page === safeCurrentPage || isTurning) return;

    turnToPage(page, page > safeCurrentPage ? "next" : "previous");
  }

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
            Análisis editorial
          </p>

          <h2 className="font-serif text-3xl font-bold text-[#151111] md:text-4xl">
            {selectedStatus === "Todas"
              ? "Trend Book 2026"
              : `Trend Book · ${selectedStatus}`}
          </h2>
        </div>

        <p className="max-w-xl text-sm leading-7 text-[#6d6260]">
          Explora las tendencias monitorizadas como un informe editorial
          interactivo. Cada página muestra una tendencia con su galería visual
          a la izquierda y análisis detallado a la derecha.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[38px] border border-[#eadbd4] bg-gradient-to-br from-[#fff8f4] via-[#f7ece8] to-[#eadbd4] p-4 shadow-[0_30px_90px_rgba(90,45,35,0.14)] md:p-7">
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#d8a7b1]/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#c8a96a]/25 blur-3xl" />

        <AnimatePresence mode="wait" initial={false}>
          {!isBookOpen ? (
            <motion.div
              key="closed-book"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col items-center justify-center py-8 md:py-12"
            >
              <ClosedTrendBook
                onOpen={() => setIsBookOpen(true)}
                totalPages={Math.max(pages.length, 1)}
                trendCount={trends.length}
                selectedStatus={selectedStatus}
              />
            </motion.div>
          ) : (
            <motion.div
              key="open-book"
              initial={{ opacity: 0, y: 16, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.985 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
                    Informe editorial
                  </p>

                  <h3 className="font-serif text-3xl font-bold text-[#151111] md:text-4xl">
                    Cuaderno de tendencias
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBookOpen(false)}
                    disabled={isTurning}
                    className="rounded-full border border-[#d8c7b8] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#151111] shadow-sm transition hover:bg-[#151111] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Cerrar libro
                  </button>

                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    disabled={pages.length <= 1 || isTurning}
                    className="rounded-full border border-[#d8c7b8] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#151111] shadow-sm transition hover:bg-[#151111] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Anterior
                  </button>

                  <span className="rounded-full bg-[#151111] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                    Página {safeCurrentPage + 1} de {Math.max(pages.length, 1)}
                  </span>

                  <button
                    type="button"
                    onClick={goToNextPage}
                    disabled={pages.length <= 1 || isTurning}
                    className="rounded-full border border-[#d8c7b8] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#151111] shadow-sm transition hover:bg-[#151111] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>

              <div
                className="relative rounded-[32px] bg-[#f4e7df] p-3 shadow-[inset_0_0_0_1px_rgba(90,38,56,0.10),0_22px_60px_rgba(0,0,0,0.15)] md:p-5"
                style={{ perspective: "1800px" }}
              >
                <div className="pointer-events-none absolute inset-y-5 left-1/2 z-20 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#b98f86]/50 to-transparent md:block" />
                <div className="pointer-events-none absolute inset-y-6 left-1/2 z-20 hidden w-8 -translate-x-1/2 bg-gradient-to-r from-black/10 via-black/5 to-transparent blur-xl md:block" />
                <div className="pointer-events-none absolute inset-y-4 left-3 hidden w-3 rounded-full bg-gradient-to-r from-black/20 to-transparent md:block" />
                <div className="pointer-events-none absolute inset-y-4 right-3 hidden w-3 rounded-full bg-gradient-to-l from-black/15 to-transparent md:block" />

                <PageTurnOverlay
                  animationKey={turnAnimationKey}
                  direction={direction}
                  turningTrends={turningTrends}
                  fromPageIndex={turningFromPage}
                />

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${selectedStatus}-${safeCurrentPage}`}
                    initial={{ opacity: 0, scale: 0.995 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.995 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="grid gap-3 md:grid-cols-2 h-full"
                  >
                    {currentTrends.length > 0 ? (
                      <>
                        {/* Left page - Image */}
                        <TrendBookPageImage trend={currentTrends[0]} />

                        {/* Right page - Content */}
                        <TrendBookPage
                          trend={currentTrends[0]}
                          absoluteIndex={safeCurrentPage + 1}
                        />
                      </>
                    ) : (
                      <div className="col-span-full rounded-[24px] bg-[#fffdf9] p-10 text-center">
                        <p className="font-serif text-3xl font-bold text-[#151111]">
                          No hay tendencias para este filtro.
                        </p>

                        <p className="mt-3 text-sm text-[#6d6260]">
                          Prueba con otro estado para consultar el cuaderno.
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {pages.length > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  {pages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => goToPage(index)}
                      disabled={isTurning}
                      className={`h-2.5 rounded-full transition ${
                        index === safeCurrentPage
                          ? "w-9 bg-[#151111]"
                          : "w-2.5 bg-[#8a2638]/30 hover:bg-[#8a2638]/60"
                      } ${isTurning ? "cursor-not-allowed opacity-40" : ""}`}
                      aria-label={`Ir a la página ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function PageTurnOverlay({
  animationKey,
  direction,
  turningTrends,
  fromPageIndex,
}: {
  animationKey: number;
  direction: "next" | "previous";
  turningTrends: Trend[];
  fromPageIndex: number;
}) {
  if (animationKey === 0 || turningTrends.length === 0) return null;

  const isNext = direction === "next";
  const turningLeftTrend = turningTrends[0];
  const turningRightTrend = turningTrends[1] ?? turningTrends[0];
  const turningAbsoluteIndex = fromPageIndex * 2 + 1;

  return (
    <AnimatePresence>
      <motion.div
        key={animationKey}
        className="pointer-events-none absolute inset-y-5 z-40 hidden w-full overflow-visible md:block"
        initial={{
          rotateY: 0,
        }}
        animate={{
          rotateY: isNext ? -180 : 180,
        }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.75,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: isNext ? "left center" : "right center",
        }}
      >
        {/* Front of rotating pages */}
        <div
          className="grid gap-3 md:grid-cols-2 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          {/* Left page - Image (rotating) */}
          <TrendBookPageImage trend={turningLeftTrend} />

          {/* Right page - Content (rotating) */}
          <motion.div
            className="relative rounded-[24px] border border-[#eadbd4] bg-[#fffdf9] overflow-hidden shadow-lg"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75 }}
          >
            {/* Lighting effect on front */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: isNext
                  ? "linear-gradient(90deg, rgba(0,0,0,0.15) 0%, transparent 30%)"
                  : "linear-gradient(270deg, rgba(0,0,0,0.15) 0%, transparent 30%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{
                duration: 0.75,
                ease: "easeInOut",
              }}
            />

            <TrendBookPageContent
              trend={turningRightTrend}
              absoluteIndex={turningAbsoluteIndex + 1}
            />
          </motion.div>
        </div>

        {/* Back of rotating pages */}
        <div
          className="grid gap-3 md:grid-cols-2 w-full h-full absolute inset-0"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Back left - Image */}
          <div
            className="relative rounded-[24px] border border-[#eadbd4] overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(135deg, #eadbd4 0%, #d8a7b1 50%, #c8a96a 100%)`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>

          {/* Back right - Image */}
          <div
            className="relative rounded-[24px] border border-[#eadbd4] overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(135deg, #f7ece8 0%, #eadbd4 50%, #d8a7b1 100%)`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/5" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ClosedTrendBook({
  onOpen,
  totalPages,
  trendCount,
  selectedStatus,
}: {
  onOpen: () => void;
  totalPages: number;
  trendCount: number;
  selectedStatus: StatusFilter;
}) {
  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-[950px] flex-col items-center justify-center gap-8 md:flex-row md:items-center md:justify-between">
        <motion.div
          whileHover={{
            y: -8,
            rotateY: -9,
            rotateX: 5,
            scale: 1.02,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformPerspective: 1200, transformStyle: "preserve-3d" }}
          className="relative h-[430px] w-[300px] shrink-0 cursor-pointer md:h-[500px] md:w-[360px]"
          onClick={onOpen}
        >
          <div className="absolute inset-y-4 left-[-18px] w-8 rounded-l-[26px] bg-gradient-to-r from-[#080707] via-[#201416] to-[#352126]" />
          <div className="absolute bottom-1 left-8 right-[-18px] top-8 rounded-[26px] bg-black/25 blur-2xl" />

          <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,#140d0f_0%,#241417_45%,#1b1214_70%,#3a241e_100%)] px-7 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(229,169,182,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(200,169,106,0.14),transparent_30%)]" />
            <div className="absolute inset-y-0 left-5 w-px bg-white/10" />
            <div className="absolute inset-y-0 left-7 w-px bg-black/25" />
            <div className="absolute right-5 top-5 h-16 w-16 rounded-full border border-white/10 bg-white/5 blur-sm" />

            <div className="relative z-10 flex h-full flex-col">
              <p className="text-xs font-bold uppercase tracking-[0.38em] text-[#e5a9b6]">
                Trend Book
              </p>

              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                  Edición editorial
                </p>

                <h3 className="mt-4 font-serif text-5xl font-bold leading-[0.92] text-white">
                  2026
                </h3>

                <h4 className="mt-3 max-w-[180px] font-serif text-4xl font-bold leading-[0.95] text-white">
                  Cuaderno de tendencias
                </h4>
              </div>

              <div className="mt-8 rounded-[22px] border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#e5a9b6]">
                  Contenido
                </p>

                <ul className="mt-4 space-y-2 text-sm leading-6 text-white/70">
                  <li>{trendCount} tendencias monitorizadas</li>
                  <li>{totalPages} páginas editoriales</li>
                  <li>
                    {selectedStatus === "Todas"
                      ? "Vista completa del radar"
                      : `Filtro: ${selectedStatus}`}
                  </li>
                </ul>
              </div>

              <div className="mt-auto">
                <div className="mb-5 h-px w-full bg-white/10" />

                <p className="text-sm leading-6 text-white/65">
                  Un informe visual para explorar crecimiento, popularidad,
                  sentimiento e insight editorial.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-[420px] text-center md:text-left">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
            Portada interactiva
          </p>

          <h3 className="font-serif text-4xl font-bold text-[#151111] md:text-5xl">
            Abre el informe
          </h3>

          <p className="mt-5 text-sm leading-7 text-[#6d6260]">
            Ahora el Trend Book se presenta como un objeto editorial: primero
            aparece la portada cerrada y después se abre para mostrar las páginas
            del análisis con galerías visuales.
          </p>

          <button
            type="button"
            onClick={onOpen}
            className="mt-7 rounded-full bg-[#151111] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-sm transition hover:translate-y-[-1px] hover:bg-[#8a2638]"
          >
            Abrir cuaderno
          </button>
        </div>
      </div>
    </div>
  );
}

function TrendBookPageContent({
  trend,
  absoluteIndex,
}: {
  trend: Trend;
  absoluteIndex: number;
}) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.85),transparent_45%,rgba(138,38,56,0.04))]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#f7ece8] blur-2xl" />

      <div className="relative z-10 flex h-full flex-col p-6 md:p-8">
        <div className="mb-7 flex items-start justify-between gap-4">
          <span className="inline-flex rounded-full bg-[#f7ece8] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
            #{absoluteIndex} · {trend.category}
          </span>

          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#151111] text-sm font-bold text-white">
            +{trend.growth}
          </span>
        </div>

        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#8a2638]">
          {trend.status}
        </p>

        <h4 className="max-w-md font-serif text-4xl font-bold leading-[0.95] text-[#151111] md:text-5xl">
          {trend.name}
        </h4>

        <p className="mt-6 text-sm leading-7 text-[#6d6260]">
          {trend.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(trend.brands ?? []).map((brand) => (
            <span
              key={brand}
              className="rounded-full bg-[#fbf7f4] px-3 py-1 text-xs font-semibold text-[#6d6260]"
            >
              {brand}
            </span>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <BookMetric label="Growth" value={`+${trend.growth}%`} />
          <BookMetric label="Pop." value={`${trend.popularity}%`} />
          <BookMetric label="Sent." value={`${trend.sentiment}%`} />
        </div>

        <div className="mt-auto pt-7">
          <div className="rounded-2xl border border-[#f0e3de] bg-white/70 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8a2638]">
              Insight
            </p>

            <p className="mt-3 text-sm leading-7 text-[#6d6260]">
              {getTrendInsight(trend.status)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function TrendBookPageImage({
  trend,
}: {
  trend: Trend;
}) {
  return (
    <article className="relative min-h-[520px] overflow-hidden rounded-[24px] border border-[#eadbd4] bg-gradient-to-br shadow-[0_18px_50px_rgba(80,45,35,0.10)] md:rounded-r-[18px]"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(${(trend.growth * 3) % 360}, 65%, 50%), hsl(${(trend.popularity * 2) % 360}, 55%, 60%))`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
      
      <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8 text-white">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/70 mb-4">
            {trend.category}
          </p>
          <h3 className="font-serif text-4xl font-bold leading-[0.95] md:text-5xl">
            {trend.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {(trend.brands ?? []).slice(0, 2).map((brand) => (
            <span
              key={brand}
              className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function TrendBookPage({
  trend,
  absoluteIndex,
}: {
  trend: Trend;
  absoluteIndex: number;
}) {
  return (
    <article className="relative min-h-[520px] overflow-hidden rounded-[24px] border border-[#eadbd4] bg-[#fffdf9] shadow-[0_18px_50px_rgba(80,45,35,0.10)] md:rounded-l-[18px]">
      <TrendBookPageContent trend={trend} absoluteIndex={absoluteIndex} />
    </article>
  );
}

function BookMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#fbf7f4] p-4">
      <p className="text-[11px] font-semibold text-[#8a2638]">{label}</p>
      <p className="mt-2 text-lg font-bold text-[#151111]">{value}</p>
    </div>
  );
}
