"use client";

import { useState } from "react";

const categories = [
  "Todas",
  "Estética",
  "Microtendencia",
  "Prenda clave",
  "Color / textura",
  "Estilo urbano",
  "Silueta",
];

const states = [
  "Todos",
  "Emergente",
  "En crecimiento",
  "Consolidada",
  "En descenso",
];

interface TimelineFiltersProps {
  onStateChange: (state: string) => void;
  onCategoryChange: (category: string) => void;
  selectedState: string;
  selectedCategory: string;
  totalTrends: number;
}

export function TimelineFilters({
  onStateChange,
  onCategoryChange,
  selectedState,
  selectedCategory,
  totalTrends,
}: TimelineFiltersProps) {
  return (
    <div className="rounded-[28px] border border-[#eadbd4] bg-white p-6 shadow-sm">
      <div className="space-y-6">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
            Filtrar por estado
          </p>
          <div className="flex flex-wrap gap-2">
            {states.map((state) => (
              <button
                key={state}
                type="button"
                onClick={() => onStateChange(state)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  selectedState === state
                    ? "bg-[#151111] text-white"
                    : "bg-[#f7ece8] text-[#8a2638] hover:bg-[#eadbd4]"
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#f0e3de] pt-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
            Filtrar por categoría
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  selectedCategory === category
                    ? "bg-[#151111] text-white"
                    : "bg-[#f7ece8] text-[#8a2638] hover:bg-[#eadbd4]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#f0e3de] pt-6">
          <p className="text-sm font-semibold text-[#151111]">
            Tendencias visibles: <span className="text-[#8a2638]">{totalTrends}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
