"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export const CustomGoldCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  const dotSpringConfig = { damping: 40, stiffness: 800 };
  const dotX = useSpring(-100, dotSpringConfig);
  const dotY = useSpring(-100, dotSpringConfig);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReducedMotion) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = target.closest("button, a, input, textarea, select, [role='button'], label");
      setIsHovering(Boolean(isInteractive));
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Floating Halo Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-gold-400/80 bg-gold-300/10 shadow-[0_0_15px_rgba(201,162,75,0.45)] backdrop-blur-[0.5px]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? 46 : 28,
          height: isHovering ? 46 : 28,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      {/* Center Gold Pin Dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-amber-200 shadow-[0_0_8px_rgba(201,162,75,0.9)]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? 8 : 5,
          height: isHovering ? 8 : 5,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
      />
    </div>
  );
};
