"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PlanSelector from "@/components/auth/PlanSelector";

type PlanType = "basic" | "pro" | "premium";

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("basic");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    consultancy: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Por favor completa los campos obligatorios (Nombre, Email, Contraseña)");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          consultancy: formData.consultancy,
          plan: selectedPlan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Error al crear la cuenta");
        return;
      }

      toast.success("¡Cuenta creada correctamente!");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 1500);
    } catch (error) {
      toast.error("Error al crear la cuenta");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#151111] mb-2">
              TrendFashion Analytics
            </h1>
            <p className="text-gray-600">Crea tu cuenta</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Plan Selector */}
            <PlanSelector
              selectedPlan={selectedPlan}
              onPlanChange={setSelectedPlan}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638]"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638]"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la consultora <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <input
                type="text"
                name="consultancy"
                value={formData.consultancy}
                onChange={handleChange}
                placeholder="Mi Consultora Fashion"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638]"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638]"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 8 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638]"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8a2638] text-white font-semibold py-2 rounded-lg hover:bg-[#6a1f2a] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creando cuenta..." : "Registrarse"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/auth/signin"
                className="text-[#8a2638] font-semibold hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
