import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!news) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Error al cargar noticia" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isFeatured, isHidden, isFallback } = body;

    // Validar que al menos uno de los campos esté presente
    if (isFeatured === undefined && isHidden === undefined && isFallback === undefined) {
      return NextResponse.json(
        { error: "Al menos uno de los campos (isFeatured, isHidden, isFallback) es requerido" },
        { status: 400 }
      );
    }

    // Verificar que la noticia existe
    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 }
      );
    }

    // Solo permitir actualizar estos campos
    const updateData: any = {};
    
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (isHidden !== undefined) updateData.isHidden = isHidden;
    if (isFallback !== undefined) updateData.isFallback = isFallback;

    const news = await prisma.news.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      { error: "Error al actualizar noticia", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
