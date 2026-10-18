import React from "react";

export const HaldiIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} strokeWidth="1.5">
    {/* Turmeric Pot / Urli with Floral Petals */}
    <ellipse cx="12" cy="14" rx="8" ry="4" stroke="currentColor" fill="currentColor" fillOpacity="0.15" />
    <path d="M 4 14 C 4 18, 20 18, 20 14" stroke="currentColor" />
    <path d="M 12 4 C 11 7, 13 8, 12 11" stroke="currentColor" strokeDasharray="1 1" />
    {/* Marigold flower rays at apex */}
    <circle cx="12" cy="7" r="2.5" fill="currentColor" fillOpacity="0.4" />
    <circle cx="9" cy="6" r="1.5" fill="currentColor" fillOpacity="0.2" />
    <circle cx="15" cy="6" r="1.5" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

export const CocktailRingIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} strokeWidth="1.5">
    {/* Interlocking Rings and Cocktail Sparkle */}
    <circle cx="9" cy="14" r="5" stroke="currentColor" fill="currentColor" fillOpacity="0.1" />
    <circle cx="15" cy="14" r="5" stroke="currentColor" fill="currentColor" fillOpacity="0.1" />
    {/* Diamond atop the ring */}
    <polygon points="9,6 11,9 9,10 7,9" stroke="currentColor" fill="currentColor" fillOpacity="0.4" />
    {/* Starlight sparkles for All-Bling */}
    <path d="M 19 4 L 19.5 6 L 21.5 6.5 L 19.5 7 L 19 9 L 18.5 7 L 16.5 6.5 L 18.5 6 Z" fill="currentColor" />
    <path d="M 4 5 L 4.5 6.5 L 6 7 L 4.5 7.5 L 4 9 L 3.5 7.5 L 2 7 L 3.5 6.5 Z" fill="currentColor" opacity="0.7" />
  </svg>
);

export const SangeetIcon = CocktailRingIcon;

export const ChoodaIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} strokeWidth="1.5">
    {/* Chooda Bangles (Red & Ivory Stack) */}
    <ellipse cx="12" cy="7" rx="7" ry="2.5" stroke="currentColor" fill="currentColor" fillOpacity="0.2" />
    <ellipse cx="12" cy="9" rx="7" ry="2.5" stroke="currentColor" strokeDasharray="1 1" />
    <ellipse cx="12" cy="11" rx="7" ry="2.5" stroke="currentColor" fill="currentColor" fillOpacity="0.15" />
    <ellipse cx="12" cy="13" rx="7" ry="2.5" stroke="currentColor" />
    {/* Hanging Kalire / Ornate Bell Tassels */}
    <path d="M 9 14 L 8 18 L 10 18 Z" stroke="currentColor" fill="currentColor" fillOpacity="0.3" />
    <circle cx="9" cy="20" r="1" fill="currentColor" />
    <path d="M 15 14 L 14 18 L 16 18 Z" stroke="currentColor" fill="currentColor" fillOpacity="0.3" />
    <circle cx="15" cy="20" r="1" fill="currentColor" />
    {/* Central heart of love */}
    <path d="M 12 3 C 11.5 2 10.5 2 10 2.5 C 9.5 3 9.5 4 12 5.5 C 14.5 4 14.5 3 14 2.5 C 13.5 2 12.5 2 12 3 Z" fill="currentColor" />
  </svg>
);

export const WeddingIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} strokeWidth="1.5">
    {/* Sacred Havan Kund (Fire Altar for Saat Phere) */}
    <path d="M 5 17 L 19 17 L 16 21 L 8 21 Z" stroke="currentColor" fill="currentColor" fillOpacity="0.2" />
    <line x1="3" y1="17" x2="21" y2="17" stroke="currentColor" />
    {/* Auspicious Flames */}
    <path d="M 12 4 C 10 7, 9 9, 12 14 C 15 9, 14 7, 12 4 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
    <path d="M 10 11 C 9 12, 10 13, 11 14" stroke="currentColor" opacity="0.7" />
    <path d="M 14 11 C 15 12, 14 13, 13 14" stroke="currentColor" opacity="0.7" />
    {/* Garland Arc */}
    <path d="M 6 13 Q 12 16 18 13" stroke="currentColor" strokeDasharray="1.5 2" opacity="0.6" />
  </svg>
);
