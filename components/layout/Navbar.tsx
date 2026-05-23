"use client";

import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import TransitionLink from "@/components/animations/TransitionLink";
import { LogIn, LogOut, Settings, User, Menu, X, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Noticias", href: "/news" },
  { label: "Marcas", href: "/brands" },
  { label: "Tendencias", href: "/trends" },
  { label: "Timeline", href: "/trends-timeline" },
  { label: "Comparativas", href: "/comparison" },
  { label: "Informes", href: "/reports" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => setIsMenuOpen(false);

  // Implementar click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("pointerdown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfd3] bg-[#fffdf9]/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <TransitionLink href="/" className="flex flex-col leading-none">
          <span className="text-lg font-bold tracking-tight text-[#171314]">
            TrendFashion
          </span>
          <span className="text-xs uppercase tracking-[0.35em] text-[#7A2E3A]">
            Analytics
          </span>
        </TransitionLink>

        {/* Secciones principales - visible en desktop */}
        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <TransitionLink
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#171314] text-[#fffdf9]"
                    : "text-[#4f4643] hover:bg-[#f1e4dc] hover:text-[#171314]"
                }`}
              >
                {item.label}
              </TransitionLink>
            );
          })}

          {/* Botón Planes - Premium CTA */}
          <TransitionLink
            href="/pricing"
            className={`ml-4 rounded-full px-4 py-2 text-sm font-semibold transition flex items-center gap-2 ${
              pathname === "/pricing"
                ? "bg-gradient-to-r from-[#d8a7b1] to-[#C8A96A] text-[#151111] shadow-lg shadow-[#d8a7b1]/30"
                : "bg-gradient-to-r from-[#d8a7b1]/80 to-[#C8A96A]/80 text-[#151111] hover:from-[#d8a7b1] hover:to-[#C8A96A] hover:shadow-lg hover:shadow-[#d8a7b1]/30"
            }`}
          >
            <Zap className="w-4 h-4" />
            Planes
          </TransitionLink>
        </div>

        {/* Menú hamburguesa */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 rounded-full bg-[#171314] px-4 py-2 text-[#FFFDF9] transition hover:bg-[#7A2E3A]"
            aria-label="Abrir menú"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-[#eadfd3] bg-[#fffdf9] shadow-lg">
              {/* Radar de moda */}
              <TransitionLink
                href="/radar"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#171314] transition hover:bg-[#f1e4dc]"
              >
                Radar de moda
              </TransitionLink>

              {/* Planes - Mobile CTA */}
              <TransitionLink
                href="/pricing"
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition ${
                  pathname === "/pricing"
                    ? "bg-gradient-to-r from-[#d8a7b1] to-[#C8A96A] text-[#151111]"
                    : "text-[#d8a7b1] hover:bg-[#d8a7b1]/10"
                }`}
              >
                <Zap className="w-4 h-4" />
                Planes Premium
              </TransitionLink>

              {/* Divider */}
              {status !== "loading" && (
                <>
                  <div className="border-t border-[#eadfd3]" />

                  {/* Secciones en mobile */}
                  <div className="block md:hidden border-b border-[#eadfd3]">
                    {navItems.map((item) => {
                      const isActive =
                        item.href === "/"
                          ? pathname === "/"
                          : pathname === item.href || pathname.startsWith(item.href + "/");

                      return (
                        <TransitionLink
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          className={`block px-4 py-2 text-sm font-medium transition ${
                            isActive
                              ? "bg-[#171314] text-[#fffdf9]"
                              : "text-[#4f4643] hover:bg-[#f1e4dc]"
                          }`}
                        >
                          {item.label}
                        </TransitionLink>
                      );
                    })}
                  </div>

                  <div className="border-t border-[#eadfd3]" />

                  {/* Auth Section */}
                  {session?.user ? (
                    <>
                      {/* Profile */}
                      <TransitionLink
                        href="/profile"
                        onClick={closeMenu}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#8a2638] transition hover:bg-[#f1e4dc]"
                      >
                        <User className="w-4 h-4" />
                        Perfil
                      </TransitionLink>

                      {/* Admin - Solo si es admin */}
                      {(session.user as any)?.role === "admin" && (
                        <TransitionLink
                          href="/admin"
                          onClick={closeMenu}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#8a2638] transition hover:bg-[#f1e4dc]"
                        >
                          <Settings className="w-4 h-4" />
                          Admin
                        </TransitionLink>
                      )}

                      {/* Sign Out */}
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: "/" });
                          closeMenu();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#8a2638] transition hover:bg-[#f1e4dc] text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Salir
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        signIn();
                        closeMenu();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#8a2638] transition hover:bg-[#f1e4dc] text-left"
                    >
                      <LogIn className="w-4 h-4" />
                      Iniciar sesión
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}