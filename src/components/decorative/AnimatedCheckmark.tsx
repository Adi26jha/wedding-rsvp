"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedCheckmarkProps {
  size?: number;
  className?: string;
  strokeColor?: string;
}

export const AnimatedCheckmark: React.FC<AnimatedCheckmarkProps> = ({
  size = 20,
  className = "",
  strokeColor = "#C9A24B",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M4.5 12.75L9.5 17.75L19.5 6.75"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </svg>
  );
};
