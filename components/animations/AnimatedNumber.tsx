"use client";

import { useEffect, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
};

export default function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1200,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;

      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(value * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}