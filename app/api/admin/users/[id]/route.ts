import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { name, email, role, plan } = body;

    // Validación básica
    if (name === undefined && email === undefined && role === undefined && plan === undefined) {
      return NextResponse.json(
        { error: "Se debe proporcionar al menos un campo para actualizar" },
        { status: 400 }
      );
    }

    if (plan !== undefined && plan !== null && plan !== "pro" && plan !== "premium") {
      return NextResponse.json(
        { error: "Plan inválido. Usa pro, premium o null (basic)" },
        { status: 400 }
      );
    }

    // Preparar datos a actualizar
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (plan !== undefined) updateData.plan = plan;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(`User ${id} updated successfully`);

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Error updating user:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "El email ya está en uso" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar usuario" },
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

    // Verificar que el usuario existe antes de eliminar
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar el usuario (las relaciones en cascada se manejan en el schema)
    await prisma.user.delete({
      where: { id },
    });

    console.log(`User ${id} deleted successfully`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting user:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error al eliminar usuario" },
      { status: 500 }
    );
  }
}
