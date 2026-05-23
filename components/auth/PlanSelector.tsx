"use client";

import { Check } from "lucide-react";

type PlanType = "basic" | "pro" | "premium";

interface PlanSelectorProps {
  selectedPlan: PlanType;
  onPlanChange: (plan: PlanType) => void;
}

interface Plan {
  id: PlanType;
  title: string;
  price: string;
  description: string;
  popular?: boolean;
}

export default function PlanSelector({
  selectedPlan,
  onPlanChange,
}: PlanSelectorProps) {
  const plans: Plan[] = [
    {
      id: "basic",
      title: "Basic",
      price: "Gratis",
      description: "Acceso inicial a tendencias",
    },
    {
      id: "pro",
      title: "Pro",
      price: "$29/mes",
      description: "Análisis avanzado y reportes",
      popular: true,
    },
    {
      id: "premium",
      title: "Premium",
      price: "$99/mes",
      description: "Experiencia VIP con IA predicativa",
    },
  ];

  const getPlanColor = (planId: PlanType) => {
    switch (planId) {
      case "basic":
        return {
          border: "border-[#7A2E3A]",
          lightBg: "from-[#7A2E3A]/5",
          text: "text-[#7A2E3A]",
        };
      case "pro":
        return {
          border: "border-[#d8a7b1]",
          lightBg: "from-[#d8a7b1]/8",
          text: "text-[#d8a7b1]",
        };
      case "premium":
        return {
          border: "border-[#C8A96A]",
          lightBg: "from-[#C8A96A]/5",
          text: "text-[#C8A96A]",
        };
    }
  };

  return (
    <div className="mb-8 w-full">
      <label className="block text-sm font-semibold text-[#171314] mb-4">
        Elige tu plan (puedes cambiar después)
      </label>

      {/* Vertical list - compacta y elegante */}
      <div className="space-y-3 w-full">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const colors = getPlanColor(plan.id);

          return (
            <button
              key={plan.id}
              onClick={() => onPlanChange(plan.id)}
              type="button"
              className={`w-full text-left p-4 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d8a7b1] ${
                isSelected
                  ? `${colors.border} bg-gradient-to-r ${colors.lightBg} to-transparent shadow-md`
                  : "border-[#e8dbd4] bg-[#fffdf9] hover:border-[#d8a7b1]/40 hover:shadow-sm"
              }`}
              aria-pressed={isSelected}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: Plan info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-[#171314]">
                      {plan.title}
                    </h3>
                    {plan.popular && (
                      <span className="inline-flex items-center bg-gradient-to-r from-[#d8a7b1] to-[#C8A96A] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                        Más popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className={`text-lg font-bold ${colors.text}`}>
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-xs text-[#6b625f]">
                    {plan.description}
                  </p>
                </div>

                {/* Right: Check badge */}
                {isSelected && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#d8a7b1] to-[#C8A96A] flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Helper text */}
      <p className="text-xs text-[#b8a9a6] mt-5 text-center">
        Los beneficios son experiencias profesionales fuera de la plataforma
      </p>
    </div>
  );
}
