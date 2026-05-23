import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Eventos mockeados para seed
const mockedEvents = [
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
    name: "Première Vision Paris",
    category: "Feria Textil",
    location: "París, Francia",
    day: "10",
    month: "Feb",
    year: "2026",
    description:
      "Feria principal de materiales y tendencias textiles que anticipa las direcciones creativas de las colecciones futuras.",
    relevanceScore: 88,
    source: "Dataset curado de eventos de feria textil",
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
];

async function main() {
  console.log("🌱 Iniciando seed de datos...");

  // Limpiar datos existentes
  await prisma.brandReview.deleteMany();
  await prisma.forecast.deleteMany();
  await prisma.brandMetricsHistory.deleteMany();
  await prisma.report.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();
  await prisma.event.deleteMany();

  // ==================== CREAR USUARIO ADMIN ====================

  const adminPassword = "Admin123!@#";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@trendfashion.com",
      name: "Administrador",
      password: hashedPassword,
      role: "admin",
      consultancy: "TrendFashion Analytics",
      plan: "premium",
    },
  });

  console.log(`✅ Usuario admin creado:`);
  console.log(`   Email: ${adminUser.email}`);
  console.log(`   Password: ${adminPassword}`);

  // ==================== CREAR USUARIO DE PRUEBA ====================

  const testPassword = "Test123!@#";
  const testHashedPassword = await bcrypt.hash(testPassword, 10);

  const testUser = await prisma.user.create({
    data: {
      email: "demo@fashionanalytics.com",
      name: "Demo User",
      password: testHashedPassword,
      role: "user",
      consultancy: "Fashion Analytics Team",
      plan: "pro",
    },
  });

  console.log(`✅ Usuario de prueba creado:`);
  console.log(`   Email: ${testUser.email}`);
  console.log(`   Password: ${testPassword}`);

  // ==================== CREAR MARCAS ====================

  const brands = await Promise.all([
    // LUXURY
    prisma.brand.create({
      data: {
        name: "Chanel",
        category: "luxury",
        country: "France",
        logo: "https://via.placeholder.com/100?text=Chanel",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Prada",
        category: "luxury",
        country: "Italy",
        logo: "https://via.placeholder.com/100?text=Prada",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Dior",
        category: "luxury",
        country: "France",
        logo: "https://via.placeholder.com/100?text=Dior",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Gucci",
        category: "luxury",
        country: "Italy",
        logo: "https://via.placeholder.com/100?text=Gucci",
      },
    }),

    // PREMIUM
    prisma.brand.create({
      data: {
        name: "Massimo Dutti",
        category: "premium",
        country: "Spain",
        logo: "https://via.placeholder.com/100?text=Massimo+Dutti",
      },
    }),
    prisma.brand.create({
      data: {
        name: "COS",
        category: "premium",
        country: "Sweden",
        logo: "https://via.placeholder.com/100?text=COS",
      },
    }),

    // FAST FASHION
    prisma.brand.create({
      data: {
        name: "Zara",
        category: "fastfashion",
        country: "Spain",
        logo: "https://via.placeholder.com/100?text=Zara",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Mango",
        category: "fastfashion",
        country: "Spain",
        logo: "https://via.placeholder.com/100?text=Mango",
      },
    }),
    prisma.brand.create({
      data: {
        name: "H&M",
        category: "fastfashion",
        country: "Sweden",
        logo: "https://via.placeholder.com/100?text=H&M",
      },
    }),
  ]);

  console.log(`✅ Creadas ${brands.length} marcas`);

  // ==================== CREAR HISTÓRICO DE MÉTRICAS (12 meses) ====================

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 12);

  const metricsData = [];

  for (let i = 0; i < 12; i++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(currentDate.getMonth() + i);

    for (const brand of brands) {
      // Datos realistas por categoría
      let baseMentions: number;
      let baseSentiment: number;
      let basePopularity: number;

      if (brand.category === "luxury") {
        baseMentions = 45 + Math.random() * 25;
        baseSentiment = 72 + Math.random() * 15;
        basePopularity = 78 + Math.random() * 12;
      } else if (brand.category === "premium") {
        baseMentions = 30 + Math.random() * 20;
        baseSentiment = 68 + Math.random() * 18;
        basePopularity = 65 + Math.random() * 15;
      } else {
        // fastfashion
        baseMentions = 60 + Math.random() * 30;
        baseSentiment = 60 + Math.random() * 20;
        basePopularity = 72 + Math.random() * 18;
      }

      // Añadir tendencia: algunos meses suben, otros bajan
      const trend = Math.sin((i / 12) * Math.PI * 2) * 10;

      metricsData.push({
        brandId: brand.id,
        date: currentDate,
        mentions: Math.round(baseMentions + trend),
        sentiment: Math.min(100, Math.max(0, baseSentiment + trend)),
        popularity: Math.min(100, Math.max(0, basePopularity + trend)),
        score: Math.min(
          100,
          Math.max(
            0,
            (baseSentiment + basePopularity + baseMentions / 10) / 2 + trend
          )
        ),
      });
    }
  }

  // Insertar todos los datos de métricas
  for (const metric of metricsData) {
    await prisma.brandMetricsHistory.create({
      data: metric,
    });
  }

  console.log(`✅ Creados ${metricsData.length} registros de histórico`);

  // ==================== CREAR EVENTOS ====================

  const events = await Promise.all(
    mockedEvents.map((event) =>
      prisma.event.create({
        data: {
          ...event,
          isMocked: true,
        },
      })
    )
  );

  console.log(`✅ Creados ${events.length} eventos`);

  console.log("\n🎉 Seed completado exitosamente\n");
  console.log("═══════════════════════════════════════════════════");
  console.log("📌 CREDENCIALES DE ACCESO:");
  console.log("═══════════════════════════════════════════════════");
  console.log(`ADMIN:`);
  console.log(`  Email: admin@trendfashion.com`);
  console.log(`  Password: ${adminPassword}`);
  console.log(`\nUSUARIO DE PRUEBA:`);
  console.log(`  Email: demo@fashionanalytics.com`);
  console.log(`  Password: ${testPassword}`);
  console.log("═══════════════════════════════════════════════════\n");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
