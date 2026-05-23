import Reveal from "@/components/animations/Reveal";
import FashionMetricCard from "./FashionMetricCard";

const metrics = [
  {
    label: "Marcas analizadas",
    value: 24,
    suffix: "+",
    description: "Seguimiento de marcas luxury, premium y fast fashion.",
  },
  {
    label: "Tendencias detectadas",
    value: 128,
    description: "Agrupación visual de colores, estilos y categorías emergentes.",
  },
  {
    label: "Crecimiento medio",
    value: 32.8,
    prefix: "+",
    suffix: "%",
    decimals: 1,
    description: "Evolución media de popularidad en el periodo seleccionado.",
  },
];

export default function HomeMetricsSection() {
  return (
    <section className="pb-20">
      <Reveal>
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#7A2E3A]">
            Visión general
          </p>

          <h2 className="font-serif text-4xl font-bold tracking-[-0.04em] text-[#171314] md:text-5xl">
            Una lectura clara del comportamiento digital de la moda.
          </h2>
        </div>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-3">
        {metrics.map((metric, index) => (
          <Reveal key={metric.label} delay={index * 0.08}>
            <FashionMetricCard {...metric} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}