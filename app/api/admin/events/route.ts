import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Filtros dinámicos
    const where: any = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    // Contar total
    const total = await prisma.event.count({ where });

    // Obtener eventos
    const events = await prisma.event.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        location: true,
        day: true,
        month: true,
        year: true,
        relevanceScore: true,
        source: true,
        isMocked: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Error al cargar eventos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, category, location, day, month, year } = body;

    if (!name || !day || !month || !year || !category || !location) {
      return NextResponse.json(
        { error: "Nombre, fecha completa, categoría y ubicación son requeridos" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        name,
        description,
        category,
        location,
        day,
        month,
        year,
        source: "Custom",
        isMocked: false,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Error al crear evento", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
