"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import PageContainer from "@/components/layout/PageContainer";
import { getBrandMetrics } from "@/lib/brandMetrics";
import { getNews } from "@/lib/news";
import { BrandMetricsResponse } from "@/types/brandMetrics";

type BrandDetail = {
  id: string;
  name: string;
  category: string;
  country: string;
  mentions: number;
  popularity: number;
  sentiment: number;
  score: number;
  rank: number;
};

type TrendAssociation = {
  name: string;
  affinity: number;
  stage: "Emergente" | "Crecimiento" | "Consolidada";
};

type NewsArticle = {
  source?: { id?: string | null; name?: string };
  author?: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  content?: string;
  slug?: string;
};

type NewsResponse = {
  status: string;
  source: "newsapi" | "fallback";
  totalResults: number;
  articles: NewsArticle[];
};

type TabId = "dashboard" | "history";
type PeriodId = "1m" | "3m" | "6m" | "12m";
type MetricId = "mentions" | "popularity" | "sentiment" | "lifecycle" | "score";

type BrandHistory = {
  founded: number;
  founder: string;
  origin: string;
  keyMilestones: { year: number; event: string }[];
  philosophy: string;
  narrative: string;
};

const tabs: { id: TabId; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "history", label: "Historia" },
  ];

const periods: { id: PeriodId; label: string; multiplier: number }[] = [
  { id: "1m", label: "Último mes", multiplier: 1 },
  { id: "3m", label: "Últimos 3 meses", multiplier: 1.15 },
  { id: "6m", label: "Últimos 6 meses", multiplier: 1.25 },
  { id: "12m", label: "Último año", multiplier: 1.4 },
];

const brandCountries: Record<string, string> = {
  Gucci: "Italia",
  Prada: "Italia",
  Chanel: "Francia",
  Dior: "Francia",
  Zara: "España",
  Mango: "España",
  "H&M": "Suecia",
  COS: "Reino Unido",
  "Massimo Dutti": "España",
};

const brandHistoryMap: Record<string, BrandHistory> = {
  Prada: {
    founded: 1913,
    founder: "Mario Prada",
    origin: "Milán, Italia",
    keyMilestones: [
      { year: 1913, event: "Fundación como marroquinería de lujo" },
      { year: 1975, event: "Miuccia Prada asume la dirección creativa" },
      { year: 1989, event: "Lanzamiento del icónico nylon bag" },
      { year: 2000, event: "Expansión global con línea prêt-à-porter" },
      { year: 2023, event: "Posicionamiento en quiet luxury y sostenibilidad" },
    ],
    philosophy:
      "Prada cree en la belleza del detalle, la precisión artesanal y la constante reinvención dentro de un marco de elegancia discreta. Su filosofía combina innovación material con herencia italiana.",
    narrative: "Prada representa la paradoja del lujo moderno: una casa milenaria que revolucionó la tradición mediante la innovación. Cuando Miuccia Prada asumió la dirección creativa en 1975, heredó una marroquinería reverenciada pero dormida. Su genio consistió en comprender que el verdadero lujo no grita, sino susurra. El nylon bag de 1989 fue un acto de transgresión silenciosa: un material industrial elevado a obra maestra, desafiando la noción de que el lujo exigía preciosismo. Décadas después, mientras el mundo se intoxica con logos y referencias, Prada permanece del lado de la sombra, del detalle imperceptible que solo el iniciado reconoce. Es la marca que entiende que la sofisticación máxima es aquella que no necesita explicarse.",
  },
  Dior: {
    founded: 1946,
    founder: "Christian Dior",
    origin: "París, Francia",
    keyMilestones: [
      { year: 1946, event: "Fundación con el revolucionario New Look" },
      { year: 1957, event: "Christian Dior fallece; Yves Saint Laurent continúa" },
      { year: 1996, event: "John Galliano asume el rol de diseñador" },
      { year: 2011, event: "Raf Simons lidera la visión creativa" },
      { year: 2023, event: "Maria Grazia Chiuri refuerza código femenino" },
    ],
    philosophy:
      "Dior encarna la feminidad romántica y el arte de la seducción a través de la moda. Su legado está en la extraordinaria artesanía, la sofisticación visual y la reafirmación de la elegancia parisina.",
    narrative: "Dior fue un acto de resurrección. En 1946, cuando Europa aún humeaba, Christian Dior anunció una revolución del cuerpo femenino que significaba, en realidad, una revolución del alma. Su New Look no era solo un corset invertido; era un manifiesto de esperanza disfrazado de crinolina. Dior comprendió algo fundamental: la moda es política, la moda es teatro, la moda es la forma más íntima de resistencia. Su legado trasciende el corte impecable o la artesanía extraordinaria; es la arquitectura de la feminidad como código poético. A través de sucesivos diseñadores—de Galliano a Simons a Chiuri—Dior ha permanecido como el templo donde la sensualidad se vuelve inteligencia y la belleza se convierte en una forma de pensamiento.",
  },
  Chanel: {
    founded: 1910,
    founder: "Gabrielle Chanel",
    origin: "París, Francia",
    keyMilestones: [
      { year: 1910, event: "Apertura de la primera boutique en París" },
      { year: 1926, event: "Lanzamiento del icónico Little Black Dress" },
      { year: 1954, event: "Creación del Chanel 2.55 bag" },
      { year: 1921, event: "Lanzamiento del perfume Chanel No. 5" },
      { year: 2023, event: "Posicionamiento como referente de atemporalidad" },
    ],
    philosophy:
      "Chanel revolucionó la moda al eliminar corsetería y complejidad innecesaria. Su filosofía permanece en la simplicidad elegante, la atemporalidad y el lujo discreto como estatus intelectual.",
    narrative: "Gabrielle Chanel fue una anarquista del lujo. En un mundo que confundía refinamiento con restricción, ella demolió los corsés—literalmente—y construyó un nuevo lenguaje donde comodidad y sofisticación dejaron de ser enemigos. El Little Black Dress no fue simplemente un vestido; fue una declaración: la mujer moderna no necesita piedras para brillar. Chanel No. 5 reinventó el perfume como firma olfativa personal, un aura invisible pero inconfundible. Su mayor genio fue comprender que la atemporalidad no es ausencia de cambio, sino un cambio tan profundo que se vuelve eterno. Un siglo después de su muerte, Chanel sigue siendo la casa que no envejece porque nunca tuvo edad. Es la marca que convirtió la sencillez en el máximo lujo.",
  },
  Gucci: {
    founded: 1921,
    founder: "Guccio Gucci",
    origin: "Florencia, Italia",
    keyMilestones: [
      { year: 1921, event: "Fundación como tienda de cuero y accesorios" },
      { year: 1953, event: "Creación del icónico loafer" },
      { year: 1969, event: "Bamboo bag revoluciona el universo de bolsos" },
      { year: 1994, event: "Tom Ford comienza su era maximalista" },
      { year: 2023, event: "Alessandro Michele refuerza código de identidad" },
    ],
    philosophy:
      "Gucci celebra la creatividad sin límites, la audacia visual y la subversión de códigos. Su filosofía contemporánea abraza la inclusión, la diversidad de géneros y la moda como expresión personal radical.",
    narrative: "Gucci comenzó como una artesanía florentina, una tienda donde los italianos ricos y tímidos compraban zapatos y cueros que susurraban discreción. Durante décadas, fue la marca de un establishment que no necesitaba gritar. Pero Tom Ford llegó en los 90s y cometió un acto de herejía: hizo que Gucci gritara. Transformó la discreción en maximalismo, el understatement en seducción descarada. Gucci se volvió erótica, audaz, exuberante. Alessandro Michele continuó esa revolución pero con una diferencia crucial: reemplazó la seducción heteronormativa por la ironía queer, la nostalgia y la subversión. Gucci se convirtió en la marca donde la alta moda finalmente reconoce que el lujo no pertenece a un género, a una edad, a una forma de ser. Es el lugar donde la élite y la contracultura descubrieron que podían coexistir.",
  },
  Zara: {
    founded: 1975,
    founder: "Amancio Ortega",
    origin: "A Coruña, España",
    keyMilestones: [
      { year: 1975, event: "Apertura de la primera tienda en A Coruña" },
      { year: 1989, event: "Expansión internacional a París" },
      { year: 2000, event: "Lanzamiento de tiendas flagships en ciudades clave" },
      { year: 2010, event: "Dominio del mercado de fast fashion en Europa" },
      { year: 2023, event: "Transformación digital y sostenibilidad acelerada" },
    ],
    philosophy:
      "Zara revolucionó el retail al reducir el tiempo entre diseño y venta. Su filosofía se centra en la velocidad de respuesta a tendencias, la accesibilidad y la democratización de la moda contemporánea.",
    narrative: "Zara nace de un acto de impaciencia. Amancio Ortega, un sastre gallego, observó que la industria de la moda operaba con la lógica de la banca: lenta, estratificada, desconectada de la realidad. Decidió desafiar esto con una herejía radical: ¿qué si la ropa pudiera fabricarse en semanas en lugar de meses? Zara no inventó fast fashion; inventó fast fashion democrático y reflexivo. No es una carrera hacia la velocidad sin sentido; es una sinfonía logística donde el diseño, la fabricación y la distribución danzan juntas. Mientras las casas de moda pensaban en colecciones, Zara pensaba en conversaciones. Escuchaba las calles, a los jóvenes, a las tendencias nacientes y respondía. Hoy, Zara representa algo más profundo que eficiencia comercial: es la prueba de que la moda contemporánea debe ser ágil, responsable y fundamentalmente democrática.",
  },
  Mango: {
    founded: 1984,
    founder: "Isak Andic",
    origin: "Barcelona, España",
    keyMilestones: [
      { year: 1984, event: "Primer Mango abre en Barcelona" },
      { year: 1992, event: "Expansión a Francia y Reino Unido" },
      { year: 2000, event: "Posicionamiento como marca de estilo accesible" },
      { year: 2010, event: "Presencia consolidada en 100+ países" },
      { year: 2023, event: "Énfasis en diseño cuidado y sostenibilidad" },
    ],
    philosophy:
      "Mango cree en la moda accesible con diseño sofisticado. Su filosofía combina la estética mediterránea con calidad asequible, ofreciendo piezas versátiles que reflejan elegancia cotidiana.",
    narrative: "Barcelona tiene una tradición de sofisticación silenciosa. Mango nace de esa sensibilidad: la idea de que el estilo no es un privilegio, sino una elección inteligente. Isak Andic comprendió algo que la industria tardó décadas en aprender: el buen gusto no es proporcional al precio. La verdadera elegancia es editorial, pensada, editorializada. Mango no persigue tendencias; las interpreta. Cada prenda responde a una lógica arquitectónica, a una idea de mujer contemporánea que viste sin ruido pero con presencia. A diferencia del fast fashion frenético, Mango respira. Sus colecciones son composiciones donde cada pieza dialoga con las otras. Hoy, con presencia en 100+ países, Mango mantiene la paradoja más difícil de la moda moderna: ser global sin perder su alma, ser accesible sin ser vulgar, ser contemporáneo sin ser efímero.",
  },
  "H&M": {
    founded: 1947,
    founder: "Erling Persson",
    origin: "Västerås, Suecia",
    keyMilestones: [
      { year: 1947, event: "Fundación como Hennes" },
      { year: 1968, event: "Fusión con Mauritz; nace H&M" },
      { year: 1980, event: "Expansión nórdica e internacional" },
      { year: 2000, event: "Liderazgo en fast fashion asequible global" },
      { year: 2023, event: "Inversión significativa en sostenibilidad" },
    ],
    philosophy:
      "H&M democratiza la moda moderna haciendo tendencias accesibles a todos. Su filosofía persigue crear moda a un precio justo, rápida y responsable, sin renunciar a estilo ni calidad.",
    narrative: "H&M representa un dilema fundacional de la modernidad: ¿cómo democratizar la moda sin destruirla? Desde Västerås, Erling Persson vislumbró un mundo donde la trabajadora de fábrica pudiera usar lo que usaba la esposa del magnate. No era caridad; era lógica. En los 90s y 2000s, mientras el lujo se encastillaba, H&M fue el detonador: pasarelas a tiendas en 15 días, tendencias a precios que no exigían hipoteca. Pero la velocidad tiene un precio, y recientemente el mundo se dio cuenta: ese precio lo pagan los trabajadores, el medio ambiente, nuestros mares de plástico. Hoy, H&M está en un viaje de redención difícil y necesario: mantener su promesa de accesibilidad mientras reinventa su ética. Es la marca que debe aprender que la verdadera democratización no es barata; tiene un costo moral que eventualmente debe pagarse.",
  },
  COS: {
    founded: 2007,
    founder: "H&M Group (marca hermana)",
    origin: "Londres, Reino Unido",
    keyMilestones: [
      { year: 2007, event: "Lanzamiento como marca experimental de H&M" },
      { year: 2010, event: "Consolidación de identidad minimalista" },
      { year: 2015, event: "Expansión editorial y colaboraciones creativas" },
      { year: 2019, event: "Posicionamiento como referente de slow fashion" },
      { year: 2023, event: "Liderazgo en minimalismo premium accesible" },
    ],
    philosophy:
      "COS nace como laboratorio creativo donde el diseño arquitectónico y la sostenibilidad convergen. Su filosofía rechaza lo superfluo, celebrando la belleza funcional, el detalle y la responsabilidad ambiental.",
    narrative: "COS es una paradoja: un laboratorio de H&M que rechaza la velocidad obsesiva de su matriz. Nacida en Londres como antítesis experimental, COS propone una idea radical en tiempos de aceleración: que el lujo accesible no requiere adoración al ídolo de la velocidad. Su DNA responde a principios casi arquitectónicos: geometría pura, paletas reducidas, materiales nobles de fuentes consideradas. COS entiende que la verdadera contemporaneidad no es lo que ocurre hoy, sino lo que perdurará mañana. Mientras la industria ama lo viral, COS ama lo duradero. Es la marca para intelectuales de la moda, para aquellos que entienden que el minimalismo es un acto político. Desde COS, se impugna la idea de que la accesibilidad exige frenesi; propone, en cambio, que el lujo democrático requiere pausa, reflexión, y un respeto casi devoto por los materiales y los procesos.",
  },
  "Massimo Dutti": {
    founded: 1985,
    founder: "Félix Martínez (diseñador original)",
    origin: "Barcelona, España",
    keyMilestones: [
      { year: 1985, event: "Fundación como marca contemporánea española" },
      { year: 2000, event: "Adquisición por Inditex (grupo Zara)" },
      { year: 2010, event: "Expansión internacional y reposicionamiento de lujo" },
      { year: 2015, event: "Consolidación como marca premium accesible" },
      { year: 2023, event: "Énfasis en tailoring y sostenibilidad artesanal" },
    ],
    philosophy:
      "Massimo Dutti fusiona elegancia tailored con sensibilidad contemporánea. Su filosofía celebra la sofisticación asequible, el detalle artesanal español y la atemporalidad como valor permanente en la moda.",
    narrative: "Hay en Barcelona una tradición de tailoring que entiende que la ropa es arquitectura del cuerpo. Massimo Dutti nace de esa escuela: donde cada costura es una decisión, donde cada hombro tiene una intención, donde la proporción es ley suprema. Félix Martínez construyó una marca que rechaza el grito. Massimo Dutti representa el principio español de que la verdadera elegancia nunca levanta la voz; simplemente existe, perfecta, silenciosa. Al ser absorbida por Inditex, muchos temieron su dilución. Pero ocurrió lo opuesto: Massimo Dutti se convirtió en el contramodelo de la velocidad dentro del grupo. Es la marca que enseña que el traje correcto puede cambiar tu relación contigo mismo. Hoy, representa algo poco frecuente en la moda democrática: la idea de que el verdadero lujo es invisible. No es lo que otros ven; es cómo te ves a ti mismo en el espejo después de ponértelo. Es la marca de la elegancia española moderna: sin aspavientos, sin marcas visibles, infinitamente sofisticada.",
  },
};

const brandTrendMap: Record<string, TrendAssociation[]> = {
  Prada: [
    { name: "Quiet Luxury", affinity: 94, stage: "Consolidada" },
    { name: "Minimalismo editorial", affinity: 88, stage: "Consolidada" },
    { name: "Heritage Fashion", affinity: 76, stage: "Crecimiento" },
  ],
  Dior: [
    { name: "Romantic Luxury", affinity: 91, stage: "Consolidada" },
    { name: "Alta costura", affinity: 86, stage: "Consolidada" },
    { name: "Feminine Codes", affinity: 73, stage: "Crecimiento" },
  ],
  Chanel: [
    { name: "Classic Luxury", affinity: 93, stage: "Consolidada" },
    { name: "Timeless Fashion", affinity: 89, stage: "Consolidada" },
    { name: "Soft Elegance", affinity: 70, stage: "Crecimiento" },
  ],
  Gucci: [
    { name: "Maximalismo", affinity: 87, stage: "Crecimiento" },
    { name: "Retro Revival", affinity: 81, stage: "Consolidada" },
    { name: "Gender Fluid Fashion", affinity: 74, stage: "Emergente" },
  ],
  Zara: [
    { name: "Fast Trends", affinity: 90, stage: "Consolidada" },
    { name: "Office Core", affinity: 78, stage: "Crecimiento" },
    { name: "Seasonal Essentials", affinity: 72, stage: "Crecimiento" },
  ],
  Mango: [
    { name: "Mediterranean Chic", affinity: 85, stage: "Crecimiento" },
    { name: "Quiet Luxury", affinity: 79, stage: "Consolidada" },
    { name: "Minimal Workwear", affinity: 74, stage: "Crecimiento" },
  ],
  "H&M": [
    { name: "Accessible Fashion", affinity: 84, stage: "Consolidada" },
    { name: "Streetwear", affinity: 75, stage: "Crecimiento" },
    { name: "Basics Revival", affinity: 69, stage: "Emergente" },
  ],
  COS: [
    { name: "Minimalismo premium", affinity: 89, stage: "Consolidada" },
    { name: "Architectural Fashion", affinity: 77, stage: "Crecimiento" },
    { name: "Quiet Luxury", affinity: 72, stage: "Consolidada" },
  ],
  "Massimo Dutti": [
    { name: "Smart Casual", affinity: 86, stage: "Consolidada" },
    { name: "Tailored Basics", affinity: 80, stage: "Crecimiento" },
    { name: "Old Money", affinity: 74, stage: "Crecimiento" },
  ],
};

function createBrandId(brand: string) {
  return brand.toLowerCase().replaceAll("&", "and").replaceAll(" ", "-");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES").format(value);
}

function getCategoryDescription(category: string) {
  if (category === "Luxury") {
    return "Marca de lujo con alta presencia editorial, fuerte identidad visual y gran impacto aspiracional.";
  }

  if (category === "Premium") {
    return "Marca con posicionamiento cuidado, estética refinada y una audiencia digital más segmentada.";
  }

  if (category === "Fast Fashion") {
    return "Marca con gran volumen de menciones, alta rotación de tendencias y fuerte conexión con consumo masivo.";
  }

  return "Marca analizada dentro del ecosistema digital de moda.";
}

function getSentimentText(sentiment: number) {
  if (sentiment >= 80) return "Muy positivo";
  if (sentiment >= 70) return "Estable";
  return "Mejorable";
}

function getLifecycle(score: number) {
  if (score >= 85) return "Dominancia estable";
  if (score >= 70) return "Crecimiento sostenido";
  if (score >= 55) return "Presencia competitiva";
  return "Visibilidad emergente";
}

function getForecastText(brand: BrandDetail, periodLabel: string) {
  if (brand.score >= 85) {
    return `${brand.name} presenta una posición dominante en el segmento ${brand.category}. Para el periodo ${periodLabel.toLowerCase()}, su combinación de popularidad y sentimiento indica alta estabilidad mediática.`;
  }

  if (brand.score >= 70) {
    return `${brand.name} mantiene un rendimiento sólido durante el periodo ${periodLabel.toLowerCase()}, aunque todavía tiene margen para reforzar su presencia frente a las marcas líderes.`;
  }

  return `${brand.name} muestra una presencia moderada. En el periodo ${periodLabel.toLowerCase()}, podría ganar relevancia si aumenta su asociación con tendencias emergentes.`;
}

function getTrendAssociations(brandName: string) {
  return (
    brandTrendMap[brandName] ?? [
      { name: "Moda contemporánea", affinity: 75, stage: "Crecimiento" },
      { name: "Estética digital", affinity: 68, stage: "Emergente" },
      { name: "Consumo aspiracional", affinity: 64, stage: "Crecimiento" },
    ]
  );
}

function getBrandHistory(brandName: string): BrandHistory | undefined {
  return brandHistoryMap[brandName];
}

function getChartValue(point: Record<string, string | number>, key: string) {
  const value = point[key];

  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;

  return 0;
}

function getChartLabel(point: Record<string, string | number>) {
  const value = point.month ?? point["Mes"] ?? point["mes"] ?? "";
  return String(value);
}

function getMetricDescription(metric: MetricId, brand: BrandDetail) {
  const descriptions = {
    mentions: `${brand.name} acumula ${formatNumber(
      brand.mentions
    )} menciones dentro del seguimiento actual. Este dato permite medir su presencia mediática reciente.`,
    popularity: `La popularidad de ${brand.name} es del ${brand.popularity}%. Se calcula comparando su volumen de menciones con la marca líder del ranking.`,
    sentiment: `El sentimiento de ${brand.name} es del ${brand.sentiment}%. Se estima a partir del tono de titulares y descripciones detectadas.`,
    lifecycle: `${brand.name} se encuentra en fase de ${getLifecycle(
      brand.score
    ).toLowerCase()}. Esta fase ayuda a interpretar si la marca está creciendo, consolidada o perdiendo visibilidad dentro del análisis.`,
    score: `El score global de ${brand.name} es ${brand.score}. Combina popularidad y sentimiento para resumir el rendimiento digital de la marca.`,
  };

  return descriptions[metric];
}

export default function BrandDetailPage() {
  const [newsData, setNewsData] = useState<NewsResponse | null>(null);
  const params = useParams();
  const id = String(params.id ?? "");

  const [data, setData] = useState<BrandMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodId>("6m");
  const [selectedMetric, setSelectedMetric] = useState<MetricId>("mentions");

  const brands = useMemo<BrandDetail[]>(() => {
    if (!data) return [];

    const maxMentions = data.ranking[0]?.mentions || 1;

    return data.ranking.map((brand, index) => {
      const popularity = Math.round((brand.mentions / maxMentions) * 100);
      const sentiment = data.averageSentiment;
      const score = Math.round((popularity + sentiment) / 2);

      return {
        id: createBrandId(brand.brand),
        name: brand.brand,
        category: brand.category,
        country: brandCountries[brand.brand] ?? "Global",
        mentions: brand.mentions,
        popularity,
        sentiment,
        score,
        rank: index + 1,
      };
    });
  }, [data]);

  const brand = brands.find((item) => item.id === id);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const metricsResult = await getBrandMetrics();
        setData(metricsResult);
      } catch (error) {
        console.error("Error cargando métricas de marca:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  useEffect(() => {
    if (!brand) return;

    async function loadNews() {
      try {
        const newsResult = await getNews(selectedPeriod, brand!.name);
        setNewsData(newsResult);
      } catch (error) {
        console.error("Error cargando noticias de marca:", error);
        setNewsData(null);
      }
    }

    loadNews();
  }, [brand, selectedPeriod]);

  const selectedPeriodData =
    periods.find((period) => period.id === selectedPeriod) ?? periods[2];

  const segmentBrands = useMemo(() => {
    if (!brand) return [];

    return brands
      .filter((item) => item.category === brand.category)
      .sort((a, b) => b.score - a.score);
  }, [brands, brand]);

  const trendAssociations = useMemo(() => {
    if (!brand) return [];
    return getTrendAssociations(brand.name);
  }, [brand]);

  const chartData = useMemo(() => {
    if (!data || !brand) return [];

    return data.chartData.map((point) => ({
      label: getChartLabel(point),
      value: Math.round(
        getChartValue(point, brand.name) * selectedPeriodData.multiplier
      ),
    }));
  }, [data, brand, selectedPeriodData.multiplier]);

  const relatedNews = useMemo(() => {
    if (!brand || !newsData?.articles) return [];

    // Determinar límite según periodo
    let limit = 6;
    if (selectedPeriod === "1m") {
      limit = 2;
    } else if (selectedPeriod === "3m") {
      limit = 4;
    } else if (selectedPeriod === "6m") {
      limit = 6;
    } else if (selectedPeriod === "12m") {
      limit = 10;
    }

    // Eliminar duplicados por title
    const uniqueArticles: NewsArticle[] = [];
    const seenTitles = new Set<string>();

    for (const article of newsData.articles) {
      const titleLower = article.title.toLowerCase().trim();
      if (!seenTitles.has(titleLower)) {
        seenTitles.add(titleLower);
        uniqueArticles.push(article);
      }
    }

    // Devolver según límite
    return uniqueArticles.slice(0, limit);
  }, [brand, newsData, selectedPeriod]);

  const maxChartValue = useMemo(() => {
    return Math.max(...chartData.map((item) => item.value), 1);
  }, [chartData]);

  if (loading) {
    return (
      <PageContainer>
        <section className="py-20">
          <div className="rounded-[28px] border border-[#eadbd4] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#8a2638]">
              Cargando detalle de marca...
            </p>
          </div>
        </section>
      </PageContainer>
    );
  }

  if (!brand) {
    return (
      <PageContainer>
        <section className="py-20">
          <Link
            href="/brands"
            className="mb-8 inline-flex rounded-full border border-[#eadbd4] bg-white px-5 py-3 text-sm font-semibold text-[#8a2638] shadow-sm transition hover:bg-[#171314] hover:text-white"
          >
            ← Volver a marcas
          </Link>

          <div className="rounded-[28px] border border-[#eadbd4] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#8a2638]">
              No se ha encontrado esta marca.
            </p>
          </div>
        </section>
      </PageContainer>
    );
  }

  const radarMetrics = [
    { label: "Presencia digital", value: brand.popularity },
    { label: "Sentimiento", value: brand.sentiment },
    { label: "Afinidad tendencias", value: trendAssociations[0]?.affinity ?? 70 },
    { label: "Estabilidad", value: Math.min(brand.score + 2, 99) },
    { label: "Impacto editorial", value: Math.min(brand.mentions / 10, 100) },
  ];

  return (
    <PageContainer>
      <section className="py-20">
        <Link
          href="/brands"
          className="mb-8 inline-flex rounded-full border border-[#eadbd4] bg-white px-5 py-3 text-sm font-semibold text-[#8a2638] shadow-sm transition hover:bg-[#171314] hover:text-white"
        >
          ← Volver a marcas
        </Link>

        <div className="mb-8 overflow-hidden rounded-[36px] border border-[#eadbd4] bg-[#fffdf9] p-8 shadow-[0_24px_70px_rgba(60,35,30,0.08)] md:p-12">
          <div className="mb-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
                Brand Intelligence Dashboard
              </p>

              <h1 className="font-serif text-6xl font-bold leading-[0.9] text-[#151111] md:text-7xl">
                {brand.name}
              </h1>

              <p className="mt-5 text-base text-[#6d6260]">
                {brand.country} · {brand.category} · #{brand.rank} en ranking
                global
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 lg:items-end">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#151111] text-3xl font-bold text-white">
                {brand.score}
              </div>

              <span className="rounded-full bg-[#f7ece8] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                {getLifecycle(brand.score)}
              </span>
            </div>
          </div>

          <p className="max-w-3xl text-base leading-8 text-[#6d6260]">
            {getCategoryDescription(brand.category)}
          </p>
        </div>

        <div className="sticky top-20 z-20 mb-10 rounded-[28px] border border-[#eadbd4] bg-white/90 p-4 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                    activeTab === tab.id
                      ? "bg-[#151111] text-white shadow-sm"
                      : "bg-[#f7ece8] text-[#8a2638] hover:bg-[#eadbd4]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "dashboard" && (
              <div className="flex flex-wrap gap-2">
                {periods.map((period) => (
                  <button
                    key={period.id}
                    type="button"
                    onClick={() => setSelectedPeriod(period.id)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      selectedPeriod === period.id
                        ? "bg-[#8a2638] text-white"
                        : "bg-[#fbf7f4] text-[#6d6260] hover:bg-[#f7ece8]"
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${selectedPeriod}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === "history" && (
              <div className="grid gap-8 lg:grid-cols-[1fr]">
                <article className="rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                    Trayectoria y legado
                  </p>

                  <h2 className="mb-6 font-serif text-3xl font-bold text-[#151111]">
                    Historia de {brand.name}
                  </h2>

                  <p className="mb-8 text-sm leading-7 text-[#6d6260]">
                    {getBrandHistory(brand.name)?.origin} · Fundada en{" "}
                    {getBrandHistory(brand.name)?.founded}
                  </p>

                  {/* Narrativa */}
                  <div className="mb-10 rounded-[24px] bg-[#fffdf9] p-6 border border-[#eadbd4]">
                    <p className="mb-4 text-sm leading-7 text-[#151111]">
                      {getBrandHistory(brand.name)?.narrative}
                    </p>
                  </div>

                  {/* Fundador */}
                  <div className="mb-10 space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                        Fundador
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#151111]">
                        {getBrandHistory(brand.name)?.founder}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Horizontal */}
                  <div className="mb-10">
                    <p className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                      Hitos clave
                    </p>

                    <div className="overflow-x-auto pb-2">
                      <div className="flex gap-4 min-w-max">
                        {getBrandHistory(brand.name)?.keyMilestones.map(
                          (milestone, index) => (
                            <div key={index} className="flex flex-col items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-[#8a2638] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {milestone.year}
                              </div>
                              <div className="text-center flex-shrink-0 w-32">
                                <p className="text-xs font-bold text-[#151111] mb-1">
                                  {milestone.year}
                                </p>
                                <p className="text-xs text-[#6d6260] leading-4">
                                  {milestone.event}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Filosofía */}
                  <div className="rounded-[24px] bg-[#f7ece8] p-6 border border-[#eadbd4]">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638] mb-3">
                      Filosofía de marca
                    </p>
                    <p className="text-sm leading-6 text-[#6d6260]">
                      {getBrandHistory(brand.name)?.philosophy}
                    </p>
                  </div>
                </article>

                <aside className="rounded-[32px] bg-[#151111] p-8 text-white shadow-xl">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#d9a7b0]">
                    Brand Heritage
                  </p>

                  <h2 className="mb-5 font-serif text-3xl font-bold">
                    Legado
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-bold text-[#e5a9b6] mb-2">
                        Años de trayectoria
                      </p>
                      <p className="text-3xl font-bold">
                        {new Date().getFullYear() -
                          (getBrandHistory(brand.name)?.founded ?? 2000)}
                      </p>
                    </div>

                    <div className="h-px bg-white/10"></div>

                    <div>
                      <p className="text-xs font-bold text-[#e5a9b6] mb-3">
                        Dimensiones clave
                      </p>
                      <ul className="space-y-2 text-sm text-white/70">
                        <li className="flex items-start gap-2">
                          <span className="text-[#e5a9b6] mt-1">•</span>
                          <span>
                            Fundación: {getBrandHistory(brand.name)?.founded}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#e5a9b6] mt-1">•</span>
                          <span>
                            Origen: {getBrandHistory(brand.name)?.origin}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#e5a9b6] mt-1">•</span>
                          <span>
                            Categoría: {brand.category}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#e5a9b6] mt-1">•</span>
                          <span>
                            País: {brand.country}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </aside>
              </div>
            )}

            {activeTab === "dashboard" && (
              <>
                {/* Overview */}
                <div className="mb-10 grid gap-5 md:grid-cols-5">
                  <button
                    onClick={() => setSelectedMetric("mentions")}
                    type="button"
                    className="text-left"
                  >
                    <MetricCard
                      active={selectedMetric === "mentions"}
                      label="Menciones"
                      value={formatNumber(
                        Math.round(
                          brand.mentions * selectedPeriodData.multiplier
                        )
                      )}
                      description="Noticias detectadas sobre la marca."
                    />
                  </button>

                  <button
                    onClick={() => setSelectedMetric("popularity")}
                    type="button"
                    className="text-left"
                  >
                    <MetricCard
                      active={selectedMetric === "popularity"}
                      label="Popularidad"
                      value={`${brand.popularity}%`}
                      description="Presencia relativa frente a la marca líder."
                    />
                  </button>

                  <button
                    onClick={() => setSelectedMetric("sentiment")}
                    type="button"
                    className="text-left"
                  >
                    <MetricCard
                      active={selectedMetric === "sentiment"}
                      label="Sentimiento"
                      value={`${brand.sentiment}%`}
                      description={`${getSentimentText(
                        brand.sentiment
                      )} según titulares.`}
                    />
                  </button>

                  <button
                    onClick={() => setSelectedMetric("lifecycle")}
                    type="button"
                    className="text-left"
                  >
                    <MetricCard
                      active={selectedMetric === "lifecycle"}
                      label="Lifecycle"
                      value={getLifecycle(brand.score)}
                      description="Fase actual dentro del análisis."
                    />
                  </button>

                  <button
                    onClick={() => setSelectedMetric("score")}
                    type="button"
                    className="text-left"
                  >
                    <article
                      className={`h-full rounded-[24px] border p-6 text-left text-white shadow-xl transition ${
                        selectedMetric === "score"
                          ? "border-[#e5a9b6] bg-[#8a2638]"
                          : "border-[#eadbd4] bg-[#151111]"
                      }`}
                    >
                      <p className="mb-3 text-sm font-semibold text-[#e5a9b6]">
                        Score global
                      </p>
                      <h2 className="text-4xl font-bold">{brand.score}</h2>
                      <p className="mt-4 text-sm leading-6 text-white/65">
                        Popularidad + sentimiento.
                      </p>
                    </article>
                  </button>
                </div>

                <div className="mb-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
                  <article className="rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                          Evolución temporal
                        </p>
                        <h2 className="font-serif text-3xl font-bold text-[#151111]">
                          Rendimiento de {brand.name}
                        </h2>
                      </div>

                      <span className="rounded-full bg-[#f7ece8] px-4 py-2 text-xs font-bold text-[#8a2638]">
                        {selectedPeriodData.label}
                      </span>
                    </div>

                    <div className="flex h-72 items-end gap-3 rounded-[26px] bg-[#fbf7f4] p-6">
                      {chartData.map((item, index) => {
                        const height = Math.max(
                          (item.value / maxChartValue) * 100,
                          8
                        );

                        return (
                          <div
                            key={`${item.label}-${index}`}
                            className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                          >
                            <motion.div
                              initial={{ height: 0 }}
                              whileInView={{ height: `${height}%` }}
                              viewport={{ once: true, amount: 0.4 }}
                              transition={{
                                duration: 0.8,
                                delay: index * 0.06,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="w-full rounded-t-2xl bg-gradient-to-t from-[#8a2638] to-[#e5a9b6]"
                            />

                            <div className="text-center">
                              <p className="text-xs font-bold text-[#151111]">
                                {item.value}
                              </p>
                              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6d6260]">
                                {item.label}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </article>

                  <aside className="rounded-[32px] bg-[#151111] p-8 text-white shadow-xl">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#d9a7b0]">
                      Métrica seleccionada
                    </p>

                    <h2 className="mb-5 font-serif text-3xl font-bold">
                      Lectura dinámica
                    </h2>

                    <p className="text-sm leading-7 text-white/70">
                      {getMetricDescription(selectedMetric, brand)}
                    </p>

                    <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
                      <p className="mb-2 text-sm font-bold text-[#e5a9b6]">
                        Periodo activo
                      </p>
                      <p className="text-sm text-white/70">
                        {selectedPeriodData.label}
                      </p>
                    </div>
                  </aside>
                </div>

                {/* Forecast + Comparison */}
                <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] mb-10">
                  <aside className="rounded-[32px] bg-[#151111] p-8 text-white shadow-xl">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#d9a7b0]">
                      Forecast Engine
                    </p>

                    <h2 className="mb-5 font-serif text-3xl font-bold">
                      Predicción analítica
                    </h2>

                    <p className="mb-8 text-sm leading-7 text-white/70">
                      {getForecastText(brand, selectedPeriodData.label)}
                    </p>

                    <DarkProgress
                      label="Confianza del modelo"
                      value={Math.min(brand.score + 2, 99)}
                    />
                  </aside>

                  <article className="rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                      Escenario previsto
                    </p>

                    <h2 className="mb-6 font-serif text-3xl font-bold text-[#151111]">
                      Proyección de {brand.name}
                    </h2>

                    <div className="grid gap-4 md:grid-cols-3">
                      <ScenarioCard
                        title="Crecimiento estimado"
                        value={`+${Math.max(4, Math.round(brand.score / 10))}%`}
                      />
                      <ScenarioCard
                        title="Riesgo de caída"
                        value={`${Math.max(2, 100 - brand.score)}%`}
                      />
                      <ScenarioCard
                        title="Estabilidad"
                        value={`${Math.min(brand.score + 2, 99)}%`}
                      />
                    </div>

                    <p className="mt-8 text-sm leading-7 text-[#6d6260]">
                      Esta predicción funciona como una simulación analítica basada
                      en score, sentimiento, popularidad y relación con tendencias
                      actuales. Sirve para mostrar cómo la plataforma podría apoyar
                      decisiones estratégicas en un entorno real.
                    </p>
                  </article>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1fr_1fr] mb-10">
                  <article className="rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                      Comparativa sectorial
                    </p>

                    <h2 className="mb-6 font-serif text-3xl font-bold text-[#151111]">
                      Ranking dentro de {brand.category}
                    </h2>

                    <div className="space-y-5">
                      {segmentBrands.map((item, index) => (
                        <Link
                          key={item.id}
                          href={`/brands/${item.id}`}
                          className="block rounded-2xl p-3 transition hover:bg-[#fbf7f4]"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#151111] text-xs font-bold text-white">
                                {index + 1}
                              </span>

                              <div>
                                <p className="font-bold text-[#151111]">
                                  {item.name}
                                </p>
                                <p className="text-xs text-[#6d6260]">
                                  {formatNumber(item.mentions)} menciones
                                </p>
                              </div>
                            </div>

                            <span className="font-bold text-[#8a2638]">
                              {item.score}
                            </span>
                          </div>

                          <div className="h-2 rounded-full bg-[#f0e3de]">
                            <div
                              className="h-2 rounded-full bg-[#151111]"
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </article>

                  <aside className="rounded-[32px] bg-[#151111] p-8 text-white shadow-xl">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#d9a7b0]">
                      Resumen ejecutivo
                    </p>

                    <h2 className="mb-6 font-serif text-3xl font-bold">
                      Datos clave
                    </h2>

                    <div className="space-y-5">
                      <DarkProgress label="Popularidad" value={brand.popularity} />
                      <DarkProgress label="Sentimiento" value={brand.sentiment} />
                      <DarkProgress label="Score global" value={brand.score} />
                    </div>
                  </aside>
                </div>

                <BrandRadar metrics={radarMetrics} />

                {/* Tendencias */}
                <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                  <TrendPanel trends={trendAssociations} />

                  <article className="rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                      Lectura analítica
                    </p>

                    <h2 className="mb-5 font-serif text-3xl font-bold text-[#151111]">
                      Insights sobre {brand.name}
                    </h2>

                    <div className="space-y-5 text-sm leading-7 text-[#6d6260]">
                      <p>
                        {brand.name} se asocia principalmente con{" "}
                        <strong className="text-[#151111]">
                          {trendAssociations[0]?.name}
                        </strong>{" "}
                        y{" "}
                        <strong className="text-[#151111]">
                          {trendAssociations[1]?.name}
                        </strong>
                        .
                      </p>

                      <p>
                        Esta relación permite interpretar su posicionamiento dentro
                        del segmento {brand.category} y observar qué territorios
                        estéticos refuerzan su identidad digital.
                      </p>

                      <p>
                        La afinidad con tendencias consolidadas ayuda a explicar su
                        estabilidad, mientras que las tendencias emergentes pueden
                        anticipar oportunidades de crecimiento.
                      </p>
                    </div>
                  </article>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </section>


    </PageContainer>
  );
}

function MetricCard({
  label,
  value,
  description,
  active,
}: {
  label: string;
  value: string;
  description: string;
  active?: boolean;
}) {
  return (
    <article
      className={`h-full rounded-[24px] border p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
        active
          ? "border-[#8a2638] bg-[#fff7f5]"
          : "border-[#eadbd4] bg-white"
      }`}
    >
      <p className="mb-3 text-sm font-semibold text-[#8a2638]">{label}</p>
      <h2 className="text-3xl font-bold text-[#151111]">{value}</h2>
      <p className="mt-4 text-sm leading-6 text-[#6d6260]">{description}</p>
    </article>
  );
}

function TrendPanel({ trends }: { trends: TrendAssociation[] }) {
  return (
    <article className="rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
        Tendencias asociadas
      </p>

      <h2 className="mb-6 font-serif text-3xl font-bold text-[#151111]">
        Territorios estéticos conectados
      </h2>

      <div className="space-y-5">
        {trends.map((trend) => (
          <div key={trend.name}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-[#151111]">{trend.name}</p>
                <p className="text-xs font-semibold text-[#8a2638]">
                  {trend.stage}
                </p>
              </div>

              <span className="text-sm font-bold text-[#151111]">
                {trend.affinity}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#f0e3de]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${trend.affinity}%` }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-[#8a2638]"
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function BrandRadar({
  metrics,
}: {
  metrics: { label: string; value: number }[];
}) {
  return (
    <article className="rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
        Radar de marca
      </p>

      <h2 className="mb-6 font-serif text-3xl font-bold text-[#151111]">
        Perfil estratégico
      </h2>

      <div className="grid gap-5 md:grid-cols-5">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[24px] bg-[#fbf7f4] p-5">
            <div className="mb-4 flex h-28 items-end rounded-2xl bg-white p-3">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${metric.value}%` }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-t-xl bg-[#151111]"
              />
            </div>

            <p className="text-sm font-bold text-[#151111]">{metric.label}</p>
            <p className="mt-1 text-xs font-semibold text-[#8a2638]">
              {Math.round(metric.value)}%
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function ScenarioCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-[#fbf7f4] p-6">
      <p className="mb-3 text-sm font-semibold text-[#8a2638]">{title}</p>
      <p className="text-4xl font-bold text-[#151111]">{value}</p>
    </div>
  );
}

function DarkProgress({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-[#e5a9b6]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}