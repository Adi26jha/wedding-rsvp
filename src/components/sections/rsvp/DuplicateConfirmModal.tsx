"use client";

import React from "react";
import { AlertCircle, RefreshCw, X } from "lucide-react";

interface DuplicateConfirmModalProps {
  isOpen: boolean;
  existingName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const DuplicateConfirmModal: React.FC<DuplicateConfirmModalProps> = ({
  isOpen,
  existingName,
  onConfirm,
  onCancel,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-ivory-50 rounded-2xl max-w-md w-full p-6 border-2 border-gold-400 shadow-2xl relative text-left">
        <button
          onClick={onCancel}
          type="button"
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-charcoal-400 hover:text-charcoal-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-full bg-gold-100 border border-gold-300 text-maroon-800 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-xl text-maroon-900 font-medium">
              Existing RSVP Found
            </h4>
            <p className="text-xs text-charcoal-500 font-sans mt-0.5">
              An invitation response is already registered with this mobile number.
            </p>
          </div>
        </div>

        <div className="bg-ivory-200/70 p-3.5 rounded-xl border border-gold-200 text-xs text-charcoal-700 font-sans mb-5 leading-relaxed">
          Previously submitted for:{" "}
          <strong className="text-maroon-900 font-semibold">{existingName}</strong>.
          <br />
          Would you like to overwrite and update your family attendee records with this new submission?
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-full border border-gold-400/60 text-charcoal-700 hover:bg-ivory-200 text-xs font-sans font-medium transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-full bg-maroon-800 hover:bg-maroon-900 text-ivory-50 text-xs font-sans font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>Update My RSVP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
