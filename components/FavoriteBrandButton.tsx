"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export function FavoriteBrandButton({ brandName }: { brandName: string }) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session?.user) return;

    async function checkFavorite() {
      try {
        const response = await fetch("/api/brands/favorites");
        const data = await response.json();
        setIsFavorite(data.favorites?.includes(brandName) || false);
      } catch (error) {
        console.error("Error verificando favorito:", error);
      }
    }

    checkFavorite();
  }, [session, brandName]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast.error("Inicia sesión para marcar favoritos");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/brands/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          isFavorite: !isFavorite,
        }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        toast.success(
          isFavorite ? "Marca desfavorecida" : "Marca agregada a favoritos"
        );
      } else {
        toast.error("Error al actualizar favoritos");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar favoritos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className="rounded-full p-2 transition hover:bg-white/10 disabled:opacity-50"
      title={isFavorite ? "Remover de favoritos" : "Agregar a favoritos"}
    >
      <Star
        className={`w-5 h-5 transition ${
          isFavorite
            ? "fill-[#8a2638] text-[#8a2638]"
            : "text-gray-400 hover:text-[#8a2638]"
        }`}
      />
    </button>
  );
}
