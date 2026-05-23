"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import DashboardClient from "@/components/dashboard/DashboardClient";

type NewsArticle = {
  title?: string;
  description?: string;
  url?: string;
  urlToImage?: string;
  image?: string;
  imageUrl?: string;
  publishedAt?: string;
  date?: string;
  slug?: string;
  source?: {
    name?: string;
  };
};

const FALLBACK_IMAGES = [
  "/news-fallbacks/fallback-1.jpg",
  "/news-fallbacks/fallback-2.jpg",
  "/news-fallbacks/fallback-3.jpg",
];

function getFallbackImage(index: number) {
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

const fallbackFeaturedNews = {
  title: "Noticia destacada del sector moda",
  description:
    "Consulta las últimas noticias del sector moda, marcas destacadas y tendencias digitales.",
  date: "Actualidad",
  href: "/news",
  image: getFallbackImage(0),
};

function createSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function formatDate(article: NewsArticle) {
  if (article.date) return article.date;

  if (!article.publishedAt) return "Actualidad";

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(article.publishedAt));
}

function getFeaturedHref(article: NewsArticle) {
  if (article.slug) {
    return `/news/${article.slug}`;
  }

  if (article.title) {
    return `/news/${createSlug(article.title)}`;
  }

  return "/news";
}

function getFeaturedImage(article: NewsArticle) {
  return (
    article.imageUrl ||
    article.urlToImage ||
    article.image ||
    getFallbackImage(0)
  );
}

export default function HomePage() {
  const [featuredNews, setFeaturedNews] = useState(fallbackFeaturedNews);

  useEffect(() => {
    async function loadFeaturedNews() {
      try {
        const response = await fetch("/api/news", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("No se pudieron cargar las noticias.");
        }

        const data = await response.json();

        const articles: NewsArticle[] = Array.isArray(data)
          ? data
          : data.articles ?? [];

        const firstArticle = articles[0];

        if (!firstArticle) return;

        setFeaturedNews({
          title: firstArticle.title || fallbackFeaturedNews.title,
          description:
            firstArticle.description || fallbackFeaturedNews.description,
          date: formatDate(firstArticle),
          href: getFeaturedHref(firstArticle),
          image: getFeaturedImage(firstArticle),
        });
      } catch (error) {
        console.error("Error cargando noticia destacada:", error);
      }
    }

    loadFeaturedNews();
  }, []);

  return (
    <PageContainer>
      {/* PORTADA */}
      <section className="relative left-1/2 -mt-10 w-screen -translate-x-1/2 overflow-hidden bg-[#f7eee9] px-6 pb-24 pt-14 md:-mt-14 md:px-10 md:pb-32 md:pt-20">
        <div className="absolute right-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-[#e8a9b6]/30 blur-3xl" />
        <div className="absolute bottom-[-140px] left-[-120px] h-[360px] w-[360px] rounded-full bg-[#151111]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-6 inline-flex rounded-full border border-[#d8c7b8] bg-white/70 px-5 py-2 text-sm font-semibold text-[#8a2638] shadow-sm">
            Fashion Data Intelligence
          </div>

          <h1 className="max-w-5xl font-serif text-6xl font-bold leading-[0.9] text-[#151111] md:text-8xl">
            Analiza tendencias de moda con datos visuales.
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-[#6d6260] md:text-lg">
            TrendFashion Analytics es una plataforma visual para comparar
            marcas, detectar tendencias, medir popularidad digital y analizar la
            reputación del sector moda.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="#dashboard"
              className="rounded-full bg-[#151111] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#2a2020]"
            >
              Ver dashboard
            </Link>

            <Link
              href="/news"
              className="rounded-full border border-[#d8c7b8] bg-white px-7 py-4 text-sm font-semibold text-[#151111] transition hover:bg-[#151111] hover:text-white"
            >
              Ver noticias
            </Link>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            <article className="rounded-[28px] border border-[#eadbd4] bg-white/80 p-6 shadow-sm backdrop-blur">
              <p className="mb-3 text-sm font-semibold text-[#8a2638]">
                Marcas analizadas
              </p>
              <h2 className="text-4xl font-bold text-[#151111]">24+</h2>
              <p className="mt-4 text-sm leading-6 text-[#6d6260]">
                Seguimiento de marcas luxury, premium y fast fashion.
              </p>
            </article>

            <article className="rounded-[28px] border border-[#eadbd4] bg-white/80 p-6 shadow-sm backdrop-blur">
              <p className="mb-3 text-sm font-semibold text-[#8a2638]">
                Tendencias detectadas
              </p>
              <h2 className="text-4xl font-bold text-[#151111]">128</h2>
              <p className="mt-4 text-sm leading-6 text-[#6d6260]">
                Agrupación visual de estilos, categorías y movimientos.
              </p>
            </article>

            <article className="rounded-[28px] border border-[#eadbd4] bg-[#151111] p-6 text-white shadow-xl">
              <p className="mb-3 text-sm font-semibold text-[#e5a9b6]">
                Crecimiento medio
              </p>
              <h2 className="text-4xl font-bold">+32.8%</h2>
              <p className="mt-4 text-sm leading-6 text-white/65">
                Evolución media de popularidad en el periodo seleccionado.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section id="dashboard" className="py-24">
        <DashboardClient />
      </section>

      {/* NOTICIA DESTACADA */}
      <section className="pb-24">
        <div className="mb-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
            Actualidad
          </p>

          <h2 className="max-w-3xl font-serif text-4xl font-bold leading-tight text-[#171111] md:text-5xl">
            Noticia destacada del sector moda
          </h2>
        </div>

        <article className="grid overflow-hidden rounded-[2rem] border border-[#eaded4] bg-[#fffdf9] shadow-[0_24px_70px_rgba(60,35,30,0.08)] md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative h-[260px] overflow-hidden bg-[#f5ebe8] md:h-auto md:min-h-[360px]">
            <img
              src={featuredNews.image || getFallbackImage(0)}
              alt={featuredNews.title}
              className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getFallbackImage(0);
              }}
            />
          </div>

          <div className="flex flex-col justify-center p-8 md:p-12">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#171111] px-4 py-2 text-xs font-semibold text-white">
                Noticia destacada
              </span>

              <span className="rounded-full bg-[#f4e6e3] px-4 py-2 text-xs font-semibold text-[#8a2638]">
                {featuredNews.date}
              </span>
            </div>

            <h3 className="mb-5 font-serif text-3xl font-bold leading-tight text-[#171111] md:text-4xl">
              {featuredNews.title}
            </h3>

            <p className="mb-8 max-w-2xl text-sm leading-7 text-[#6f6260] md:text-base">
              {featuredNews.description}
            </p>

            <Link
              href={featuredNews.href}
              className="w-fit rounded-full bg-[#171111] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#2a2020]"
            >
              Leer noticia completa
            </Link>
          </div>
        </article>

        <div className="mt-8 flex justify-center md:justify-end">
          <Link
            href="/news"
            className="w-fit rounded-full border border-[#d8c7b8] bg-[#fffdf9] px-6 py-3 text-sm font-semibold text-[#171111] transition hover:bg-[#171111] hover:text-white"
          >
            Ver todas las noticias
          </Link>
        </div>
      </section>
    </PageContainer>
  );
}