/**
 * Report Insights Generator
 * Generates dynamic insight text for fashion analytics reports
 */

export interface BrandData {
  id: string;
  name: string;
  mentions: number;
  popularity: number;
  sentiment: number;
  score: number;
}

/**
 * Generate an executive summary for the report
 */
export function generateExecutiveSummary(
  brandA: BrandData,
  brandB: BrandData
): string {
  const leader = brandA.score > brandB.score ? brandA.name : brandB.name;
  const difference = Math.abs(brandA.score - brandB.score);

  return `${leader} lidera la comparativa con una ventaja de ${difference} puntos. El análisis de menciones digitales, sentimiento de mercado y posicionamiento estratégico revela patrones clave en la percepción de marca y engagement con la audiencia.`;
}

/**
 * Generate 3-4 key insights based on brand comparison
 */
export function generateInsights(
  brandA: BrandData,
  brandB: BrandData
): string[] {
  const insights: string[] = [];

  // Insight 1: Mentions dominance
  const mentionsDiff = Math.abs(brandA.mentions - brandB.mentions);
  const mentionsLeader =
    brandA.mentions > brandB.mentions ? brandA.name : brandB.name;
  const mentionsPercent = Math.round(
    (mentionsDiff / Math.max(brandA.mentions, brandB.mentions)) * 100
  );

  insights.push(
    `${mentionsLeader} domina la conversación digital con un volumen de menciones ${mentionsPercent}% superior, indicando mayor visibilidad mediática y presencia en redes sociales.`
  );

  // Insight 2: Sentiment advantage
  const sentimentDiff = Math.abs(brandA.sentiment - brandB.sentiment);
  const sentimentLeader =
    brandA.sentiment > brandB.sentiment ? brandA.name : brandB.name;

  if (sentimentDiff > 5) {
    insights.push(
      `${sentimentLeader} cuenta con un sentimiento más positivo (+${sentimentDiff.toFixed(1)}%), demostrando mejor percepción de marca y apreciación del consumidor.`
    );
  }

  // Insight 3: Market positioning
  const scoreRatio = (
    (Math.max(brandA.score, brandB.score) /
      Math.min(brandA.score, brandB.score)) *
    100
  ).toFixed(0);
  const positionLeader = brandA.score > brandB.score ? brandA.name : brandB.name;
  const positionFollower =
    brandA.score > brandB.score ? brandB.name : brandA.name;

  insights.push(
    `${positionLeader} mantiene una posición más sólida en el mercado, con un score global que es ${scoreRatio}% superior al de ${positionFollower}, reflejando fortaleza competitiva.`
  );

  // Insight 4: Growth potential (if there's a significant difference)
  const popDiff = Math.abs(brandA.popularity - brandB.popularity);
  if (popDiff > 10) {
    const popLeader =
      brandA.popularity > brandB.popularity ? brandA.name : brandB.name;
    insights.push(
      `${popLeader} exhibe mayor popularidad relativa, sugiriendo mejor alineación con tendencias actuales de mercado y preferencias de consumidor.`
    );
  }

  return insights;
}

/**
 * Generate a strategic conclusion
 */
export function generateConclusion(
  brandA: BrandData,
  brandB: BrandData
): string {
  const leader = brandA.score > brandB.score ? brandA.name : brandB.name;
  const follower = brandA.score > brandB.score ? brandB.name : brandA.name;

  return `En conclusión, ${leader} demuestra fortaleza competitiva en el análisis integral, combinando presencia digital, sentimiento de marca positivo y puntuación global elevada. Sin embargo, ${follower} mantiene una posición significativa en el mercado fashion, con oportunidades claras para optimizar su presencia y engagement. La brecha entre ambas marcas refleja dinámicas de mercado competitivas que requieren monitoreo continuo.`;
}

/**
 * Get comparative advantage statement
 */
export function getComparativeAdvantage(
  metric: string,
  brandA: BrandData,
  brandB: BrandData
): string {
  switch (metric) {
    case "mentions":
      const mentionsDiff = Math.abs(brandA.mentions - brandB.mentions);
      const mentionsLeader =
        brandA.mentions > brandB.mentions ? brandA.name : brandB.name;
      return `${mentionsLeader} lidera con ${mentionsDiff.toLocaleString("es-ES")} menciones adicionales`;

    case "sentiment":
      const sentimentLeader =
        brandA.sentiment > brandB.sentiment ? brandA.name : brandB.name;
      const sentimentDiff = Math.abs(brandA.sentiment - brandB.sentiment);
      return `${sentimentLeader} tiene un sentimiento ${sentimentDiff.toFixed(1)}% más positivo`;

    case "score":
      const scoreLeader = brandA.score > brandB.score ? brandA.name : brandB.name;
      const scoreDiff = Math.abs(brandA.score - brandB.score);
      return `${scoreLeader} tiene un score ${scoreDiff} puntos más alto`;

    case "popularity":
      const popLeader =
        brandA.popularity > brandB.popularity ? brandA.name : brandB.name;
      const popDiff = Math.abs(brandA.popularity - brandB.popularity);
      return `${popLeader} es ${popDiff}% más popular`;

    default:
      return "";
  }
}

/**
 * Format a number in Spanish locale
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-ES").format(value);
}
