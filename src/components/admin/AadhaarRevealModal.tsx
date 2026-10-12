"use client";

import React, { useState } from "react";
import { ShieldAlert, Copy, Check, X, ShieldCheck } from "lucide-react";

interface AadhaarRevealModalProps {
  isOpen: boolean;
  attendeeName: string;
  revealedAadhaar?: string;
  isLoading: boolean;
  error?: string | null;
  onConfirmReveal: () => void;
  onClose: () => void;
}

export const AadhaarRevealModal: React.FC<AadhaarRevealModalProps> = ({
  isOpen,
  attendeeName,
  revealedAadhaar,
  isLoading,
  error,
  onConfirmReveal,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (revealedAadhaar) {
      navigator.clipboard.writeText(revealedAadhaar.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-ivory-50 rounded-2xl max-w-md w-full p-6 border-2 border-gold-400 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-charcoal-400 hover:text-charcoal-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-xl text-maroon-900 font-medium">
              Sensitive ID Access
            </h4>
            <p className="text-xs text-charcoal-500 font-sans mt-0.5">
              Attendee: <strong className="text-charcoal-900">{attendeeName}</strong>
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {!revealedAadhaar ? (
          <div className="space-y-4">
            <div className="bg-ivory-200/80 p-3.5 rounded-xl border border-gold-300/60 text-xs text-charcoal-700 font-sans leading-relaxed">
              <p className="font-semibold text-maroon-900 mb-1">
                🔒 Security &amp; Audit Compliance
              </p>
              Revealing this Aadhaar number decrypts AES-256-GCM ciphertext on the server and will append an entry to the permanent <code className="bg-ivory-300 px-1 py-0.5 rounded text-charcoal-900">audit_logs</code> table.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full border border-gold-400/60 text-charcoal-700 hover:bg-ivory-200 text-xs font-sans font-medium transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirmReveal}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-full bg-maroon-800 hover:bg-maroon-900 text-ivory-50 text-xs font-sans font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "Decrypting..." : "Decrypt & Log Access"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-center">
              <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-semibold block mb-1">
                Decrypted Aadhaar Number
              </span>
              <p className="font-mono text-2xl font-bold text-emerald-950 tracking-widest my-1">
                {revealedAadhaar}
              </p>
              <span className="text-[10px] text-emerald-700 font-sans block flex items-center justify-center gap-1 mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Access logged to security audit trail
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 py-2.5 px-4 rounded-full border border-gold-400 bg-ivory-100 hover:bg-gold-100 text-charcoal-800 text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gold-700" />
                    <span>Copy 12 Digits</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-6 rounded-full bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs font-sans font-medium transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
