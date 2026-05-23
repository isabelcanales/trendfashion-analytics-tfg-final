"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Marcas", href: "/brands" },
    { label: "Tendencias", href: "/trends" },
    { label: "Timeline", href: "/trends-timeline" },
    { label: "Comparación", href: "/comparison" },
    { label: "Informes", href: "/reports" },
    { label: "Perfil", href: "/profile" },
  ];

  const resourcesLinks = [
    { label: "Noticias", href: "/news" },
    { label: "Radar de Moda", href: "/radar" },
    { label: "Análisis de Marcas", href: "/brands" },
    { label: "Predicción de Tendencias", href: "/trends-timeline" },
    { label: "Planes & Precios", href: "/pricing" },
  ];

  const legalLinks = [
    { label: "Política de Privacidad", href: "#" },
    { label: "Términos de Uso", href: "#" },
    { label: "Aviso Legal", href: "#" },
    { label: "Cookies", href: "#" },
  ];

  return (
    <footer className="border-t border-[#eadbd4] bg-[#151111] text-[#fffdf9]">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="group block">
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold tracking-tight text-[#fffdf9] group-hover:text-[#d8a7b1] transition">
                  TrendFashion
                </span>
                <span className="text-xs uppercase tracking-[0.35em] text-[#8a2638]">
                  Analytics
                </span>
              </div>
            </Link>
            <p className="text-sm leading-6 text-[#b8a9a6]">
              Plataforma de análisis de tendencias, marcas y comportamiento del sector moda basada en datos.
            </p>
            <div className="flex items-center gap-2 text-sm text-[#8a2638] hover:text-[#d8a7b1] transition cursor-pointer group">
              <Mail className="w-4 h-4 group-hover:scale-110 transition" />
              <a href="mailto:contacto@trendfashionanalytics.com">
                contacto@trendfashionanalytics.com
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-[#d8a7b1]">
              Navegación
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#b8a9a6] transition hover:text-[#d8a7b1] hover:pl-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-[#d8a7b1]">
              Recursos
            </h3>
            <ul className="space-y-3">
              {resourcesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#b8a9a6] transition hover:text-[#d8a7b1] hover:pl-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-[#d8a7b1]">
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={`${link.href}-${index}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#b8a9a6] transition hover:text-[#d8a7b1] hover:pl-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-[#3a2a28]" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm text-[#8a9099]">
            © {currentYear} TrendFashion Analytics. Todos los derechos reservados.
          </p>

          {/* Social/Additional Info */}
          <div className="flex items-center gap-6">
            <p className="text-xs text-[#7a8089]">
              Plataforma de análisis de tendencias basada en datos reales
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
