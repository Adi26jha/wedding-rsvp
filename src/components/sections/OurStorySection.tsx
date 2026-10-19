"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GoldDivider } from "../decorative/GoldDivider";
import { RoyalWaxSeal } from "../decorative/RoyalWaxSeal";
import { TiltCard } from "../delight/TiltCard";

export const OurStorySection: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-24 px-4 bg-[#FAF7F2]">
      {/* Background Indian Botanical Line Art */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#6A1B29_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-4xl mx-auto relative z-10">
        <TiltCard maxTilt={3}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-ivory-50 rounded-[32px] sm:rounded-[40px] p-6 sm:p-12 lg:p-14 shadow-luxe border-2 border-gold-300/80 relative text-center"
          >
            {/* Inner Inset Gold Border */}
            <div className="absolute inset-3 sm:inset-4 rounded-[26px] sm:rounded-[34px] border border-gold-400/30 pointer-events-none" />

            {/* Corner Filigrees */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold-400/80 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold-400/80 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold-400/80 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold-400/80 rounded-br-sm pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Monogram Seal & Header Badge */}
              <div className="inline-flex items-center justify-center gap-2 mb-3">
                <RoyalWaxSeal size="sm" />
                <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-gold-700 font-semibold">
                  With Joy &amp; Gratitude
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl text-maroon-900 font-normal tracking-tight">
                A Celebration of Love &amp; Vows
              </h2>

              <GoldDivider variant="lotus" className="my-4 sm:my-5 opacity-80" />

              {/* Centered High-Resolution Couple Portrait in Royal Arch Frame */}
              <div className="w-full max-w-xl sm:max-w-2xl my-6 sm:my-8">
                <div className="relative group mx-auto">
                  {/* Ambient Glow */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-gold-300/40 via-gold-400/30 to-gold-300/40 rounded-t-[100px] sm:rounded-t-[120px] rounded-b-[24px] blur-md opacity-60 group-hover:opacity-100 transition duration-700" />

                  {/* Gold Filigree Arch Border */}
                  <div className="relative p-2 sm:p-2.5 bg-gradient-to-b from-[#E2C27F] via-[#C5A059] to-[#8C6D34] rounded-t-[96px] sm:rounded-t-[116px] rounded-b-[22px] shadow-2xl">
                    {/* Natural 3:2 Aspect Ratio Preserves 100% Native Camera Resolution */}
                    <div className="relative overflow-hidden rounded-t-[88px] sm:rounded-t-[108px] rounded-b-[16px] bg-[#1a0509] aspect-[3/2] w-full">
                      <Image
                        src="/images/priyal-justin.jpg"
                        alt="Priyal & Justin"
                        fill
                        unoptimized
                        priority
                        className="object-cover object-[46%_25%] transition-transform duration-700 group-hover:scale-[1.03]"
                      />

                      {/* Subtle Vignette & Lighting Filter */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

                      {/* Inset Gold Line */}
                      <div className="absolute inset-2 sm:inset-2.5 rounded-t-[80px] sm:rounded-t-[100px] rounded-b-[10px] border border-gold-200/50 pointer-events-none" />
                    </div>
                  </div>

                  {/* Caption underneath the photo */}
                  <div className="mt-3">
                    <p className="font-serif italic text-gold-900 text-sm sm:text-base tracking-wide">
                      Priyal &amp; Justin
                    </p>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-gold-700/90 font-sans font-semibold">
                      Corbett Adventure Resort &bull; Uttarakhand
                    </span>
                  </div>
                </div>
              </div>

              {/* Narrative Text */}
              <div className="space-y-4 font-serif text-base sm:text-lg text-charcoal-700 leading-relaxed italic max-w-2xl mx-auto">
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

              {/* Signature Divider & Names */}
              <div className="mt-8 pt-6 border-t border-gold-200/80 w-full max-w-md mx-auto">
                <p className="font-serif text-maroon-900 text-2xl font-medium tracking-wide">
                  Priyal <span className="text-gold-600 font-serif italic text-lg">&amp;</span> Justin
                </p>
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold-700 font-sans mt-0.5 font-semibold block">
                  November 21st &ndash; 22nd, 2026
                </span>
              </div>
            </div>
          </motion.div>
        </TiltCard>
      </div>
    </section>
  );
};
