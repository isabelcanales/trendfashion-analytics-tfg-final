"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { generateTrendPrediction } from "@/lib/trendForecast";
import type { MetricType } from "@/types/forecast";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIForecastModalProps {
  isOpen: boolean;
  brand?: string;
  metric?: MetricType;
  timeHorizon?: "corto" | "medio" | "largo";
  onClose: () => void;
}

export default function AIForecastModal({
  isOpen,
  brand = "Gucci",
  metric = "popularity",
  timeHorizon = "medio",
  onClose,
}: AIForecastModalProps) {
  const [prediction, setPrediction] = useState<any>(null);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Fetch prediction from real data when modal opens or brand changes
  useEffect(() => {
    if (!isOpen || !brand) {
      setPrediction(null);
      return;
    }

    setIsLoadingPrediction(true);
    const loadPrediction = async () => {
      try {
        // Convert brand name to slug for API
        const brandSlug = brand.toLowerCase().replace(/\s+/g, "-");
        const pred = await generateTrendPrediction(
          brandSlug,
          metric,
          timeHorizon
        );
        setPrediction(pred);
      } catch (error) {
        console.error("Error loading prediction:", error);
        setPrediction(null);
      } finally {
        setIsLoadingPrediction(false);
      }
    };

    loadPrediction();
  }, [isOpen, brand, metric, timeHorizon]);

  // Detección de intención y generación de respuesta mejorada
  const generateAIChatResponse = (message: string): string => {
    if (!prediction) return "No hay predicción disponible.";

    const q = message.toLowerCase().trim();
    const brandName = prediction.brand;
    const status = prediction.status;
    const current = prediction.currentValue;
    const predicted = prediction.predictedValue;
    const prob = prediction.growthProbability;
    const conf = prediction.confidenceLevel;
    const variation = prediction.estimatedVariation;

    // 1. DETECCIÓN DE SALUDOS
    const greetings = ["hola", "hols", "buenas", "hey", "buenos días", "buenas noches", "buenas tardes"];
    if (greetings.some((g) => q.includes(g))) {
      return `¡Hola! Puedo ayudarte a interpretar la predicción de ${brandName}. Pregúntame sobre su fase actual, puntos de mejora o tendencias que podría aprovechar. 😊`;
    }

    // 2. PREGUNTAS SOBRE FASE/ESTADO
    const phaseKeywords = ["fase", "estado", "por qué", "porqué", "consolidada", "crecimiento", "emergente", "declive", "posición"];
    if (phaseKeywords.some((k) => q.includes(k))) {
      const phaseResponses: Record<string, string> = {
        Consolidada: `${brandName} está consolidada, dominando su segmento con un valor de ${current}%. Este es el momento de innovar constantemente para mantener el liderazgo. La predicción hacia ${predicted}% sugiere estabilidad, pero siempre hay espacio para sorprender al mercado.`,
        "En crecimiento": `${brandName} está en una fase muy positiva. Con valor actual de ${current}% y tendencia hacia ${predicted}%, el crecimiento es real (${prob}% de probabilidad). Ahora es el momento crítico de consolidar esta tracción. Cada acción cuenta.`,
        Emergente: `${brandName} está emergiendo. Con ${current}%, es una marca con potencial alto. Pequeñas acciones pueden generar gran impacto. La predicción marca ${predicted}%, así que si se alinea con tendencias clave, el crecimiento será acelerado.`,
        "En declive": `${brandName} está en declive (${current}%). No es el fin, sino una oportunidad de reinvención. Con los ajustes correctos, la trayectoria podría revertirse. Necesita acciones disruptivas que reconecten con la audiencia.`,
      };
      return (
        phaseResponses[status] ||
        `${brandName} está en fase de ${status.toLowerCase()}. Valor actual ${current}%, predicción ${predicted}%. Es importante actuar con estrategia clara.`
      );
    }

    // 3. PREGUNTAS SOBRE MEJORA/RECOMENDACIÓN
    const improvementKeywords = ["mejorar", "mejoría", "debería", "recomenda", "fortalez", "estrategia", "crecer"];
    if (improvementKeywords.some((k) => q.includes(k))) {
      const improvementResponses: string[] = [
        `${brandName} necesita enfoque en tres áreas: (1) aumentar presencia mediática, (2) mejorar engagement con comunidades core, (3) innovación en propuestas de valor. Con confianza del ${conf}%, hay variables que controlar.`,
        `Para crecer, ${brandName} debe: fortalecer identidad diferenciada, conectar auténticamente con valores actuales, diversificar canales de interacción. La probabilidad de crecimiento es ${prob}%, lo que indica oportunidad.`,
        `Con valor en ${current}%, ${brandName} tiene espacio para crecer. Recomendación: atacar segmentos adjacentes donde tiene autoridad, reforzar narrativa de marca, colaborar estratégicamente. Variación estimada: ${variation}%.`,
      ];
      return improvementResponses[Math.floor(Math.random() * improvementResponses.length)];
    }

    // 4. PREGUNTAS SOBRE TENDENCIAS/OPORTUNIDADES
    const trendKeywords = ["tendencia", "aprovechar", "oportunidad", "mercado", "trending", "futuro"];
    if (trendKeywords.some((k) => q.includes(k))) {
      const trendResponses: string[] = [
        `${brandName} debería explorar: sostenibilidad consciente, experiencias digital-first, co-creación con creators. Dado su estado de ${status.toLowerCase()}, está en posición ideal para capturar estas tendencias.`,
        `Las oportunidades para ${brandName} están en: transformación digital profunda, activismo causa-related, customización masiva. Con ${prob}% de probabilidad de crecimiento, la timing es ahora.`,
        `En su fase actual (${status.toLowerCase()}), ${brandName} puede liderar en: nuestaética post-digital, luxury accesible, storytelling auténtico. El mercado está receptivo.`,
      ];
      return trendResponses[Math.floor(Math.random() * trendResponses.length)];
    }

    // 5. RESPUESTA POR DEFECTO (PREGUNTA DESCONOCIDA)
    const defaultResponses: string[] = [
      `Interesante pregunta. Para mejor ayuda, cuéntame si quieres saber sobre la fase de ${brandName}, puntos de mejora o tendencias. Cada una tiene respuestas muy diferentes.`,
      `f ¡tarte mejor si me preguntas sobre su estado actual, recomendaciones estratégicas o tendencias que puede aprovechar. ¿Cuál te interesa más?`,
      `No estoy seguro de entender esa pregunta. ¿Hablamos de la estrategia de ${brandName}? Puedo ayudarte con su fase, puntos fuertes/débiles, o perspectivas de mercado.`,
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const suggestedQuestions = [
    "¿Por qué está en esta fase?",
    "¿Qué debería mejorar?",
    "¿Qué tendencia puede aprovechar?",
  ];

  const handleSuggestedQuestion = (question: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIChatResponse(question),
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    }, 300);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIChatResponse(inputValue),
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    }, 300);
  };

  // Handle ESC key to close drawer
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle case where prediction is loading or couldn't be generated
  if (isOpen && (isLoadingPrediction || !prediction)) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Drawer - Loading/Error State */}
            <motion.div
              initial={{ x: 560 }}
              animate={{ x: 0 }}
              exit={{ x: 560 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed right-0 top-0 z-50 h-screen w-full max-w-[560px] overflow-y-auto bg-[#fffaf7] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-6 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#151111]/10 text-[#151111] transition hover:bg-[#151111]/20"
              >
                ✕
              </button>

              {/* Header */}
              <div className="border-b border-[#eadbd4] px-6 py-5">
                <h2 className="font-serif text-2xl font-bold text-[#151111]">
                  Fashion Trend Forecast
                </h2>
                <p className="mt-1 text-sm text-[#6d6260]">
                  {brand}
                </p>
              </div>

              {/* Content */}
              <div className="px-6 py-8">
                {isLoadingPrediction ? (
                  <>
                    <div className="mb-6 inline-flex h-8 w-8 animate-spin rounded-full border-4 border-[#eadbd4] border-t-[#8a2638]" />
                    <p className="mt-4 text-sm text-[#6d6260]">
                      Analizando datos reales de NewsAPI...
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mb-3 text-sm font-semibold uppercase text-[#8a2638]">
                      ⚠️ Predicción no disponible
                    </p>
                    <h3 className="font-serif text-xl font-bold text-[#151111]">
                      No hay datos reales
                    </h3>
                    <p className="mt-4 text-sm text-[#6d6260]">
                      No pudimos obtener datos reales de NewsAPI para <strong>{brand}</strong>. 
                      Verifica tu NEWS_API_KEY y que haya noticias disponibles.
                    </p>
                  </>
                )}

                <button
                  onClick={onClose}
                  className="mt-8 w-full rounded-[8px] bg-[#8a2638] px-6 py-2 text-xs font-bold uppercase tracking-[0.05em] text-white transition hover:bg-[#a83450]"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (!prediction) {
    return null;
  }

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      "Emergente": "#e5a9b6",
      "En crecimiento": "#8a2638",
      "Consolidada": "#151111",
      "En declive": "#6d6260",
    };
    return colors[status] || "#151111";
  };

  const getStatusEmoji = (status: string): string => {
    const emojis: Record<string, string> = {
      "Emergente": "🌱",
      "En crecimiento": "📈",
      "Consolidada": "🏆",
      "En declive": "📉",
    };
    return emojis[status] || "•";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer - Prediction State */}
          <motion.div
            initial={{ x: 560 }}
            animate={{ x: 0 }}
            exit={{ x: 560 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-[560px] overflow-y-auto bg-[#fffaf7] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#151111]/10 text-[#151111] transition hover:bg-[#151111]/20"
            >
              ✕
            </button>

            {/* Header - Sticky */}
            <div className="sticky top-0 border-b border-[#eadbd4] bg-[#fffaf7] px-6 py-5">
              <h2 className="font-serif text-2xl font-bold text-[#151111]">
                Fashion Trend Forecast
              </h2>
              <p className="mt-1 text-sm text-[#6d6260]">
                Predicción IA para {prediction.brand}
              </p>
            </div>

            {/* Body - Scrollable */}
            <div className="space-y-4 px-6 py-6">
              {/* Status Badge */}
              <div className="rounded-[12px] p-3" style={{ backgroundColor: getStatusColor(prediction.status) + "15" }}>
                <p className="text-xs font-semibold uppercase" style={{ color: getStatusColor(prediction.status) }}>
                  Estado
                </p>
                <p className="mt-1 font-serif text-lg font-bold" style={{ color: getStatusColor(prediction.status) }}>
                  <span className="mr-2">{getStatusEmoji(prediction.status)}</span>
                  {prediction.status}
                </p>
              </div>

              {/* Current vs Predicted */}
              <div className="rounded-[12px] border border-[#eadbd4] bg-white p-4">
                <p className="mb-3 text-xs font-semibold uppercase text-[#6d6260]">
                  Valor Actual vs Predicción
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6d6260]">Actual</span>
                    <span className="font-serif text-xl font-bold text-[#151111]">
                      {prediction.currentValue}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#eadbd4]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(prediction.currentValue / 100) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="h-full bg-[#8a2638]"
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-[#6d6260]">Predicción</span>
                    <span className="font-serif text-xl font-bold text-[#8a2638]">
                      {prediction.predictedValue}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#eadbd4]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(prediction.predictedValue / 100) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="h-full bg-[#e5a9b6]"
                    />
                  </div>
                </div>
              </div>

              {/* Probability & Confidence */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[12px] border border-[#eadbd4] bg-white p-4">
                  <p className="mb-2 text-xs font-semibold uppercase text-[#6d6260]">
                    Probabilidad
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-2xl font-bold text-[#8a2638]">
                      {prediction.growthProbability}%
                    </span>
                  </div>
                </div>

                <div className="rounded-[12px] border border-[#eadbd4] bg-white p-4">
                  <p className="mb-2 text-xs font-semibold uppercase text-[#6d6260]">
                    Confianza
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-2xl font-bold text-[#151111]">
                      {prediction.confidenceLevel}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Variation Estimated */}
              <div className="rounded-[12px] border-l-4 border-l-[#8a2638] bg-[#fffdf9] p-4">
                <p className="mb-2 text-xs font-semibold uppercase text-[#6d6260]">
                  Variación Estimada
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-bold text-[#8a2638]">
                    {prediction.estimatedVariation > 0 ? "+" : ""}
                    {prediction.estimatedVariation}%
                  </span>
                  <span className="text-xs text-[#6d6260]">
                    {prediction.estimatedVariation > 0
                      ? "↑ Crecimiento"
                      : prediction.estimatedVariation < 0
                        ? "↓ Declive"
                        : "→ Estable"}
                  </span>
                </div>
              </div>

              {/* Main Insight */}
              <div className="rounded-[12px] border-l-4 border-l-[#8a2638] bg-[#fffdf9] p-4">
                <p className="text-xs leading-5 text-[#151111]">
                  {prediction.insights[0]}
                </p>
              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-[#eadbd4]" />

              {/* Chat Section */}
              <div>
                <h3 className="mb-4 font-serif text-lg font-bold text-[#151111]">
                  Pregunta a la IA sobre {prediction.brand}
                </h3>

                {/* Chat Messages */}
                <div className="mb-4 max-h-[240px] space-y-3 overflow-y-auto rounded-[12px] bg-[#fbf7f4] p-4">
                  {chatMessages.length === 0 ? (
                    <p className="text-center text-xs text-[#6d6260]">
                      Inicia una conversación con preguntas sugeridas
                    </p>
                  ) : (
                    chatMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-[12px] px-3 py-2 text-xs leading-5 ${
                            msg.role === "user"
                              ? "bg-[#8a2638] text-white"
                              : "border border-[#eadbd4] bg-white text-[#151111]"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Suggested Questions */}
                <div className="mb-4 space-y-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="w-full rounded-[8px] border border-[#eadbd4] bg-white px-3 py-2 text-left text-xs font-medium text-[#151111] transition hover:bg-[#fffdf9] hover:border-[#8a2638] active:scale-95"
                    >
                      {question}
                    </button>
                  ))}
                </div>

                {/* Input Area */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    placeholder="Escribe tu pregunta..."
                    className="flex-1 rounded-[8px] border border-[#eadbd4] bg-white px-3 py-2 text-xs placeholder-[#6d6260] outline-none transition focus:border-[#8a2638] focus:ring-1 focus:ring-[#8a2638]/20"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="rounded-[8px] bg-[#8a2638] px-4 py-2 text-xs font-bold uppercase tracking-[0.03em] text-white transition hover:bg-[#a83450] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    Enviar
                  </button>
                </div>
              </div>

              {/* Spacer for footer clearance */}
              <div className="h-4" />
            </div>

            {/* Footer - Sticky */}
            <div className="sticky bottom-0 border-t border-[#eadbd4] bg-[#fffaf7] px-6 py-4">
              <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                <p className="text-xs text-[#6d6260]">
                  Generado por AI • {new Date().toLocaleDateString("es-ES")}
                </p>
                <button
                  onClick={onClose}
                  className="rounded-[8px] bg-[#8a2638] px-6 py-2 text-xs font-bold uppercase tracking-[0.05em] text-white transition hover:bg-[#a83450] w-full sm:w-auto"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
