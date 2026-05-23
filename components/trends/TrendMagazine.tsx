"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HTMLFlipBook from "react-pageflip";

type Trend = {
  id: string;
  name: string;
  category: string;
  growth: number | null;
  popularity: number;
  sentiment: number;
  status: "Emergente" | "En crecimiento" | "Consolidada" | "Estable";
  brands: string[];
  description: string;
};

interface TrendMagazineProps {
  trends?: Trend[];
  selectedStatus?: string;
}

const fallbackTrends: Trend[] = [
  {
    id: "quiet-luxury",
    name: "Quiet Luxury",
    category: "Estética",
    growth: 46,
    popularity: 91,
    sentiment: 84,
    status: "Consolidada",
    brands: ["Chanel", "Prada", "Massimo Dutti", "COS"],
    description:
      "Estética basada en prendas sobrias, materiales premium y ausencia de logos visibles.",
  },
  {
    id: "coquette",
    name: "Coquette",
    category: "Microtendencia",
    growth: 39,
    popularity: 82,
    sentiment: 76,
    status: "Emergente",
    brands: ["Miu Miu", "Zara", "Sandro"],
    description:
      "Lazos, encajes y feminidad romántica reinterpretada en redes sociales.",
  },
  {
    id: "old-money",
    name: "Old Money",
    category: "Lifestyle",
    growth: 34,
    popularity: 86,
    sentiment: 81,
    status: "Consolidada",
    brands: ["Ralph Lauren", "Chanel", "Massimo Dutti", "Loro Piana"],
    description:
      "Elegancia clásica, lujo silencioso y códigos visuales aspiracionales.",
  },
  {
    id: "denim-total-look",
    name: "Denim Total Look",
    category: "Prenda clave",
    growth: 28,
    popularity: 74,
    sentiment: 69,
    status: "En crecimiento",
    brands: ["Zara", "Mango", "H&M", "Diesel"],
    description:
      "El denim vuelve como protagonista absoluto en prendas y accesorios.",
  },
];

const images: Record<string, string> = {
  "quiet-luxury": "/images/quiet-luxury.jpg",
  coquette: "/images/coquette.jpg",
  "old-money": "/images/old-money.jpg",
  "denim-total-look": "/images/denim-total-look.jpg",

  "streetwear-premium": "/images/streetwear-premium.jpg",
  "minimalismo-calido": "/images/minimalismo-calido.jpg",
  metalizados: "/images/metalizados.jpg",
  "sastreria-relajada": "/images/sastreria-relajada.jpg",
};

function getImage(id: string) {
  return images[id] ?? "/images/quiet-luxury.jpg";
}

function getInsight(status: Trend["status"]) {
  if (status === "Emergente") {
    return "Alta capacidad de crecimiento y fuerte impacto digital.";
  }

  if (status === "En crecimiento") {
    return "Tendencia en expansión con presencia creciente en editoriales.";
  }

  if (status === "Consolidada") {
    return "Estética asentada con fuerte reconocimiento aspiracional.";
  }

  return "Tendencia estable con potencial comercial sostenido.";
}

export default function TrendMagazine({
  trends,
  selectedStatus = "Todas",
}: TrendMagazineProps) {
  const bookRef = useRef<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => {
      mediaQuery.removeEventListener("change", updateIsMobile);
    };
  }, []);

  const pageWidth = isMobile ? 330 : 461;
  const pageHeight = isMobile ? 520 : 600;
  const bookWidth = isMobile ? pageWidth : pageWidth * 2;

  const pageStyle = {
    width: `${pageWidth}px`,
    height: `${pageHeight}px`,
  };

  const handleOpenMagazine = () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    setIsOpen(true);
  };

  const visibleTrends = useMemo(() => {
    const source = trends?.length ? trends : fallbackTrends;

    if (selectedStatus === "Todas") return source;

    return source.filter((trend) => trend.status === selectedStatus);
  }, [trends, selectedStatus]);

  const magazineTrends = visibleTrends.slice(0, 8);

  return (
    <section className="my-10 flex w-full flex-col items-center overflow-hidden px-4 sm:my-16 sm:px-0">
      {!isOpen ? (
        <div className="relative aspect-[23/30] w-full max-w-[460px] overflow-hidden rounded-[10px] shadow-[0_30px_90px_rgba(21,17,17,0.22)]">
          <img
            src="/images/cover.jpg"
            alt="Trend Book"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/70" />

          <div className="absolute inset-0 flex flex-col justify-between p-8 text-white sm:p-12">
            <div />

            <div>
              <p className="mb-6 font-serif text-5xl font-bold sm:text-6xl">
                2026
              </p>

              <button
                type="button"
                onClick={handleOpenMagazine}
                className="rounded-full bg-[#151111] px-7 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#8a2638] sm:px-9 sm:text-xs sm:tracking-[0.22em]"
              >
                Abrir revista
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center">
          <div className="w-full overflow-x-auto overflow-y-hidden pb-4">
            <div
              className="relative mx-auto"
              style={{ width: `${bookWidth}px`, height: `${pageHeight}px` }}
            >
              <HTMLFlipBook
                key={isMobile ? "mobile" : "desktop"}
                ref={bookRef}
                width={pageWidth}
                height={pageHeight}
                size="fixed"
                minWidth={pageWidth}
                maxWidth={pageWidth}
                minHeight={pageHeight}
                maxHeight={pageHeight}
                showCover={!isMobile}
                drawShadow={false}
                flippingTime={330}
                useMouseEvents={false}
                mobileScrollSupport={true}
                className="mx-auto"
                style={{}}
                startPage={0}
                usePortrait={isMobile}
                startZIndex={0}
                autoSize={false}
                clickEventForward={true}
                swipeDistance={30}
                showPageCorners={!isMobile}
                disableFlipByClick={false}
                maxShadowOpacity={0}
              >
                {/* PORTADA */}
                <div
                  className="relative overflow-hidden bg-[#151111]"
                  style={pageStyle}
                >
                  <img
                    src="/images/cover.jpg"
                    alt="Trend Book"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/70" />
                </div>

                {/* PÁGINA VACÍA */}
                <div style={pageStyle} className="bg-[#f8f5f2]" />

                {/* DESCRIPCIÓN DE LA REVISTA */}
                <div
                  style={pageStyle}
                  className="bg-[#f8f5f2] p-8 sm:p-14"
                >
                  <div className="flex h-full flex-col justify-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8a2638] sm:text-xs sm:tracking-[0.35em]">
                      Editorial 2026
                    </p>

                    <h2 className="mt-6 font-serif text-5xl leading-[0.95] text-[#151111] sm:text-6xl">
                      Fashion Trend
                      <br />
                      Forecast
                    </h2>

                    <p className="mt-8 max-w-[320px] text-base leading-8 text-[#5f5652] sm:mt-10 sm:text-lg sm:leading-9">
                      Una selección editorial de tendencias, comportamientos
                      visuales y movimientos estéticos que definirán la conversación
                      digital y la industria de la moda durante 2026.
                    </p>
                  </div>
                </div>

                {magazineTrends.flatMap((trend, index) => [
                  <div
                    key={`${trend.id}-visual`}
                    style={pageStyle}
                    className="relative overflow-hidden bg-[#f9f7f4] p-7 sm:p-12"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8a2638] sm:text-xs sm:tracking-[0.35em]">
                      Tendencia {index + 1}
                    </p>

                    <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#8a2638] sm:mt-6 sm:text-xs sm:tracking-[0.35em]">
                      {trend.category}
                    </p>

                    <h2 className="mt-5 font-serif text-5xl font-bold leading-[0.9] text-[#151111] sm:text-6xl">
                      {trend.name}
                    </h2>

                    <div className="mt-7 h-[250px] overflow-hidden rounded-[2px] bg-[#eee5df] sm:mt-8 sm:h-[320px]">
                      <img
                        src={getImage(trend.id)}
                        alt={trend.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <span className="absolute bottom-7 left-7 text-sm font-bold text-[#8a2638] sm:bottom-8 sm:left-12">
                      {index * 2 + 4}
                    </span>
                  </div>,

                  <div
                    key={`${trend.id}-analysis`}
                    style={pageStyle}
                    className="relative overflow-hidden bg-[#f8f5f2] px-7 py-7 sm:px-10 sm:py-9"
                  >
                    <div className="absolute inset-y-0 left-0 w-[14px] bg-gradient-to-r from-black/10 to-transparent" />

                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#8a2638] sm:text-[10px] sm:tracking-[0.32em]">
                            Análisis editorial
                          </p>

                          <h2 className="mt-4 max-w-[250px] font-serif text-4xl font-bold leading-[0.9] text-[#151111] sm:max-w-[300px] sm:text-5xl">
                            {trend.status}
                          </h2>
                        </div>

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#151111] text-lg font-black text-white sm:h-16 sm:w-16 sm:text-2xl">
                          +{trend.growth ?? 0}
                        </div>
                      </div>

                      <p className="mt-6 text-sm leading-6 text-[#352d2a] sm:mt-7 sm:text-[15px] sm:leading-7">
                        {trend.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
                        {(trend.brands ?? []).map((brand) => (
                          <span
                            key={`${trend.id}-${brand}`}
                            className="rounded-full bg-[#efe7e2] px-3 py-1.5 text-[11px] font-semibold text-[#5c514c] sm:text-xs"
                          >
                            {brand}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-7 sm:gap-3">
                        <div className="rounded-[16px] bg-[#f3ece8] p-3 sm:rounded-[18px] sm:p-4">
                          <p className="text-[11px] font-bold text-[#8a2638] sm:text-xs">
                            Growth
                          </p>
                          <p className="mt-2 text-xl font-black text-[#151111] sm:text-2xl">
                            +{trend.growth ?? 0}%
                          </p>
                        </div>

                        <div className="rounded-[16px] bg-[#f3ece8] p-3 sm:rounded-[18px] sm:p-4">
                          <p className="text-[11px] font-bold text-[#8a2638] sm:text-xs">
                            Pop.
                          </p>
                          <p className="mt-2 text-xl font-black text-[#151111] sm:text-2xl">
                            {trend.popularity}%
                          </p>
                        </div>

                        <div className="rounded-[16px] bg-[#f3ece8] p-3 sm:rounded-[18px] sm:p-4">
                          <p className="text-[11px] font-bold text-[#8a2638] sm:text-xs">
                            Sent.
                          </p>
                          <p className="mt-2 text-xl font-black text-[#151111] sm:text-2xl">
                            {trend.sentiment}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto rounded-[20px] border border-[#ead9d2] bg-[#fcfaf8] p-4 sm:rounded-[22px] sm:p-5">
                        <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#8a2638] sm:text-[10px] sm:tracking-[0.3em]">
                          Insight
                        </p>

                        <p className="mt-3 text-sm leading-6 text-[#5f5652]">
                          {getInsight(trend.status)}
                        </p>
                      </div>
                    </div>

                    <span className="absolute bottom-6 right-7 text-xs font-bold text-[#8a2638] sm:right-10">
                      {index * 2 + 5}
                    </span>
                  </div>,
                ])}
              </HTMLFlipBook>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
            <button
              type="button"
              onClick={() => bookRef.current?.pageFlip().flipPrev()}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-3xl shadow-md sm:h-14 sm:w-14"
              aria-label="Página anterior"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={() => bookRef.current?.pageFlip().flipNext()}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-3xl shadow-md sm:h-14 sm:w-14"
              aria-label="Página siguiente"
            >
              ›
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-[#151111] px-7 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white sm:ml-4 sm:px-9 sm:text-xs sm:tracking-[0.2em]"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
