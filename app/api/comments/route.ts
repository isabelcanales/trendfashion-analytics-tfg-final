import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get("newsId");

    if (!newsId) {
      return NextResponse.json(
        { error: "newsId es requerido" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { newsId },
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    return NextResponse.json(
      { error: "Error al obtener comentarios" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Debes estar autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, newsId } = body;

    if (!content || !newsId) {
      return NextResponse.json(
        { error: "Contenido y newsId son requeridos" },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: "El comentario no puede estar vacío" },
        { status: 400 }
      );
    }

    // Verificar que la noticia existe
    const news = await prisma.news.findUnique({
      where: { id: newsId },
    });

    if (!news) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: session.user.id as string,
        newsId,
      },
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

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error al crear comentario:", error);
    return NextResponse.json(
      { error: "Error al crear comentario" },
      { status: 500 }
    );
  }
}
