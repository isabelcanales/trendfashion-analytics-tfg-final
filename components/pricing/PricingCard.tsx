"use client";

import { Check, ArrowRight } from "lucide-react";
import { useState } from "react";

type PricingCardProps = {
  plan: "basic" | "pro" | "premium";
  title: string;
  price: string;
  description: string;
  features: string[];
  onSelectPlan: (plan: string) => void;
  highlighted?: boolean;
};

export default function PricingCard({
  plan,
  title,
  price,
  description,
  features,
  onSelectPlan,
  highlighted = false,
}: PricingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Different styles for each plan
  const getStyles = () => {
    switch (plan) {
      case "premium":
        return {
          borderColor: "border-[#C8A96A]",
          bgColor: "bg-gradient-to-br from-[#fffdf9]/85 to-[#fffdf9]/70",
          textColor: "text-[#171314]",
          accentColor: "text-[#C8A96A]",
          buttonBg: "bg-gradient-to-r from-[#C8A96A] to-[#d8a7b1]",
          buttonText: "text-[#151111]",
          badgeBg: "bg-[#C8A96A]/20",
          badgeText: "text-[#C8A96A]",
          glowColor: "shadow-[#C8A96A]/20",
        };
      case "pro":
        return {
          borderColor: "border-[#d8a7b1]",
          bgColor: "bg-gradient-to-br from-[#fffdf9]/80 to-[#fffdf9]/65",
          textColor: "text-[#171314]",
          accentColor: "text-[#d8a7b1]",
          buttonBg: "bg-gradient-to-r from-[#d8a7b1] to-[#C8A96A]",
          buttonText: "text-[#151111]",
          badgeBg: "bg-[#d8a7b1]/20",
          badgeText: "text-[#d8a7b1]",
          glowColor: "shadow-[#d8a7b1]/20",
        };
      case "basic":
      default:
        return {
          borderColor: "border-[#eadfd3]",
          bgColor: "bg-[#fffdf9]/60",
          textColor: "text-[#171314]",
          accentColor: "text-[#7A2E3A]",
          buttonBg: "bg-[#7A2E3A]",
          buttonText: "text-[#fffdf9]",
          badgeBg: "bg-[#7A2E3A]/20",
          badgeText: "text-[#7A2E3A]",
          glowColor: "shadow-[#7A2E3A]/15",
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`relative h-full ${isHovered ? "z-30" : "z-10"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect para premium */}
      {highlighted && isHovered && (
        <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-[#C8A96A]/30 to-[#d8a7b1]/20 blur-2xl opacity-60" />
      )}

      <article
        className={`group relative overflow-hidden rounded-[1.5rem] border-2 ${styles.borderColor} ${styles.bgColor} p-8 backdrop-blur transition duration-300 ${
          isHovered ? "scale-[1.01] shadow-2xl" : "shadow-lg"
        } ${styles.glowColor} flex flex-col h-full ${isHovered ? "z-20" : "z-0"}`}
      >
        {/* Shine effect */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.4)_45%,transparent_70%)] transition-transform duration-1000 group-hover:translate-x-[120%]" />
        </div>

        {/* Gradient orbs for premium */}
        {highlighted && (
          <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#C8A96A]/25 blur-3xl" />
            <div className="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-[#d8a7b1]/20 blur-3xl" />
          </div>
        )}

        <div className="relative z-10 flex-grow">
          {/* Badge */}
          {highlighted && (
            <div className={`inline-block ${styles.badgeBg} ${styles.badgeText} rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wider mb-4`}>
              Más Popular
            </div>
          )}

          {/* Title & Description */}
          <h3 className={`text-2xl font-bold tracking-tight ${styles.textColor} mb-2`}>
            {title}
          </h3>
          <p className="text-sm text-[#6b625f] mb-6">{description}</p>

          {/* Price */}
          <div className="mb-8">
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-bold ${styles.accentColor}`}>
                {price}
              </span>
              {price !== "Gratis" && <span className="text-sm text-[#b8a9a6]">/mes</span>}
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {features.map((feature, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <Check className={`w-5 h-5 ${styles.accentColor} flex-shrink-0 mt-0.5`} />
                <span className={`text-sm leading-6 ${styles.textColor}`}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Button */}
        <button
          onClick={() => onSelectPlan(plan)}
          className={`${styles.buttonBg} ${styles.buttonText} w-full py-3 rounded-lg font-semibold text-sm transition duration-300 flex items-center justify-center gap-2 group/btn hover:shadow-xl ${
            highlighted ? "hover:scale-105" : "hover:translate-x-1"
          }`}
        >
          {plan === "basic" ? "Comenzar" : "Elegir Plan"}
          <ArrowRight className="w-4 h-4 transition group-hover/btn:translate-x-1" />
        </button>
      </article>
    </div>
  );
}
