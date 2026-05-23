"use client";

import { useMemo, useRef, useState } from "react";
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
  const { data: session } = useSession();
  const router = useRouter();

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
    <section className="my-16 flex w-full flex-col items-center overflow-visible">
      {!isOpen ? (
        <div className="relative h-[600px] w-[460px] overflow-hidden shadow-[0_30px_90px_rgba(21,17,17,0.22)]">
          <img
            src="/images/cover.jpg"
            alt="Trend Book"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/70" />

          <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
            <div>
              
            </div>

            <div>
              <p className="mb-6 font-serif text-6xl font-bold">2026</p>

              <button
                type="button"
                onClick={handleOpenMagazine}
                className="rounded-full bg-[#151111] px-9 py-4 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#8a2638]"
              >
                Abrir revista
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center">
          <div className="relative h-[600px] w-[922px]">
           <HTMLFlipBook
                ref={bookRef}
                width={461}
                height={600}
                size="fixed"
                minWidth={461}
                maxWidth={461}
                minHeight={600}
                maxHeight={600}
                showCover={true}
                drawShadow={false}
                flippingTime={330}
                useMouseEvents={false}
                mobileScrollSupport={true}
                className="mx-auto"
                style={{}}
                startPage={0}
                usePortrait={false}
                startZIndex={0}
                autoSize={false}
                clickEventForward={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
                maxShadowOpacity={0}
                >
              {/* PORTADA */}
              <div className="relative h-[600px] w-[461px] overflow-hidden bg-[#151111]">
                    <img
                    src="/images/cover.jpg"
                    alt="Trend Book"
                    className="h-full w-full object-cover"
                    />

                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/70" />

              
              </div>

              {/* PÁGINA VACÍA */}
              <div className="h-[600px] w-[461px] bg-[#f8f5f2]" />

              {/* DESCRIPCIÓN DE LA REVISTA */}
              <div className="h-[600px] w-[461px] bg-[#f8f5f2] p-14">
                <div className="flex h-full flex-col justify-center">
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
                    Editorial 2026
                  </p>

                  <h2 className="mt-6 font-serif text-6xl leading-[0.95] text-[#151111]">
                    Fashion Trend
                    <br />
                    Forecast
                  </h2>

                  <p className="mt-10 max-w-[320px] text-lg leading-9 text-[#5f5652]">
                    Una selección editorial de tendencias, comportamientos
                    visuales y movimientos estéticos que definirán la conversación
                    digital y la industria de la moda durante 2026.
                  </p>
                </div>
              </div>

              {magazineTrends.flatMap((trend, index) => [
                <div
                  key={`${trend.id}-visual`}
                  className="relative h-[600px] w-[461px] overflow-hidden bg-[#f9f7f4] p-12"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
                    Tendencia {index + 1}
                  </p>

                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
                    {trend.category}
                  </p>

                  <h2 className="mt-5 font-serif text-6xl font-bold leading-[0.9] text-[#151111]">
                    {trend.name}
                  </h2>

                  <div className="mt-8 h-[320px] overflow-hidden rounded-[2px] bg-[#eee5df]">
                    <img
                      src={getImage(trend.id)}
                      alt={trend.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <span className="absolute bottom-8 left-12 text-sm font-bold text-[#8a2638]">
                    {index * 2 + 4}
                  </span>
                </div>,

                <div
                  key={`${trend.id}-analysis`}
                  className="relative h-[600px] w-[461px] overflow-hidden bg-[#f8f5f2] px-10 py-9"
                >
                  <div className="absolute inset-y-0 left-0 w-[14px] bg-gradient-to-r from-black/10 to-transparent" />

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#8a2638]">
                          Análisis editorial
                        </p>

                        <h2 className="mt-4 max-w-[300px] font-serif text-5xl font-bold leading-[0.9] text-[#151111]">
                          {trend.status}
                        </h2>
                      </div>

                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#151111] text-2xl font-black text-white">
                        +{trend.growth ?? 0}
                      </div>
                    </div>

                    <p className="mt-7 text-[15px] leading-7 text-[#352d2a]">
                      {trend.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {(trend.brands ?? []).map((brand) => (
                        <span
                          key={`${trend.id}-${brand}`}
                          className="rounded-full bg-[#efe7e2] px-3 py-1.5 text-xs font-semibold text-[#5c514c]"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>

                    <div className="mt-7 grid grid-cols-3 gap-3">
                      <div className="rounded-[18px] bg-[#f3ece8] p-4">
                        <p className="text-xs font-bold text-[#8a2638]">
                          Growth
                        </p>
                        <p className="mt-2 text-2xl font-black text-[#151111]">
                          +{trend.growth ?? 0}%
                        </p>
                      </div>

                      <div className="rounded-[18px] bg-[#f3ece8] p-4">
                        <p className="text-xs font-bold text-[#8a2638]">
                          Pop.
                        </p>
                        <p className="mt-2 text-2xl font-black text-[#151111]">
                          {trend.popularity}%
                        </p>
                      </div>

                      <div className="rounded-[18px] bg-[#f3ece8] p-4">
                        <p className="text-xs font-bold text-[#8a2638]">
                          Sent.
                        </p>
                        <p className="mt-2 text-2xl font-black text-[#151111]">
                          {trend.sentiment}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto rounded-[22px] border border-[#ead9d2] bg-[#fcfaf8] p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8a2638]">
                        Insight
                      </p>

                      <p className="mt-3 text-sm leading-6 text-[#5f5652]">
                        {getInsight(trend.status)}
                      </p>
                    </div>
                  </div>

                  <span className="absolute bottom-6 right-10 text-xs font-bold text-[#8a2638]">
                    {index * 2 + 5}
                  </span>
                </div>,
              ])}
            </HTMLFlipBook>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => bookRef.current?.pageFlip().flipPrev()}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl shadow-md"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={() => bookRef.current?.pageFlip().flipNext()}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl shadow-md"
            >
              ›
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="ml-4 rounded-full bg-[#151111] px-9 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}