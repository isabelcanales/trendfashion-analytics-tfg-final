import TransitionLink from "@/components/animations/TransitionLink";
import BrandPopularityPanel from "./BrandPopularityPanel";
import Reveal from "@/components/animations/Reveal";

export default function HeroSection() {
  return (
    <section className="relative left-1/2 grid min-h-[58vh] w-screen -translate-x-1/2 items-center overflow-hidden">
      {/* HERO BACKGROUND */}
      <img
        src="/images/hero-fashion.jpg"
        alt="Fondo editorial de moda"
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-65"
      />

      {/* CAPAS DE LUZ / LEGIBILIDAD */}
      <div className="absolute inset-0 z-0 bg-[#fffdf9]/15" />

      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#fffdf9]/90 via-[#fffdf9]/55 to-[#fffdf9]/10" />

      {/* GRADIENTE FUERTE HACIA BLANCO ABAJO */}
      <div className="absolute inset-x-0 bottom-0 z-0 h-[65%] bg-gradient-to-b from-transparent via-[#fffdf9]/75 to-white" />

      {/* CONTENT CENTRADO */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <Reveal>
            <span className="mb-6 inline-flex rounded-full border border-[#d8c7b8] bg-[#fffdf9]/70 px-4 py-2 text-sm font-medium text-[#7A2E3A] backdrop-blur">
              Fashion Data Intelligence
            </span>

            <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[0.95] tracking-[-0.06em] text-[#171314] md:text-6xl">
              Estadísticas de moda para entender tendencias, marcas y reputación.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5f5551]">
              Plataforma visual para analizar marcas de moda, comparar su evolución
              digital y detectar tendencias mediante dashboards interactivos.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <TransitionLink
                href="/dashboard"
                className="rounded-full bg-[#171314] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-[#7A2E3A]"
              >
                Entrar al dashboard
              </TransitionLink>

              <TransitionLink
                href="/brands"
                className="rounded-full border border-[#d8c7b8] bg-[#fffdf9]/70 px-7 py-3 text-sm font-semibold text-[#171314] transition hover:bg-white"
              >
                Ver marcas
              </TransitionLink>
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal delay={0.15}>
            <BrandPopularityPanel />
          </Reveal>
        </div>
      </div>
    </section>
  );
}