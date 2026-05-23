import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const ALLOWED_PLANS = ["pro", "premium"] as const;
type PaidPlan = (typeof ALLOWED_PLANS)[number];

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para actualizar tu plan" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const plan = body?.plan as PaidPlan | null;

    if (plan !== null && !ALLOWED_PLANS.includes(plan as PaidPlan)) {
      return NextResponse.json(
        { error: "Plan inválido. Usa pro, premium o null (basic)" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { plan },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user plan:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el plan" },
      { status: 500 }
    );
  }
}
