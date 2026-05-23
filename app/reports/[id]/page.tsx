"use client";

import PageContainer from "@/components/layout/PageContainer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Report {
  id: string;
  title: string;
  slug: string;
  executiveSummary: string;
  insights: string;
  conclusion: string;
  createdAt: string;
  brand1: { id: string; name: string };
  brand2: { id: string; name: string };
  user: { id: string; name: string; email: string };
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [reportId, setReportId] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadParams = async () => {
      const { id } = await params;
      if (isMounted) {
        setReportId(id);
        loadReport(id);
      }
    };

    loadParams();

    return () => {
      isMounted = false;
    };
  }, [params]);

  const loadReport = async (id: string) => {
    try {
      const res = await fetch(`/api/reports/${id}`, {
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Debes iniciar sesión para ver este informe");
        } else if (res.status === 404) {
          throw new Error("Informe no encontrado");
        } else if (res.status === 403) {
          throw new Error("No tienes permisos para ver este informe");
        } else {
          throw new Error("Error al cargar el informe");
        }
      }

      const data = await res.json();
      setReport(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a2638] mx-auto mb-4"></div>
            <p className="text-[#b8a9a6]">Cargando informe...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="mb-8">
          <Link href="/reports">
            <button className="flex items-center gap-2 text-[#8a2638] hover:text-[#a83450] transition mb-8">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver a informes
            </button>
          </Link>
        </div>

        <div className="rounded-[20px] border-2 border-red-200 bg-red-50 p-8 text-center">
          <svg
            className="h-12 w-12 text-red-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4v2m0 4v2M5.172 5.172a4 4 0 015.656 0L12 6.343m0 0a4 4 0 015.656 0m-5.656 0a4 4 0 000 5.656m0 0a4 4 0 005.656 0M5.172 5.172a4 4 0 010 5.656m0 0L12 18m0 0l6.828-6.828m0 0a4 4 0 010-5.656m0 0a4 4 0 005.656 0"
            />
          </svg>
          <p className="font-serif text-2xl font-bold text-red-600 mb-2">
            {error}
          </p>
          <p className="text-red-500">
            Por favor, intenta de nuevo o vuelve a la lista de informes.
          </p>
        </div>
      </PageContainer>
    );
  }

  if (!report) {
    return (
      <PageContainer>
        <Link href="/reports">
          <button className="flex items-center gap-2 text-[#8a2638] hover:text-[#a83450] transition mb-8">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver a informes
          </button>
        </Link>

        <div className="rounded-[20px] border-2 border-dashed border-[#eadbd4] bg-[#f9f6f3] p-12 text-center">
          <p className="font-serif text-2xl font-bold text-[#151111]">
            Informe no encontrado
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Back Button */}
      <Link href="/reports">
        <button className="flex items-center gap-2 text-[#8a2638] hover:text-[#a83450] transition mb-8 font-semibold">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a informes
        </button>
      </Link>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#151111] via-[#2a1f1c] to-[#151111] p-8 shadow-lg md:p-12"
      >
        <div className="absolute inset-0 -right-20 -top-20 h-80 w-80 rounded-full bg-[#8a2638]/10 blur-3xl" />
        <div className="absolute inset-0 -bottom-20 -left-10 h-60 w-60 rounded-full bg-[#e5a9b6]/5 blur-2xl" />

        <div className="relative z-10">
          <div className="mb-6 flex items-baseline gap-2">
            <span className="inline-block rounded-full bg-[#8a2638]/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#e5a9b6]">
              Informe Comparativo
            </span>
            <time className="text-xs text-[#b8a9a6]">
              {formatDate(report.createdAt)}
            </time>
          </div>

          <h1 className="mb-4 font-serif text-5xl font-bold leading-tight text-white md:text-6xl">
            {report.brand1.name}
            <span className="mx-3 text-[#e5a9b6]">×</span>
            {report.brand2.name}
          </h1>

          <p className="text-sm text-[#b8a9a6]">
            Análisis estratégico de desempeño competitivo en el ecosistema
            digital de moda
          </p>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Executive Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-hidden rounded-[24px] border border-[#eadbd4] bg-white p-8 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="h-1 w-12 rounded-full bg-[#8a2638]" />
              <h2 className="font-serif text-2xl font-bold text-[#151111]">
                Resumen Ejecutivo
              </h2>
            </div>
            <p className="leading-8 text-[#4a4440]">
              {report.executiveSummary}
            </p>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="overflow-hidden rounded-[24px] border border-[#eadbd4] bg-white p-8 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="h-1 w-12 rounded-full bg-[#8a2638]" />
              <h2 className="font-serif text-2xl font-bold text-[#151111]">
                Análisis Detallado
              </h2>
            </div>
            <div className="prose prose-sm max-w-none text-[#4a4440]">
              <div className="whitespace-pre-wrap leading-8">
                {report.insights}
              </div>
            </div>
          </motion.div>

          {/* Conclusion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="overflow-hidden rounded-[24px] border border-[#eadbd4] bg-white p-8 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="h-1 w-12 rounded-full bg-[#8a2638]" />
              <h2 className="font-serif text-2xl font-bold text-[#151111]">
                Conclusiones
              </h2>
            </div>
            <p className="leading-8 text-[#4a4440]">
              {report.conclusion}
            </p>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Brands Card */}
          <div className="overflow-hidden rounded-[24px] border border-[#eadbd4] bg-gradient-to-br from-[#f9f6f3] to-white p-6 shadow-sm">
            <h3 className="mb-4 font-serif text-lg font-bold text-[#151111]">
              Marcas Comparadas
            </h3>
            <div className="space-y-3">
              <div className="rounded-[12px] border-l-4 border-[#8a2638] bg-white p-4">
                <p className="text-xs font-semibold text-[#8a2638] uppercase">
                  Marca A
                </p>
                <p className="font-bold text-[#151111]">
                  {report.brand1.name}
                </p>
              </div>
              <div className="rounded-[12px] border-l-4 border-[#e5a9b6] bg-white p-4">
                <p className="text-xs font-semibold text-[#e5a9b6] uppercase">
                  Marca B
                </p>
                <p className="font-bold text-[#151111]">
                  {report.brand2.name}
                </p>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="overflow-hidden rounded-[24px] border border-[#eadbd4] bg-gradient-to-br from-[#f9f6f3] to-white p-6 shadow-sm">
            <h3 className="mb-4 font-serif text-lg font-bold text-[#151111]">
              Información
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-[#8a2638] uppercase">
                  Fecha de creación
                </p>
                <p className="text-[#4a4440]">{formatDate(report.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#8a2638] uppercase">
                  Tipo
                </p>
                <p className="text-[#4a4440]">Análisis Comparativo</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#8a2638] uppercase">
                  ID del Informe
                </p>
                <p className="font-mono text-xs text-[#6d6260] break-all">
                  {report.id}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/reports" className="block w-full">
              <button className="w-full rounded-[12px] border-2 border-[#8a2638] bg-[#8a2638] px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white transition duration-300 hover:bg-[#a83450] active:scale-95">
                Volver a informes
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}
