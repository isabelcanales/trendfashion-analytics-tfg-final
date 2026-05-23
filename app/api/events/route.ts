import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const where: any = {};
    if (month) where.month = month;
    if (year) where.year = year;

    const events = await prisma.event.findMany({
      where,
      orderBy: [{ month: "asc" }, { day: "asc" }],
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return NextResponse.json(
      { error: "Error al obtener eventos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Solo admins pueden crear eventos
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "No tienes permiso para crear eventos" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, category, location, day, month, year, description } = body;

    // Validar campos requeridos
    if (!name || !category || !location || !day || !month || !year) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        name,
        category,
        location,
        day,
        month,
        year,
        description: description || "",
        relevanceScore: 0,
        source: "Custom",
        isMocked: false,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error al crear evento:", error);
    return NextResponse.json(
      { error: "Error al crear evento" },
      { status: 500 }
    );
  }
}
