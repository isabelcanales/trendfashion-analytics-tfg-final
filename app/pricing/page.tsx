import PricingSection from "@/components/pricing/PricingSection";

export const metadata = {
  title: "Planes de Pago | TrendFashion Analytics",
  description: "Planes con eventos, publicaciones y experiencias premium fuera de la web",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#fffdf9]">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-4">
            <span className="inline-block text-xs uppercase tracking-widest font-semibold text-[#d8a7b1] bg-[#d8a7b1]/10 px-4 py-2 rounded-full">
              Monetización
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#171314] text-center mb-6">
            Planes de Suscripción
          </h1>
          <p className="text-lg text-[#6b625f] text-center max-w-2xl mx-auto">
            Acceso a eventos exclusivos, revistas premium y experiencias profesionales fuera de la plataforma.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <section className="py-16 md:py-24 border-t border-[#eadfd3] bg-[#f5f0ed]/40">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#171314] mb-12">
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-[#171314] mb-2">
                ¿Puedo cambiar de plan en cualquier momento?
              </h3>
              <p className="text-[#6b625f]">
                Sí, puedes actualizar o degradar tu plan en cualquier momento desde tu perfil.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#171314] mb-2">
                ¿Hay período de prueba?
              </h3>
              <p className="text-[#6b625f]">
                El Plan Basic es gratuito y tienes acceso completo a todas sus características.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#171314] mb-2">
                ¿Qué incluyen los eventos y revistas premium?
              </h3>
              <p className="text-[#6b625f]">
                Acceso anticipado a lanzamientos de colecciones, sesiones de análisis en vivo con expertos, y revistas digitales curadas sobre tendencias emergentes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#171314] mb-2">
                ¿Cómo funciona el API en Plan Premium?
              </h3>
              <p className="text-[#6b625f]">
                En esta versión de planes no hay integraciones técnicas. Premium se centra en experiencias VIP, asesoría personalizada y acceso prioritario a eventos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
