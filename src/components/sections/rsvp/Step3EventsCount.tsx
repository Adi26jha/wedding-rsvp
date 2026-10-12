"use client";

import React, { useState } from "react";
import { Plus, Minus, ArrowLeft, ArrowRight, CheckSquare, Square, Calendar } from "lucide-react";
import { RsvpFormState } from "./types";
import { AnimatedCheckmark } from "@/components/decorative/AnimatedCheckmark";

interface Step3Props {
  formData: RsvpFormState;
  updateFormData: (fields: Partial<RsvpFormState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ALL_EVENTS = [
  { id: "haldi", name: "Haldi Ceremony", date: "21st Nov 1:00 PM" },
  { id: "sangeet", name: "Sangeet & Musical Night", date: "21st Nov 7:00 PM" },
  { id: "wedding", name: "The Wedding & Phere", date: "22nd Nov Evening" },
];

export const Step3EventsCount: React.FC<Step3Props> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState<string>("");

  const toggleEvent = (eventId: string) => {
    let current = [...formData.attendingEvents];
    if (current.includes(eventId)) {
      current = current.filter((e) => e !== eventId);
    } else {
      current.push(eventId);
    }
    updateFormData({ attendingEvents: current });
    if (error) setError("");
  };

  const selectAllEvents = () => {
    if (formData.attendingEvents.length === ALL_EVENTS.length) {
      updateFormData({ attendingEvents: [] });
    } else {
      updateFormData({ attendingEvents: ALL_EVENTS.map((e) => e.id) });
    }
    if (error) setError("");
  };

  const changeCount = (delta: number) => {
    const nextCount = Math.max(1, Math.min(10, formData.guestCount + delta));
    // Synchronize attendee array length
    const currentAttendees = [...formData.attendees];
    if (nextCount > currentAttendees.length) {
      for (let i = currentAttendees.length; i < nextCount; i++) {
        currentAttendees.push({
          fullName: i === 0 ? formData.contactName : "",
          ageGroup: "adult",
        });
      }
    } else if (nextCount < currentAttendees.length) {
      currentAttendees.splice(nextCount);
    }

    updateFormData({
      guestCount: nextCount,
      attendees: currentAttendees,
    });
  };

  const validateAndProceed = () => {
    if (formData.attendingEvents.length === 0) {
      setError("Please select at least one celebration event you will attend.");
      return;
    }
    setError("");

    // Make sure attendee array has guestCount elements
    if (formData.attendees.length !== formData.guestCount) {
      const attendees = [...formData.attendees];
      while (attendees.length < formData.guestCount) {
        attendees.push({
          fullName: attendees.length === 0 ? formData.contactName : "",
          ageGroup: "adult",
        });
      }
      updateFormData({ attendees });
    }

    onNext();
  };

  const isAllSelected = formData.attendingEvents.length === ALL_EVENTS.length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl sm:text-3xl text-maroon-800 font-normal">
          Guest Count &amp; Events
        </h3>
        <p className="font-sans text-xs sm:text-sm text-charcoal-500 mt-1">
          Tell us how many members will join and which functions you will attend.
        </p>
      </div>

      {/* Guest Stepper */}
      <div className="bg-ivory-50 border border-gold-300/80 rounded-2xl p-5 sm:p-6 text-center space-y-3 shadow-sm">
        <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal-700">
          Total Attending Family / Group Members
        </label>
        <p className="text-xs text-charcoal-500 font-sans">
          Includes all adults and children requiring resort room &amp; transport arrangements.
        </p>

        <div className="flex items-center justify-center gap-6 pt-2">
          <button
            type="button"
            onClick={() => changeCount(-1)}
            disabled={formData.guestCount <= 1}
            aria-label="Decrease guest count"
            className="w-12 h-12 rounded-full border border-gold-400/80 bg-ivory-100 flex items-center justify-center text-maroon-800 hover:bg-gold-100 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95 shadow-sm"
          >
            <Minus className="w-5 h-5" />
          </button>

          <div className="w-20 text-center">
            <span className="font-serif text-4xl sm:text-5xl font-medium text-maroon-900 block leading-none">
              {formData.guestCount}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-charcoal-400 font-sans mt-1 block">
              {formData.guestCount === 1 ? "Guest" : "Guests"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => changeCount(1)}
            disabled={formData.guestCount >= 10}
            aria-label="Increase guest count"
            className="w-12 h-12 rounded-full border border-gold-400/80 bg-ivory-100 flex items-center justify-center text-maroon-800 hover:bg-gold-100 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Events Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal-700">
            Functions You Will Attend <span className="text-maroon-600">*</span>
          </label>

          <button
            type="button"
            onClick={selectAllEvents}
            className="text-xs font-sans text-maroon-700 hover:text-maroon-900 font-medium underline underline-offset-2"
          >
            {isAllSelected ? "Deselect All" : "Select All Functions"}
          </button>
        </div>

        <div className="space-y-2.5">
          {ALL_EVENTS.map((event) => {
            const isChecked = formData.attendingEvents.includes(event.id);
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => toggleEvent(event.id)}
                className={`w-full min-h-[52px] p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isChecked
                    ? "bg-gradient-to-r from-ivory-50 to-[#FFFBF2] border-maroon-700 text-maroon-950 shadow-sm ring-1 ring-maroon-600/20"
                    : "bg-ivory-50/60 border-gold-300/70 text-charcoal-700 hover:bg-ivory-50 hover:border-gold-400"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors border ${
                      isChecked
                        ? "bg-maroon-800 border-maroon-900 text-ivory-100 shadow-sm"
                        : "bg-ivory-100 border-gold-300/80 text-transparent"
                    }`}
                  >
                    {isChecked && <AnimatedCheckmark size={15} strokeColor="#F3E5AB" />}
                  </div>
                  <div>
                    <span className="font-serif text-base font-medium text-maroon-900 block leading-tight">
                      {event.name}
                    </span>
                    <span className="text-xs text-charcoal-500 font-sans mt-0.5 block">
                      {event.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isChecked && (
                    <span className="hidden sm:inline-block text-[10px] font-sans font-semibold uppercase tracking-wider text-gold-800 bg-gold-100/80 px-2 py-0.5 rounded-full border border-gold-300/60">
                      Attending
                    </span>
                  )}
                  <Calendar className="w-4 h-4 text-gold-500/70 shrink-0" />
                </div>
              </button>
            );
          })}
        </div>

        {error && <p className="text-xs text-red-600 font-medium mt-1">{error}</p>}
      </div>

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

        <button
          type="button"
          onClick={validateAndProceed}
          className="min-h-[44px] px-6 py-2.5 rounded-full bg-gradient-to-r from-maroon-800 to-maroon-700 text-ivory-50 text-xs font-sans font-semibold tracking-wider uppercase shadow-luxe flex items-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Provide Guest Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
