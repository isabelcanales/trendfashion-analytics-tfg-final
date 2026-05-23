import { BrandMetricsResponse } from "@/types/brandMetrics";

export async function getBrandMetrics(): Promise<BrandMetricsResponse> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 12000);

  try {
    const response = await fetch("/api/brand-metrics", {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status} al cargar métricas de marcas.`);
    }

    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}