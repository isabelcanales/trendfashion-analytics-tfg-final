"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MetricData {
  users: number;
  news: number;
  comments: number;
  events: number;
  loading: boolean;
}

const ModuleCard = ({
  title,
  description,
  status,
  href,
}: {
  title: string;
  description: string;
  status: string;
  href: string;
}) => (
  <Link
    href={href}
    className="group bg-white rounded-lg border border-[#eadbd4] p-6 hover:shadow-lg transition-all duration-300 hover:border-[#d8a7b1]"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-[#151111] group-hover:text-[#8a2638] transition">
          {title}
        </h3>
        <p className="text-sm text-[#b8a9a6] mt-2 line-clamp-2">{description}</p>
      </div>
    </div>

    <div className="flex items-center justify-between mt-6">
      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#f5ebe0] text-[#8a2638] border border-[#eadbd4]">
        {status}
      </span>
      <span className="text-[#8a2638] font-semibold group-hover:translate-x-1 transition-transform">
        →
      </span>
    </div>
  </Link>
);

const MetricCard = ({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading: boolean;
}) => (
  <div className="bg-white rounded-lg border border-[#eadbd4] p-6">
    <p className="text-[#b8a9a6] text-sm font-semibold mb-3">{label}</p>
    {loading ? (
      <div className="h-8 bg-[#f5ebe0] rounded animate-pulse"></div>
    ) : (
      <p className="text-4xl font-bold text-[#8a2638]">{value}</p>
    )}
  </div>
);

export default function AdminPage() {
  const [metrics, setMetrics] = useState<MetricData>({
    users: 0,
    news: 0,
    comments: 0,
    events: 0,
    loading: true,
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const [usersRes, newsRes, commentsRes, eventsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/news"),
        fetch("/api/admin/comments"),
        fetch("/api/admin/events"),
      ]);

      let usersCount = 0;
      let newsCount = 0;
      let commentsCount = 0;
      let eventsCount = 0;

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        usersCount = Array.isArray(usersData) ? usersData.length : 0;
      }

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        // El endpoint devuelve { data: [...], pagination: { total, ... } }
        newsCount = newsData.pagination?.total || (Array.isArray(newsData.data) ? newsData.data.length : 0);
      }

      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        commentsCount = Array.isArray(commentsData) ? commentsData.length : 0;
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        // El endpoint devuelve { data: [...], pagination: { total, ... } }
        eventsCount = eventsData.pagination?.total || (Array.isArray(eventsData.data) ? eventsData.data.length : 0);
      }

      setMetrics({
        users: usersCount,
        news: newsCount,
        comments: commentsCount,
        events: eventsCount,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
      setMetrics((prev) => ({ ...prev, loading: false }));
    }
  };

  const modules = [
    {
      name: "Noticias",
      description: "Publica, edita y modera noticias de moda y tecnología.",
      status: "Moderación",
      href: "/admin/news",
    },
    {
      name: "Eventos",
      description: "Crea y administra eventos relevantes para la comunidad.",
      status: "Gestión",
      href: "/admin/events",
    },
    {
      name: "Comentarios",
      description: "Modera comentarios de usuarios en noticias y contenidos.",
      status: "Moderación",
      href: "/admin/comments",
    },
    {
      name: "Usuarios",
      description: "Gestiona usuarios, roles y permisos de la plataforma.",
      status: "Activo",
      href: "/admin/users",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fffdf9]">
      {/* Header */}
      <div className="bg-white border-b border-[#eadbd4] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <h1 className="text-4xl font-bold text-[#151111] mb-2">
            Panel de administración
          </h1>
          <p className="text-[#b8a9a6] text-lg">
            Gestiona contenidos, usuarios y actividad de la plataforma TrendFashion Analytics.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Métricas */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#151111] mb-6">Resumen de Actividad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard label="Usuarios Registrados" value={metrics.users} loading={metrics.loading} />
            <MetricCard label="Noticias Publicadas" value={metrics.news} loading={metrics.loading} />
            <MetricCard label="Comentarios" value={metrics.comments} loading={metrics.loading} />
            <MetricCard label="Eventos" value={metrics.events} loading={metrics.loading} />
          </div>
        </div>

        {/* Secciones de Gestión */}
        <div>
          <h2 className="text-2xl font-bold text-[#151111] mb-6">Secciones de Gestión</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <ModuleCard
                key={module.name}
                title={module.name}
                description={module.description}
                status={module.status}
                href={module.href}
              />
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-white rounded-lg border border-[#eadbd4]">
          <p className="text-sm text-[#8a9099]">
            💡 <span className="font-semibold text-[#151111]">Consejo:</span> Las métricas se actualizan automáticamente. 
            Accede a cualquier sección para gestionar el contenido específico. Todos los cambios se registran en la base de datos.
          </p>
        </div>
      </div>
    </main>
  );
}
