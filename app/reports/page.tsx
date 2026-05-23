"use client";

import PageContainer from "@/components/layout/PageContainer";
import { generateReportCardData, getMiniVisualization } from "@/lib/reportCardHelpers";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PremiumFeature from "@/components/PremiumFeature";
import { Download } from "lucide-react";

interface DBReport {
  id: string;
  title: string;
  slug: string;
  executiveSummary: string;
  insights: string;
  conclusion: string;
  createdAt: string;
  brand1: { id: string; name: string };
  brand2: { id: string; name: string };
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReportsPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<DBReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<DBReport | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const res = await fetch("/api/reports", {
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401) {
          setReports([]);
        } else {
          throw new Error("Error al cargar reportes");
        }
      } else {
        const data = await res.json();
        setReports(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      console.error("Error loading reports from API:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId: string, reportTitle: string) => {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar el informe "${reportTitle}"?`
    );

    if (!confirmed) return;

    setDeleting(reportId);
    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Error al eliminar el informe"
        );
      }

      // Actualizar el estado eliminando el reporte
      setReports((prevReports) =>
        prevReports.filter((report) => report.id !== reportId)
      );

      setSuccessMessage("✓ Informe eliminado correctamente");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
      console.error("Error deleting report:", err);
    } finally {
      setDeleting(null);
    }
  };

  const handlePrintReport = (report: DBReport) => {
    // Abrir ventana nueva
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Por favor, habilita las ventanas emergentes para imprimir");
      return;
    }

    // Crear HTML del informe
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${report.brand1.name} × ${report.brand2.name}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            background: white;
            color: #151111;
            width: 100%;
            height: 100%;
          }
          
          body {
            padding: 0;
            margin: 0;
          }
          
          .report-container {
            width: 100%;
            background: white;
            padding: 20mm;
          }
          
          .report-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #eadbd4;
            padding-bottom: 20px;
          }
          
          .platform-name {
            font-size: 12px;
            color: #8a2638;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 10px;
          }
          
          .report-title {
            font-size: 28px;
            font-weight: 700;
            color: #151111;
            margin-bottom: 10px;
          }
          
          .report-date {
            font-size: 13px;
            color: #6d6260;
          }
          
          .report-section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          
          .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #151111;
            margin-bottom: 12px;
            margin-top: 20px;
          }
          
          .section-content {
            font-size: 11pt;
            line-height: 1.6;
            color: #4a4440;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          
          .metadata {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #eadbd4;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 15px;
            font-size: 11px;
          }
          
          .metadata-item {
            text-align: left;
          }
          
          .metadata-label {
            font-size: 10px;
            color: #8a2638;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 5px;
          }
          
          .metadata-value {
            font-size: 12px;
            color: #151111;
            font-weight: 600;
          }
          
          .report-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eadbd4;
            text-align: center;
            font-size: 10px;
            color: #b8a9a6;
          }
          
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .report-container {
              padding: 20mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <!-- Header -->
          <div class="report-header">
            <div class="platform-name">TrendFashion Analytics</div>
            <div class="report-title">${report.brand1.name} × ${report.brand2.name}</div>
            <div class="report-date">Informe generado: ${formatDate(report.createdAt)}</div>
          </div>
          
          <!-- Executive Summary -->
          <div class="report-section">
            <h2 class="section-title">Resumen Ejecutivo</h2>
            <div class="section-content">${report.executiveSummary}</div>
          </div>
          
          <!-- Detailed Analysis -->
          <div class="report-section">
            <h2 class="section-title">Análisis Detallado</h2>
            <div class="section-content">${report.insights}</div>
          </div>
          
          <!-- Conclusions -->
          <div class="report-section">
            <h2 class="section-title">Conclusiones</h2>
            <div class="section-content">${report.conclusion}</div>
          </div>
          
          <!-- Metadata -->
          <div class="metadata">
            <div class="metadata-item">
              <div class="metadata-label">Marca A</div>
              <div class="metadata-value">${report.brand1.name}</div>
            </div>
            <div class="metadata-item">
              <div class="metadata-label">Marca B</div>
              <div class="metadata-value">${report.brand2.name}</div>
            </div>
            <div class="metadata-item">
              <div class="metadata-label">Fecha</div>
              <div class="metadata-value">${formatDate(report.createdAt)}</div>
            </div>
            <div class="metadata-item">
              <div class="metadata-label">Tipo</div>
              <div class="metadata-value">Análisis Comparativo</div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="report-footer">
            <p>© 2026 TrendFashion Analytics | Análisis Comparativo de Marcas</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 250);
          };
          
          // Cerrar ventana después de imprimir
          window.onafterprint = function() {
            window.close();
          };
          
          // Fallback: cerrar después de 2 segundos si onafterprint no funciona
          setTimeout(function() {
            try {
              window.close();
            } catch (e) {
              // Silenciar errores si ya está cerrada
            }
          }, 2000);
        </script>
      </body>
      </html>
    `;

    // Escribir contenido en la ventana
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <PageContainer className="no-print">
      {/* HERO SECTION */}
      <div className="mb-16 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#151111] via-[#2a1f1c] to-[#151111] p-8 shadow-lg md:p-12 no-print">
        {/* Background accents */}
        <div className="absolute inset-0 -right-20 -top-20 h-80 w-80 rounded-full bg-[#8a2638]/10 blur-3xl" />
        <div className="absolute inset-0 -bottom-20 -left-10 h-60 w-60 rounded-full bg-[#e5a9b6]/5 blur-2xl" />

        <div className="relative z-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-[#e5a9b6]">
            Centro documental
          </p>

          <h1 className="mb-4 font-serif text-5xl font-bold leading-tight text-white md:text-6xl">
            Informes Estratégicos
            <span className="block text-[#e5a9b6]">de Moda</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/80">
            Biblioteca de análisis comparativos premium. Accede a informes
            detallados sobre el desempeño competitivo de las principales marcas
            en el panorama digital de moda.
          </p>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 flex items-center gap-2 no-print">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {loading && (
        <div className="text-center py-12 no-print">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a2638] mx-auto mb-4"></div>
          <p className="text-[#b8a9a6]">Cargando informes...</p>
        </div>
      )}

      {/* ERROR BANNER */}
      {error && !loading && (
        <div className="mb-8 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center gap-2 no-print">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* REPORTS GRID */}
      {!loading && reports.length > 0 ? (
        <div className="no-print">
          <h2 className="mb-12 font-serif text-3xl font-bold text-[#151111]">
            Informes Generados
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report, index) => {
              const cardData = generateReportCardData(
                report.brand1.name,
                report.brand2.name,
                0,
                0,
                0,
                0,
                0,
                0
              );
              const vizData = getMiniVisualization(0, 0);

              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex flex-col overflow-hidden rounded-[24px] border border-[#eadbd4] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Header Premium */}
                  <div className="border-b border-[#eadbd4] bg-gradient-to-br from-[#f9f6f3] to-white p-6 md:p-7">
                    <div className="mb-3 flex items-baseline justify-between gap-3">
                      <h3 className="font-serif text-xl font-bold leading-tight text-[#151111] md:text-2xl">
                        {report.brand1.name}
                        <span className="mx-2 text-[#8a2638]">×</span>
                        {report.brand2.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#6d6260]">
                      {formatDate(report.createdAt)}
                    </p>
                  </div>

                  {/* Content Premium */}
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    {/* Status Badge */}
                    <div className="mb-4">
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${cardData.statusColor}`}
                      >
                        <span className="relative flex h-2 w-2">
                          <span className={`absolute inline-flex h-full w-full rounded-full ${
                            cardData.status === "liderazgo_consolidado"
                              ? "bg-emerald-400"
                              : cardData.status === "alta_competitividad"
                                ? "bg-amber-400"
                                : cardData.status === "equilibrio"
                                  ? "bg-blue-400"
                                  : "bg-rose-400"
                          } opacity-75 animate-pulse`}
                          />
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${
                            cardData.status === "liderazgo_consolidado"
                              ? "bg-emerald-500"
                              : cardData.status === "alta_competitividad"
                                ? "bg-amber-500"
                                : cardData.status === "equilibrio"
                                  ? "bg-blue-500"
                                  : "bg-rose-500"
                          }`}
                          />
                        </span>
                        {cardData.statusLabel}
                      </div>
                    </div>

                    {/* Insight Premium */}
                    <p className="mb-6 text-sm leading-6 text-[#151111] font-medium">
                      {report.executiveSummary}
                    </p>

                    {/* Mini Visualization - Score Bars */}
                    <div className="mb-6 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 text-right">
                          <p className="text-xs font-semibold text-[#6d6260] uppercase">
                            {report.brand1.name}
                          </p>
                          <p className="text-lg font-bold text-[#151111]">
                            —
                          </p>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 overflow-hidden rounded-full bg-[#f0eded]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "50%" }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                              className="h-full bg-[#8a2638]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-16 text-right">
                          <p className="text-xs font-semibold text-[#6d6260] uppercase">
                            {report.brand2.name}
                          </p>
                          <p className="text-lg font-bold text-[#8a2638]">
                            —
                          </p>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 overflow-hidden rounded-full bg-[#f0eded]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "50%" }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                              className="h-full bg-[#e5a9b6]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dominant Metric */}
                    <div className="mb-6 rounded-[12px] border border-[#eadbd4] bg-[#f9f6f3] p-4">
                      <p className="mb-1 text-xs font-semibold text-[#8a2638] uppercase">
                        Análisis
                      </p>
                      <p className="text-sm font-bold text-[#151111] line-clamp-2">
                        {report.insights}
                      </p>
                    </div>

                    {/* Premium Feature - Advanced Export */}
                    <div className="mb-6">
                      <PremiumFeature
                        requiredPlan="pro"
                        title="Exportación PDF Avanzada"
                        description="Desbloquea plantillas profesionales, marca personalizada y formatos premium para tus reportes."
                        currentPlan={(session?.user as any)?.plan}
                        icon={<Download className="w-full h-full" />}
                        ctaText="Desbloquear Pro"
                        size="sm"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto flex gap-3">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="flex-1 group/btn w-full rounded-[12px] border-2 border-[#8a2638] bg-white px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#8a2638] transition duration-300 hover:bg-[#8a2638] hover:text-white active:scale-95"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Abrir
                          <svg
                            className="h-4 w-4 transition duration-300 group-hover/btn:translate-x-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteReport(report.id, report.title)
                        }
                        disabled={deleting === report.id}
                        className="px-4 py-3 rounded-[12px] border-2 border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-400 transition duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Eliminar informe"
                      >
                        {deleting === report.id ? (
                          <svg
                            className="h-5 w-5 animate-spin"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        ) : (
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : !loading ? (
        <div className="rounded-[20px] border-2 border-dashed border-[#eadbd4] bg-[#f9f6f3] p-12 text-center no-print">
          <p className="mb-2 font-serif text-2xl font-bold text-[#151111]">
            No hay informes generados aún
          </p>
          <p className="text-[#6d6260]">
            Ve al comparador y genera tu primer informe comparativo.
          </p>

          <Link href="/comparison">
            <button className="mt-6 rounded-[12px] border-2 border-[#8a2638] bg-[#8a2638] px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#a83450] active:scale-95">
              Ir al comparador
            </button>
          </Link>
        </div>
      ) : null}

      {/* MODAL */}
      <AnimatePresence>
        {selectedReport && (
          <>
            {/* Backdrop - Hide in print */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm no-print"
            />

            {/* Modal - Adjust for print */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-[28px] shadow-2xl overflow-hidden">
                {/* Modal Header - Hide in print */}
                <div className="flex-shrink-0 border-b border-[#eadbd4] bg-gradient-to-r from-[#151111] to-[#2a1f1c] px-8 py-6 text-white no-print">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-serif text-3xl font-bold mb-2">
                        {selectedReport.brand1.name}
                        <span className="mx-3 text-[#e5a9b6]">×</span>
                        {selectedReport.brand2.name}
                      </h2>
                      <p className="text-sm text-[#b8a9a6]">
                        {formatDateTime(selectedReport.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedReport(null)}
                      className="flex-shrink-0 text-white hover:text-[#e5a9b6] transition"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Modal Content - Only this part should print */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 print-report">
                  {/* Report Title for Print */}
                  <div className="hidden print:block mb-6 print:mb-4">
                    <h1 className="font-serif text-2xl font-bold text-[#151111] mb-2">
                      {selectedReport.brand1.name} × {selectedReport.brand2.name}
                    </h1>
                    <p className="text-sm text-[#6d6260]">
                      {formatDate(selectedReport.createdAt)}
                    </p>
                    <div className="h-px bg-[#eadbd4] my-4" />
                  </div>

                  {/* Executive Summary */}
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#151111] mb-3">
                      Resumen Ejecutivo
                    </h3>
                    <p className="text-[#4a4440] leading-7">
                      {selectedReport.executiveSummary}
                    </p>
                  </div>

                  {/* Insights */}
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#151111] mb-3">
                      Análisis Detallado
                    </h3>
                    <div className="text-[#4a4440] leading-7 whitespace-pre-wrap">
                      {selectedReport.insights}
                    </div>
                  </div>

                  {/* Conclusion */}
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#151111] mb-3">
                      Conclusiones
                    </h3>
                    <p className="text-[#4a4440] leading-7">
                      {selectedReport.conclusion}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="rounded-[12px] border border-[#eadbd4] bg-[#f9f6f3] p-4 mt-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-[#8a2638] uppercase">
                          Marca A
                        </p>
                        <p className="font-bold text-[#151111]">
                          {selectedReport.brand1.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#8a2638] uppercase">
                          Marca B
                        </p>
                        <p className="font-bold text-[#151111]">
                          {selectedReport.brand2.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#8a2638] uppercase">
                          Fecha
                        </p>
                        <p className="text-[#4a4440]">
                          {formatDate(selectedReport.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#8a2638] uppercase">
                          Tipo
                        </p>
                        <p className="text-[#4a4440]">Análisis Comparativo</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer - Hide in print */}
                <div className="flex-shrink-0 border-t border-[#eadbd4] bg-[#f9f6f3] px-8 py-4 flex gap-3 no-print">
                  <button
                    onClick={() => handlePrintReport(selectedReport)}
                    className="flex-1 rounded-[12px] border-2 border-[#8a2638] bg-[#8a2638] px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white transition duration-300 hover:bg-[#a83450] active:scale-95 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    Descargar informe
                  </button>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="flex-1 rounded-[12px] border-2 border-[#eadbd4] bg-white px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#151111] transition duration-300 hover:bg-[#f9f6f3] active:scale-95"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}