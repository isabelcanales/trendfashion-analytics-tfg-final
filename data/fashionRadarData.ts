export type FashionEvent = {
  name: string;
  category: string;
  location: string;
  day: string;
  month: string;
  year: string;
  description: string;
  relevanceScore: number;
  source: string;
};

export type FashionResource = {
  title: string;
  type: "Libro" | "Revista" | "Recurso";
  category: string;
  description: string;
  score: number;
  metrics: {
    relevance: number;
    popularity: number;
    professionalUse: number;
  };
  source: string;
};

export const fashionEvents: FashionEvent[] = [
  {
    name: "New York Fashion Week",
    category: "Fashion Week",
    location: "Nueva York, Estados Unidos",
    day: "11",
    month: "Feb",
    year: "2026",
    description:
      "Evento internacional clave para analizar moda comercial, street style, cobertura mediática y tendencias globales de temporada.",
    relevanceScore: 94,
    source: "Dataset curado de eventos internacionales de moda",
  },
  {
    name: "Madrid Fashion Week",
    category: "Fashion Week",
    location: "Madrid, España",
    day: "15",
    month: "Feb",
    year: "2026",
    description:
      "Evento relevante dentro del mercado español para seguir diseñadores nacionales, marcas emergentes y propuestas editoriales locales.",
    relevanceScore: 87,
    source: "Dataset curado de eventos nacionales de moda",
  },
  {
    name: "London Fashion Week",
    category: "Fashion Week",
    location: "Londres, Reino Unido",
    day: "19",
    month: "Feb",
    year: "2026",
    description:
      "Semana de la moda reconocida por su enfoque creativo, nuevas firmas, propuestas experimentales y análisis de tendencias emergentes.",
    relevanceScore: 92,
    source: "Dataset curado de eventos internacionales de moda",
  },
  {
    name: "Milan Fashion Week",
    category: "Fashion Week",
    location: "Milán, Italia",
    day: "25",
    month: "Feb",
    year: "2026",
    description:
      "Evento clave para estudiar firmas italianas, lujo, prêt-à-porter, posicionamiento de marca y estética de temporada.",
    relevanceScore: 96,
    source: "Dataset curado de eventos internacionales de moda",
  },
  {
    name: "Paris Fashion Week",
    category: "Fashion Week",
    location: "París, Francia",
    day: "03",
    month: "Mar",
    year: "2026",
    description:
      "Uno de los eventos más influyentes del calendario de moda, especialmente útil para analizar lujo, alta costura y tendencias editoriales.",
    relevanceScore: 98,
    source: "Dataset curado de eventos internacionales de moda",
  },
  {
    name: "Copenhagen Fashion Week",
    category: "Sostenibilidad",
    location: "Copenhague, Dinamarca",
    day: "27",
    month: "Ene",
    year: "2026",
    description:
      "Evento destacado por su vínculo con sostenibilidad, diseño nórdico, innovación responsable y nuevos modelos de consumo en moda.",
    relevanceScore: 89,
    source: "Dataset curado de eventos de sostenibilidad y moda",
  },
  {
    name: "Pitti Uomo",
    category: "Menswear",
    location: "Florencia, Italia",
    day: "13",
    month: "Ene",
    year: "2026",
    description:
      "Feria internacional centrada en moda masculina, sastrería, lifestyle, marcas premium y tendencias comerciales del sector.",
    relevanceScore: 91,
    source: "Dataset curado de ferias profesionales de moda",
  },
  {
    name: "Première Vision Paris",
    category: "Industria textil",
    location: "París, Francia",
    day: "10",
    month: "Feb",
    year: "2026",
    description:
      "Feria profesional orientada a tejidos, materiales, proveedores, innovación textil y tendencias de producción para la industria moda.",
    relevanceScore: 90,
    source: "Dataset curado de ferias profesionales de moda",
  },
  {
    name: "Met Gala",
    category: "Cultura y moda",
    location: "Nueva York, Estados Unidos",
    day: "04",
    month: "May",
    year: "2026",
    description:
      "Evento cultural de gran impacto mediático donde moda, celebridades, lujo y narrativa visual generan conversación global.",
    relevanceScore: 95,
    source: "Dataset curado de eventos culturales vinculados a moda",
  },
  {
    name: "Graduate Fashion Week",
    category: "Talento emergente",
    location: "Londres, Reino Unido",
    day: "12",
    month: "Jun",
    year: "2026",
    description:
      "Evento enfocado en talento joven, escuelas de diseño, nuevas propuestas creativas y detección de perfiles emergentes en moda.",
    relevanceScore: 84,
    source: "Dataset curado de eventos de formación y talento",
  },
];

export const fashionResources: FashionResource[] = [
  {
    title: "The Little Dictionary of Fashion",
    type: "Libro",
    category: "Historia y estilo",
    description:
      "Obra clásica sobre elegancia, estilo y fundamentos del vestir, útil para comprender la moda desde una visión editorial e histórica.",
    score: 94,
    metrics: {
      relevance: 96,
      popularity: 91,
      professionalUse: 88,
    },
    source: "Selección curada de bibliografía de moda",
  },
  {
    title: "Fashionopolis",
    type: "Libro",
    category: "Sostenibilidad",
    description:
      "Libro centrado en el impacto de la industria de la moda y en la transformación hacia modelos más sostenibles y responsables.",
    score: 91,
    metrics: {
      relevance: 94,
      popularity: 87,
      professionalUse: 92,
    },
    source: "Selección curada de bibliografía de moda",
  },
  {
    title: "The Fashion Business Manual",
    type: "Libro",
    category: "Negocio de moda",
    description:
      "Manual visual orientado a entender procesos de negocio, branding, desarrollo de producto, comunicación y gestión dentro del sector moda.",
    score: 93,
    metrics: {
      relevance: 94,
      popularity: 89,
      professionalUse: 95,
    },
    source: "Selección curada de bibliografía profesional",
  },
  {
    title: "Vogue",
    type: "Revista",
    category: "Editorial y tendencias",
    description:
      "Publicación internacional de referencia para moda, lujo, editoriales visuales, celebridades y cobertura de pasarelas.",
    score: 98,
    metrics: {
      relevance: 99,
      popularity: 98,
      professionalUse: 95,
    },
    source: "Selección curada de medios editoriales de moda",
  },
  {
    title: "Business of Fashion",
    type: "Revista",
    category: "Industria y estrategia",
    description:
      "Fuente especializada en negocio de moda, estrategia, retail, lujo, marcas, tecnología y análisis profesional del sector.",
    score: 97,
    metrics: {
      relevance: 98,
      popularity: 94,
      professionalUse: 99,
    },
    source: "Selección curada de medios profesionales de moda",
  },
  {
    title: "WWD",
    type: "Revista",
    category: "Noticias de industria",
    description:
      "Medio centrado en actualidad profesional de moda, retail, lujo, movimientos de marcas, desfiles y evolución del mercado.",
    score: 95,
    metrics: {
      relevance: 96,
      popularity: 92,
      professionalUse: 97,
    },
    source: "Selección curada de medios profesionales de moda",
  },
  {
    title: "Vogue Runway",
    type: "Recurso",
    category: "Pasarelas e inspiración",
    description:
      "Recurso visual de referencia para consultar colecciones, desfiles, tendencias de temporada y dirección estética de firmas internacionales.",
    score: 96,
    metrics: {
      relevance: 98,
      popularity: 95,
      professionalUse: 94,
    },
    source: "Selección curada de recursos digitales de moda",
  },
  {
    title: "Tagwalk",
    type: "Recurso",
    category: "Análisis de tendencias",
    description:
      "Herramienta digital útil para investigar colecciones, colores, prendas, estilos y patrones visuales dentro de pasarelas internacionales.",
    score: 93,
    metrics: {
      relevance: 95,
      popularity: 88,
      professionalUse: 94,
    },
    source: "Selección curada de herramientas de análisis visual",
  },
  {
    title: "WGSN",
    type: "Recurso",
    category: "Forecasting",
    description:
      "Plataforma profesional enfocada en predicción de tendencias, consumo, color, comportamiento de mercado y dirección creativa.",
    score: 97,
    metrics: {
      relevance: 99,
      popularity: 91,
      professionalUse: 99,
    },
    source: "Selección curada de herramientas profesionales de moda",
  },
  {
    title: "Domestika Fashion Courses",
    type: "Recurso",
    category: "Formación creativa",
    description:
      "Plataforma de cursos creativos con formación en diseño de moda, ilustración, estilismo, patronaje, branding y dirección visual.",
    score: 92,
    metrics: {
      relevance: 91,
      popularity: 94,
      professionalUse: 88,
    },
    source: "Selección curada de recursos formativos",
  },
  {
    title: "Fashionary",
    type: "Recurso",
    category: "Diseño y recursos",
    description:
      "Recurso especializado para diseñadores de moda con plantillas, guías, cuadernos de bocetos y materiales para conceptualizar colecciones.",
    score: 90,
    metrics: {
      relevance: 93,
      popularity: 86,
      professionalUse: 91,
    },
    source: "Selección curada de recursos de diseño",
  },
  {
    title: "CLO 3D",
    type: "Recurso",
    category: "Diseño digital 3D",
    description:
      "Software utilizado para crear prendas digitales, visualizar patrones, simular tejidos y acelerar procesos de diseño dentro de la industria.",
    score: 94,
    metrics: {
      relevance: 95,
      popularity: 90,
      professionalUse: 97,
    },
    source: "Selección curada de herramientas de diseño digital",
  },
];