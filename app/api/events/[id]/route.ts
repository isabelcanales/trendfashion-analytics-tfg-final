import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // Solo admins pueden actualizar eventos
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "No tienes permiso para actualizar eventos" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, category, location, day, month, year, description } = body;

    // Validar que el evento existe
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(location && { location }),
        ...(day && { day }),
        ...(month && { month }),
        ...(year && { year }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error al actualizar evento:", error);
    return NextResponse.json(
      { error: "Error al actualizar evento" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // Solo admins pueden eliminar eventos
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "No tienes permiso para eliminar eventos" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // No permitir eliminar eventos mocked
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    if (event.isMocked) {
      return NextResponse.json(
        { error: "No se pueden eliminar eventos mocked" },
        { status: 400 }
      );
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    return NextResponse.json(
      { error: "Error al eliminar evento" },
      { status: 500 }
    );
  }
}
