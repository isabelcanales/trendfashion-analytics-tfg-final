import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// GET: Obtener un reporte por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para ver reportes" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID del informe es requerido" },
        { status: 400 }
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

    // Obtener el reporte
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        brand1: { select: { id: true, name: true } },
        brand2: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Informe no encontrado" },
        { status: 404 }
      );
    }

    // Verificar que el usuario tenga acceso
    if (report.userId !== userId) {
      return NextResponse.json(
        { error: "No tienes permisos para ver este informe" },
        { status: 403 }
      );
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Error al cargar el informe" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar reporte por ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para eliminar informes" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID del informe es requerido" },
        { status: 400 }
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

    // Verificar que el reporte exista y pertenezca al usuario
    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Informe no encontrado" },
        { status: 404 }
      );
    }

    if (report.userId !== userId) {
      return NextResponse.json(
        { error: "No tienes permisos para eliminar este informe" },
        { status: 403 }
      );
    }

    // Eliminar el reporte
    await prisma.report.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting report:", error);
    return NextResponse.json(
      { error: "Error al eliminar el informe" },
      { status: 500 }
    );
  }
}

