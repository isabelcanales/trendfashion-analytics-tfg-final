import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL requerida" },
        { status: 400 }
      );
    }

    const news = await prisma.news.findUnique({
      where: { url },
    });

    if (!news) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error al buscar noticia:", error);
    return NextResponse.json(
      { error: "Error al buscar noticia" },
      { status: 500 }
    );
  }
}
