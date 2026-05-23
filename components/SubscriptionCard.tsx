"use client";

import { Check, Zap, Crown, Sparkles } from "lucide-react";
import Link from "next/link";

type PlanType = "basic" | "pro" | "premium";

interface SubscriptionCardProps {
  currentPlan: string | null | undefined;
}

export default function SubscriptionCard({ currentPlan }: SubscriptionCardProps) {
  const planData: Record<PlanType | string, any> = {
    basic: {
      title: "Plan Basic",
      icon: Sparkles,
      color: "from-[#7A2E3A] to-[#8a2638]",
      badgeColor: "bg-[#7A2E3A]/20 text-[#7A2E3A]",
      features: [
        "Newsletter semanal",
        "1 revista digital por mes",
        "1 webinar mensual",
        "Acceso a comunidad privada",
        "Resumen de tendencias",
      ],
      cta: "Conoce nuestros planes",
    },
    pro: {
      title: "Plan Pro",
      icon: Zap,
      color: "from-[#d8a7b1] to-[#C8A96A]",
      badgeColor: "bg-[#d8a7b1]/20 text-[#d8a7b1]",
      features: [
        "Todo de Basic +",
        "Entrada anticipada a eventos",
        "2 masterclasses mensuales",
        "Revistas semanales",
        "Kits de informes trimestrales",
        "Acceso prioritario a networking",
      ],
      cta: "Cambiar plan",
    },
    premium: {
      title: "Plan Premium",
      icon: Crown,
      color: "from-[#C8A96A] to-[#d8a7b1]",
      badgeColor: "bg-[#C8A96A]/20 text-[#C8A96A]",
      features: [
        "Todo de Pro +",
        "Pase VIP a eventos presenciales",
        "Butaca preferente en lanzamientos",
        "Briefing 1:1 mensual con experto",
        "Dossiers exclusivos de temporada",
        "Mesa redonda privada trimestral",
        "Soporte concierge prioritario",
      ],
      cta: "Cambiar plan",
    },
  };

  const plan = planData[currentPlan || "basic"] || planData.basic;
  const Icon = plan.icon;

  return (
    <div className="rounded-[1.5rem] border border-[#eadfd3] bg-gradient-to-br from-white via-[#fffdf9]/50 to-white p-8 shadow-sm">
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`bg-gradient-to-br ${plan.color} p-3 rounded-lg`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#171314]">
                  {plan.title}
                </h2>
                <p className="text-sm text-[#6b625f]">
                  {currentPlan === "basic"
                    ? "Tu plan actual"
                    : "Plan premium activo"}
                </p>
              </div>
            </div>
          </div>
          {currentPlan !== "basic" && (
            <span className={`${plan.badgeColor} px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider`}>
              Activo
            </span>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {plan.features.map((feature: string, idx: number) => (
            <div key={idx} className="flex items-start gap-3">
              <Check
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  currentPlan === "premium"
                    ? "text-[#C8A96A]"
                    : currentPlan === "pro"
                    ? "text-[#d8a7b1]"
                    : "text-[#7A2E3A]"
                }`}
              />
              <span className="text-sm text-[#6b625f] leading-relaxed">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        {currentPlan !== "premium" && (
          <Link
            href="/pricing"
            className={`inline-flex items-center gap-2 bg-gradient-to-r ${plan.color} hover:shadow-lg hover:shadow-[#d8a7b1]/30 text-white font-semibold px-6 py-3 rounded-lg transition-all hover:scale-105 active:scale-95`}
          >
            <Sparkles className="w-4 h-4" />
            {plan.cta}
          </Link>
        )}

        {currentPlan === "premium" && (
          <p className="text-sm text-[#6b625f] font-medium">
            ¡Gracias por ser parte de nuestro programa Premium! 🎉
          </p>
        )}
      </div>

      {/* Additional Info */}
      <div className="pt-6 border-t border-[#eadfd3]">
        <p className="text-xs text-[#b8a9a6]">
          Los beneficios incluyen acceso a eventos exclusivos, publicaciones premium y experiencias de networking profesional fuera de la plataforma.
        </p>
      </div>
    </div>
  );
}
