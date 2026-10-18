"use client";

import React from "react";
import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  isDeclined?: boolean;
}

const STEP_LABELS = [
  "Contact",
  "Attendance",
  "Guest Count",
  "Guest IDs",
  "Review & Consent",
];

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  isDeclined = false,
}) => {
  if (currentStep >= 6) return null; // Success step hides progress bar

  const activeSteps = isDeclined
    ? [STEP_LABELS[0], STEP_LABELS[1]]
    : STEP_LABELS;

  const total = activeSteps.length;
  const current = Math.min(currentStep, total);

  return (
    <div className="w-full max-w-xl mx-auto mb-8 px-2">
      {/* Mobile Compact Progress Bar */}
      <div className="flex sm:hidden items-center justify-between text-xs mb-2">
        <span className="font-sans font-medium text-maroon-800">
          Step {current} of {total}: <span className="font-serif italic text-gold-700">{activeSteps[current - 1]}</span>
        </span>
        <span className="text-charcoal-400 font-sans text-[11px]">
          {Math.round((current / total) * 100)}%
        </span>
      </div>

      <div className="h-1.5 w-full bg-ivory-300 rounded-full overflow-hidden sm:hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-500 to-maroon-700 transition-all duration-500 ease-out"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>

      {/* Desktop Stepper */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute left-6 right-6 top-4 h-[2px] bg-ivory-300 -z-0" />
        <div
          className="absolute left-6 top-4 h-[2px] bg-gradient-to-r from-gold-500 to-maroon-700 -z-0 transition-all duration-500 ease-out"
          style={{
            width: `${((current - 1) / (total - 1)) * 100}%`,
            maxWidth: "calc(100% - 48px)",
          }}
        />

        {activeSteps.map((label, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < current;
          const isActive = stepNum === current;

          return (
            <div key={label} className="flex flex-col items-center relative z-10 group">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  isDone
                    ? "bg-maroon-800 text-ivory-100 shadow-md border border-gold-400/40"
                    : isActive
                    ? "bg-gradient-to-br from-[#E6C670] to-[#C9A24B] text-maroon-950 ring-4 ring-gold-300/40 shadow-glow font-bold scale-110"
                    : "bg-ivory-100 text-charcoal-400 border border-gold-200/50"
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 stroke-[2.5] text-gold-300" />
                ) : (
                  <span className="font-serif font-bold">{stepNum}</span>
                )}
              </div>
              <span
                className={`text-[11px] font-sans mt-2 tracking-wide uppercase transition-colors ${
                  isActive
                    ? "font-bold text-maroon-950 tracking-wider"
                    : isDone
                    ? "text-maroon-800 font-medium"
                    : "text-charcoal-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
