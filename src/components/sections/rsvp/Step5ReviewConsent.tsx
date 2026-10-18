"use client";

import React, { useState } from "react";
import { Shield, ArrowLeft, Send, FileText, UserCheck, Calendar, Lock } from "lucide-react";
import { RsvpFormState } from "./types";
import { AnimatedCheckmark } from "@/components/decorative/AnimatedCheckmark";

interface Step5Props {
  formData: RsvpFormState;
  updateFormData: (fields: Partial<RsvpFormState>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const EVENT_NAMES: Record<string, string> = {
  haldi: "HALDI (21 Nov 1:00 PM)",
  cocktail: "COCKTAIL & RING CEREMONY (21 Nov 7:00 PM)",
  chooda: "CHOODA CEREMONY (22 Nov 10:00 AM)",
  wedding: "THE WEDDING (22 Nov 4:30 PM)",
  sangeet: "COCKTAIL & RING CEREMONY (21 Nov 7:00 PM)",
};

export const Step5ReviewConsent: React.FC<Step5Props> = ({
  formData,
  updateFormData,
  onSubmit,
  onBack,
  isSubmitting = false,
}) => {
  const [consentError, setConsentError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consentGiven) {
      setConsentError(true);
      return;
    }
    setConsentError(false);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl sm:text-3xl text-maroon-800 font-normal">
          Review &amp; Confirmation
        </h3>
        <p className="font-sans text-xs sm:text-sm text-charcoal-500 mt-1">
          Please review your family details prior to finalizing your RSVP.
        </p>
      </div>

      {/* Hidden Anti-bot Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="_hp_company"
          tabIndex={-1}
          autoComplete="off"
          value={formData.honeypot}
          onChange={(e) => updateFormData({ honeypot: e.target.value })}
        />
      </div>

      {/* Summary Card */}
      <div className="bg-ivory-50 border border-gold-300/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm text-left">
        {/* Contact info row */}
        <div className="pb-3 border-b border-gold-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-charcoal-400 font-sans block">
              Primary Contact
            </span>
            <span className="font-serif text-lg sm:text-xl text-maroon-900 font-medium">
              {formData.contactName}
            </span>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase tracking-wider text-charcoal-400 font-sans block">
              Mobile &bull; WhatsApp
            </span>
            <span className="text-xs sm:text-sm font-sans font-semibold text-charcoal-800">
              +91 {formData.mobileNumber}
            </span>
          </div>
        </div>

        {/* Functions attending */}
        <div className="pb-3 border-b border-gold-200/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-charcoal-400 font-sans flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gold-600" />
              Celebrations Included
            </span>
            <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-sans font-medium">
              All 4 Ceremonies
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {["haldi", "cocktail", "chooda", "wedding"].map((evt) => (
              <span
                key={evt}
                className="px-2.5 py-1.5 rounded-md bg-ivory-200/80 border border-gold-300/60 text-xs text-maroon-900 font-medium font-sans"
              >
                {EVENT_NAMES[evt]}
              </span>
            ))}
          </div>
        </div>

        {/* Attending guests list with attached Aadhaar Document Badges */}
        <div>
          <span className="text-[10px] uppercase tracking-wider text-charcoal-400 font-sans block mb-2 flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-gold-600" />
            Attending Members ({formData.guestCount})
          </span>
          <div className="space-y-2">
            {formData.attendees.slice(0, formData.guestCount).map((att, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-ivory-100/70 border border-gold-200/50 text-xs font-sans"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-maroon-100 text-maroon-800 text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-charcoal-900">{att.fullName}</span>
                  <span className="text-[10px] text-charcoal-400 capitalize">
                    ({att.ageGroup})
                  </span>
                </div>

                {/* Attached Document Status */}
                <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 text-[11px]">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span className="truncate max-w-[130px] font-medium">
                    {att.documentName || "Aadhaar Attached"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optional Notes or Dietary Requirements */}
        <div className="pt-2">
          <label
            htmlFor="specialNotes"
            className="block text-xs uppercase tracking-wider font-semibold text-charcoal-700 mb-1"
          >
            Special Requests / Dietary Preferences (Optional)
          </label>
          <input
            id="specialNotes"
            type="text"
            placeholder="e.g. Jain food, ground floor cottage preference, etc."
            value={formData.notes}
            onChange={(e) => updateFormData({ notes: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-100/60 border border-gold-300/80 text-charcoal-900 placeholder-charcoal-400 text-xs focus:outline-none focus:ring-2 focus:ring-maroon-100 min-h-[44px]"
          />
        </div>
      </div>

      {/* Mandatory Consent Box */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        consentError
          ? "bg-red-50/70 border-red-300"
          : "bg-emerald-50/60 border-emerald-300/90 shadow-xs"
      }`}>
        <label className="flex items-start gap-3.5 cursor-pointer select-none">
          <div className="pt-0.5 relative">
            <input
              type="checkbox"
              id="consent"
              required
              checked={formData.consentGiven}
              onChange={(e) => {
                updateFormData({ consentGiven: e.target.checked });
                if (consentError && e.target.checked) setConsentError(false);
              }}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                formData.consentGiven
                  ? "bg-maroon-800 border-maroon-900 shadow-xs"
                  : "bg-white border-gold-400"
              }`}
            >
              {formData.consentGiven && (
                <AnimatedCheckmark size={14} strokeColor="#F3E5AB" />
              )}
            </div>
          </div>
          <div className="text-xs text-charcoal-700 leading-relaxed font-sans">
            <span className="font-semibold text-charcoal-900 block mb-0.5">
              Consent for Venue &amp; Accommodation Compliance
            </span>
            I consent to sharing these ID details for venue and accommodation arrangements at Corbett Adventure Resort. Data will be encrypted with AES-256-GCM, used solely for this celebration, and purged post-event.
          </div>
        </label>
        {consentError && (
          <p className="text-xs text-red-600 font-medium mt-2 pl-8">
            Please acknowledge the consent checkbox to finalize your reservation.
          </p>
        )}
      </div>

      {/* Navigation & Submit */}
      <div className="flex items-center justify-between pt-2 gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="min-h-[44px] px-5 py-2.5 rounded-full border border-gold-400/60 text-charcoal-700 hover:bg-ivory-200 text-xs font-sans font-medium flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-[48px] px-8 py-3 rounded-full bg-gradient-to-r from-maroon-800 via-maroon-700 to-maroon-800 text-ivory-50 text-xs sm:text-sm font-sans font-semibold tracking-wider uppercase shadow-luxe hover:shadow-luxe-hover flex items-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 border border-gold-400/40"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-ivory-50 border-t-transparent rounded-full animate-spin" />
              <span>Encrypting &amp; Confirming...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Confirm &amp; Submit RSVP</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
