import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  message: string;
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

const SYSTEM_PROMPT = `Eres el asistente de TrendFashion Analytics, una plataforma de análisis de tendencias de moda.

Tu rol es ayudar a interpretar:
- Tendencias de moda actuales
- Análisis de marcas y su posicionamiento
- Noticias de la industria fashion
- Comparativas entre marcas
- Informes y predicciones de tendencias

Responde de forma clara, útil, profesional y concisa.
- No inventes datos concretos si no tienes información suficiente
- Ofrece insights prácticos
- Sé amable y accesible
- Responde en español

Cuando hables de datos específicos de la plataforma, menciona que son análisis en tiempo real basados en noticias y tendencias actuales.`;

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { message, conversationHistory = [] } = body;

    // Validate input
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Mensaje inválido" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    // Fallback if API key is not configured
    if (!apiKey) {
      return NextResponse.json(
        {
          response: `⚠️ El asistente IA todavía no está configurado completamente. 

Para activarlo, el administrador necesita añadir la clave \`GROQ_API_KEY\` en las variables de entorno.

Obtén tu clave gratis en: https://console.groq.com/keys

Mientras tanto, puedo ayudarte a navegar por TrendFashion Analytics y responder preguntas generales sobre análisis de tendencias de moda.

¿Qué quieres saber?`,
        },
        { status: 200 }
      );
    }

    // Build messages for Groq
    const messages: Message[] = [
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    // Call Groq API (compatible with OpenAI format)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Groq API error:", error);

      // Handle specific errors
      if (response.status === 401) {
        return NextResponse.json(
          { error: "API key inválida. Verifica tu GROQ_API_KEY." },
          { status: 401 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error: "Demasiadas solicitudes. Por favor, espera un momento.",
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error:
            error.error?.message ||
            "Error al comunicarse con el servicio de IA",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage =
      data.choices[0]?.message?.content ||
      "No se pudo generar una respuesta. Por favor, intenta de nuevo.";

    return NextResponse.json(
      { response: assistantMessage },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Error procesando tu solicitud. Por favor, intenta de nuevo.",
      },
      { status: 500 }
    );
  }
}
