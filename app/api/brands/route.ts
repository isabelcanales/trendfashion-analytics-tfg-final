import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        metricsHistory: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Error fetching brands" },
      { status: 500 }
    );
  }
}
