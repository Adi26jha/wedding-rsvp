import React from "react";

interface GoldDividerProps {
  className?: string;
  variant?: "diamond" | "lotus" | "simple";
}

export const GoldDivider: React.FC<GoldDividerProps> = ({
  className = "",
  variant = "diamond",
}) => {
  return (
    <div className={`flex items-center justify-center gap-3 my-8 ${className}`}>
      <span className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent via-gold-400 to-gold-600 opacity-60" />

      {variant === "diamond" && (
        <div className="flex items-center gap-1.5 text-gold-500">
          <span className="h-1.5 w-1.5 rotate-45 border border-gold-500 bg-gold-200" />
          <span className="h-2.5 w-2.5 rotate-45 bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 shadow-sm" />
          <span className="h-1.5 w-1.5 rotate-45 border border-gold-500 bg-gold-200" />
        </div>
      )}

      {variant === "lotus" && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-5 h-5 text-gold-500"
          strokeWidth="1.2"
        >
          <path d="M12 3C12 3 8 8 8 13C8 16 10 18 12 18C14 18 16 16 16 13C16 8 12 3 12 3Z" fill="rgba(197, 160, 89, 0.15)" />
          <path d="M6 13C6 13 3 15 3 17C3 19 6 20 8 18" />
          <path d="M18 13C18 13 21 15 21 17C21 19 18 20 16 18" />
          <circle cx="12" cy="18" r="1.5" fill="currentColor" />
        </svg>
      )}

      {variant === "simple" && (
        <span className="h-2 w-2 rounded-full bg-gold-400 opacity-80" />
      )}

      <span className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent via-gold-400 to-gold-600 opacity-60" />
    </div>
  );
};
