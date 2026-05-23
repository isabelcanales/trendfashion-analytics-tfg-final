"use client";

import TransitionLink from "@/components/animations/TransitionLink";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getNews } from "@/lib/news";
import { toast } from "sonner";
import { Trash2, Edit2 } from "lucide-react";

type Article = {
  id?: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  urlToImage?: string;
  slug?: string;
  source?: {
    name?: string;
  };
  publishedAt?: string;
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
};

const FALLBACK_IMAGES = [
  "/images/news-fallback.jpg",
  "/images/news-fallback-1.jpg",
  "/images/news-fallback-2.jpg",
];

function getFallbackImage(article: Article) {
  const text = article.title || article.url || "article";
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
}

function formatDate(date?: string) {
  if (!date) return "Actualidad";
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function createSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function findArticleByParam(articles: Article[], param: string) {
  const numericId = Number(param);
  if (!Number.isNaN(numericId)) {
    return articles[numericId] ?? null;
  }
  return (
    articles.find((article) => {
      if (article.slug && article.slug === param) {
        return true;
      }
      return createSlug(article.title) === param;
    }) ?? null
  );
}

function detectBrands(text: string) {
  const brands = ["zara", "gucci", "prada", "chanel", "dior", "mango"];
  return brands.filter((brand) => text.includes(brand));
}

export default function NewsDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const { data: session } = useSession();

  const [article, setArticle] = useState<Article | null>(null);
  const [newsId, setNewsId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  // Cargar artículo
  useEffect(() => {
    async function loadArticle() {
      try {
        const savedNews = sessionStorage.getItem("trendfashion_news");
        if (savedNews) {
          const articles = JSON.parse(savedNews) as Article[];
          const selectedArticle = findArticleByParam(articles, id);
          if (selectedArticle) {
            setArticle(selectedArticle);
            return;
          }
        }

        const data = await getNews();
        const articles = data.articles || [];
        const selectedArticle = findArticleByParam(articles, id);

        if (!selectedArticle) {
          setError("No se ha encontrado esta noticia.");
          return;
        }

        setArticle(selectedArticle);
      } catch (error) {
        console.error("Error al cargar la noticia:", error);
        setError("No se ha podido cargar la noticia.");
      }
    }

    loadArticle();
  }, [id]);

  // Cargar comentarios cuando se encuentra el artículo
  useEffect(() => {
    async function loadComments() {
      if (!article?.url) return;

      try {
        setLoadingComments(true);

        // Buscar la noticia en BD por URL
        const allNews = await fetch("/api/news/search?url=" + encodeURIComponent(article.url));
        const newsData = await allNews.json();
        
        if (newsData && newsData.id) {
          setNewsId(newsData.id);

          // Luego obtener comentarios
          const commentsRes = await fetch(`/api/comments?newsId=${newsData.id}`);
          if (commentsRes.ok) {
            const commentsData = await commentsRes.json();
            setComments(commentsData);
          }
        }
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
      } finally {
        setLoadingComments(false);
      }
    }

    loadComments();
  }, [article?.url]);

  async function handleAddComment() {
    if (!session || !newsId) {
      toast.error("Debes estar autenticado para comentar");
      return;
    }

    if (!commentContent.trim()) {
      toast.error("El comentario no puede estar vacío");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentContent, newsId }),
      });

      if (!res.ok) throw new Error("Error al crear comentario");

      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setCommentContent("");
      toast.success("Comentario agregado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al agregar comentario");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!confirm("¿Eliminar este comentario?")) return;

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar");

      setComments(comments.filter((c) => c.id !== commentId));
      toast.success("Comentario eliminado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar comentario");
    }
  }

  async function handleEditComment(commentId: string) {
    if (!editingContent.trim()) {
      toast.error("El contenido no puede estar vacío");
      return;
    }

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingContent }),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      const updatedComment = await res.json();
      setComments(
        comments.map((c) => (c.id === commentId ? updatedComment : c))
      );
      setEditingCommentId(null);
      setEditingContent("");
      toast.success("Comentario actualizado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar comentario");
    }
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <TransitionLink
          href="/news"
          className="mb-8 inline-flex rounded-full border border-[#eadbd4] bg-white px-5 py-3 text-sm font-semibold text-[#8a2638] shadow-sm transition hover:-translate-x-1"
        >
          ← Volver a noticias
        </TransitionLink>
        <p className="rounded-2xl border border-[#eadbd4] bg-white p-6 text-[#8a2638] shadow-sm">
          {error}
        </p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="rounded-2xl border border-[#eadbd4] bg-white p-6 text-[#6d6260] shadow-sm">
          Cargando noticia...
        </p>
      </div>
    );
  }

  const fullText = `${article.title || ""} ${article.description || ""}`.toLowerCase();
  const brands = detectBrands(fullText);
  const fallbackImage = getFallbackImage(article);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <TransitionLink
        href="/news"
        className="mb-8 inline-flex rounded-full border border-[#eadbd4] bg-white px-5 py-3 text-sm font-semibold text-[#8a2638] shadow-sm transition hover:-translate-x-1"
      >
        ← Volver a noticias
      </TransitionLink>

      <div className="mb-10 overflow-hidden rounded-[30px] border border-[#eadbd4] bg-white shadow-sm">
        <img
          src={article.urlToImage || fallbackImage}
          alt={article.title}
          className="h-[420px] w-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage;
          }}
        />
      </div>

      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#8a2638]">
        {article.source?.name || "Fashion Source"} · {formatDate(article.publishedAt)}
      </p>

      <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-[#151111] md:text-5xl">
        {article.title}
      </h1>

      <p className="mb-10 text-lg leading-8 text-[#6d6260]">
        {article.description}
      </p>

      <div className="mb-14 space-y-6 text-[15px] leading-7 text-[#3a2f2c]">
        <p>
          Esta noticia refleja una tendencia relevante dentro del sector moda,
          donde se observa una evolución en estilos, narrativa visual y
          posicionamiento de marca.
        </p>

        <p>
          En los últimos meses, el ecosistema digital ha amplificado este tipo
          de contenidos, generando un aumento significativo en menciones y
          engagement en plataformas sociales.
        </p>

        <p>
          Este fenómeno suele estar asociado a cambios en comportamiento del
          consumidor, especialmente en segmentos jóvenes y audiencias interesadas
          en lujo accesible.
        </p>
      </div>

      <div className="mb-14 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#eadbd4] bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-serif text-xl font-bold">
            Impacto en tendencias
          </h3>
          <p className="text-sm leading-6 text-[#6d6260]">
            Este contenido tiene un impacto medio-alto en tendencias digitales,
            especialmente en categorías de estilo urbano, lujo y moda editorial.
          </p>
        </div>

        <div className="rounded-2xl border border-[#eadbd4] bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-serif text-xl font-bold">
            Marcas detectadas
          </h3>
          {brands.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <span
                  key={brand}
                  className="rounded-full bg-[#f7ece8] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#8a2638]"
                >
                  {brand}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6d6260]">
              No se han detectado marcas clave.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#f0e3de] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8a2638]">
          Fuente original
        </span>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-fit items-center gap-2 rounded-full bg-[#151111] px-6 py-3 text-sm text-white transition hover:translate-x-1"
        >
          Ver noticia completa →
        </a>
      </div>

      {/* COMENTARIOS */}
      <div className="mt-16 border-t border-[#f0e3de] pt-12">
        <h2 className="mb-8 font-serif text-3xl font-bold text-[#151111]">
          Comentarios ({comments.length})
        </h2>

        {/* Formulario de comentarios */}
        {session ? (
          <div className="mb-8 rounded-2xl border border-[#eadbd4] bg-[#fffdf9] p-6">
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#151111]">
                {session.user?.name || session.user?.email}
              </p>
            </div>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Escribe tu comentario..."
              rows={4}
              className="w-full rounded-lg border border-[#eadbd4] px-4 py-3 text-sm text-[#151111] placeholder-[#8a2638]/50 focus:border-[#8a2638] focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setCommentContent("")}
                className="rounded-lg border border-[#eadbd4] px-4 py-2 text-sm font-semibold text-[#151111] hover:bg-[#f7ece8]"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddComment}
                disabled={isSubmitting || !commentContent.trim()}
                className="rounded-lg bg-[#8a2638] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6a1f2a] disabled:opacity-50"
              >
                {isSubmitting ? "Publicando..." : "Publicar comentario"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8 rounded-2xl border border-[#eadbd4] bg-[#fffdf9] p-6 text-center">
            <p className="text-sm text-[#6d6260]">
              <TransitionLink
                href="/auth/signin"
                className="font-semibold text-[#8a2638] hover:underline"
              >
                Inicia sesión
              </TransitionLink>
              {" "}para comentar
            </p>
          </div>
        )}

        {/* Lista de comentarios */}
        <div className="space-y-4">
          {loadingComments ? (
            <p className="text-sm text-[#6d6260]">Cargando comentarios...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-[#6d6260]">
              Sin comentarios aún. ¡Sé el primero en comentar!
            </p>
          ) : (
            comments.map((comment) => {
              const isOwner = session?.user?.id === comment.user.id;
              const isAdmin = (session?.user as any)?.role === "admin";

              return (
                <div
                  key={comment.id}
                  className="rounded-2xl border border-[#eadbd4] bg-white p-6"
                >
                  {editingCommentId === comment.id ? (
                    <div>
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={3}
                        className="mb-3 w-full rounded-lg border border-[#eadbd4] px-4 py-3 text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditingContent("");
                          }}
                          className="rounded-lg border border-[#eadbd4] px-3 py-2 text-xs font-semibold text-[#151111] hover:bg-[#f7ece8]"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className="rounded-lg bg-[#8a2638] px-3 py-2 text-xs font-semibold text-white hover:bg-[#6a1f2a]"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-[#151111]">
                            {comment.user.name || comment.user.email}
                          </p>
                          <p className="text-xs text-[#8a2638]">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                        {(isOwner || isAdmin) && (
                          <div className="flex gap-2">
                            {isOwner && (
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingContent(comment.content);
                                }}
                                className="text-[#8a2638] hover:text-[#6a1f2a]"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm leading-6 text-[#3a2f2c]">
                        {comment.content}
                      </p>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}