"use client";

import React from "react";
import { Phone, Heart, Shield, Lock } from "lucide-react";
import Link from "next/link";
import { GoldDivider } from "../decorative/GoldDivider";
import { RoyalWaxSeal } from "../decorative/RoyalWaxSeal";

const CONTACTS = [
  { name: "Nehal Batra", phone: "8800358365", display: "+91 88003 58365" },
  { name: "Girish Batra", phone: "9718488143", display: "+91 97184 88143" },
  { name: "Shalu Batra", phone: "9810374303", display: "+91 98103 74303" },
];

export const FooterSection: React.FC = () => {
  return (
    <footer className="bg-[#170509] text-ivory-100 py-20 px-4 border-t-2 border-gold-500/30 relative">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Royal Wax Seal */}
        <RoyalWaxSeal size="sm" className="mb-4" />

        <h3 className="font-serif text-3xl sm:text-5xl text-ivory-100 font-normal tracking-tight">
          Priyal &amp; Justin
        </h3>
        <p className="font-serif text-gold-400 text-sm sm:text-base italic mt-1">
          21st &ndash; 22nd November 2026 &bull; Corbett Adventure Resort
        </p>

        <GoldDivider variant="diamond" className="my-6 opacity-60" />

        {/* RSVP Deadline Notice */}
        <div className="bg-black/30 border border-gold-500/40 rounded-2xl px-6 py-4 max-w-md mb-10 shadow-inner">
          <p className="text-xs uppercase tracking-[0.2em] text-gold-400 font-sans font-semibold">
            RSVP Confirmation Deadline
          </p>
          <p className="text-xs sm:text-sm text-ivory-200 mt-1 leading-relaxed">
            Kindly confirm your presence by <strong className="text-gold-300">31st October 2026</strong> to help us finalize resort cottages and transport arrangements.
          </p>
        </div>

        {/* Family Support Contacts */}
        <div className="w-full max-w-2xl mb-10">
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold-400 font-sans font-semibold mb-4">
            For Assistance, Directions &amp; Travel Enquiries
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CONTACTS.map((c) => (
              <a
                key={c.name}
                href={`tel:${c.phone}`}
                className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-gold-500/30 text-xs font-sans transition-all hover:border-gold-400/70 group"
              >
                <Phone className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <span className="block font-semibold text-ivory-100">{c.name}</span>
                  <span className="block text-[11px] text-gold-300/80 font-mono">{c.display}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Security & Privacy Reassurance */}
        <div className="flex items-center gap-2 text-xs text-charcoal-400 mb-8 max-w-lg bg-black/20 p-3 rounded-xl border border-gold-400/20">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="text-[11px] leading-relaxed text-ivory-300">
            All guest Aadhaar documents are encrypted server-side with AES-256-GCM encryption and used solely for hotel check-in compliance before scheduled post-event purging.
          </p>
        </div>

        {/* Sign-off */}
        <div className="border-t border-white/10 w-full pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-400">
          <div className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-maroon-500 fill-maroon-500" />
            <span>for Priyal &amp; Justin &bull; With love, The Batra Family</span>
          </div>

          {/* Discreet Admin Link */}
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-gold-400/70 hover:text-gold-300 transition-colors text-[11px] font-medium"
          >
            <Lock className="w-3 h-3" />
            <span>Executive Admin Portal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
