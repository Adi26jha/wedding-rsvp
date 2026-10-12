import React from "react";

export const RotatingMandala: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`pointer-events-none select-none overflow-hidden flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full text-gold-500/25 animate-[spin_160s_linear_infinite]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        {/* Outer orbital rings */}
        <circle cx="250" cy="250" r="235" strokeDasharray="3 6" opacity="0.6" />
        <circle cx="250" cy="250" r="215" opacity="0.4" />
        <circle cx="250" cy="250" r="195" opacity="0.7" />

        {/* 16-point Rajasthani/Mughal petal stars */}
        {[...Array(16)].map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <g key={i} transform={`rotate(${angle} 250 250)`}>
              <path
                d="M 250 55 C 235 95, 235 130, 250 160 C 265 130, 265 95, 250 55 Z"
                fill="currentColor"
                fillOpacity="0.06"
              />
              <circle cx="250" cy="45" r="3" fill="currentColor" opacity="0.8" />
            </g>
          );
        })}

        {/* Inner geometric rosette */}
        <circle cx="250" cy="250" r="140" strokeWidth="0.8" strokeDasharray="5 5" opacity="0.6" />
        <circle cx="250" cy="250" r="110" opacity="0.5" />

        {[...Array(8)].map((_, i) => {
          const angle = (i * 360) / 8 + 22.5;
          return (
            <g key={i} transform={`rotate(${angle} 250 250)`}>
              <polygon
                points="250,110 265,150 250,190 235,150"
                fill="currentColor"
                fillOpacity="0.08"
                strokeWidth="0.8"
              />
            </g>
          );
        })}

        {/* Center lotus core */}
        <circle cx="250" cy="250" r="60" strokeWidth="1" opacity="0.7" />
        <circle cx="250" cy="250" r="25" fill="currentColor" fillOpacity="0.1" />
      </svg>
    </div>
  );
};
