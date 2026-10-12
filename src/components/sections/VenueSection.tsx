"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, BedDouble, Compass, ExternalLink } from "lucide-react";
import { GoldDivider } from "../decorative/GoldDivider";

const MAPS_URL = "https://maps.google.com/?q=Corbett+Adventure+Resort+Bail+Parao+Uttarakhand";

export const VenueSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-[#0F241D] via-[#16382E] to-[#0A1A14] text-ivory-50 relative overflow-hidden">
      {/* Background Subtle Leaf Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-800/80 border border-gold-400/40 text-gold-300 text-xs uppercase tracking-[0.25em] font-sans font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-gold-400" />
            The Destination
          </span>
          <h2 className="font-serif text-3xl sm:text-6xl font-normal text-ivory-100 tracking-tight">
            Corbett Adventure Resort
          </h2>
          <p className="font-serif text-gold-300 text-lg sm:text-xl italic mt-1">
            Bail Parao, Ramnagar, Uttarakhand
          </p>
          <GoldDivider variant="diamond" className="my-5 opacity-75" />
        </div>

        {/* 3 Pillars: Setting, Accommodation, Transit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-emerald-900/60 backdrop-blur-sm border-2 border-gold-400/30 rounded-2xl p-7 text-center space-y-3.5 shadow-lg"
          >
            <div className="w-12 h-12 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center mx-auto border border-gold-400/40">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-ivory-100">The Setting</h3>
            <p className="text-xs sm:text-sm text-ivory-200/80 leading-relaxed font-sans">
              Nestled at the threshold of Corbett&apos;s ancient Sal forest canopy, with pristine mountain breezes, sprawling party lawns, and unpolluted twilight skies.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-emerald-900/60 backdrop-blur-sm border-2 border-gold-400/30 rounded-2xl p-7 text-center space-y-3.5 shadow-lg"
          >
            <div className="w-12 h-12 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center mx-auto border border-gold-400/40">
              <BedDouble className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-ivory-100">Guest Accommodations</h3>
            <p className="text-xs sm:text-sm text-ivory-200/80 leading-relaxed font-sans">
              Luxury cottages and suites are reserved for all attending guests at the resort. The Aadhaar ID cards provided in your RSVP ensure prompt, VIP check-in.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-emerald-900/60 backdrop-blur-sm border-2 border-gold-400/30 rounded-2xl p-7 text-center space-y-3.5 shadow-lg"
          >
            <div className="w-12 h-12 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center mx-auto border border-gold-400/40">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-ivory-100">Distance &amp; Travel</h3>
            <p className="text-xs sm:text-sm text-ivory-200/80 leading-relaxed font-sans">
              ~15 km from Ramnagar Railway Station; ~245 km from Delhi NCR via Moradabad/Kashipur highway. Scenic 5&ndash;6 hour highway drive.
            </p>
          </motion.div>
        </div>

        {/* Maps Button */}
        <div className="mt-12 text-center">
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA771C] text-[#132B23] font-sans text-xs sm:text-sm font-bold tracking-wider uppercase hover:opacity-95 transition-all shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:scale-105 active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Resort Location in Google Maps</span>
          </a>
        </div>
      </div>
    </section>
  );
};
