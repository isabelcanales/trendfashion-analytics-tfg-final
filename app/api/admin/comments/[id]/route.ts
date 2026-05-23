import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const comment = await prisma.comment.delete({
      where: { id },
    });

    console.log(`Comment ${id} deleted successfully`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Error al eliminar comentario" },
      { status: 500 }
    );
  }
}
