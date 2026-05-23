"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrandCategory, MetricType } from "@/types/fashion";

type CategoryFilter = BrandCategory | "Todas";

type DashboardFiltersProps = {
  category: CategoryFilter;
  metric: MetricType;
  onCategoryChange: (value: CategoryFilter) => void;
  onMetricChange: (value: MetricType) => void;
};

export default function DashboardFilters({
  category,
  metric,
  onCategoryChange,
  onMetricChange,
}: DashboardFiltersProps) {
  return (
    <section className="mb-8 rounded-[2rem] border border-[#eadfd3] bg-[#fffdf9]/85 p-5 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge className="bg-[#171314] text-white hover:bg-[#171314]">
              Filtros activos
            </Badge>

            <Badge className="bg-[#D8A7B1]/25 text-[#7A2E3A] hover:bg-[#D8A7B1]/25">
              {category}
            </Badge>

            <Badge className="bg-[#C8A96A]/20 text-[#7A2E3A] hover:bg-[#C8A96A]/20">
              {metric}
            </Badge>
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#171314]">
            Ajusta la lectura de datos
          </h2>

          <p className="mt-1 text-sm text-[#6b625f]">
            Filtra por tipo de marca y métrica principal.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:min-w-[520px]">
          <Select
            value={category}
            onValueChange={(value) => onCategoryChange(value as CategoryFilter)}
          >
            <SelectTrigger className="!h-14 min-w-[200px] rounded-full border-[#eadfd3] bg-white px-6 text-base font-semibold text-[#171314] shadow-sm transition hover:border-[#d8c7b8] focus:ring-2 focus:ring-[#D8A7B1]/30 [&_span]:text-base [&_svg]:h-5 [&_svg]:w-5">
              <SelectValue placeholder="Tipo de marca" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Todas">Todas</SelectItem>
              <SelectItem value="Luxury">Luxury</SelectItem>
              <SelectItem value="Fast Fashion">Fast Fashion</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={metric}
            onValueChange={(value) => onMetricChange(value as MetricType)}
          >
            <SelectTrigger className="!h-14 min-w-[200px] rounded-full border-[#eadfd3] bg-white px-6 text-base font-semibold text-[#171314] shadow-sm transition hover:border-[#d8c7b8] focus:ring-2 focus:ring-[#D8A7B1]/30 [&_span]:text-base [&_svg]:h-5 [&_svg]:w-5">
              <SelectValue placeholder="Métrica" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="mentions">Menciones</SelectItem>
              <SelectItem value="popularity">Popularidad</SelectItem>
              <SelectItem value="sentiment">Sentimiento</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}