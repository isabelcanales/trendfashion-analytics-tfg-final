import { useState } from "react";
import type { MetricType } from "@/types/forecast";

export interface AIForecastModalState {
  isOpen: boolean;
  brand?: string;
  metric?: MetricType;
  timeHorizon?: "corto" | "medio" | "largo";
}

export function useAIForecastModal() {
  const [state, setState] = useState<AIForecastModalState>({
    isOpen: false,
  });

  const open = (
    brand: string,
    metric: MetricType = "popularity",
    timeHorizon: "corto" | "medio" | "largo" = "medio"
  ) => {
    setState({
      isOpen: true,
      brand,
      metric,
      timeHorizon,
    });
  };

  const close = () => {
    setState({ isOpen: false });
  };

  return {
    ...state,
    open,
    close,
  };
}
