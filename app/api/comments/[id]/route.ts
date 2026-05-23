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

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Debes estar autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "El contenido del comentario no puede estar vacío" },
        { status: 400 }
      );
    }

    // Obtener el comentario
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comentario no encontrado" },
        { status: 404 }
      );
    }

    // Solo el autor del comentario puede editarlo
    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { error: "No tienes permiso para editar este comentario" },
        { status: 403 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error al actualizar comentario:", error);
    return NextResponse.json(
      { error: "Error al actualizar comentario" },
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

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Debes estar autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Obtener el comentario
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comentario no encontrado" },
        { status: 404 }
      );
    }

    // Solo el autor o un admin pueden eliminar
    const isAdmin = (session.user as any)?.role === "admin";
    if (comment.userId !== session.user.id && !isAdmin) {
      return NextResponse.json(
        { error: "No tienes permiso para eliminar este comentario" },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    return NextResponse.json(
      { error: "Error al eliminar comentario" },
      { status: 500 }
    );
  }
}
