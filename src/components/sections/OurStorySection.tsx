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

      <div className="max-w-5xl mx-auto relative z-10">
        <TiltCard maxTilt={4}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-ivory-50 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 shadow-luxe border-2 border-gold-300/80 relative"
          >
            {/* Inner Inset Gold Border */}
            <div className="absolute inset-3 sm:inset-4 rounded-[26px] sm:rounded-[34px] border border-gold-400/30 pointer-events-none" />

            {/* Corner Filigrees */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold-400/80 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold-400/80 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold-400/80 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold-400/80 rounded-br-sm pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Photo Column: Royal Mughal Arch Portrait */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative group w-full max-w-[320px] sm:max-w-[340px]">
                  {/* Decorative Outer Glow */}
                  <div className="absolute -inset-1.5 bg-gradient-to-b from-gold-300/60 via-gold-400/40 to-maroon-900/20 rounded-t-[144px] rounded-b-[28px] blur-sm opacity-70 group-hover:opacity-100 transition duration-700" />

                  {/* Gold Filigree Arch Frame */}
                  <div className="relative p-2 bg-gradient-to-b from-[#DFBA73] via-[#C5A059] to-[#8C6D34] rounded-t-[140px] rounded-b-[24px] shadow-2xl">
                    <div className="relative overflow-hidden rounded-t-[132px] rounded-b-[18px] bg-maroon-950 aspect-[4/5] sm:aspect-[3/4] w-full">
                      <Image
                        src="/images/priyal-justin.jpg"
                        alt="Priyal & Justin"
                        fill
                        sizes="(max-width: 768px) 320px, 340px"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        priority
                      />

                      {/* Subtle Vignette Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                      {/* Inset Gold Line */}
                      <div className="absolute inset-2 rounded-t-[124px] rounded-b-[12px] border border-gold-200/50 pointer-events-none" />
                    </div>
                  </div>

                  {/* Botanical Arch Base Accent */}
                  <div className="mt-3 text-center">
                    <p className="font-serif italic text-gold-800 text-sm tracking-wide">
                      Priyal &amp; Justin
                    </p>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-gold-600/90 font-sans font-medium">
                      Corbett &bull; 2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Text Column: Editorial Narrative & RSVP Note */}
              <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
                {/* Monogram Seal & Header Badge */}
                <div className="inline-flex items-center gap-2 mb-3">
                  <RoyalWaxSeal size="sm" />
                  <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-gold-700 font-semibold">
                    With Joy &amp; Gratitude
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-maroon-900 font-normal tracking-tight">
                  A Celebration of Love &amp; Vows
                </h2>

                <GoldDivider variant="lotus" className="my-4 sm:my-5 opacity-80 lg:mx-0" />

                <div className="space-y-4 font-serif text-base sm:text-lg text-charcoal-700 leading-relaxed italic max-w-xl">
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

                <div className="mt-6 sm:mt-8 pt-5 border-t border-gold-200/80 w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div>
                    <p className="font-serif text-maroon-900 text-xl sm:text-2xl font-medium tracking-wide">
                      Priyal <span className="text-gold-600 font-serif italic text-base sm:text-lg">&amp;</span> Justin
                    </p>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-gold-700 font-sans mt-0.5 font-semibold block">
                      Corbett Adventure Resort &bull; November 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </TiltCard>
      </div>
    </section>
  );
};
