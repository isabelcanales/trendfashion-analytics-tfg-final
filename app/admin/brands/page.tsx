import Link from "next/link";

export default function BrandsAdminPage() {
  return (
    <main className="min-h-screen bg-[#fffdf9] p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-[#8a2638] hover:text-[#d8a7b1] font-semibold mb-6 inline-block">
          ← Volver al panel
        </Link>

        <h1 className="text-4xl font-bold text-[#151111] mb-4">Gestión de Marcas</h1>
        <p className="text-[#b8a9a6] text-lg mb-8">
          Registra, actualiza y analiza marcas. Gestiona categorías, países y métricas asociadas.
        </p>

        <div className="bg-white rounded-lg border border-[#eadbd4] p-8">
          <p className="text-[#8a9099] text-center py-12">
            Esta sección se implementará en la siguiente fase.
          </p>
        </div>
      </div>
    </main>
  );
}
