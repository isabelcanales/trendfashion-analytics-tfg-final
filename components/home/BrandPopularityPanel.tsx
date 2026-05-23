import Reveal from "@/components/animations/Reveal";
import AnimatedNumber from "@/components/animations/AnimatedNumber";

type BrandCategory = "Luxury" | "Fast Fashion" | "Premium";

type Brand = {
  name: string;
  mentions: number;
  category: BrandCategory;
};

const brands: Brand[] = [
  { name: "Prada", mentions: 880, category: "Luxury" },
  { name: "Chanel", mentions: 371, category: "Luxury" },
  { name: "Dior", mentions: 368, category: "Luxury" },
  { name: "Gucci", mentions: 237, category: "Luxury" },
  { name: "Zara", mentions: 106, category: "Fast Fashion" },
  { name: "Mango", mentions: 42, category: "Fast Fashion" },
];

const sortedBrands = [...brands].sort((a, b) => b.mentions - a.mentions);

const totalMentions = brands.reduce((total, brand) => total + brand.mentions, 0);

const maxMentions = Math.max(...brands.map((brand) => brand.mentions));

const averagePopularity =
  brands.reduce((total, brand) => total + brand.mentions, 0) / brands.length;

export default function BrandPopularityPanel() {
  return (
    <div className="rounded-[2rem] border border-[#eadfd3] bg-[#fffdf9]/80 p-5 shadow-2xl shadow-[#7A2E3A]/10 backdrop-blur">
      <div className="rounded-[1.5rem] bg-[#171314] p-6 text-white">
        <div className="mb-8 flex items-center justify-between gap-6">
          <div>
            <p className="text-sm text-[#d8a7b1]">Popularidad global</p>

            <h2 className="mt-1 text-4xl font-bold tracking-tight">
              <AnimatedNumber
                value={averagePopularity}
                suffix="+"
                decimals={0}
              />
            </h2>
          </div>

          <span className="rounded-full bg-[#C8A96A]/20 px-4 py-2 text-sm font-medium text-[#EAD7A0]">
            Fashion Index
          </span>
        </div>

        <div className="space-y-5">
          {sortedBrands.map((brand, index) => {
            const width = (brand.mentions / maxMentions) * 100;

            return (
              <Reveal key={brand.name} delay={index * 0.08}>
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <div>
                      <span className="font-medium">{brand.name}</span>

                      <span className="ml-2 text-xs text-white/45">
                        {brand.category}
                      </span>
                    </div>

                    <span>
                      <AnimatedNumber value={brand.mentions} />
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-[#D8A7B1] transition-all duration-1000"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-xs text-white/50">Marcas</p>

            <p className="mt-1 text-xl font-semibold">
              <AnimatedNumber value={brands.length} />
            </p>
          </div>

          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-xs text-white/50">Categorías</p>

            <p className="mt-1 text-xl font-semibold">
              <AnimatedNumber
                value={new Set(brands.map((brand) => brand.category)).size}
              />
            </p>
          </div>

          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-xs text-white/50">Datos</p>

            <p className="mt-1 text-xl font-semibold">
              <AnimatedNumber value={totalMentions} suffix="+" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}