import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Error al cargar evento" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, category, location, day, month, year } = body;

    // Verificar que el evento existe
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    if (!name || !day || !month || !year || !category || !location) {
      return NextResponse.json(
        { error: "Nombre, fecha completa, categoría y ubicación son requeridos" },
        { status: 400 }
      );
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        name,
        description,
        category,
        location,
        day,
        month,
        year,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Error al actualizar evento", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Evento eliminado",
      event,
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Error al eliminar evento", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
