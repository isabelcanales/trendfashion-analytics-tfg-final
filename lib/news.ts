export async function getNews(period = "6m", brand?: string) {
  const params = new URLSearchParams();
  params.set("period", period);
  if (brand) {
    params.set("brand", brand);
  }

  const res = await fetch(`/api/news?${params.toString()}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    console.error("Error en getNews:", {
      status: res.status,
      statusText: res.statusText,
      errorData,
      period,
      brand,
    });

    throw new Error(errorData?.error || "Error al obtener noticias");
  }

  return res.json();
}