"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface News {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  source: string | null;
  urlToImage: string | null;
  publishedAt: string | null;
  isFeatured: boolean;
  isHidden: boolean;
  isFallback: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function NewsAdminPage() {
  const [news, setNews] = useState<News[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, [pagination.page, search]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/news?${params}`);
      if (!response.ok) throw new Error("Error al cargar noticias");

      const data = await response.json();
      setNews(data.data);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (newsId: string, currentValue: boolean) => {
    try {
      setUpdating(newsId);
      const response = await fetch(`/api/admin/news/${newsId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !currentValue }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
        throw new Error(errorData.error || errorData.details || "Error al actualizar noticia");
      }

      setNews(
        news.map((n) =>
          n.id === newsId ? { ...n, isFeatured: !currentValue } : n
        )
      );
      setSuccess("Noticia actualizada");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const toggleHidden = async (newsId: string, currentValue: boolean) => {
    try {
      setUpdating(newsId);
      const response = await fetch(`/api/admin/news/${newsId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !currentValue }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
        throw new Error(errorData.error || errorData.details || "Error al actualizar noticia");
      }

      setNews(
        news.map((n) =>
          n.id === newsId ? { ...n, isHidden: !currentValue } : n
        )
      );
      setSuccess("Noticia actualizada");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const toggleFallback = async (newsId: string, currentValue: boolean) => {
    try {
      setUpdating(newsId);
      const response = await fetch(`/api/admin/news/${newsId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFallback: !currentValue }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
        throw new Error(errorData.error || errorData.details || "Error al actualizar noticia");
      }

      setNews(
        news.map((n) =>
          n.id === newsId ? { ...n, isFallback: !currentValue } : n
        )
      );
      setSuccess("Noticia actualizada");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdf9] p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/admin"
          className="text-[#8a2638] hover:text-[#d8a7b1] font-semibold mb-6 inline-block"
        >
          ← Volver al panel
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#151111] mb-4">
            Panel editorial de noticias
          </h1>
          <p className="text-[#b8a9a6] text-lg mb-4">
            Cura y modera noticias de la industria de la moda. Las noticias provienen automáticamente de NewsAPI.
          </p>
          <p className="text-[#8a9099] text-sm">
            Aquí puedes marcar noticias como destacadas, ocultarlas o marcarlas como contenido editorial.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
            {success}
          </div>
        )}

        {/* Buscador */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por título, descripción o fuente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-[#eadbd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638]"
          />
        </div>

        {/* Lista de noticias */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a2638] mx-auto mb-4"></div>
            <p className="text-[#b8a9a6]">Cargando noticias...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#eadbd4] p-12 text-center">
            <p className="text-[#8a9099]">No hay noticias para mostrar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-[#8a9099] mb-6">
              Total: <span className="font-semibold text-[#151111]">{pagination.total}</span> noticias
            </div>

            {news.map((n) => (
              <div
                key={n.id}
                className="bg-white rounded-lg border border-[#eadbd4] p-6 hover:shadow-md transition"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Imagen */}
                  {n.urlToImage && (
                    <div className="lg:col-span-1">
                      <img
                        src={n.urlToImage}
                        alt={n.title}
                        className="w-full h-32 object-cover rounded-lg border border-[#eadbd4]"
                      />
                    </div>
                  )}

                  {/* Contenido */}
                  <div className={n.urlToImage ? "lg:col-span-3" : "lg:col-span-4"}>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-[#151111] mb-2">
                        {n.title}
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {n.isFeatured && (
                          <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded border border-yellow-200">
                            ⭐ Destacada
                          </span>
                        )}
                        {n.isHidden && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs font-semibold rounded border border-gray-200">
                            👁️ Oculta
                          </span>
                        )}
                        {n.isFallback && (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded border border-blue-200">
                            📝 Editorial
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-[#6d6260] mb-3 line-clamp-2">
                        {n.description}
                      </p>

                      <div className="text-xs text-[#8a9099] space-y-1">
                        <p>
                          <span className="font-semibold">Fuente:</span> {n.source || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Publicada:</span>{" "}
                          {n.publishedAt
                            ? new Date(n.publishedAt).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Sin fecha"}
                        </p>
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-[#eadbd4]">
                      <button
                        onClick={() => toggleFeatured(n.id, n.isFeatured)}
                        disabled={updating === n.id}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          n.isFeatured
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100"
                            : "bg-[#f5f1f0] text-[#8a9099] border border-[#eadbd4] hover:bg-[#e8e0db]"
                        } disabled:opacity-50`}
                      >
                        {n.isFeatured ? "✓ Destacada" : "Destacar"}
                      </button>

                      <button
                        onClick={() => toggleHidden(n.id, n.isHidden)}
                        disabled={updating === n.id}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          n.isHidden
                            ? "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                            : "bg-[#f5f1f0] text-[#8a9099] border border-[#eadbd4] hover:bg-[#e8e0db]"
                        } disabled:opacity-50`}
                      >
                        {n.isHidden ? "✓ Oculta" : "Ocultar"}
                      </button>

                      <button
                        onClick={() => toggleFallback(n.id, n.isFallback)}
                        disabled={updating === n.id}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          n.isFallback
                            ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                            : "bg-[#f5f1f0] text-[#8a9099] border border-[#eadbd4] hover:bg-[#e8e0db]"
                        } disabled:opacity-50`}
                      >
                        {n.isFallback ? "✓ Editorial" : "Marcar como editorial"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="flex gap-2 justify-center mt-8">
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })
                  }
                  disabled={pagination.page === 1}
                  className="px-3 py-2 border border-[#eadbd4] rounded-lg hover:bg-[#f5f1f0] disabled:opacity-50 font-medium"
                >
                  ← Anterior
                </button>

                <div className="flex items-center gap-2 px-4 py-2">
                  <span className="text-[#8a9099]">
                    Página {pagination.page} de {pagination.totalPages}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      page: Math.min(pagination.totalPages, pagination.page + 1),
                    })
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-2 border border-[#eadbd4] rounded-lg hover:bg-[#f5f1f0] disabled:opacity-50 font-medium"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
