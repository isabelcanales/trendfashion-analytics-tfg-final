"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type RouteTransitionContextType = {
  isTransitioning: boolean;
  startTransition: () => void;
};

const RouteTransitionContext = createContext<RouteTransitionContextType | null>(
  null
);

export function useRouteTransition() {
  const context = useContext(RouteTransitionContext);

  if (!context) {
    throw new Error(
      "useRouteTransition debe usarse dentro de RouteTransitionProvider"
    );
  }

  return context;
}

export default function RouteTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = () => {
    setIsTransitioning(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTransitioning(false);
    }, 350);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <RouteTransitionContext.Provider
      value={{
        isTransitioning,
        startTransition,
      }}
    >
      {children}

      <div
        className={`pointer-events-none fixed bottom-0 left-0 right-0 top-[73px] z-40 bg-[#fffdf9] transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isTransitioning ? "opacity-100" : "opacity-0"
        }`}
      />
    </RouteTransitionContext.Provider>
  );
}