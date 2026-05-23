import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
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
        news: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Error al cargar comentarios" },
      { status: 500 }
    );
  }
}
