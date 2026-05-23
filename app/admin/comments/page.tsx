"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CommentWithRelations {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  } | null;
  news: {
    title: string;
  } | null;
}

export default function CommentsAdminPage() {
  const [comments, setComments] = useState<CommentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/comments");
      if (!response.ok) throw new Error("Error al cargar comentarios");
      const data = await response.json();
      setComments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("¿Eliminar este comentario?")) return;

    try {
      setDeleting(commentId);
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar comentario");
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdf9] p-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin"
          className="text-[#8a2638] hover:text-[#d8a7b1] font-semibold mb-6 inline-block"
        >
          ← Volver al panel
        </Link>

        <h1 className="text-4xl font-bold text-[#151111] mb-4">Moderación de Comentarios</h1>
        <p className="text-[#b8a9a6] text-lg mb-8">
          Revisa y gestiona comentarios de los usuarios. Mantén la calidad de la comunidad.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a2638] mx-auto mb-4"></div>
            <p className="text-[#b8a9a6]">Cargando comentarios...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#eadbd4] p-12 text-center">
            <p className="text-[#8a9099]">No hay comentarios para moderar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-[#8a9099] mb-4">
              Total: <span className="font-semibold text-[#151111]">{comments.length}</span> comentarios
            </div>

            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-lg border border-[#eadbd4] p-6 hover:shadow-md transition"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-[#8a9099] mb-1">
                      <span className="font-semibold text-[#151111]">
                        {comment.user?.name || comment.user?.email || "Usuario desconocido"}
                      </span>
                    </p>
                    <p className="text-xs text-[#b8a9a6]">
                      {new Date(comment.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={deleting === comment.id}
                    className="px-3 py-1 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded border border-red-200 font-medium transition disabled:opacity-50"
                  >
                    {deleting === comment.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <p className="text-[#151111] leading-relaxed">{comment.content}</p>
                </div>

                {/* Footer */}
                {comment.news && (
                  <div className="pt-4 border-t border-[#eadbd4]">
                    <p className="text-xs text-[#8a9099] mb-1">En respuesta a:</p>
                    <p className="text-sm text-[#8a2638] font-semibold">{comment.news.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
