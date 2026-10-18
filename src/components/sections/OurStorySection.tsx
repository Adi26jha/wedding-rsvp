"use client";

import React from "react";
import { motion } from "framer-motion";
import { GoldDivider } from "../decorative/GoldDivider";
import { FloralArch } from "../decorative/FloralArch";
import { RoyalWaxSeal } from "../decorative/RoyalWaxSeal";
import { Sparkles } from "lucide-react";
import { TiltCard } from "../delight/TiltCard";

export const OurStorySection: React.FC = () => {
  return (
    <section className="relative py-24 px-4 bg-[#FAF7F2]">
      {/* Background Indian Botanical Line Art */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#6A1B29_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-3xl mx-auto relative z-10">
        <TiltCard maxTilt={5}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-ivory-50 rounded-[32px] p-6 sm:p-14 shadow-luxe border-2 border-gold-300/80 relative text-center"
          >
          {/* Inner Inset Gold Border */}
          <div className="absolute inset-3 sm:inset-4 rounded-[26px] border border-gold-400/30 pointer-events-none" />

          {/* Corner Filigrees */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold-400/80 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold-400/80 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold-400/80 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold-400/80 rounded-br-sm pointer-events-none" />

          <div className="relative z-10">
            {/* Small Monogram Seal Accent */}
            <div className="inline-flex items-center justify-center mb-3">
              <RoyalWaxSeal size="sm" />
            </div>

            <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-gold-700 font-semibold mb-1">
              With Joy &amp; Gratitude
            </p>

            <h2 className="font-serif text-3xl sm:text-5xl text-maroon-900 font-normal tracking-tight">
              A Celebration of Love &amp; Vows
            </h2>

            <GoldDivider variant="lotus" className="my-5 opacity-80" />

            <div className="space-y-4 font-serif text-base sm:text-lg text-charcoal-700 leading-relaxed max-w-2xl mx-auto italic">
              <p>
                &ldquo;Two distinct journeys that converged into one sacred melody.
                As we prepare to unite our lives in the holy sacrament of marriage,
                our greatest wish is to share these auspicious moments surrounded by the blessings
                of our dearest family and friends.&rdquo;
              </p>
              <p className="font-sans text-xs sm:text-sm text-charcoal-600 not-italic leading-relaxed pt-2">
                Please confirm your RSVP for our wedding celebrations in the serene foothills of Uttarakhand, where under open Corbett skies and surrounded by ancient Sal trees, we shall dance, celebrate, and embark on our lifetime voyage together.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gold-200/80 flex flex-col items-center">
              <p className="font-serif text-maroon-900 text-xl font-medium tracking-wide">
                Priyal <span className="text-gold-600 font-serif italic text-base">&amp;</span> Justin
              </p>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold-700 font-sans mt-1 font-semibold">
                Corbett Adventure Resort &bull; November 2026
              </span>
            </div>
          </div>
        </motion.div>
      </TiltCard>
    </div>
  </section>
);
};
