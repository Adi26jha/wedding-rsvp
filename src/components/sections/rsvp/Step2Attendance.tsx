"use client";

import React from "react";
import { Sparkles, HeartHandshake, ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { RsvpFormState } from "./types";
import { AnimatedCheckmark } from "@/components/decorative/AnimatedCheckmark";

interface Step2Props {
  formData: RsvpFormState;
  updateFormData: (fields: Partial<RsvpFormState>) => void;
  onNext: () => void;
  onBack: () => void;
  onFastSubmitDeclined: () => void;
  isSubmitting?: boolean;
}

export const Step2Attendance: React.FC<Step2Props> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
  onFastSubmitDeclined,
  isSubmitting = false,
}) => {
  const handleSelect = (status: "attending" | "declined") => {
    updateFormData({ attendanceStatus: status });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl sm:text-3xl text-maroon-800 font-normal">
          Will You Be Joining Us?
        </h3>
        <p className="font-sans text-xs sm:text-sm text-charcoal-500 mt-1">
          Kindly let us know if you will celebrate with us in Jim Corbett.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Joyfully Accepting Card */}
        <button
          type="button"
          onClick={() => handleSelect("attending")}
          className={`min-h-[140px] p-6 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 relative group cursor-pointer ${
            formData.attendanceStatus === "attending"
              ? "bg-gradient-to-br from-ivory-50 to-[#FFFBF2] border-maroon-700 ring-2 ring-maroon-600/30 shadow-luxe scale-[1.02]"
              : "bg-ivory-50/70 border-gold-300/80 hover:border-gold-500 hover:bg-ivory-50 shadow-sm hover:scale-[1.01]"
          }`}
        >
          <div className="flex items-start justify-between w-full">
            <span
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                formData.attendanceStatus === "attending"
                  ? "bg-maroon-700 text-ivory-50 shadow-sm"
                  : "bg-gold-100 text-maroon-700 group-hover:bg-gold-200"
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </span>
            {formData.attendanceStatus === "attending" && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-300 shadow-sm">
                <AnimatedCheckmark size={14} strokeColor="#065F46" />
                <span>Attending</span>
              </span>
            )}
          </div>

          <div className="mt-4">
            <h4 className="font-serif text-xl sm:text-2xl text-maroon-900 font-medium">
              Joyfully Accepting
            </h4>
            <p className="text-xs text-charcoal-500 font-sans mt-1">
              We wouldn&apos;t miss it! Ready for celebrations in Jim Corbett.
            </p>
          </div>
        </button>

        {/* Regretfully Declining Card */}
        <button
          type="button"
          onClick={() => handleSelect("declined")}
          className={`min-h-[140px] p-6 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 relative group cursor-pointer ${
            formData.attendanceStatus === "declined"
              ? "bg-gradient-to-br from-ivory-50 to-[#F9F7F5] border-charcoal-700 ring-2 ring-charcoal-400/30 shadow-luxe scale-[1.02]"
              : "bg-ivory-50/70 border-gold-300/80 hover:border-gold-500 hover:bg-ivory-50 shadow-sm hover:scale-[1.01]"
          }`}
        >
          <div className="flex items-start justify-between w-full">
            <span
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                formData.attendanceStatus === "declined"
                  ? "bg-charcoal-800 text-ivory-50 shadow-sm"
                  : "bg-ivory-200 text-charcoal-600 group-hover:bg-ivory-300"
              }`}
            >
              <HeartHandshake className="w-5 h-5" />
            </span>
            {formData.attendanceStatus === "declined" && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold text-charcoal-800 bg-charcoal-100 px-2.5 py-1 rounded-full border border-charcoal-300 shadow-sm">
                <AnimatedCheckmark size={14} strokeColor="#374151" />
                <span>Declined</span>
              </span>
            )}
          </div>

          <div className="mt-4">
            <h4 className="font-serif text-xl sm:text-2xl text-charcoal-800 font-medium">
              Regretfully Declining
            </h4>
            <p className="text-xs text-charcoal-500 font-sans mt-1">
              Sending our warmest blessings from afar with love.
            </p>
          </div>
        </button>
      </div>

      {/* If declining: show warm note input and fast submit */}
      {formData.attendanceStatus === "declined" && (
        <div className="pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-ivory-100/80 border border-gold-300/60 rounded-xl p-4">
            <label
              htmlFor="declinedNotes"
              className="block text-xs uppercase tracking-wider font-semibold text-charcoal-700 mb-1.5"
            >
              Send Warm Wishes to Priyal &amp; Justin (Optional)
            </label>
            <textarea
              id="declinedNotes"
              rows={3}
              placeholder="Wishing you a lifetime of love and happiness..."
              value={formData.notes}
              onChange={(e) => updateFormData({ notes: e.target.value })}
              className="w-full p-3 rounded-lg bg-ivory-50 border border-gold-300/80 text-charcoal-900 placeholder-charcoal-400 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-100"
            />
          </div>

          <button
            type="button"
            onClick={onFastSubmitDeclined}
            disabled={isSubmitting}
            className="w-full min-h-[48px] py-3.5 px-6 rounded-full bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 font-sans text-sm font-semibold tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting Your Response...</span>
            ) : (
              <>
                <Heart className="w-4 h-4 text-maroon-300 fill-maroon-300" />
                <span>Submit RSVP &amp; Blessings</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 gap-4">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-5 py-2.5 rounded-full border border-gold-400/60 text-charcoal-700 hover:bg-ivory-200 text-xs font-sans font-medium flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {formData.attendanceStatus === "attending" && (
          <button
            type="button"
            onClick={onNext}
            className="min-h-[44px] px-6 py-2.5 rounded-full bg-gradient-to-r from-maroon-800 to-maroon-700 text-ivory-50 text-xs font-sans font-semibold tracking-wider uppercase shadow-luxe flex items-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Continue to Guests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
