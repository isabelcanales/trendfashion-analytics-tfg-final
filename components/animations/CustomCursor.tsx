"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const addHover = () => setIsHovering(true);
    const removeHover = () => setIsHovering(false);

    window.addEventListener("mousemove", move);

    const hoverElements = document.querySelectorAll("a, button");

    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      window.removeEventListener("mousemove", move);

      hoverElements.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
    };
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed z-[9999] h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
        }}
      />

      <div
        className="pointer-events-none fixed z-[9998] rounded-full border border-white mix-blend-difference transition-all duration-200"
        style={{
          width: isHovering ? 42 : 26,
          height: isHovering ? 42 : 26,
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
        }}
      />
    </>
  );
}