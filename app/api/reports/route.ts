import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// GET: Obtener reportes del usuario
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para ver informes" },
        { status: 401 }
      );
    }

    // Resolver usuario usando la misma lógica que en POST
    let userId: string;
    if (session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      userId = existingUser?.id || session.user.id;
    } else {
      userId = session.user.id;
    }

    const reports = await prisma.report.findMany({
      where: { userId },
      include: {
        brand1: { select: { id: true, name: true } },
        brand2: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Error al cargar informes" },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo reporte
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para guardar informes" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      brand1Id,
      brand2Id,
      brand1Name,
      brand1Category,
      brand1Country,
      brand2Name,
      brand2Category,
      brand2Country,
      title,
      executiveSummary,
      insights,
      conclusion,
    } = body;

    // Validar campos requeridos
    if (!title || !executiveSummary || !insights || !conclusion) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // 1. Resolver el usuario
    let userId: string;
    try {
      // Primero buscar por email si existe
      if (session.user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        if (existingUser) {
          userId = existingUser.id;
        } else {
          // No existe por email, crear uno nuevo
          const newUser = await prisma.user.create({
            data: {
              id: session.user.id,
              email: session.user.email,
              name: session.user.name ?? "Usuario",
              role: "user",
            },
          });
          userId = newUser.id;
        }
      } else {
        // Si no hay email, buscar por id
        const userById = await prisma.user.findUnique({
          where: { id: session.user.id },
        });

        if (!userById) {
          return NextResponse.json(
            { error: "Usuario no encontrado y sin email para crear" },
            { status: 400 }
          );
        }
        userId = userById.id;
      }
    } catch (err) {
      console.error("Error resolving user:", err);
      return NextResponse.json(
        { error: "Error al procesar el usuario" },
        { status: 400 }
      );
    }

    // 2. Garantizar Brand1: priorizar nombre sobre ID
    let finalBrand1Id: string | null = null;

    if (brand1Name && brand1Category && brand1Country) {
      try {
        const brand1 = await prisma.brand.upsert({
          where: { name: brand1Name },
          update: {},
          create: {
            name: brand1Name,
            category: brand1Category,
            country: brand1Country,
          },
        });
        finalBrand1Id = brand1.id;
      } catch (err) {
        console.error("Error upserting brand1 by name:", err);
        return NextResponse.json(
          { error: "Error al procesar la primera marca" },
          { status: 400 }
        );
      }
    } else if (brand1Id) {
      finalBrand1Id = brand1Id;
    }

    // 3. Garantizar Brand2: priorizar nombre sobre ID
    let finalBrand2Id: string | null = null;

    if (brand2Name && brand2Category && brand2Country) {
      try {
        const brand2 = await prisma.brand.upsert({
          where: { name: brand2Name },
          update: {},
          create: {
            name: brand2Name,
            category: brand2Category,
            country: brand2Country,
          },
        });
        finalBrand2Id = brand2.id;
      } catch (err) {
        console.error("Error upserting brand2 by name:", err);
        return NextResponse.json(
          { error: "Error al procesar la segunda marca" },
          { status: 400 }
        );
      }
    } else if (brand2Id) {
      finalBrand2Id = brand2Id;
    }

    // 4. Validar que tenemos los IDs de ambas marcas
    if (!finalBrand1Id || !finalBrand2Id) {
      return NextResponse.json(
        { error: "No se pudieron obtener o crear las marcas" },
        { status: 400 }
      );
    }

    // 5. Crear slug único
    const slug = `${title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .substring(0, 50)}-${Date.now()}`;

    // 6. Crear el reporte con IDs garantizados
    const report = await prisma.report.create({
      data: {
        userId,
        brand1Id: finalBrand1Id,
        brand2Id: finalBrand2Id,
        title,
        slug,
        executiveSummary,
        insights,
        conclusion,
      },
      include: {
        brand1: { select: { name: true } },
        brand2: { select: { name: true } },
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    console.error("Error creating report:", error);
    
    // Errores de Prisma
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Una o ambas marcas no existen" },
        { status: 404 }
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Referencias de marcas inválidas" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al guardar el informe" },
      { status: 500 }
    );
  }
}
