export interface TimelineEvent {
  id: string;
  name: string;
  category: string;
  state: "Emergente" | "En crecimiento" | "Consolidada" | "En descenso" | "Estable";
  popularity: number;
  growth: number | null;
  date: string;
  period: string;
  description: string;
  explanation?: string;
  brands: string[];
  metrics: {
    mentions: number;
    engagement?: number;
    sentiment?: number;
    reach?: string;
  };
  timeline?: Array<{
    month: string;
    value: number;
  }>;
}

export const trendsTimelineData: TimelineEvent[] = [
  {
    id: "quiet-luxury",
    name: "Quiet Luxury",
    category: "Estética",
    state: "Consolidada",
    popularity: 92,
    growth: 18,
    date: "Enero 2024",
    period: "2024 - Presente",
    description:
      "Elegancia discreta basada en materiales premium y ausencia de logos visibles.",
    explanation:
      "El 'Quiet Luxury' representa una reacción al consumismo ostentoso. Se caracteriza por prendas de corte impecable, materiales de altísima calidad (cachemir, seda, lino), paletas de colores neutros y la ausencia total de logos grandes. Marcas como Chanel, Prada y Hermès lo promueven como el nuevo símbolo de estatus. Para el sector, esto significa que la calidad silenciosa es más valorada que la visibilidad.",
    brands: ["Chanel", "Prada", "Hermès", "The Row", "COS"],
    metrics: {
      mentions: 45200,
      engagement: 8.4,
      sentiment: 87,
      reach: "28.5M",
    },
    timeline: [
      { month: "Ene", value: 45 },
      { month: "Feb", value: 58 },
      { month: "Mar", value: 72 },
      { month: "Abr", value: 81 },
      { month: "May", value: 88 },
      { month: "Jun", value: 92 },
    ],
  },
  {
    id: "coquette-aesthetic",
    name: "Coquette Aesthetic",
    category: "Microtendencia",
    state: "En crecimiento",
    popularity: 84,
    growth: 42,
    date: "Febrero 2024",
    period: "2024 - Presente",
    description:
      "Feminidad romántica con lazos, encajes y tonos pastel. Dominante en redes sociales.",
    explanation:
      "La tendencia 'Coquette' surgió como un movimiento de reclamación de la feminidad tradicional. Caracterizada por lazos, encajes, volantes, tonos pastel (rosa baby, blanco roto, nude) y siluetas románticas. Tiene enorme presencia en TikTok e Instagram, especialmente entre audiencias Gen-Z. Marcas como Miu Miu, Zara e incluso Dolce & Gabbana han apostado por este aesthetic. Su crecimiento es acelerado pero podría ser volátil.",
    brands: ["Miu Miu", "Zara", "Sandro", "Dolce & Gabbana", "Mango"],
    metrics: {
      mentions: 78900,
      engagement: 12.1,
      sentiment: 79,
      reach: "42.3M",
    },
    timeline: [
      { month: "Feb", value: 32 },
      { month: "Mar", value: 48 },
      { month: "Abr", value: 61 },
      { month: "May", value: 75 },
      { month: "Jun", value: 84 },
    ],
  },
  {
    id: "old-money-style",
    name: "Old Money Style",
    category: "Estética",
    state: "Consolidada",
    popularity: 88,
    growth: 22,
    date: "Octubre 2023",
    period: "2023 - Presente",
    description:
      "Elegancia clásica con sastrería, neutralidad y referencias a lujo tradicional.",
    explanation:
      "El 'Old Money' es la respuesta aspiracional a la clase alta tradicional. Combina blazers oversized, pantalones de corte impecable, tonos neutros (navy, beige, blanco, gris), prendas de calidad superior y un cierto 'understatement'. Inspirado en figuras como Jackie Kennedy, fue popularizado nuevamente por series como 'Succession'. Es ideal para profesionales y personas que buscan autoridad sin ostentación.",
    brands: ["Ralph Lauren", "Loro Piana", "Brunello Cucinelli", "Chanel"],
    metrics: {
      mentions: 52100,
      engagement: 9.2,
      sentiment: 85,
      reach: "31.2M",
    },
    timeline: [
      { month: "Oct", value: 58 },
      { month: "Nov", value: 68 },
      { month: "Dic", value: 76 },
      { month: "Ene", value: 82 },
      { month: "Feb", value: 88 },
      { month: "Mar", value: 88 },
    ],
  },
  {
    id: "denim-total-look",
    name: "Denim Total Look",
    category: "Prenda clave",
    state: "En crecimiento",
    popularity: 76,
    growth: 31,
    date: "Marzo 2024",
    period: "2024 - Presente",
    description:
      "Uso del denim como protagonista absoluto del outfit, en múltiples tonos y texturas.",
    explanation:
      "El denim pasó de ser una prenda complementaria a ser el protagonista del look. El 'total denim look' implica combinar chaqueta, pantalones, faldas e incluso accesorios en jean, jugando con diferentes lavados (claro, oscuro, desgastado). Este trend es democrático - aplica desde el denim premium (Levi's, AG Jeans) hasta cadenas de moda rápida. Es práctico, versátil y proyecta autenticidad.",
    brands: ["Zara", "H&M", "Levi's", "Diesel", "Mango"],
    metrics: {
      mentions: 63400,
      engagement: 10.5,
      sentiment: 81,
      reach: "38.9M",
    },
    timeline: [
      { month: "Mar", value: 28 },
      { month: "Abr", value: 42 },
      { month: "May", value: 58 },
      { month: "Jun", value: 76 },
    ],
  },
  {
    id: "streetwear-premium",
    name: "Streetwear Premium",
    category: "Estilo urbano",
    state: "Consolidada",
    popularity: 82,
    growth: 19,
    date: "Septiembre 2023",
    period: "2023 - Presente",
    description:
      "Fusión de códigos urbanos con acabados de lujo. Comodidad y aspiración.",
    explanation:
      "El streetwear premium representa la convergencia de la comodidad urbana con la calidad lujo. Combina sneakers de diseador, sudaderas oversized, bolsas minimalistas y siluetas amplias, pero con acabados, materiales y construcción de marcas premium (Gucci, Prada, Balenciaga). Desde los 2010s, lo 'cool' dejó de estar en la sofisticación para residir en la autenticidad urbana. Este trend es duradero porque equilibra funcionalidad y aspiración.",
    brands: ["Gucci", "Prada", "Balenciaga", "Fear of God", "Adidas"],
    metrics: {
      mentions: 71200,
      engagement: 11.3,
      sentiment: 83,
      reach: "44.5M",
    },
    timeline: [
      { month: "Sep", value: 52 },
      { month: "Oct", value: 61 },
      { month: "Nov", value: 70 },
      { month: "Dic", value: 77 },
      { month: "Ene", value: 80 },
      { month: "Feb", value: 82 },
      { month: "Mar", value: 82 },
    ],
  },
  {
    id: "minimalismo-calido",
    name: "Minimalismo Cálido",
    category: "Estética",
    state: "Consolidada",
    popularity: 79,
    growth: 14,
    date: "Junio 2023",
    period: "2023 - Presente",
    description:
      "Colores neutros, cortes limpios y prendas versátiles. Funcionalidad editorial.",
    explanation:
      "El minimalismo evolucionó hacia una versión más 'cálida' y accesible. Mantiene la filosofía de menos es más, pero incorpora texturas (lino, algodón grueso, punto), tonos tierra (beige, terracota, gris cálido) y formas simples pero confortables. Es perfecto para armarios cápsula y personas que buscan versatilidad sin sacrificar carácter. Marcas como COS, Uniqlo y Massimo Dutti lo dominan.",
    brands: ["COS", "Uniqlo", "Massimo Dutti", "Mango", "Arket"],
    metrics: {
      mentions: 48900,
      engagement: 8.9,
      sentiment: 84,
      reach: "29.6M",
    },
    timeline: [
      { month: "Jun", value: 62 },
      { month: "Jul", value: 68 },
      { month: "Ago", value: 74 },
      { month: "Sep", value: 79 },
      { month: "Oct", value: 79 },
      { month: "Nov", value: 79 },
      { month: "Dic", value: 79 },
    ],
  },
  {
    id: "metalizados",
    name: "Acabados Metalizados",
    category: "Color / Textura",
    state: "Emergente",
    popularity: 71,
    growth: 38,
    date: "Abril 2024",
    period: "2024 - Presente",
    description:
      "Brillo plateado y dorado en prendas y accesorios. Presencia fuerte en night looks.",
    explanation:
      "Los acabados metalizados resurgen especialmente en contextos de celebración y eventos nocturnos. Técnicas como el plié metalizado (tela con efecto brillante), estampados foil y accesorios plateados o dorados aparecen en colecciones resort de marcas premium. Es una tendencia cíclica que gana fuerza a medida que nos acercamos a épocas festivas. Alto potencial de crecimiento en los próximos meses.",
    brands: ["Dior", "Prada", "Zara", "Mango", "H&M"],
    metrics: {
      mentions: 35600,
      engagement: 7.8,
      sentiment: 76,
      reach: "22.1M",
    },
    timeline: [
      { month: "Abr", value: 18 },
      { month: "May", value: 35 },
      { month: "Jun", value: 71 },
    ],
  },
  {
    id: "sastreria-relajada",
    name: "Sastrería Relajada",
    category: "Silueta",
    state: "En crecimiento",
    popularity: 77,
    growth: 29,
    date: "Febrero 2024",
    period: "2024 - Presente",
    description:
      "Blazers amplios y pantalones fluidos. Formalidad reinterpretada con comodidad.",
    explanation:
      "La sastrería tradicional fue decodificada para la vida contemporánea. Ya no se trata de estructuras rígidas, sino de blazers oversized, pantalones con caída fluida, y conjuntos que funcionan tanto en oficina como fuera. Diseñadores como Prada y COS lo dominan. Refleja el trabajo híbrido: necesitamos verse profesional pero sentirse cómodo. Tendencia con gran potencial de permanencia.",
    brands: ["Prada", "COS", "Massimo Dutti", "Chanel", "Mango"],
    metrics: {
      mentions: 56700,
      engagement: 9.7,
      sentiment: 82,
      reach: "33.8M",
    },
    timeline: [
      { month: "Feb", value: 22 },
      { month: "Mar", value: 41 },
      { month: "Abr", value: 58 },
      { month: "May", value: 71 },
      { month: "Jun", value: 77 },
    ],
  },
];

export const categories = [
  "Todas",
  "Estética",
  "Microtendencia",
  "Prenda clave",
  "Color / Textura",
  "Estilo urbano",
  "Silueta",
];

export const states = [
  "Todos",
  "Emergente",
  "En crecimiento",
  "Consolidada",
  "En descenso",
];

export function getStateColor(state: string) {
  switch (state) {
    case "Emergente":
      return { bg: "bg-[#f7ece8]", text: "text-[#8a2638]" };
    case "En crecimiento":
      return { bg: "bg-[#151111]", text: "text-white" };
    case "Consolidada":
      return { bg: "bg-[#eadbd4]", text: "text-[#151111]" };
    case "En descenso":
      return { bg: "bg-[#fbf7f4]", text: "text-[#6d6260]" };
    default:
      return { bg: "bg-[#f0e3de]", text: "text-[#6d6260]" };
  }
}

export function getStateIcon(state: string) {
  switch (state) {
    case "Emergente":
      return "✨";
    case "En crecimiento":
      return "📈";
    case "Consolidada":
      return "⭐";
    case "En descenso":
      return "📉";
    default:
      return "•";
  }
}
