type Props = {
  data: { name: string; score: number }[];
};

export default function BrandRankingTable({ data }: Props) {
  const maxScore = Math.max(...data.map((brand) => brand.score), 1);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#eadfd3] bg-[#171314] p-6 text-white shadow-xl shadow-[#7A2E3A]/10">
      <p className="text-sm font-semibold text-[#D8A7B1]">Ranking actual</p>

      <h2 className="mt-1 font-serif text-3xl font-bold">Marcas destacadas</h2>

      <div className="mt-8 space-y-6">
        {data.map((brand, index) => {
          const width = (brand.score / maxScore) * 100;

          return (
            <div key={brand.name}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                    {index + 1}
                  </span>

                  <span className="font-semibold">{brand.name}</span>
                </div>

                <span className="font-bold">
                  {brand.score.toLocaleString("es-ES")}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-[#D8A7B1] transition-all duration-700"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}