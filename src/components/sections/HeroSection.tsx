"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Sparkles, ChevronDown } from "lucide-react";
import { RoyalWaxSeal } from "../decorative/RoyalWaxSeal";
import { RotatingMandala } from "../decorative/RotatingMandala";
import { GoldSparkleCanvas } from "../decorative/GoldSparkleCanvas";
import { GoldDivider } from "../decorative/GoldDivider";

interface HeroSectionProps {
  familyGreeting?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TARGET_WEDDING_DATE = new Date("2026-11-21T13:00:00+05:30").getTime();

export const HeroSection: React.FC<HeroSectionProps> = ({ familyGreeting }) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const distance = TARGET_WEDDING_DATE - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / 1000 / 60) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToRsvp = () => {
    const el = document.getElementById("rsvp-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSchedule = () => {
    const el = document.getElementById("schedule-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Letter reveal animation variants
  const letterVariants = {
    hidden: { opacity: 0, y: 35, filter: "blur(6px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: 0.25 + i * 0.045,
        duration: 0.8,
        ease: "easeOut" as const,
      },
    }),
  };

  const priyalLetters = "Priyal".split("");
  const justinLetters = "Justin".split("");

  return (
    <section className="relative min-h-screen flex items-center justify-center px-3 sm:px-6 py-12 sm:py-20 overflow-hidden bg-[#FAF4E8]">
      {/* 1. Subtle Radial Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-200/40 via-transparent to-transparent" />

      {/* 2. Floating Gold Diya Sparkles (Canvas, 60fps) */}
      <GoldSparkleCanvas className="z-0" />

      {/* 3. The Master Royal Arch / Mehrab Card Container */}
      <div className="relative w-full max-w-4xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-gradient-to-b from-[#2E070F] via-[#3E0B16] to-[#25050C] text-ivory-50 rounded-[32px] sm:rounded-[44px] mehrab-card p-6 sm:p-14 md:p-20 shadow-[0_30px_70px_-15px_rgba(62,11,22,0.5)] border-2 border-gold-400/80 overflow-hidden"
        >
          {/* Inner Inset Gold Filigree Border */}
          <div className="absolute inset-3 sm:inset-5 rounded-[26px] sm:rounded-[36px] mehrab-card border border-gold-400/35 pointer-events-none" />

          {/* Corner Palmette / Mughal Arch Engravings */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-9 h-9 sm:w-14 sm:h-14 border-t-2 border-l-2 border-gold-400/80 pointer-events-none rounded-tl-lg" />
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 sm:w-14 sm:h-14 border-t-2 border-r-2 border-gold-400/80 pointer-events-none rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-9 h-9 sm:w-14 sm:h-14 border-b-2 border-l-2 border-gold-400/80 pointer-events-none rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-9 h-9 sm:w-14 sm:h-14 border-b-2 border-r-2 border-gold-400/80 pointer-events-none rounded-br-lg" />

          {/* Slowly Rotating Antique Mandala SVG in Center Behind Text */}
          <RotatingMandala className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] h-[340px] sm:h-[540px] opacity-20 pointer-events-none" />

          <div className="flex flex-col items-center text-center relative z-10 pt-2 sm:pt-4">
            {/* Auspicious Sanskrit Calligraphy */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-gold-300 text-xs sm:text-sm tracking-[0.35em] uppercase mb-4 drop-shadow-sm"
            >
              ॥ श्री गणेशाय नमः ॥
            </motion.p>

            {/* Personalized Guest Family Banner */}
            {familyGreeting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-400/15 border border-gold-400/50 text-gold-200 text-xs sm:text-sm font-sans tracking-wide backdrop-blur-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                <span>Cordially Welcoming the</span>
                <span className="font-semibold capitalize text-gold-100">{familyGreeting} Family</span>
              </motion.div>
            )}

            {/* Royal 3D Wax Seal Monogram */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="my-2 sm:my-3"
            >
              <RoyalWaxSeal size="md" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-sans text-[11px] sm:text-xs tracking-[0.35em] uppercase text-gold-300/80 mt-4 mb-2 font-medium"
            >
              Together with their families
            </motion.p>

            {/* Couple Names — Split-Text Staggered Letter Mask Reveal */}
            <h1
              className="font-serif font-normal tracking-tight leading-[1.04] my-2 select-none"
              style={{ fontSize: "clamp(3.5rem, 11vw, 8.5rem)" }}
            >
              {/* PRIYAL */}
              <span className="inline-block overflow-hidden pb-1">
                {priyalLetters.map((char, index) => (
                  <motion.span
                    key={`priyal-${index}`}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={letterVariants}
                    className="inline-block bg-gradient-to-r from-[#F2DAA2] via-[#FFF9E6] to-[#CFA14E] bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(207,161,78,0.35)]"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>

              {/* Shimmering Ampersand & */}
              <motion.span
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.55 }}
                className="block font-serif italic text-3xl sm:text-5xl md:text-6xl my-1 gold-shimmer-text"
              >
                &amp;
              </motion.span>

              {/* JUSTIN */}
              <span className="inline-block overflow-hidden pb-1">
                {justinLetters.map((char, index) => (
                  <motion.span
                    key={`justin-${index}`}
                    custom={index + 7}
                    initial="hidden"
                    animate="visible"
                    variants={letterVariants}
                    className="inline-block bg-gradient-to-r from-[#F2DAA2] via-[#FFF9E6] to-[#CFA14E] bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(207,161,78,0.35)]"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </h1>

            {/* Ornamental Divider */}
            <GoldDivider variant="lotus" className="my-4 opacity-80" />

            {/* Poetic Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="font-serif italic text-base sm:text-xl text-gold-200/90 max-w-xl mb-6 leading-relaxed"
            >
              Request the honour of your presence as they exchange vows beneath the ancient trees and starlit skies of Jim Corbett.
            </motion.p>

            {/* Date & Venue Badges */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-gold-100 text-xs sm:text-sm my-2"
            >
              <div className="flex items-center gap-2 bg-black/25 px-4 py-1.5 rounded-full border border-gold-400/35 backdrop-blur-sm">
                <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="font-medium tracking-wide">21st &ndash; 22nd November 2026</span>
              </div>
              <span className="hidden sm:inline text-gold-500/60">&bull;</span>
              <div className="flex items-center gap-2 bg-black/25 px-4 py-1.5 rounded-full border border-gold-400/35 backdrop-blur-sm">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="font-medium tracking-wide">Corbett Adventure Resort &bull; Uttarakhand</span>
              </div>
            </motion.div>

            {/* Live Wedding Countdown Timer with Smooth Number Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-8 mb-6 w-full max-w-md"
            >
              <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-gold-400 block mb-3 font-semibold">
                Celebrations Begin In
              </span>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <div className="bg-black/35 backdrop-blur-md border border-gold-400/40 rounded-2xl py-3 px-1 sm:px-2 shadow-inner">
                  <span className="font-serif text-2xl sm:text-3xl font-medium text-gold-200 block leading-tight">
                    {timeLeft.days}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-sans tracking-wider text-gold-400/80 block mt-1 font-semibold">
                    Days
                  </span>
                </div>

                <div className="bg-black/35 backdrop-blur-md border border-gold-400/40 rounded-2xl py-3 px-1 sm:px-2 shadow-inner">
                  <span className="font-serif text-2xl sm:text-3xl font-medium text-gold-200 block leading-tight">
                    {timeLeft.hours}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-sans tracking-wider text-gold-400/80 block mt-1 font-semibold">
                    Hours
                  </span>
                </div>

                <div className="bg-black/35 backdrop-blur-md border border-gold-400/40 rounded-2xl py-3 px-1 sm:px-2 shadow-inner">
                  <span className="font-serif text-2xl sm:text-3xl font-medium text-gold-200 block leading-tight">
                    {timeLeft.minutes}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-sans tracking-wider text-gold-400/80 block mt-1 font-semibold">
                    Mins
                  </span>
                </div>

                <div className="bg-black/35 backdrop-blur-md border border-gold-400/40 rounded-2xl py-3 px-1 sm:px-2 shadow-inner">
                  <span className="font-serif text-2xl sm:text-3xl font-medium text-gold-200 block leading-tight">
                    {timeLeft.seconds}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-sans tracking-wider text-gold-400/80 block mt-1 font-semibold">
                    Secs
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Shimmering Magnetic RSVP Button with Soft Gold Glow Pulse */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto"
            >
              <button
                onClick={scrollToRsvp}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA771C] text-[#2E070F] font-sans text-xs sm:text-sm uppercase tracking-widest font-bold shadow-gold-glow hover:shadow-[0_0_40px_rgba(201,162,75,0.7)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 border border-gold-300"
              >
                RSVP for Celebrations
              </button>

              <button
                onClick={scrollToSchedule}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-gold-100 font-sans text-xs sm:text-sm uppercase tracking-widest font-medium border border-gold-400/50 backdrop-blur-sm transition-all duration-300 hover:border-gold-300 active:scale-[0.97]"
              >
                View Itinerary
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center text-gold-700/80 cursor-pointer hidden sm:flex"
        onClick={scrollToSchedule}
      >
        <span className="text-[9px] uppercase tracking-widest font-sans mb-1 text-gold-700 font-semibold">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 text-gold-700" />
      </motion.div>
    </section>
  );
};
