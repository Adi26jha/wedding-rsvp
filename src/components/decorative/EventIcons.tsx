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

export const SangeetIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} strokeWidth="1.5">
    {/* Traditional Indian Dholak Drum */}
    <ellipse cx="6" cy="12" rx="2" ry="5" stroke="currentColor" fill="currentColor" fillOpacity="0.2" />
    <ellipse cx="18" cy="12" rx="2" ry="5" stroke="currentColor" fill="currentColor" fillOpacity="0.2" />
    <path d="M 6 7 Q 12 5 18 7" stroke="currentColor" />
    <path d="M 6 17 Q 12 19 18 17" stroke="currentColor" />
    {/* Diagonal leather laces */}
    <path d="M 6 7 L 18 17" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
    <path d="M 6 17 L 18 7" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
    {/* Rhythm note sparkle */}
    <path d="M 12 2 L 13 4 L 15 4 L 13.5 5.5 L 14 7.5 L 12 6.5 L 10 7.5 L 10.5 5.5 L 9 4 L 11 4 Z" fill="currentColor" opacity="0.5" />
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
