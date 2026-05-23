import AnimatedNumber from "@/components/animations/AnimatedNumber";

type FashionMetricCardProps = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  description: string;
  decimals?: number;
};

export default function FashionMetricCard({
  label,
  value,
  prefix = "",
  suffix = "",
  description,
  decimals = 0,
}: FashionMetricCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[1.5rem] border border-[#eadfd3] bg-[#fffdf9]/75 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-2 hover:rotate-[0.7deg] hover:shadow-2xl hover:shadow-[#7A2E3A]/15">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#D8A7B1]/35 blur-3xl" />
        <div className="absolute -right-16 top-10 h-48 w-48 rounded-full bg-[#C8A96A]/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-[#7A2E3A]/15 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.55)_45%,transparent_70%)] transition-transform duration-1000 group-hover:translate-x-[120%]" />
      </div>

      <div className="relative z-10">
        <p className="text-sm font-medium text-[#7A2E3A]">{label}</p>

        <h3 className="mt-4 text-4xl font-bold tracking-tight text-[#171314]">
          <AnimatedNumber
            value={value}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
          />
        </h3>

        <p className="mt-4 text-sm leading-6 text-[#6b625f]">{description}</p>
      </div>
    </article>
  );
}