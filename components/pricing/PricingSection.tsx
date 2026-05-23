"use client";

import { useState } from "react";
import PricingCard from "./PricingCard";
import PricingModal from "./PricingModal";

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "basic",
      title: "Basic",
      price: "Gratis",
      description: "Primer acceso al ecosistema",
      features: [
        "Newsletter semanal curada por editores",
        "1 revista digital premium al mes",
        "Invitación a 1 webinar mensual",
        "Acceso a comunidad privada de profesionales",
        "Resumen mensual de tendencias por email",
        "Descuentos en workshops asociados",
      ],
    },
    {
      id: "pro",
      title: "Pro",
      price: "$29",
      description: "Para equipos y consultores",
      features: [
        "Todo de Basic +",
        "Entrada anticipada a eventos del sector",
        "2 pases al mes para masterclasses en vivo",
        "Revistas premium semanales",
        "Kit trimestral de informes ejecutivos descargables",
        "Acceso prioritario a networking privado",
        "Invitaciones a showroom partners",
        "Soporte por email con prioridad media",
      ],
    },
    {
      id: "premium",
      title: "Premium",
      price: "$99",
      description: "Experiencia VIP y consultiva",
      features: [
        "Todo de Pro +",
        "Pase VIP a eventos presenciales seleccionados",
        "Butaca preferente en lanzamientos y conferencias",
        "Briefing 1:1 mensual con analista experto",
        "Dossiers exclusivos de temporada",
        "Acceso a mesa redonda privada trimestral",
        "Invitación a experiencias de marca",
        "Soporte concierge prioritario",
      ],
    },
  ];

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
  };

  return (
    <>
      <section className="relative pt-6 md:pt-10 pb-16 md:pb-24 overflow-visible">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d8a7b1]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C8A96A]/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">

          {/* Pricing Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-6 mb-8 auto-rows-fr items-stretch">
            {plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan.id as "basic" | "pro" | "premium"}
                title={plan.title}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                onSelectPlan={handleSelectPlan}
                highlighted={plan.id === "pro"}
              />
            ))}
          </div>

          {/* Footer text */}
          <div className="text-center">
            <p className="text-sm text-[#b8a9a6]">
              Los beneficios son externos a la plataforma: eventos, publicaciones y experiencias profesionales.
            </p>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {selectedPlan && (
        <PricingModal plan={selectedPlan} onClose={handleCloseModal} />
      )}
    </>
  );
}
