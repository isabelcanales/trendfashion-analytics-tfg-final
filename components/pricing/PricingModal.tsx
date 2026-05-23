"use client";

import { useState } from "react";
import { X, Check, AlertCircle, Loader } from "lucide-react";

type PricingModalProps = {
  plan: string;
  onClose: () => void;
};

export default function PricingModal({ plan, onClose }: PricingModalProps) {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const getPlanDetails = () => {
    const plans: Record<string, { title: string; price: string; color: string }> = {
      basic: {
        title: "Plan Basic",
        price: "Gratis",
        color: "from-[#7A2E3A] to-[#8a2638]",
      },
      pro: {
        title: "Plan Pro",
        price: "$29/mes",
        color: "from-[#d8a7b1] to-[#C8A96A]",
      },
      premium: {
        title: "Plan Premium",
        price: "$99/mes",
        color: "from-[#C8A96A] to-[#d8a7b1]",
      },
    };
    return plans[plan] || plans.basic;
  };

  const planDetails = getPlanDetails();

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.replace(/(\d{4})/g, "$1 ").trim();
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, "").substring(0, 4));
  };

  const validateForm = () => {
    if (!email || !name || !cardNumber || !expiryDate || !cvv) {
      setError("Por favor completa todos los campos");
      return false;
    }
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Número de tarjeta inválido");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setError("Fecha de expiración inválida (MM/YY)");
      return false;
    }
    if (cvv.length !== 3 && cvv.length !== 4) {
      setError("CVV inválido");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    // Simulamos el procesamiento
    setStep("processing");

    try {
      const normalizedPlan = plan === "basic" ? null : plan;

      await new Promise((resolve) => setTimeout(resolve, 1200));

      const response = await fetch("/api/subscription/plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: normalizedPlan }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo guardar la suscripción");
      }

      setStep("success");
    } catch (err) {
      setStep("form");
      setError(err instanceof Error ? err.message : "Error al procesar el pago simulado");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-[#fffdf9] rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-[#f0ede8] rounded-lg transition z-10"
        >
          <X className="w-5 h-5 text-[#6b625f]" />
        </button>

        {step === "form" && (
          <>
            {/* Header */}
            <div className={`bg-gradient-to-r ${planDetails.color} px-6 py-8 text-[#fffdf9]`}>
              <h2 className="text-2xl font-bold mb-2">{planDetails.title}</h2>
              <p className="text-sm opacity-90">Completa tu información de pago</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Plan Summary */}
              <div className="bg-[#f5f0ed] rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[#6b625f]">Precio</span>
                  <span className="text-xl font-bold text-[#171314]">
                    {planDetails.price}
                  </span>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#171314] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-2 border border-[#eadfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8a7b1] text-[#171314]"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#171314] mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-2 border border-[#eadfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8a7b1] text-[#171314]"
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-[#171314] mb-2">
                  Número de Tarjeta
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="4111 1111 1111 1111"
                  maxLength={19}
                  className="w-full px-4 py-2 border border-[#eadfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8a7b1] text-[#171314] font-mono"
                />
                <p className="text-xs text-[#b8a9a6] mt-1">
                  💡 Prueba: 4111 1111 1111 1111
                </p>
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#171314] mb-2">
                    Vencimiento
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-2 border border-[#eadfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8a7b1] text-[#171314] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#171314] mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-2 border border-[#eadfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8a7b1] text-[#171314] font-mono"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex gap-2 items-start">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-[#f0f0f0] border border-[#eadfd3] rounded-lg p-3 text-xs text-[#6b625f]">
                ⚠️ Esto es una <strong>simulación de pago</strong>. No se cobrará dinero real.
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-300 mt-6 ${
                  plan === "basic"
                    ? "bg-[#7A2E3A] hover:bg-[#8a2638]"
                    : plan === "pro"
                    ? "bg-gradient-to-r from-[#d8a7b1] to-[#C8A96A] hover:shadow-lg"
                    : "bg-gradient-to-r from-[#C8A96A] to-[#d8a7b1] hover:shadow-lg"
                }`}
              >
                Simular Pago
              </button>
            </form>
          </>
        )}

        {step === "processing" && (
          <div className="px-6 py-16 text-center">
            <Loader className="w-12 h-12 text-[#d8a7b1] mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-[#171314] mb-2">
              Procesando tu pago...
            </h3>
            <p className="text-sm text-[#6b625f]">
              Por favor espera mientras confirmamos tu solicitud.
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#171314] mb-2">
              ¡Suscripción Simulada!
            </h3>
            <p className="text-sm text-[#6b625f] mb-6">
              Tu suscripción a {planDetails.title} ha sido procesada correctamente.
            </p>
            <div className="bg-[#f5f0ed] rounded-lg p-4 mb-6 text-left">
              <p className="text-xs text-[#b8a9a6] mb-1">Email confirmación</p>
              <p className="text-sm font-medium text-[#171314]">{email}</p>
            </div>
            <p className="text-xs text-[#b8a9a6] mb-6">
              Esta es solo una simulación. No se ha cobrado dinero real.
            </p>
            <button
              onClick={onClose}
              className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition duration-300 ${
                plan === "basic"
                  ? "bg-[#7A2E3A] hover:bg-[#8a2638]"
                  : plan === "pro"
                  ? "bg-gradient-to-r from-[#d8a7b1] to-[#C8A96A] hover:shadow-lg"
                  : "bg-gradient-to-r from-[#C8A96A] to-[#d8a7b1] hover:shadow-lg"
              }`}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
