"use client";

import React, { useEffect } from "react";
import { Plus, Minus, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { RsvpFormState } from "./types";

interface Step3Props {
  formData: RsvpFormState;
  updateFormData: (fields: Partial<RsvpFormState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ALL_EVENTS = [
  {
    id: "haldi",
    name: "HALDI",
    time: "Nov 21 • 1:00 PM to 4:30 PM",
    venue: "Poolside Arena",
    attire: "Shades of Pink",
  },
  {
    id: "cocktail",
    name: "COCKTAIL & RING CEREMONY",
    time: "Nov 21 • 7:00 PM to 11:00 PM",
    venue: "Swagatam Lawn",
    attire: "All-Bling",
  },
  {
    id: "chooda",
    name: "CHOODA CEREMONY",
    time: "Nov 22 • 10:00 AM to 11:30 AM",
    venue: "Banquet Hall",
    attire: "Ethnic Wear",
  },
  {
    id: "wedding",
    name: "THE WEDDING",
    time: "Nov 22 • 4:30 PM to 10:00 PM",
    venue: "Adanya Lawn",
    attire: "Royal Indian Attire",
  },
];

const ALL_EVENT_IDS = ["haldi", "cocktail", "chooda", "wedding"];

export const Step3EventsCount: React.FC<Step3Props> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  // Automatically ensure all 4 events are populated when attending
  useEffect(() => {
    if (
      !formData.attendingEvents ||
      formData.attendingEvents.length !== ALL_EVENT_IDS.length
    ) {
      updateFormData({ attendingEvents: ALL_EVENT_IDS });
    }
  }, []);

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
      attendingEvents: ALL_EVENT_IDS,
    });
  };

  const handleProceed = () => {
    // Make sure attendee array has guestCount elements
    const attendees = [...formData.attendees];
    while (attendees.length < formData.guestCount) {
      attendees.push({
        fullName: attendees.length === 0 ? formData.contactName : "",
        ageGroup: "adult",
      });
    }
    updateFormData({
      attendees,
      attendingEvents: ALL_EVENT_IDS,
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl sm:text-3xl text-maroon-800 font-normal">
          Guest Count
        </h3>
        <p className="font-sans text-xs sm:text-sm text-charcoal-500 mt-1">
          Kindly indicate the total number of family or group members attending.
        </p>
      </div>

      {/* Guest Stepper */}
      <div className="bg-ivory-50 border border-gold-300/80 rounded-2xl p-6 sm:p-7 text-center space-y-4 shadow-sm">
        <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal-700">
          Total Attending Family / Group Members
        </label>
        <p className="text-xs text-charcoal-500 font-sans max-w-md mx-auto">
          Please select the number of members joining us at Corbett Adventure Resort. You will upload ID documents for each guest in the next step.
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

          <div className="w-24 text-center">
            <span className="font-serif text-4xl sm:text-5xl font-medium text-maroon-900 block leading-none">
              {formData.guestCount}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-charcoal-400 font-sans mt-1.5 block font-semibold">
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

      {/* Celebrations Included Notice */}
      <div className="bg-ivory-100/70 border border-gold-300/80 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-1">
          <span className="text-xs uppercase tracking-wider font-semibold text-charcoal-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            Celebrations Included For All Guests
          </span>
          <span className="text-[11px] font-sans text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            All 4 Functions
          </span>
        </div>

        <p className="text-xs text-charcoal-600 font-sans leading-relaxed">
          Your RSVP includes access to all 4 wedding ceremonies across the two days:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {ALL_EVENTS.map((evt) => (
            <div
              key={evt.id}
              className="bg-white/80 border border-gold-200/80 rounded-xl p-3 shadow-2xs text-left"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm font-semibold text-maroon-900">
                  {evt.name}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </div>
              <span className="text-[11px] text-charcoal-500 font-sans block mt-0.5">
                {evt.time} &bull; {evt.venue}
              </span>
              <span className="text-[10px] text-maroon-800 font-sans block mt-0.5">
                Dress Code: <strong className="font-medium">{evt.attire}</strong>
              </span>
            </div>
          ))}
        </div>
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
          onClick={handleProceed}
          className="min-h-[44px] px-6 py-2.5 rounded-full bg-gradient-to-r from-maroon-800 to-maroon-700 text-ivory-50 text-xs font-sans font-semibold tracking-wider uppercase shadow-luxe flex items-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Provide Guest Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
