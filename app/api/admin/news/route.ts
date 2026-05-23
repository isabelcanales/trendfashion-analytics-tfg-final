import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const featured = searchParams.get("featured");
    const hidden = searchParams.get("hidden");
    const fallback = searchParams.get("fallback");

    const skip = (page - 1) * limit;

    // Construir filtros dinámicos
    const where: any = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { source: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(featured !== undefined && { isFeatured: featured === "true" }),
      ...(hidden !== undefined && { isHidden: hidden === "true" }),
      ...(fallback !== undefined && { isFallback: fallback === "true" }),
    };

    // Obtener total de registros
    const total = await prisma.news.count({ where });

    // Obtener noticias
    const news = await prisma.news.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        source: true,
        urlToImage: true,
        publishedAt: true,
        isFeatured: true,
        isHidden: true,
        isFallback: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: news,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Error al cargar noticias" },
      { status: 500 }
    );
  }
}
