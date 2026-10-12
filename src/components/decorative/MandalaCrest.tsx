import React from "react";

interface MandalaCrestProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const MandalaCrest: React.FC<MandalaCrestProps> = ({
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-20 h-20 text-xs",
    md: "w-32 h-32 text-base",
    lg: "w-44 h-44 text-2xl",
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      {/* Decorative Outer Mandala Ring SVG */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full text-gold-500/80 animate-[spin_120s_linear_infinite]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        {/* Outer dotted orbit */}
        <circle
          cx="100"
          cy="100"
          r="92"
          strokeDasharray="2 6"
          strokeOpacity="0.6"
        />
        {/* Scalloped petals / arches */}
        <circle cx="100" cy="100" r="82" strokeOpacity="0.4" />
        <circle cx="100" cy="100" r="74" strokeOpacity="0.7" />

        {/* 12-point floral petals */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12;
          return (
            <g key={i} transform={`rotate(${angle} 100 100)`}>
              <path
                d="M 100 26 C 94 38, 94 48, 100 58 C 106 48, 106 38, 100 26 Z"
                fill="currentColor"
                fillOpacity="0.1"
              />
              <circle cx="100" cy="20" r="1.5" fill="currentColor" />
            </g>
          );
        })}

        {/* Inner geometric ring */}
        <circle
          cx="100"
          cy="100"
          r="60"
          strokeWidth="0.8"
          strokeDasharray="4 4"
          strokeOpacity="0.5"
        />
      </svg>

      {/* Center Monogram */}
      <div className="z-10 flex flex-col items-center justify-center text-center">
        <span className="font-serif tracking-widest text-maroon-700 font-normal">
          <span className="text-2xl sm:text-3xl font-medium">P</span>
          <span className="text-xs sm:text-sm text-gold-600 px-1 italic">&amp;</span>
          <span className="text-2xl sm:text-3xl font-medium">J</span>
        </span>
        <span className="text-[9px] uppercase tracking-[0.25em] text-gold-600/90 font-sans mt-0.5">
          2026
        </span>
      </div>
    </div>
  );
};
