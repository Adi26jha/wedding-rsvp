"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoyalWaxSeal } from "../decorative/RoyalWaxSeal";
import { Sparkles, ArrowRight } from "lucide-react";

interface RoyalDoorIntroProps {
  onOpened?: () => void;
}

export const RoyalDoorIntro: React.FC<RoyalDoorIntroProps> = ({ onOpened }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    try {
      const alreadyOpened = sessionStorage.getItem("royal_doors_opened_v1");
      if (alreadyOpened === "true") {
        setIsOpen(true);
      }
    } catch {}
    setHasCheckedStorage(true);
  }, []);

  const handleOpen = () => {
    try {
      sessionStorage.setItem("royal_doors_opened_v1", "true");
    } catch {}
    setIsOpen(true);
    onOpened?.();
  };

  // Prevent flash before checking sessionStorage
  if (!hasCheckedStorage) return null;

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, delay: 0.6 } }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/60 backdrop-blur-sm pointer-events-auto select-none"
          onClick={handleOpen}
        >
          {/* Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            className="absolute top-6 right-6 z-50 px-4 py-2 rounded-full bg-black/40 border border-gold-400/40 text-gold-200 text-xs uppercase tracking-widest font-sans backdrop-blur-md hover:bg-black/60 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
          </button>

          {/* Left Palace Door */}
          <motion.div
            initial={{ x: 0 }}
            exit={{
              x: "-100%",
              transition: { duration: 1.1, ease: [0.77, 0, 0.175, 1] },
            }}
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-[#2A050D] via-[#4A0C19] to-[#390812] border-r border-gold-400/50 shadow-[10px_0_35px_rgba(0,0,0,0.8)] flex items-center justify-end overflow-hidden"
          >
            {/* Jaali Arch Pattern SVG Overlay */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C9A24B_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute top-8 bottom-8 left-8 right-2 border-2 border-gold-400/30 rounded-l-3xl pointer-events-none" />

            {/* Brass Studs */}
            <div className="absolute right-6 top-1/4 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 shadow-md border border-gold-700" />
            <div className="absolute right-6 top-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 shadow-md border border-gold-700" />
            <div className="absolute right-6 top-3/4 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 shadow-md border border-gold-700" />

            {/* Left Arch Half Outline */}
            <div className="relative pr-6 opacity-30 pointer-events-none">
              <svg width="120" height="300" viewBox="0 0 120 300" fill="none" stroke="currentColor" className="text-gold-400">
                <path d="M 0 10 Q 90 10 115 150 Q 90 290 0 290" strokeWidth="1.5" />
              </svg>
            </div>
          </motion.div>

          {/* Right Palace Door */}
          <motion.div
            initial={{ x: 0 }}
            exit={{
              x: "100%",
              transition: { duration: 1.1, ease: [0.77, 0, 0.175, 1] },
            }}
            className="absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-[#2A050D] via-[#4A0C19] to-[#390812] border-l border-gold-400/50 shadow-[-10px_0_35px_rgba(0,0,0,0.8)] flex items-center justify-start overflow-hidden"
          >
            {/* Jaali Arch Pattern SVG Overlay */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C9A24B_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute top-8 bottom-8 right-8 left-2 border-2 border-gold-400/30 rounded-r-3xl pointer-events-none" />

            {/* Brass Studs */}
            <div className="absolute left-6 top-1/4 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 shadow-md border border-gold-700" />
            <div className="absolute left-6 top-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 shadow-md border border-gold-700" />
            <div className="absolute left-6 top-3/4 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 shadow-md border border-gold-700" />

            {/* Right Arch Half Outline */}
            <div className="relative pl-6 opacity-30 pointer-events-none">
              <svg width="120" height="300" viewBox="0 0 120 300" fill="none" stroke="currentColor" className="text-gold-400">
                <path d="M 120 10 Q 30 10 5 150 Q 30 290 120 290" strokeWidth="1.5" />
              </svg>
            </div>
          </motion.div>

          {/* Central Wax Seal Lock & Call-to-Action */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              scale: 1.3,
              opacity: 0,
              rotate: 15,
              transition: { duration: 0.6, ease: "easeIn" },
            }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative z-30 flex flex-col items-center text-center cursor-pointer p-4 group"
          >
            {/* Shimmering Aura around the Seal */}
            <div className="absolute -inset-8 rounded-full bg-gold-400/15 blur-xl group-hover:bg-gold-400/25 transition-all animate-pulse" />

            {/* Dimensional Wax Seal */}
            <div className="transform group-hover:scale-105 transition-transform duration-300">
              <RoyalWaxSeal size="lg" />
            </div>

            <div className="mt-6 space-y-1">
              <p className="font-serif text-gold-200 text-sm tracking-[0.3em] uppercase drop-shadow-md">
                Priyal &amp; Justin
              </p>
              <h2 className="font-serif text-xl sm:text-2xl text-gold-100 font-medium tracking-wide">
                Corbett Wedding Invitation
              </h2>
            </div>

            {/* Interactive Pulse Button */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FFE8A3]/20 via-[#C9A24B]/30 to-[#FFE8A3]/20 border border-gold-300/80 text-gold-200 text-xs uppercase tracking-[0.2em] font-sans font-semibold backdrop-blur-md shadow-gold group-hover:border-gold-200 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-300" />
              <span>Tap to Open</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
