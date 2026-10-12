import React from "react";

interface FloralArchProps {
  children: React.ReactNode;
  className?: string;
  variant?: "hero" | "card" | "compact";
}

export const FloralArch: React.FC<FloralArchProps> = ({
  children,
  className = "",
  variant = "hero",
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Top Cusped Mughal Mehrab Arch SVG Frame */}
      <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden pointer-events-none flex justify-center opacity-85">
        <svg
          viewBox="0 0 600 80"
          className="w-full max-w-2xl h-full text-gold-500"
          preserveAspectRatio="none"
          fill="none"
          stroke="currentColor"
        >
          {/* Outer Mehrab Arch with cusps */}
          <path
            d="M 15 75 Q 120 75 190 55 C 230 45 250 30 270 25 C 285 20 295 8 300 3 C 305 8 315 20 330 25 C 350 30 370 45 410 55 Q 480 75 585 75"
            strokeWidth="1.5"
            stroke="url(#mehrabGrad)"
          />
          {/* Inner Dotted Filigree Arch */}
          <path
            d="M 40 78 Q 135 78 200 60 C 235 52 255 38 273 34 C 287 30 295 18 300 13 C 305 18 313 30 327 34 C 345 38 365 52 400 60 Q 465 78 560 78"
            strokeWidth="1"
            stroke="#ECC876"
            strokeOpacity="0.6"
            strokeDasharray="4 4"
          />
          {/* Apex Kalash / Lotus finial */}
          <polygon
            points="300,1 305,8 300,15 295,8"
            fill="url(#mehrabGrad)"
          />
          <circle cx="300" cy="1" r="2" fill="#FFE8A3" />

          <defs>
            <linearGradient id="mehrabGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C9A24B" stopOpacity="0.4" />
              <stop offset="30%" stopColor="#ECC876" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FFF2C6" stopOpacity="1" />
              <stop offset="70%" stopColor="#ECC876" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#C9A24B" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Ornate Corner Accents */}
      <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-gold-400 pointer-events-none rounded-tl-md flex items-start justify-start p-0.5">
        <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
      </div>
      <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-gold-400 pointer-events-none rounded-tr-md flex items-start justify-end p-0.5">
        <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
      </div>
      <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-gold-400 pointer-events-none rounded-bl-md flex items-end justify-start p-0.5">
        <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
      </div>
      <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-gold-400 pointer-events-none rounded-br-md flex items-end justify-end p-0.5">
        <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
      </div>

      {/* Subtle Inner Golden Inset Border */}
      <div className="absolute inset-2 sm:inset-3 rounded-[28px] border border-gold-300/35 pointer-events-none" />

      {/* Main Content inside arch */}
      <div className="relative z-10 pt-10 pb-8 px-4 sm:px-10">{children}</div>
    </div>
  );
};
