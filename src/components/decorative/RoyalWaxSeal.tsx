import React from "react";

interface RoyalWaxSealProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const RoyalWaxSeal: React.FC<RoyalWaxSealProps> = ({
  className = "",
  size = "md",
}) => {
  const sizeMap = {
    sm: "w-16 h-16 text-xs",
    md: "w-24 h-24 text-base",
    lg: "w-32 h-32 text-xl",
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}
    >
      {/* 3D Wax Seal SVG Body */}
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-[0_8px_16px_rgba(78,18,29,0.35)]"
      >
        <defs>
          {/* Radial gradient for rich wax sheen */}
          <radialGradient id="waxGradient" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#8A2335" />
            <stop offset="60%" stopColor="#5C1420" />
            <stop offset="100%" stopColor="#3A0B14" />
          </radialGradient>

          {/* Antique Gold Metallic Gradient */}
          <linearGradient id="goldRimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E9D4A1" />
            <stop offset="40%" stopColor="#C5A059" />
            <stop offset="70%" stopColor="#8B6925" />
            <stop offset="100%" stopColor="#E1C898" />
          </linearGradient>

          <filter id="emboss">
            <feDropShadow dx="0.5" dy="1" stdDeviation="0.5" floodColor="#1a0408" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Outer Irregular Organic Wax Contour */}
        <path
          d="M60 4 C76 3, 90 12, 100 24 C112 38, 117 56, 114 74 C111 92, 98 108, 80 114 C62 120, 42 116, 26 106 C10 94, 2 76, 4 58 C6 38, 18 18, 36 8 C44 4, 52 4, 60 4 Z"
          fill="url(#waxGradient)"
        />

        {/* Outer Stamped Gold Filigree Ring */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="url(#goldRimGradient)"
          strokeWidth="1.5"
          strokeDasharray="1.5 3.5"
          opacity="0.85"
        />

        {/* Inner Solid Gold Boundary */}
        <circle
          cx="60"
          cy="60"
          r="41"
          fill="none"
          stroke="url(#goldRimGradient)"
          strokeWidth="0.8"
          opacity="0.9"
        />

        {/* Royal Emblem Inner Ring */}
        <circle
          cx="60"
          cy="60"
          r="38"
          fill="none"
          stroke="#420B15"
          strokeWidth="1"
          opacity="0.7"
        />
      </svg>

      {/* Center Monogram Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none">
        <span
          className="font-serif tracking-widest text-[#E9D4A1] font-medium leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.7), 0 0 1px #fff2cc" }}
        >
          <span className="text-xl sm:text-2xl font-serif">P</span>
          <span className="text-xs italic text-[#D8B677] px-0.5">&amp;</span>
          <span className="text-xl sm:text-2xl font-serif">J</span>
        </span>
        <span
          className="text-[7px] uppercase tracking-[0.22em] text-[#C5A059] font-sans mt-0.5 font-semibold"
          style={{ textShadow: "0 1px 1px rgba(0,0,0,0.6)" }}
        >
          2026
        </span>
      </div>
    </div>
  );
};
