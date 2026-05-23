import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type NewsApiArticle = {
  source?: {
    id?: string | null;
    name?: string;
  };
  author?: string | null;
  title?: string;
  description?: string;
  url?: string;
  urlToImage?: string;
  publishedAt?: string;
  content?: string;
};

type NewsApiResponse = {
  status: string;
  totalResults?: number;
  articles?: NewsApiArticle[];
  message?: string;
  code?: string;
};

// Función para crear slug a partir del título
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Función para guardar o actualizar noticia en BD
async function saveNews(article: NewsApiArticle) {
  if (!article.url || !article.title) return null;

  try {
    const slug = createSlug(article.title);

    const news = await prisma.news.upsert({
      where: { url: article.url },
      update: {
        title: article.title,
        description: article.description || null,
        content: article.content || null,
        urlToImage: article.urlToImage || null,
        source: article.source?.name || null,
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
      },
      create: {
        title: article.title,
        description: article.description || null,
        content: article.content || null,
        url: article.url,
        urlToImage: article.urlToImage || null,
        slug,
        source: article.source?.name || null,
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
      },
    });

    return news;
  } catch (error) {
    console.error("Error saving news:", error);
    return null;
  }
}

const fallbackArticles: NewsApiArticle[] = [
  {
    source: { id: null, name: "TrendFashion Analytics" },
    author: "TrendFashion Editorial",
    title: "Quiet Luxury: la estética que sigue dominando el sector moda",
    description:
      "El lujo discreto continúa ganando presencia en marcas premium y luxury, impulsado por prendas atemporales, colores neutros y ausencia de logos visibles. Esta tendencia representa un alejamiento radical de la ostentación visual, priorizando la calidad artesanal, los materiales nobles y el refinamiento sutil como símbolos de estatus.",
    url: "/news/quiet-luxury-la-estetica-que-sigue-dominando-el-sector-moda",
    urlToImage:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
    content:
      "El quiet luxury se consolida como una de las tendencias más relevantes dentro del ecosistema moda. A diferencia del consumo aspiracional tradicional, esta estética rechaza los logos prominentes y busca la excelencia a través de la sutileza. Las paletas cromáticas neutras—beige, gris, blanco roto—se combinan con tejidos premium, confección impecable y detalles que solo el ojo educado puede apreciar. Marcas como Prada, The Row y Jil Sander lideran esta revolución silenciosa que está redefiniendo qué significa estar a la moda en 2026.",
  },
  {
    source: { id: null, name: "TrendFashion Analytics" },
    author: "TrendFashion Editorial",
    title: "Las marcas de lujo refuerzan su presencia digital y editorial",
    description:
      "Firmas como Prada, Gucci, Dior y Chanel mantienen una fuerte presencia mediática gracias a colecciones ambiciosas, campañas experimentales y estrategias de contenido editorial sofisticadas. Las redes sociales y plataformas digitales se han convertido en escaparates alternativos donde el lujo experimenta nuevas formas de comunicación.",
    url: "/news/las-marcas-de-lujo-refuerzan-su-presencia-digital",
    urlToImage:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
    content:
      "Las marcas de lujo siguen ocupando una posición destacada dentro de la conversación digital de moda, adaptando sus narrativas a nuevos formatos de contenido. Desde desfiles virtuales hasta colaboraciones con artistas visuales, estas casas han entendido que la narrativa es tan importante como el producto. Prada invierte en documentales sobre su proceso creativo, Dior experimenta con realidad aumentada en sus tiendas, y Chanel mantiene su posición de autoridad editorial a través de publicaciones de lujo producidas internamente. Esta transformación digital no diluye el aura de exclusividad, sino que la amplifica a través de un acceso curado y controlado.",
  },
  {
    source: { id: null, name: "TrendFashion Analytics" },
    author: "TrendFashion Editorial",
    title: "El streetwear premium redefine los códigos de las nuevas generaciones",
    description:
      "La mezcla de códigos urbanos auténticos, prendas versátiles y acabados premium impulsa una de las tendencias con mayor crecimiento visual y comercial. Esta fusión rompe las barreras entre el deporte, la calle y el lujo, creando un nuevo territorio estético.",
    url: "/news/el-streetwear-premium-gana-terreno-entre-las-nuevas-generaciones",
    urlToImage:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1600&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
    content:
      "El streetwear premium combina comodidad, estética urbana y referencias de lujo de forma orgánica. Marcas como Off-White, Fear of God y colaboraciones entre diseñadores tradicionales y marcas deportivas están democratizando el acceso al lujo. Esta tendencia refleja un cambio generacional donde la autenticidad y la funcionalidad comparten protagonismo con la herencia design. Las zapatillas de alta tecnología se emparejan con pantalones tailored; las sudaderas de algodón premium se estilzan como prendas de pasarela. El resultado es una moda más inclusiva, menos pretenciosa y profundamente conectada con la realidad de cómo viste la generación digital.",
  },
  {
    source: { id: null, name: "TrendFashion Analytics" },
    author: "TrendFashion Editorial",
    title: "La moda sostenible se integra como eje estratégico del sector",
    description:
      "La sostenibilidad, los materiales responsables y el consumo consciente dejan de ser tendencia para convertirse en requisito fundamental. Transparencia en cadenas de suministro, certificaciones ambientales y modelos de producción circular redefinen las prioridades de marcas y consumidores.",
    url: "/news/la-moda-sostenible-gana-peso-en-el-analisis-de-tendencias",
    urlToImage:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1600&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
    content:
      "La sostenibilidad se mantiene como uno de los ejes estratégicos del sector moda, trascendiendo la narrativa de nichos. Desde grandes conglomerados hasta diseñadores independientes, todos integran consideraciones ambientales en sus decisiones creativas. Esto incluye la adopción de materiales innovadores como cuero de hongos, fibras de algas y poliésteres reciclados; la reducción de desperdicio en procesos de producción; y la creación de modelos de moda circular donde las prendas pueden ser devueltas, reparadas y reinventadas. Legislaciones como la Ley de Economía Circular Europea aceleran esta transformación, no como opción sino como obligación. Consumidores más informados exigen traceabilidad, justicia laboral y transparencia ambiental, redefiniéndose a sí mismos como agentes de cambio a través de sus decisiones de compra.",
  },
  {
    source: { id: null, name: "TrendFashion Analytics" },
    author: "TrendFashion Editorial",
    title: "Las pasarelas internacionales evolucionan como plataformas de reinvención",
    description:
      "Fashion Weeks como París, Milán, Londres y Nueva York continúan siendo referentes para detectar tendencias, experimentar con siluetas y articular narrativas visuales complejas. Pero su rol está evolucionando hacia formatos más democráticos y digitales.",
    url: "/news/las-pasarelas-internacionales-marcan-las-claves-de-temporada",
    urlToImage:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
    content:
      "Las pasarelas internacionales siguen siendo laboratorios de creatividad donde diseñadores experimentan con silhuetas, materiales y conceptos que eventualmente filtraran en el mercado masivo. Sin embargo, su estructura rígida está siendo cuestionada por diseñadores que eligen calendarios alternativos, formatos híbridos y plataformas independientes para llegar directamente a sus audiencias. Paris Fashion Week mantiene su prestigio histórico; Milan afianza su dominio en diseño editorial italiano; Nueva York se reinventa con formatos más inclusivos; Londres cultiva la experimentación y el riesgo creativo. El crecimiento de desfiles digitales, experiencias inmersivas y colaboraciones con artistas de otras disciplinas está ampliando lo que significa una presentación de moda en 2026.",
  },
  {
    source: { id: null, name: "TrendFashion Analytics" },
    author: "TrendFashion Editorial",
    title: "Marcas españolas refuerzan su liderazgo en fast fashion responsable",
    description:
      "Zara y Mango mantienen fuerza dentro del segmento de fast fashion español gracias a su velocidad de adaptación a tendencias, infraestructura logística sofisticada y creciente compromiso con prácticas sostenibles.",
    url: "/news/zara-y-mango-mantienen-fuerza-dentro-del-fast-fashion-espanol",
    urlToImage:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
    content:
      "Zara y Mango mantienen una posición destacada dentro del análisis de marcas de moda accesible, siendo modelos de eficiencia vertical integrada. Zara, con su modelo de producción nacional y tiempos de respuesta de 2-3 semanas desde diseño hasta tienda, continúa redefiniéndose como 'social fashion'—detectando tendencias en redes sociales y calles para traducirlas inmediatamente en prendas asequibles. Mango, por su parte, ha consolidado su identidad de 'diseño accesible' con curaduría editorial refinada y expansión selectiva a mercados premium. Ambas marcas están invirtiendo en tecnología digital, experiencias omnicanal y compromiso con circularidad. Esta evolución refleja que en 2026, el fast fashion responsable ya no es contradicción sino imperativo competitivo.",
  },
];

const brandSpecificArticles: Record<string, NewsApiArticle[]> = {
  Prada: [
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Prada redefine el quiet luxury con su nueva colección de primavera",
      description:
        "La casa italiana mantiene su compromiso con la estética minimalista y el lujo discreto a través de una nueva colección que prioriza la precisión artesanal, materiales premium y una paleta de colores subdued. La propuesta refuerza su liderazgo en la tendencia quiet luxury sin ceder a compromisos estéticos.",
      url: "/news/prada-quiet-luxury-primavera",
      urlToImage:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Prada continúa liderando la tendencia de quiet luxury con una nueva colección que ejemplifica su filosofía de lujo sin ostentación. Cada pieza está diseñada con una precisión casi arquitectónica, donde los detalles—el corte perfecto, los botones artesanales, la costura impecable—hablan más que cualquier logo visible. La paleta cromática de beiges, grises y azules oscuros permite que el enfoque se mantenga en la construcción y la calidad textil. Esta colección consolida a Prada como la marca que definió qué significa ser verdaderamente lujoso en una era de sobrecarga visual.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Prada fortalece su presencia editorial con contenido de autor creativo",
      description:
        "La marca italiana continúa invirtiendo en estrategias de contenido que van más allá del marketing tradicional, creando narrativas visuales sofisticadas que refuerzan su posicionamiento intelectual y artístico.",
      url: "/news/prada-redes-sociales-editorial",
      urlToImage:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Prada mantiene su estrategia de comunicación centrada en la sofisticación editorial, transformando cada campaña en una pieza de arte visual. Sus redes sociales no simplemente muestran productos, sino que narran historias sobre filosofía de diseño, procesos artesanales y perspectivas culturales. Colaboraciones con fotógrafos reconocidos, artistas visuales y directores de cine elevan el contenido a un nivel que trasciende la publicidad comercial. Esta aproximación distingue a Prada como una marca que entiende que sus audiencias son intelectuales sofisticadas que buscan significado más allá del consumo.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Prada lidera la integración de sostenibilidad en lujo contemporáneo",
      description:
        "La casa milanesa invierte en innovación de materiales responsables—fibras de alto rendimiento, cueros cultivados y procesos de producción reducidos—sin nunca comprometer su rigurosa estética signature.",
      url: "/news/prada-lujo-sostenible",
      urlToImage:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Prada integra sostenibilidad en su visión de lujo contemporáneo con una estrategia que prioriza innovación tecnológica. La marca ha desarrollado asociaciones con proveedores de materiales de vanguardia que permiten crear prendas ambientalmente responsables sin sacrificar la calidad que define su ADN. Desde nylon reciclado hasta cueros cultivados en laboratorio que replican la durabilidad y la patina del cuero tradicional, Prada demuestra que el lujo verdadero y la responsabilidad ambiental no son contradictorios sino complementarios.",
    },
  ],
  Dior: [
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Dior celebra la feminidad con una reinterpretación de la Alta Costura",
      description:
        "La casa francesa presenta una nueva línea de Alta Costura que reafirma su código visual de elegancia romántica, savoir-faire artesanal sin paralelo y la celebración de la silueta femenina como expresión artística suprema.",
      url: "/news/dior-alta-costura-feminidad",
      urlToImage:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Dior mantiene su posición como referente de la alta costura femenina con una colección que celebra la complejidad, la fuerza y la belleza de la silueta femenina. Cada vestido es una obra maestra de construcción: corsetes reimaginados, volúmenes dramáticos, acabados en punto que requieren horas de mano de obra experta. La casa francesa no sigue tendencias; las crea. Esta colección reafirma que Dior entiende que la verdadera femineidad en el lujo es sinónimo de libertad, poder y refine.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Dior refuerza su liderazgo narrativo en la moda de lujo global",
      description:
        "A través de campañas experimentales, desfiles cinematográficos y colaboraciones artísticas, Dior continúa escribiendo la narrativa de qué significa ser verdaderamente lujoso en 2026.",
      url: "/news/dior-herencia-moda-lujo",
      urlToImage:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Dior representa la excelencia en el mundo de la alta costura escribiendo la historia de la moda a través de colecciones que combinan tradición e innovación de manera magistral. Los desfiles de Dior son eventos culturales donde la moda, la arquitectura, la música y las artes visuales convergen. Maria Grazia Chiuri ha transformado Dior en plataforma para conversaciones sobre feminismo, sostenibilidad y poder femenino, demostrando que el lujo más refinado es también culturalmente relevante.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Dior domina las pasarelas internacionales como autoridad de moda",
      description:
        "Las creaciones de la casa parisina son referencias obligadas en los eventos de moda más importantes del mundo, donde su influencia se extiende a capas enteras de diseño contemporáneo.",
      url: "/news/dior-pasarelas-internacionales",
      urlToImage:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Dior lidera la conversación de la moda de lujo en las grandes pasarelas con una autoridad que viene de más de 75 años de innovación ininterrumpida. Sus desfiles en Paris Fashion Week no son simplemente presentaciones de prendas; son declaraciones de visión, experimentación y maestría técnica. El impacto de Dior trasciende su propia marca: diseñadores de toda la industria estudian sus técnicas, sus paletas cromáticas se convierten en referencia estacional, y su visión de feminidad redefine estándares de belleza y poder.",
    },
  ],
  Chanel: [
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Chanel consolida su legado de atemporalidad en un mundo de tendencias efímeras",
      description:
        "La casa francesa mantiene su promesa fundamental de que la verdadera elegancia trasciende temporadas, reforzando códigos visuales que permanecen relevantes décadas después de su creación.",
      url: "/news/chanel-legado-lujo-atemporalidad",
      urlToImage:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Chanel sigue siendo sinónimo de elegancia atemporal en la moda mundial porque comprende que el verdadero lujo es permanencia. El Little Black Dress, el bolso 2.55, el perfume No. 5 y la chaqueta tweed acolchada no son simplemente productos; son iconos culturales cuya relevancia se fortalece con el paso del tiempo. La visión de Gabrielle Chanel de 'moda que no va a la moda' se realiza plenamente en 2026, donde el cambio acelerado hace que la atemporalidad sea más valiosa que nunca.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Chanel pionera en integrar sostenibilidad en la narrativa de lujo exclusivo",
      description:
        "La casa francesa demuestra que el verdadero lujo requiere responsabilidad ambiental, integrando prácticas sustentables en toda su cadena de suministro sin dilatar su estatus de marca exclusiva.",
      url: "/news/chanel-sostenibilidad-lujo",
      urlToImage:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Chanel demuestra que el lujo y la sostenibilidad pueden coexistir de manera magistral. La casa francesa está reimaginando sus procesos de producción, priorizando materiales renovables certificados, reduciendo desperdicio y extendiendo la vida útil de sus prendas a través de servicios de reparación y mantención. Esta estrategia no es marketing sino una reinvención del concepto de lujo: si verdaderamente es una inversión inteligente, debe ser responsable ambientalmente.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Chanel redefine la experiencia omnicanal del lujo de moda",
      description:
        "A través de una estrategia sofisticada que integra tiendas flagships, boutiques de especialidad y una presencia digital cuidadosamente controlada, Chanel adapta su distribución manteniendo exclusividad.",
      url: "/news/chanel-estrategia-omnicanal",
      urlToImage:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Chanel adapta su estrategia de distribución para mantener su posición de liderazgo sin democratizar el lujo. La marca ha invertido en tiendas flagships de arquitectura emblemática, boutiques de experiencia curada y una presencia digital que prioriza la narrativa sobre la transacción. Cada punto de contacto refuerza la aura de exclusividad que define a Chanel. Esta estrategia omnicanal es revolucionaria porque rechaza el modelo de acceso masivo que domina retail, en su lugar priorizando el acceso selectivo como símbolo máximo de estatus.",
    },
  ],
  Gucci: [
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Gucci lidera el movimiento de moda audaz, maximalista y culturalmente relevante",
      description:
        "La marca italiana continúa apostando por diseños que desafían convenciones, celebran la individualidad y cuestionan las jerarquías estéticas, atrayendo a audiencias que ven la moda como forma de expresión política.",
      url: "/news/gucci-maximalismo-expresion",
      urlToImage:
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Gucci lidera el movimiento de moda audaz y maximalista redefiniendo qué significa lujo en el siglo XXI. Para Gucci, la moda no es sutileza ni discreción sino proclamación de identidad, celebración de la riqueza visual y rechazo de la austeridad. Sus campañas incluyen referencias artísticas, símbolos queer, narrativas sobre poder femenino y diversidad de género, transformando cada colección en declaración cultural. Esta posición atrae a consumidores que ven la moda como herramienta de transformación personal y poder político.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Gucci revoluciona las normas de género en la moda de lujo contemporánea",
      description:
        "A través de colecciones sin género, campañas inclusivas y una visión expansiva de feminidad y masculinidad, Gucci continúa redefiniendo las categorías fundamentales de la moda de lujo.",
      url: "/news/gucci-genero-fluido-moda",
      urlToImage:
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Gucci impulsa la inclusividad y la diversidad en la moda de lujo a través de una visión que trasciende las categorías binarias de género. La casa de modas presenta colecciones donde los géneros se mezclan orgánicamente, celebra la representación LGBTQ+ como parte integral de su narrativa y entiende que el lujo verdadero es accesible a todos sin importar identidad o expresión de género. Esta filosofía no es performativa sino estructural, permea todas las decisiones creativas y de marketing de la marca.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Gucci domina la esfera digital como marca de referencia para la Generación Z",
      description:
        "La marca italiana invierte en estrategias digitales innovadoras, colaboraciones con creadores de contenido y presencia en plataformas emergentes, asegurando relevancia intergeneracional.",
      url: "/news/gucci-generacion-z-digital",
      urlToImage:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Gucci mantiene relevancia con la audiencia más joven a través de estrategias innovadoras que entienden nativamente cómo se comunica la Generación Z. Desde colaboraciones con creadores digitales influyentes hasta presencia activa en TikTok, Instagram y plataformas emergentes, Gucci traduce su visión audaz a formatos que resuenan con consumidores nacidos en la era digital. La marca entiende que relevancia es diálogo constante, no monólogo institucional.",
    },
  ],
  Zara: [
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Zara revoluciona el fast fashion con transformación digital acelerada",
      description:
        "La marca española invierte masivamente en omnicanalidad sofisticada, inteligencia artificial para predicción de tendencias y sistemas de logística que reducen el tiempo de diseño a compra de semanas a días.",
      url: "/news/zara-transformacion-digital",
      urlToImage:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Zara lidera la transformación digital del fast fashion reinventando su cadena de suministro con tecnología de vanguardia. La integración de inteligencia artificial permite a Zara predecir tendencias con precisión, analizar comportamiento de compra en tiempo real y ajustar producción dinámicamente. El resultado es un sistema donde la moda llega a tiendas y plataformas digitales en tiempo récord, manteniendo relevancia con ciclos de tendencia cada vez más acelerados. Esta transformación demuestra que velocidad no requiere sacrificar calidad.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Zara consolida su dominio en fast fashion responsivo mediante análisis cultural",
      description:
        "La velocidad de adaptación de la marca española a tendencias emergentes—literalmente copiar streets looks de influencers a colecciones en tiendas—sigue siendo su ventaja competitiva más diferenciadora.",
      url: "/news/zara-velocidad-tendencias",
      urlToImage:
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Zara mantiene su posición como líder indiscutible en fast fashion responsivo mediante un sistema donde los equipos de diseño analizan constantemente redes sociales, calles de ciudades influyentes y plataformas de tendencias para traducirlas en prendas. El modelo de producción próximo a tiendas permite ciclos de 2-3 semanas desde concepto hasta venta, una velocidad que sus competidores simplemente no pueden replicar. Esta capacidad ha hecho que 'Zara fast fashion' sea sinónimo de relevancia cultural instantánea.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Zara demuestra que fast fashion y sostenibilidad pueden coexistir",
      description:
        "La marca española avanza significativamente en su compromiso con moda responsable sin sacrificar la rapidez que la define, integrando materiales reciclados, procesos de producción limpios y circularidad.",
      url: "/news/zara-sostenibilidad-fast-fashion",
      urlToImage:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Zara integra prácticas sostenibles en su modelo de fast fashion demostrando que velocidad no es sinónimo de irresponsabilidad. La marca está incorporando poliésteres reciclados, algodones certificados y sistemas de producción que reducen residuos en todas las líneas principales. Además, ha creado programas de circularidad donde clientes pueden devolver prendas para reciclaje. Esta evolución es crucial: si el fast fashion querido por millones va a existir, debe ser responsable.",
    },
  ],
  Mango: [
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Mango refuerza su identidad como editorial design democratizado",
      description:
        "La marca española amplía constantemente su catálogo con propuestas que demuestran que diseño editorial sofisticado y accesibilidad económica no son contradictorios sino complementarios.",
      url: "/news/mango-estilo-accesible",
      urlToImage:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Mango destaca en el segmento de moda accesible con diseño de calidad indiscutible, redefiniendo lo que es posible en la relación precio-valor. La marca comisiona diseñadores establecidos, colabora con artistas visuales reconocidos y cura colecciones con rigor editorial típico de lujo. El resultado es ropa que comunica sofisticación, refina el gusto del usuario y cuesta una fracción de lo que costanería brands lujo comparable. Este modelo de 'democracia de diseño' atrae a consumidores que rechazan la dicotomía entre accesibilidad y calidad.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Mango expande su influencia global estratégicamente en mercados selectos",
      description:
        "La casa española continúa crecimiento en Europa, Asia y América Latina con estrategia de adaptación regional que respeta su identidad global mientras honra estéticas locales.",
      url: "/news/mango-expansion-internacional",
      urlToImage:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Mango fortalece su presencia global como marca de moda accesible de autor mediante expansión estratégica que respeta particularidades de cada mercado. Lejos de homogeneizar su oferta, Mango adapta sus propuestas a climas, culturas y preferencias estéticas locales manteniendo coherencia editorial global. Esta aproximación demuestra que globalización no significa homogeneización sino capacidad de ser localmente relevante mientras permanece globalmente consistente.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Mango integra sostenibilidad como valor estratégico no cosmético",
      description:
        "La marca española integra materiales sostenibles en sus colecciones principales—no en líneas paralelas—demostrando que responsabilidad ambiental es parte integral de su visión de moda.",
      url: "/news/mango-sostenible-accesible",
      urlToImage:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Mango demuestra que sostenibilidad y accesibilidad pueden no solo coexistir sino reforzarse mutuamente. La marca integra certificación de sostenibilidad en sus cadenas de suministro, colabora con proveedores que priorizan prácticas ambientales responsables y comunica transparentemente sus avances y desafíos. El resultado es ropa asequible que refleja valores ambientales, permitiendo que consumidores de ingresos moderados accedan a moda responsable.",
    },
  ],
  "H&M": [
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "H&M lidera la transformación del fast fashion hacia modelos responsables",
      description:
        "La marca sueca equilibra presión competitiva de velocidad con compromisos ambientales verificables, demostrando que gigantes del fast fashion pueden transformarse.",
      url: "/news/hm-moda-rapida-responsable",
      urlToImage:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "H&M lidera la transformación del fast fashion hacia modelos más responsables invirtiendo significativamente en investigación de materiales, procesos de producción limpios y circularidad. La marca ha establecido targets ambiciosos de reducción de emisiones de carbono, transparencia en cadenas de suministro y compromiso con justicia laboral. Esta transformación reconoce que el modelo tradicional de fast fashion es insostenible a largo plazo, requiriendo reinvención radical.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "H&M domina el segmento asequible mediante innovación logística y de diseño",
      description:
        "La marca sueca mantiene su ventaja competitiva irrebatible en democratización de tendencias a través de sistemas de producción sofisticados y comprensión nuance de múltiples segmentos de consumidor.",
      url: "/news/hm-segmento-asequible",
      urlToImage:
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "H&M continúa liderando en accesibilidad y disponibilidad de tendencias reconociendo que el verdadero poder del fast fashion es su capacidad de servir múltiples audiencias simultáneamente. Desde collections de entrada económica hasta líneas premium que abordan consumidores más sofisticados, H&M ha desarrollado ecosystem de marcas que alcanzan toda la pirámide económica sin competir entre sí.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "H&M invierte en transformación digital para mantener liderazgo futuro",
      description:
        "La marca sueca invierte en tecnología, omnicanalidad sofisticada y experiencias de compra personalizadas para mantener relevancia en landscape retail radicalmente transformado.",
      url: "/news/hm-transformacion-digital",
      urlToImage:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "H&M moderniza su infraestructura digital integrando inteligencia artificial para personalización, realidad aumentada para experiencias de prueba virtuales y sistemas de logística que permiten entregas en horas en ciudades seleccionadas. Estos avances tecnológicos no son accesorios sino requisitos para competir en retail del futuro donde experiencia es tanto importante como el producto físico.",
    },
  ],
  COS: [
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "COS define el minimalismo como propuesta política y estética",
      description:
        "La marca británica consolida su identidad alrededor de diseño funcional y estética clean como respuesta activa contra maximalism, ofreciendo filosofía alternativa de cómo veste la modernidad.",
      url: "/news/cos-minimalismo-propuesta",
      urlToImage:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "COS destaca en el segmento de moda minimalista y contemporánea como propuesta editorial rigurosa que dice 'no' a lo innecesario. Cada pieza es diseñada con intención arquitectónica: siluetas limpias, paletas monocromáticas, materiales premium, técnicas de construcción que priorizan durabilidad. Esta filosofía anti-consumismo paradójicamente crea deseo profundo porque los consumidores reconocen autenticidad: COS genuinamente cree que menos es mejor.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "COS diversifica categorías mientras mantiene coherencia editorial rigurosa",
      description:
        "La marca británica extiende su propuesta estética a accesorios, bolsos y complementos demostrando que minimalismo puede expandirse sin diluirse.",
      url: "/news/cos-accesorios-complementos",
      urlToImage:
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "COS diversifica su oferta manteniendo coherencia de marca a través de líneas de accesorios, bolsos y complementos que extienden su filosofía minimalista. Cada nuevo producto es evaluado mediante el mismo rigor editorial que define la ropa: ¿Es verdaderamente necesario? ¿Está bien construido? ¿Envejecerá bien? Esta consistencia ha permitido que COS se convierta en destino editorial donde consumidores saben exactamente qué encontrarán.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "COS posiciona sostenibilidad como base de minimalismo contemporáneo",
      description:
        "La marca británica integra responsabilidad ambiental en el corazón de su propuesta, reconociendo que moda minimalista sostenible es precisamente la respuesta al consumismo insostenible.",
      url: "/news/cos-minimalismo-sostenible",
      urlToImage:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "COS presenta sostenibilidad como parte integral del minimalismo, no como adición cosmética. La marca utiliza fibras certificadas, procesos de producción de bajo impacto ambiental y prioriza durabilidad sobre novedad. Para COS, la ropa minimalista es inherentemente más sostenible porque está diseñada para perdurar atemporalmente, contrastando con moda que depende de cambios de tendencia para generar demanda.",
    },
  ],
  "Massimo Dutti": [
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Massimo Dutti redefine lujo accesible como sofisticación tailored",
      description:
        "La marca española define propuesta única donde elegancia sofisticada, construcción impecable y precios moderados convergen, atrayendo a consumidores que rechazanDichotomía entre lujo y accesibilidad.",
      url: "/news/massimo-dutti-lujo-accesible",
      urlToImage:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Massimo Dutti lidera el segmento de moda sofisticada a precios accesibles ofreciendo tailoring de lujo sin precio de lujo. La marca comisiona diseñadores con experiencia en ateliers tradicionales, utiliza materiales premium y prioriza técnicas de construcción que requieren artesanía. El resultado es ropa que comunica estatus intelectual más que económico: quienes entienden moda reconocen que Massimo Dutti ofrece relación precio-valor incomparable.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Massimo Dutti consolida liderazgo en atemporalidad como estrategia",
      description:
        "La marca española prioriza diseño que trasciende tendencias, enfatizando durabilidad, construcción impecable y códigos visuales que envejecen elegantemente.",
      url: "/news/massimo-dutti-calidad-atemporalidad",
      urlToImage:
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Massimo Dutti enfatiza la calidad como diferenciador principal en mercado cada vez más saturado de moda desechable. Cada prenda es diseñada con intención de duración: costuras reforzadas, materiales que envejecen bien, siluetas que permanecen relevantes más allá de una temporada. Esta filosofía anti-fast fashion posiciona a Massimo Dutti como marca para consumidores inteligentes que entienden que invertir en calidad es más económico que comprar mal constantemente.",
    },
    {
      source: { id: null, name: "TrendFashion Analytics" },
      author: "TrendFashion Editorial",
      title: "Massimo Dutti fortalece distribución selectiva en canales premium",
      description:
        "La marca española estratégicamente aumenta su presencia en tiendas multimarca de curación editorial rigurosa, reforzando su posicionamiento como marca para consumidores sofisticados.",
      url: "/news/massimo-dutti-distribucion-multimarca",
      urlToImage:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      content:
        "Massimo Dutti fortalece su distribución selectiva en el mercado reconociendo que donde se vende es parte de la narrativa de marca. La marca prioriza presencia en tiendas multimarca de reputación editorial—departamentos que curan cuidadosamente qué marcas venderán—sobre disponibilidad masiva. Esta estrategia mantiene aura de exclusividad relativa mientras asegura acceso en ciudades importantes, reforzando percepción de marca como sofisticada y selectiva.",
    },
  ],
};

// Palabras clave relacionadas con moda (en español e inglés)
const fashionKeywords = [
  "moda",
  "fashion",
  "luxury",
  "lujo",
  "style",
  "estilo",
  "runway",
  "pasarela",
  "collection",
  "colección",
  "designer",
  "diseñador",
  "clothing",
  "ropa",
  "outfit",
  "prenda",
  "trend",
  "tendencia",
  "textile",
  "textil",
  "retail",
  "tienda",
  "boutique",
  "ecommerce",
];

// Marcas objetivo para validar relevancia
const targetBrands = [
  "zara",
  "mango",
  "h&m",
  "prada",
  "chanel",
  "dior",
  "gucci",
  "cos",
  "massimo dutti",
];

const excludedKeywords = [
  "ikea",
  "mueble",
  "muebles",
  "cocina",
  "cocinas",
  "hogar",
  "guerra",
  "política",
  "politica",
  "elecciones",
  "fútbol",
  "futbol",
  "deporte",
  "deportes",
  "automotriz",
  "automóvil",
  "automovil",
  "coches",
  "vehículos",
  "vehiculos",
  "despedir",
  "despidos",
];

function getFromDate(period: string) {
  const date = new Date();

  // NewsAPI free plan only allows 1 month back (max 30 days)
  // So we cap all periods to 1 month
  date.setMonth(date.getMonth() - 1);

  return date.toISOString().split("T")[0];
}

function getArticleText(article: NewsApiArticle) {
  return `${article.title ?? ""} ${article.description ?? ""} ${
    article.content ?? ""
  }`.toLowerCase();
}

function isClearlyNotFashionArticle(article: NewsApiArticle) {
  const text = getArticleText(article);

  return excludedKeywords.some((keyword) =>
    text.includes(keyword.toLowerCase())
  );
}

function isFashionArticle(article: NewsApiArticle) {
  const text = getArticleText(article);

  return fashionKeywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

/**
 * Valida que un artículo sea relevante para moda.
 * Requiere:
 * 1. Presencia de al menos UNA marca objetivo (Zara, Mango, H&M, Prada, etc.)
 * 2. Y presencia de al menos UNA palabra relacionada con moda (fashion, moda, lujo, etc.)
 * 
 * Esto evita artículos sobre "Mango" la persona sin contexto de moda,
 * y evita noticias de coches, política o sucesos sin relación moda.
 */
function isRelevantToFashion(article: NewsApiArticle): boolean {
  const text = getArticleText(article);

  // Paso 1: Verificar presencia de al menos una marca objetivo
  const hasBrand = targetBrands.some((brand) => text.includes(brand));
  if (!hasBrand) {
    return false;
  }

  // Paso 2: Si tiene marca, verificar presencia de palabra de moda
  const hasFashionKeyword = fashionKeywords.some((keyword) =>
    text.includes(keyword)
  );
  return hasFashionKeyword;
}

function normalizeArticle(article: NewsApiArticle, index: number) {
  const title = article.title?.trim() || `Noticia de moda ${index + 1}`;

  return {
    source: article.source ?? {
      id: null,
      name: "Fuente de moda",
    },
    author: article.author ?? "Redacción moda",
    title,
    description:
      article.description?.trim() ||
      "Actualidad del sector moda, marcas, pasarelas y tendencias digitales.",
    url: article.url || `/news/${createSlug(title)}`,
    urlToImage:
      article.urlToImage ||
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
    publishedAt: article.publishedAt || new Date().toISOString(),
    content:
      article.content ??
      "Noticia relacionada con el sector moda, tendencias, marcas y comportamiento digital.",
    slug: createSlug(title),
  };
}

function getCleanArticles(articles: NewsApiArticle[], brand?: string) {
  const articlesWithBasicData = articles.filter(
    (article) => article.title && article.url
  );

  // Filtrar por: NO es artículo excluido Y es relevante para moda (tiene marca + palabra moda)
  const relevantFashionArticles = articlesWithBasicData
    .filter((article) => !isClearlyNotFashionArticle(article))
    .filter(isRelevantToFashion)
    .map(normalizeArticle);

  if (relevantFashionArticles.length > 0) {
    console.log(
      "[getCleanArticles] Found",
      relevantFashionArticles.length,
      "relevant fashion articles (brand + fashion keywords)"
    );
    return relevantFashionArticles;
  }

  console.log(
    "[getCleanArticles] No relevant fashion articles found, using fallback"
  );

  // Si no hay artículos relevantes, usar fallback específico de marca
  const fallbackArticlesList = getFallbackArticlesForBrand(brand);
  return fallbackArticlesList.map(normalizeArticle);
}

function getFallbackArticlesForBrand(brand?: string) {
  if (!brand) {
    return fallbackArticles;
  }

  // Si existe artículos específicos para la marca, usarlos
  if (brandSpecificArticles[brand]) {
    return brandSpecificArticles[brand];
  }

  // Si no, usar artículos generales
  return fallbackArticles;
}

export async function GET(request: Request) {
  const apiKey = process.env.NEWS_API_KEY;
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "6m";
  const brand = searchParams.get("brand");
  const fromDate = getFromDate(period);

  try {
    // STEP 1: Intentar NewsAPI primero (como en brand-metrics y trend-metrics)
    if (apiKey) {
      console.log("[GET /api/news] Step 1: Attempting NewsAPI first...");
      
      try {
        const url = new URL("https://newsapi.org/v2/everything");

        if (brand) {
          url.searchParams.set(
            "q",
            `"${brand}" AND (moda OR fashion OR lujo OR luxury OR pasarela OR colección OR tendencias OR estilo)`
          );
        } else {
          url.searchParams.set(
            "q",
            '(moda OR fashion OR tendencias OR pasarela OR lujo OR luxury OR streetwear OR Zara OR Mango OR Gucci OR Prada OR Chanel OR Dior)'
          );
        }

        url.searchParams.set("searchIn", "title,description");
        url.searchParams.set("language", "es");
        url.searchParams.set("sortBy", "publishedAt");
        url.searchParams.set("pageSize", "50");
        url.searchParams.set("from", fromDate);
        url.searchParams.set(
          "excludeDomains",
          "tmz.com,thesun.co.uk,dailymail.co.uk"
        );
        url.searchParams.set("apiKey", apiKey);

        const response = await fetch(url.toString(), {
          cache: "no-store",
        });

        console.log("[GET /api/news] NewsAPI Response:", {
          status: response.status,
          statusText: response.statusText,
        });

        if (response.ok) {
          const data = (await response.json()) as NewsApiResponse;
          const cleanArticles = getCleanArticles(data.articles ?? [], brand ?? undefined);

          if (cleanArticles.length > 0) {
            console.log("[GET /api/news] SUCCESS: Got", cleanArticles.length, "articles from NewsAPI");
            
            // Guardar noticias en BD
            const urls: string[] = [];
            for (const article of cleanArticles) {
              await saveNews(article);
              if (article.url) urls.push(article.url);
            }

            // Consultar Prisma para traer solo noticias NO ocultas
            const visibleNews = await prisma.news.findMany({
              where: {
                AND: [
                  { url: { in: urls } },
                  { isHidden: false },
                ],
              },
              select: {
                title: true,
                description: true,
                content: true,
                url: true,
                urlToImage: true,
                slug: true,
                source: true,
                publishedAt: true,
                isFeatured: true,
                isFallback: true,
              },
              orderBy: {
                publishedAt: "desc",
              },
            });

            const filteredArticles = visibleNews.map((news) => ({
              source: { name: news.source || "Fuente de moda" },
              title: news.title,
              description: news.description,
              url: news.url,
              urlToImage: news.urlToImage,
              publishedAt: news.publishedAt?.toISOString(),
              content: news.content,
              slug: news.slug,
            }));

            return NextResponse.json({
              status: "ok",
              source: "newsapi",
              reason: "Articles from NewsAPI (fresh data priority)",
              period,
              brand: brand || null,
              from: fromDate,
              totalResults: filteredArticles.length,
              articles: filteredArticles,
            });
          } else {
            console.log("[GET /api/news] NewsAPI returned 0 usable articles");
          }
        } else {
          const responseText = await response.text();
          console.error("[GET /api/news] NewsAPI Error:", {
            status: response.status,
            statusText: response.statusText,
            body: responseText.substring(0, 200),
          });
        }
      } catch (error) {
        console.error("[GET /api/news] NewsAPI call failed:", error);
      }
    }

    // STEP 2: Si NewsAPI falla o no hay resultados, usar BD
    console.log("[GET /api/news] Step 2: Attempting database fallback...");
    
    const cachedNews = await prisma.news.findMany({
      where: { isHidden: false },
      select: {
        title: true,
        description: true,
        content: true,
        url: true,
        urlToImage: true,
        slug: true,
        source: true,
        publishedAt: true,
        isFeatured: true,
        isFallback: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 50,
    });

    if (cachedNews.length > 0) {
      console.log("[GET /api/news] SUCCESS: Using database cache with", cachedNews.length, "articles");
      
      const articles = cachedNews.map((news) => ({
        source: { name: news.source || "Fuente de moda" },
        title: news.title,
        description: news.description,
        url: news.url,
        urlToImage: news.urlToImage,
        publishedAt: news.publishedAt?.toISOString(),
        content: news.content,
        slug: news.slug,
      }));

      return NextResponse.json({
        status: "ok",
        source: "database",
        reason: "Articles from database cache (NewsAPI unavailable)",
        period,
        brand: brand || null,
        from: fromDate,
        totalResults: articles.length,
        articles,
      });
    }

    // STEP 3: Si BD también falla, devolver fallback
    console.log("[GET /api/news] Step 3: Using fallback articles...");
    const fallbackArticlesList = getFallbackArticlesForBrand(brand ?? undefined);
    const fallbackArticles = fallbackArticlesList.map(normalizeArticle);

    return NextResponse.json({
      status: "fallback",
      source: "fallback",
      reason: "Fallback demo articles (NewsAPI and database unavailable)",
      period,
      brand: brand || null,
      from: fromDate,
      totalResults: fallbackArticles.length,
      articles: fallbackArticles,
    });
  } catch (error) {
    console.error("[GET /api/news] Unexpected error:", error);

    const fallbackArticlesList = getFallbackArticlesForBrand(
      new URL(request.url).searchParams.get("brand") ?? undefined
    );
    const fallbackArticles = fallbackArticlesList.map(normalizeArticle);

    return NextResponse.json(
      {
        status: "fallback",
        source: "fallback",
        error: "Unexpected server error",
        totalResults: fallbackArticles.length,
        articles: fallbackArticles,
      },
      { status: 500 }
    );
  }
}