import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        favoriteBrands: {
          include: { brand: true },
        },
      },
    });

    const favorites = user?.favoriteBrands.map((fav) => fav.brand.name) || [];
    const favoriteBrands =
      user?.favoriteBrands.map((fav) => ({
        id: fav.brand.id,
        name: fav.brand.name,
        category: fav.brand.category,
        country: fav.brand.country,
      })) || [];

    return Response.json({ favorites, favoriteBrands });
  } catch (error) {
    console.error("Error obteniendo favoritos:", error);
    return Response.json(
      { error: "Error obteniendo favoritos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const { brandName, isFavorite } = await request.json();

  if (!brandName) {
    return Response.json({ error: "Nombre de marca requerido" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return Response.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const brand = await prisma.brand.findUnique({
      where: { name: brandName },
    });

    if (!brand) {
      // Crear la marca si no existe
      const newBrand = await prisma.brand.create({
        data: {
          name: brandName,
          category: "Tracked",
          country: "Global",
        },
      });

      if (isFavorite) {
        await prisma.brandFavorite.create({
          data: {
            userId: user.id,
            brandId: newBrand.id,
          },
        });
      }

      return Response.json({ success: true, isFavorite });
    }

    if (isFavorite) {
      await prisma.brandFavorite.create({
        data: {
          userId: user.id,
          brandId: brand.id,
        },
      });
    } else {
      await prisma.brandFavorite.deleteMany({
        where: {
          userId: user.id,
          brandId: brand.id,
        },
      });
    }

    return Response.json({ success: true, isFavorite });
  } catch (error: any) {
    if (error.code === "P2002") {
      // La marca ya está marcada como favorita, desmarcarla
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      const brand = await prisma.brand.findUnique({
        where: { name: brandName },
      });

      if (user && brand) {
        await prisma.brandFavorite.deleteMany({
          where: {
            userId: user.id,
            brandId: brand.id,
          },
        });
      }

      return Response.json({ success: true, isFavorite: false });
    }

    console.error("Error actualizando favoritos:", error);
    return Response.json(
      { error: "Error actualizando favoritos" },
      { status: 500 }
    );
  }
}
