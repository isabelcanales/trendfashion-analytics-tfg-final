"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { User, Mail, Building2, Save, Star, Heart } from "lucide-react";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import SubscriptionCard from "@/components/SubscriptionCard";

interface FavoriteBrand {
  id: string;
  name: string;
  category: string;
  country: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [favoriteBrands, setFavoriteBrands] = useState<FavoriteBrand[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    consultancy: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        consultancy: (session.user as any)?.consultancy || "",
      });

      // Cargar marcas favoritas
      fetchFavoriteBrands();
    }
  }, [session, status, router]);

  const fetchFavoriteBrands = async () => {
    try {
      const response = await fetch("/api/brands/favorites");
      const data = await response.json();

      if (data.favoriteBrands) {
        setFavoriteBrands(data.favoriteBrands);
      }
    } catch (error) {
      console.error("Error cargando marcas favoritas:", error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Nombre y email son obligatorios");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          consultancy: formData.consultancy || "Mi Consultora",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Error al actualizar el perfil");
        return;
      }

      toast.success("Perfil actualizado correctamente");
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      toast.error("Error al actualizar el perfil");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a2638] mx-auto mb-4"></div>
            <p>Cargando perfil...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
              Mi Cuenta
            </p>
            <h1 className="font-serif text-5xl font-bold text-[#151111] md:text-6xl">
              Gestiona tu perfil
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-7 text-[#6d6260]">
            Actualiza tu información personal y sigue tus marcas favoritas para un análisis personalizado.
          </p>
        </div>

        {/* Profile Section */}
        <div className="mb-12 rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#8a2638] to-[#c8a96a] flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#151111]">
                {formData.name}
              </h2>
              <p className="text-sm text-[#6d6260]">{formData.email}</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6 mb-8 pt-8 border-t border-[#eadbd4]">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-[#151111] mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#8a2638]" />
                  Nombre completo
                </div>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 rounded-[16px] transition focus:outline-none ${
                  isEditing
                    ? "border-[#8a2638] bg-white focus:ring-2 focus:ring-[#8a2638]/20"
                    : "border-[#eadbd4] bg-[#f7ece8] text-[#6d6260]"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#151111] mb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#8a2638]" />
                  Email
                </div>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 rounded-[16px] transition focus:outline-none ${
                  isEditing
                    ? "border-[#8a2638] bg-white focus:ring-2 focus:ring-[#8a2638]/20"
                    : "border-[#eadbd4] bg-[#f7ece8] text-[#6d6260]"
                }`}
              />
            </div>

            {/* Consultancy - Solo mostrar si tiene valor */}
            {isEditing || formData.consultancy ? (
              <div>
                <label className="block text-sm font-semibold text-[#151111] mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#8a2638]" />
                    Nombre de la consultora{" "}
                    <span className="text-gray-400 text-xs font-normal">(opcional)</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="consultancy"
                  value={formData.consultancy}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Mi Consultora Fashion"
                  className={`w-full px-4 py-3 border-2 rounded-[16px] transition focus:outline-none ${
                    isEditing
                      ? "border-[#8a2638] bg-white focus:ring-2 focus:ring-[#8a2638]/20"
                      : "border-[#eadbd4] bg-[#f7ece8] text-[#6d6260]"
                  }`}
                />
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-8 border-t border-[#eadbd4]">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-[12px] bg-[#8a2638] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a1f2a]"
              >
                Editar perfil
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-[12px] bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: session?.user?.name || "",
                      email: session?.user?.email || "",
                      consultancy: (session?.user as any)?.consultancy || "",
                    });
                  }}
                  className="rounded-[12px] border-2 border-[#eadbd4] px-6 py-3 text-sm font-semibold text-[#8a2638] transition hover:bg-[#f7ece8]"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Subscription Section */}
        <div className="mb-12">
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
              Tu Suscripción
            </p>
            <h2 className="font-serif text-3xl font-bold text-[#151111] md:text-4xl">
              Plan de beneficios
            </h2>
          </div>
          <SubscriptionCard currentPlan={(session?.user as any)?.plan} />
        </div>

        {/* Favorites Dashboard Section */}
        <div className="rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-[#8a2638]/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-[#8a2638]" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#151111]">
                Panel personalizado
              </h2>
            </div>
            <p className="text-sm text-[#6d6260]">
              Sigue tus marcas favoritas para un análisis detallado y acceso rápido a sus métricas.
            </p>
          </div>

          {loadingFavorites ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8a2638] mb-3"></div>
                <p className="text-sm text-[#6d6260]">Cargando marcas favoritas...</p>
              </div>
            </div>
          ) : favoriteBrands.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favoriteBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.name
                    .toLowerCase()
                    .replaceAll("&", "and")
                    .replaceAll(" ", "-")}`}
                  className="group rounded-[20px] border-2 border-[#eadbd4] bg-gradient-to-br from-white to-[#f7ece8] p-5 transition hover:border-[#8a2638] hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#8a2638] mb-1">
                        {brand.category}
                      </p>
                      <h3 className="font-serif text-xl font-bold text-[#151111] group-hover:text-[#8a2638] transition">
                        {brand.name}
                      </h3>
                    </div>
                    <Heart className="w-5 h-5 text-[#8a2638] fill-current flex-shrink-0" />
                  </div>
                  <p className="text-xs text-[#6d6260]">{brand.country}</p>
                  <div className="mt-4 pt-4 border-t border-[#eadbd4]">
                    <span className="text-xs font-semibold text-[#8a2638]">
                      Ver análisis →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block rounded-full bg-[#f7ece8] p-4 mb-4">
                <Star className="w-8 h-8 text-[#8a2638]" />
              </div>
              <h3 className="font-semibold text-[#151111] mb-2">
                No tienes marcas favoritas
              </h3>
              <p className="text-sm text-[#6d6260] mb-6">
                Ve a la sección de{" "}
                <Link
                  href="/brands"
                  className="font-semibold text-[#8a2638] hover:underline"
                >
                  marcas
                </Link>
                {" "}y marca tus favoritas con una estrella.
              </p>
              <Link
                href="/brands"
                className="inline-flex rounded-[12px] bg-[#8a2638] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a1f2a]"
              >
                Descubrir marcas
              </Link>
            </div>
          )}
        </div>

      </div>
    </PageContainer>
  );
}
