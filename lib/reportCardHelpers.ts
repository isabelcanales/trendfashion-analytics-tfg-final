/**
 * Report Card Helpers
 * Genera datos dinámicos para las cards de informes
 */

export interface ReportCardData {
  status: "liderazgo_consolidado" | "alta_competitividad" | "equilibrio" | "tendencia_emergente";
  statusLabel: string;
  statusColor: string;
  insight: string;
  dominantMetric: string;
  dominantValue: string;
}

/**
 * Determina el status competitivo entre dos marcas
 */
function getCompetitiveStatus(
  scoreA: number,
  scoreB: number,
  mentionsA: number,
  mentionsB: number,
  sentimentA: number,
  sentimentB: number
): ReportCardData["status"] {
  const scoreDiff = Math.abs(scoreA - scoreB);
  const mentionsDiff = Math.abs(mentionsA - mentionsB);
  const sentimentDiff = Math.abs(sentimentA - sentimentB);

  // Liderazgo consolidado: líder claro en múltiples métricas
  if (scoreDiff >= 8 && mentionsDiff >= 300) {
    return "liderazgo_consolidado";
  }

  // Tendencia emergente: scores bajos pero con diferencias marcadas
  if (Math.max(scoreA, scoreB) < 70 && scoreDiff >= 10) {
    return "tendencia_emergente";
  }

  // Equilibrio competitivo: marcas muy parejas
  if (scoreDiff <= 3 && mentionsDiff <= 100) {
    return "equilibrio";
  }

  // Alta competitividad: competencia cerrada
  return "alta_competitividad";
}

/**
 * Genera insight dinámico basado en análisis de marcas
 */
function generateCardInsight(
  brandA: string,
  brandB: string,
  scoreA: number,
  scoreB: number,
  mentionsA: number,
  mentionsB: number,
  sentimentA: number,
  sentimentB: number
): string {
  const leader = scoreA > scoreB ? brandA : brandB;
  const scoreDiff = Math.abs(scoreA - scoreB);
  const mentionsDiff = Math.abs(mentionsA - mentionsB);
  const sentimentDiff = Math.abs(sentimentA - sentimentB);

  // Por diferencia de mentions
  if (mentionsDiff > 500) {
    const mentionLeader = mentionsA > mentionsB ? brandA : brandB;
    return `${mentionLeader} domina la conversación digital con presencia significativamente superior.`;
  }

  // Por diferencia de sentimiento
  if (sentimentDiff > 8) {
    const sentimentLeader = sentimentA > sentimentB ? brandA : brandB;
    return `${sentimentLeader} mantiene mejor percepción de marca en el ecosistema digital.`;
  }

  // Por diferencia de score
  if (scoreDiff >= 8) {
    return `${leader} presenta posición competitiva más sólida en el análisis integral.`;
  }

  // Equilibrio
  return `${brandA} y ${brandB} mantienen una competencia cerrada en el mercado digital.`;
}

/**
 * Obtiene el color para cada status
 */
function getStatusColor(status: ReportCardData["status"]): string {
  switch (status) {
    case "liderazgo_consolidado":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "alta_competitividad":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "equilibrio":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "tendencia_emergente":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

/**
 * Obtiene el label legible para cada status
 */
function getStatusLabel(status: ReportCardData["status"]): string {
  const labels: Record<ReportCardData["status"], string> = {
    liderazgo_consolidado: "Liderazgo consolidado",
    alta_competitividad: "Alta competitividad",
    equilibrio: "Equilibrio competitivo",
    tendencia_emergente: "Tendencia emergente",
  };
  return labels[status];
}

/**
 * Determina la métrica dominante
 */
function getDominantMetric(
  scoreA: number,
  scoreB: number,
  mentionsA: number,
  mentionsB: number
): { metric: string; value: string } {
  const scoreLeader = scoreA > scoreB ? "A" : "B";
  const mentionsLeader = mentionsA > mentionsB ? "A" : "B";

  if (scoreLeader === mentionsLeader) {
    return {
      metric: "Liderazgo en Score y Menciones",
      value: scoreLeader === "A" ? "Marca A" : "Marca B",
    };
  }

  const scoreDiff = Math.abs(scoreA - scoreB);
  const mentionsDiff = Math.abs(mentionsA - mentionsB);

  if (scoreDiff > mentionsDiff) {
    return {
      metric: "Score Global",
      value: `+${scoreDiff} puntos`,
    };
  } else {
    return {
      metric: "Presencia Digital",
      value: `+${mentionsDiff} menciones`,
    };
  }
}

/**
 * Genera datos completos para una card de informe
 */
export function generateReportCardData(
  brandA: string,
  brandB: string,
  scoreA: number,
  scoreB: number,
  mentionsA: number,
  mentionsB: number,
  sentimentA: number,
  sentimentB: number
): ReportCardData {
  const status = getCompetitiveStatus(
    scoreA,
    scoreB,
    mentionsA,
    mentionsB,
    sentimentA,
    sentimentB
  );

  const insight = generateCardInsight(
    brandA,
    brandB,
    scoreA,
    scoreB,
    mentionsA,
    mentionsB,
    sentimentA,
    sentimentB
  );

  const { metric: dominantMetric, value: dominantValue } = getDominantMetric(
    scoreA,
    scoreB,
    mentionsA,
    mentionsB
  );

  const colorClass = getStatusColor(status);
  const statusLabel = getStatusLabel(status);

  return {
    status,
    statusLabel,
    statusColor: colorClass,
    insight,
    dominantMetric,
    dominantValue,
  };
}

/**
 * Genera un mini indicador visual tipo sparkline (solo números/barras simples)
 */
export function getMiniVisualization(
  scoreA: number,
  scoreB: number
): { barA: number; barB: number; maxScore: number } {
  const maxScore = Math.max(scoreA, scoreB, 100);
  return {
    barA: (scoreA / maxScore) * 100,
    barB: (scoreB / maxScore) * 100,
    maxScore,
  };
}
