"use client";

import TransitionLink from "@/components/animations/TransitionLink";
import { useEffect, useState } from "react";
import { getNews } from "@/lib/news";

type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  slug?: string;
  source?: {
    name?: string;
  };
  publishedAt?: string;
};

const FALLBACK_IMAGES = [
  "/news-fallbacks/fallback-1.jpg",
  "/news-fallbacks/fallback-2.jpg",
  "/news-fallbacks/fallback-3.jpg",
];

function getFallbackImage(index: number) {
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

function createSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function getArticleHref(article: Article) {
  if (article.slug) {
    return `/news/${article.slug}`;
  }

  return `/news/${createSlug(article.title)}`;
}

function getTag(article: Article) {
  const text = `${article.title} ${article.description}`.toLowerCase();

  if (text.includes("zara")) return "Zara";
  if (text.includes("gucci")) return "Gucci";
  if (text.includes("prada")) return "Prada";
  if (text.includes("chanel")) return "Chanel";
  if (text.includes("dior")) return "Dior";
  if (text.includes("mango")) return "Mango";
  if (text.includes("pasarela")) return "Pasarela";
  if (text.includes("fashion week")) return "Fashion Week";
  if (text.includes("runway")) return "Runway";
  if (text.includes("luxury") || text.includes("lujo")) return "Luxury";
  if (text.includes("moda")) return "Moda";

  return "Fashion";
}

function formatDate(date?: string) {
  if (!date) return "Actualidad";

  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function NewsSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  function saveArticles() {
    sessionStorage.setItem("trendfashion_news", JSON.stringify(articles));
  }

  useEffect(() => {
    getNews()
      .then((data) => {
        const validArticles = (data.articles || []).filter(
          (article: Article) =>
            article.title && article.description && article.url
        );

        setArticles(validArticles.slice(0, 10));
      })
      .catch((error) => {
        console.error("Error cargando noticias:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const featuredArticle = articles[0];
  const secondaryArticles = articles.slice(1, 10);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
      <div className="mb-10 flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
          Fashion News
        </span>

        <h2 className="max-w-3xl font-serif text-4xl font-bold leading-tight text-[#151111] md:text-5xl">
          Noticias relevantes del sector moda
        </h2>

        <p className="max-w-2xl text-sm leading-7 text-[#6d6260] md:text-base">
          Últimas publicaciones sobre tendencias, lujo, pasarelas y marcas
          destacadas dentro del ecosistema digital de la moda.
        </p>
      </div>

      {loading ? (
        <div className="rounded-[28px] border border-[#eadbd4] bg-white p-8 text-sm text-[#6d6260] shadow-sm">
          Cargando noticias...
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-[28px] border border-[#eadbd4] bg-white p-8 text-sm text-[#6d6260] shadow-sm">
          No se encontraron noticias relevantes.
        </div>
      ) : (
        <>
          {featuredArticle && (
            <TransitionLink
              href={getArticleHref(featuredArticle)}
              onClick={saveArticles}
              className="group mb-8 block overflow-hidden rounded-[32px] border border-[#eadbd4] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative min-h-[340px] overflow-hidden">
                <img
                  src={featuredArticle.urlToImage || getFallbackImage(0)}
                  alt={featuredArticle.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackImage(0);
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                <div className="absolute left-6 top-6 rounded-full bg-white/90 px-5 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#8a2638] backdrop-blur">
                  Destacada · {getTag(featuredArticle)}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-white/75">
                    {featuredArticle.source?.name || "Fashion Source"} ·{" "}
                    {formatDate(featuredArticle.publishedAt)}
                  </p>

                  <h3 className="max-w-4xl font-serif text-3xl font-bold leading-tight text-white md:text-4xl">
                    {featuredArticle.title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-col justify-between p-7 lg:p-8">
                <div>
                  <span className="mb-5 inline-flex rounded-full bg-[#f7ece8] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8a2638]">
                    Portada editorial
                  </span>

                  <p className="line-clamp-5 text-sm leading-7 text-[#6d6260] md:text-base">
                    {featuredArticle.description}
                  </p>
                </div>

                <div className="mt-7 flex items-center justify-between border-t border-[#f0e3de] pt-5">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8a2638]">
                    Leer noticia completa
                  </span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#151111] text-white transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </TransitionLink>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 2xl:grid-cols-3">
            {secondaryArticles.map((article, index) => {
              const fallbackImage = getFallbackImage(index + 1);

              return (
                <TransitionLink
                  key={`${article.url}-${index}`}
                  href={getArticleHref(article)}
                  onClick={saveArticles}
                  className="group overflow-hidden rounded-[28px] border border-[#eadbd4] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={article.urlToImage || fallbackImage}
                      alt={article.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackImage;
                      }}
                    />

                    <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a2638] backdrop-blur">
                      {getTag(article)}
                    </div>
                  </div>

                  <div className="flex min-h-[230px] flex-col justify-between p-7">
                    <div>
                      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a2638]">
                        {article.source?.name || "Fashion Source"} ·{" "}
                        {formatDate(article.publishedAt)}
                      </p>

                      <h3 className="line-clamp-2 font-serif text-2xl font-bold leading-snug text-[#151111]">
                        {article.title}
                      </h3>

                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#6d6260]">
                        {article.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-[#f0e3de] pt-5">
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a2638]">
                        Ver artículo completo
                      </span>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#151111] text-sm text-white transition group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </TransitionLink>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}