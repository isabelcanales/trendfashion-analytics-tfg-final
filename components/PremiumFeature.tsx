"use client";

import { Lock, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

type PlanType = "pro" | "premium";

interface PremiumFeatureProps {
  requiredPlan: PlanType;
  title: string;
  description: string;
  currentPlan?: string | null;
  icon?: React.ReactNode;
  ctaText?: string;
  size?: "sm" | "md" | "lg";
}

export default function PremiumFeature({
  requiredPlan,
  title,
  description,
  currentPlan,
  icon,
  ctaText = "Desbloquear",
  size = "md",
}: PremiumFeatureProps) {
  // Determine if user has access
  const planHierarchy = { basic: 0, pro: 1, premium: 2 };
  const currentPlanLevel = planHierarchy[currentPlan as keyof typeof planHierarchy] || 0;
  const requiredPlanLevel = planHierarchy[requiredPlan];
  const hasAccess = currentPlanLevel >= requiredPlanLevel;

  if (hasAccess) {
    return null; // No mostrar el bloque si el usuario tiene acceso
  }

  const getPlanColor = (plan: PlanType) => {
    switch (plan) {
      case "pro":
        return {
          bg: "bg-gradient-to-br from-[#d8a7b1]/10 to-[#f1e4dc]/5",
          border: "border-[#d8a7b1]/30",
          badge: "bg-[#d8a7b1]/20 text-[#d8a7b1]",
          button: "bg-gradient-to-r from-[#d8a7b1] to-[#C8A96A] hover:shadow-lg hover:shadow-[#d8a7b1]/30",
        };
      case "premium":
        return {
          bg: "bg-gradient-to-br from-[#C8A96A]/10 to-[#f1e4dc]/5",
          border: "border-[#C8A96A]/30",
          badge: "bg-[#C8A96A]/20 text-[#C8A96A]",
          button: "bg-gradient-to-r from-[#C8A96A] to-[#d8a7b1] hover:shadow-lg hover:shadow-[#C8A96A]/30",
        };
    }
  };

  const colors = getPlanColor(requiredPlan);

  const sizeStyles = {
    sm: "p-4",
    md: "p-7 sm:p-8",
    lg: "p-8 sm:p-10",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const titleSizes = {
    sm: "text-sm font-semibold",
    md: "text-base font-semibold",
    lg: "text-lg font-bold",
  };

  const descSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const buttonSizes = {
    sm: "text-xs py-2 px-3",
    md: "text-sm py-2.5 px-4",
    lg: "text-base py-3 px-5",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[20px] border-2 ${colors.border} ${colors.bg} backdrop-blur-sm transition-all ${sizeStyles[size]} hover:shadow-lg`}
    >
      {/* Shine effect */}
      <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-50 rounded-[20px] overflow-hidden transition-opacity">
        <div className="absolute inset-0 translate-x-[-100%] hover:translate-x-[100%] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] transition-transform duration-700" />
      </div>

      <div className="relative z-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {icon ? (
              <div className={`${iconSizes[size]} flex-shrink-0 text-[#d8a7b1]`}>{icon}</div>
            ) : (
              <Lock className={`${iconSizes[size]} flex-shrink-0 text-[#d8a7b1]`} />
            )}
            <span className={`${colors.badge} ${size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'md' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5'} rounded-full font-semibold uppercase tracking-wider`}>
              {requiredPlan === "pro" ? "Pro+" : "Premium"}
            </span>
          </div>
          <h3 className={`${titleSizes[size]} text-[#171314] mb-2`}>{title}</h3>
          <p className={`${descSizes[size]} text-[#6b625f] leading-relaxed`}>
            {description}
          </p>
        </div>

        <Link
          href="/pricing"
          className={`${colors.button} text-[#151111] font-semibold rounded-lg transition-all inline-flex items-center gap-1.5 flex-shrink-0 ${buttonSizes[size]} hover:scale-105 active:scale-95 self-start sm:self-center`}
        >
          {ctaText}
          <ArrowRight className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}`} />
        </Link>
      </div>
    </div>
  );
}
