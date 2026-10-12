"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none bg-transparent">
      <motion.div
        className="h-full bg-gradient-to-r from-[#9B7524] via-[#ECC876] to-[#FFE8A3] origin-left shadow-[0_0_12px_rgba(201,162,75,0.8)]"
        style={{ scaleX }}
      />
    </div>
  );
};
