import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");
    const days = searchParams.get("days") || "120"; // 4 meses por defecto

    if (!brandId) {
      return NextResponse.json(
        { error: "brandId is required" },
        { status: 400 }
      );
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const metrics = await prisma.brandMetricsHistory.findMany({
      where: {
        brandId,
        date: {
          gte: daysAgo,
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Error fetching metrics" },
      { status: 500 }
    );
  }
}
