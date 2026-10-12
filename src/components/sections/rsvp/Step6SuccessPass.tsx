"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CalendarPlus, Share2, Camera, MapPin, ShieldCheck } from "lucide-react";
import { SubmissionResponse } from "./types";
import { RoyalWaxSeal } from "@/components/decorative/RoyalWaxSeal";
import { AnimatedCheckmark } from "@/components/decorative/AnimatedCheckmark";

interface Step6Props {
  response: SubmissionResponse;
  onEditAgain: () => void;
}

const EVENT_LABELS: Record<string, string> = {
  haldi: "Haldi (21 Nov 1 PM)",
  sangeet: "Sangeet (21 Nov 7 PM)",
  wedding: "The Wedding (22 Nov)",
};

export const Step6SuccessPass: React.FC<Step6Props> = ({
  response,
  onEditAgain,
}) => {
  const isDeclined = response.attendanceStatus === "declined";

  const handleShareWhatsapp = () => {
    const text = encodeURIComponent(
      `Excited to celebrate Priyal & Justin's wedding at Corbett Adventure Resort on 21-22 November 2026! 🌸✨ RSVP confirmed.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleDownloadCalendar = () => {
    window.location.href = "/api/calendar?event=all";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6 text-center max-w-lg mx-auto"
    >
      {/* Success Badge */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-100 to-emerald-50 text-emerald-700 flex items-center justify-center border-2 border-emerald-400 shadow-glow mb-3"
        >
          <AnimatedCheckmark size={32} strokeColor="#047857" />
        </motion.div>

        <h3 className="font-serif text-3xl sm:text-4xl text-maroon-900 font-normal">
          {isDeclined ? "Thank You for Your Blessings" : "RSVP Confirmed with Joy"}
        </h3>

        <p className="font-sans text-xs sm:text-sm text-charcoal-600 mt-1 max-w-md">
          {isDeclined
            ? "We are deeply touched by your heartfelt wishes and will miss your presence."
            : response.isUpdate
            ? "Your family reservation details and ID documents have been successfully updated."
            : "Your presence and documents have been received. We can't wait to celebrate together!"}
        </p>
      </div>

      {!isDeclined && (
        <>
          {/* Digital Keepsake Pass / Screenshot Card */}
          <div
            id="digital-pass"
            className="bg-ivory-50 border-2 border-gold-400/80 rounded-2xl p-6 sm:p-7 shadow-luxe relative overflow-hidden text-left"
          >
            {/* Corner Decorative Dots */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-gold-500/60" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-gold-500/60" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-gold-500/60" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-gold-500/60" />

            {/* Pass Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gold-200/60">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-gold-700 font-semibold block">
                  Wedding Guest Pass &bull; Corbett 2026
                </span>
                <span className="font-serif text-xl sm:text-2xl text-maroon-900 font-medium">
                  Priyal &amp; Justin
                </span>
              </div>
              <RoyalWaxSeal size="sm" className="w-12 h-12" />
            </div>

            {/* Pass Body */}
            <div className="py-4 space-y-3 font-sans text-xs">
              <div className="flex items-center justify-between">
                <span className="text-charcoal-400 uppercase text-[10px] tracking-wider">
                  Guest / Family
                </span>
                <span className="font-semibold text-charcoal-900 text-sm">
                  {response.primaryContactName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-charcoal-400 uppercase text-[10px] tracking-wider">
                  Attending Count
                </span>
                <span className="font-semibold text-maroon-800">
                  {response.guestCount} {response.guestCount === 1 ? "Guest" : "Guests"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-charcoal-400 uppercase text-[10px] tracking-wider">
                  Functions
                </span>
                <span className="text-charcoal-800 font-medium text-right max-w-[220px]">
                  {response.attendingEvents
                    ?.map((e) => EVENT_LABELS[e] || e)
                    .join(", ")}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-charcoal-400 uppercase text-[10px] tracking-wider">
                  Aadhaar Status
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  IDs Encrypted &amp; Stored
                </span>
              </div>

              <div className="pt-2 border-t border-gold-200/50 flex items-center justify-between text-[11px] text-charcoal-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-maroon-700 shrink-0" />
                  <span>Corbett Adventure Resort</span>
                </div>
                <span>21&ndash;22 Nov 2026</span>
              </div>
            </div>

            {/* Pass Footer Note */}
            <div className="pt-3 border-t border-gold-200/60 text-center">
              <span className="text-[10px] uppercase tracking-widest text-gold-600 font-sans font-semibold inline-flex items-center gap-1">
                <Camera className="w-3 h-3" />
                Screenshot this pass for quick resort check-in
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadCalendar}
              className="min-h-[46px] px-4 py-2.5 rounded-full bg-ivory-50 border border-gold-400/80 hover:bg-gold-100 text-maroon-900 text-xs font-sans font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <CalendarPlus className="w-4 h-4 text-gold-600" />
              <span>Add to Calendar</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsapp}
              className="min-h-[46px] px-4 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-ivory-50 text-xs font-sans font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </>
      )}

      {/* Edit / Resubmit link */}
      <div className="pt-4 text-center">
        <button
          type="button"
          onClick={onEditAgain}
          className="text-xs font-sans text-charcoal-500 hover:text-maroon-800 underline underline-offset-4 transition-colors"
        >
          Need to make changes? Modify your RSVP submission
        </button>
      </div>
    </motion.div>
  );
};
