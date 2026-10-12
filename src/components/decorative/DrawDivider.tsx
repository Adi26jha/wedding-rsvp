"use client";

import React from "react";
import { motion } from "framer-motion";

interface DrawDividerProps {
  className?: string;
  variant?: "lotus" | "diamond";
}

export const DrawDivider: React.FC<DrawDividerProps> = ({
  className = "",
  variant = "lotus",
}) => {
  return (
    <div className={`flex items-center justify-center gap-3 my-10 select-none overflow-hidden ${className}`}>
      {/* Left Drawing Wing Line */}
      <svg
        className="w-20 sm:w-36 h-4 overflow-visible"
        viewBox="0 0 150 16"
        fill="none"
      >
        <motion.path
          d="M 150 8 L 0 8"
          stroke="url(#drawGoldGradLeft)"
          strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="drawGoldGradLeft" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#C9A24B" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#ECC876" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C9A24B" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Motif (Lotus or Diamond) */}
      <motion.div
        initial={{ scale: 0, rotate: -20, opacity: 0 }}
        whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center shrink-0 text-gold-500"
      >
        {variant === "lotus" ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-6 h-6 text-gold-500 drop-shadow-sm"
            strokeWidth="1.2"
          >
            <path
              d="M12 3C12 3 8 8 8 13C8 16 10 18 12 18C14 18 16 16 16 13C16 8 12 3 12 3Z"
              fill="rgba(201, 162, 75, 0.2)"
            />
            <path d="M6 13C6 13 3 15 3 17C3 19 6 20 8 18" />
            <path d="M18 13C18 13 21 15 21 17C21 19 18 20 16 18" />
            <circle cx="12" cy="18" r="1.5" fill="currentColor" />
          </svg>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rotate-45 border border-gold-500 bg-gold-200" />
            <span className="h-2.5 w-2.5 rotate-45 bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 shadow-sm" />
            <span className="h-1.5 w-1.5 rotate-45 border border-gold-500 bg-gold-200" />
          </div>
        )}
      </motion.div>

      {/* Right Drawing Wing Line */}
      <svg
        className="w-20 sm:w-36 h-4 overflow-visible"
        viewBox="0 0 150 16"
        fill="none"
      >
        <motion.path
          d="M 0 8 L 150 8"
          stroke="url(#drawGoldGradRight)"
          strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="drawGoldGradRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A24B" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#ECC876" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C9A24B" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
