import AnimatedNumber from "@/components/animations/AnimatedNumber";

type StatCardProps = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  description: string;
};

export default function StatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  description,
}: StatCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-[#eadfd3] bg-[#fffdf9]/80 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7A2E3A]/10">
      <p className="text-sm font-semibold text-[#7A2E3A]">{label}</p>

      <h3 className="mt-3 text-4xl font-bold tracking-tight text-[#171314]">
        <AnimatedNumber
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
        />
      </h3>

      <p className="mt-3 text-sm leading-6 text-[#6b625f]">{description}</p>
    </article>
  );
}