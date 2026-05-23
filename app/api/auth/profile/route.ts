import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, consultancy } = body;

    // Validaciones
    if (!name || !email) {
      return NextResponse.json(
        { error: "Nombre y email son obligatorios" },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe (y no es el mismo usuario)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 400 }
      );
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        consultancy: consultancy || "Mi Consultora",
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          consultancy: updatedUser.consultancy,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en actualización de perfil:", error);
    return NextResponse.json(
      { error: "Error al actualizar el perfil" },
      { status: 500 }
    );
  }
}
