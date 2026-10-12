"use client";

import React, { useState } from "react";
import { User, Phone, Mail, ArrowRight } from "lucide-react";
import { RsvpFormState } from "./types";

interface Step1Props {
  formData: RsvpFormState;
  updateFormData: (fields: Partial<RsvpFormState>) => void;
  onNext: () => void;
}

export const Step1Contact: React.FC<Step1Props> = ({
  formData,
  updateFormData,
  onNext,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.contactName.trim() || formData.contactName.trim().length < 2) {
      newErrors.contactName = "Please enter your name (at least 2 characters)";
    }

    const cleanedMobile = formData.mobileNumber.replace(/[\s-]/g, "");
    const indianMobileRegex = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/;
    if (!cleanedMobile || !indianMobileRegex.test(cleanedMobile)) {
      newErrors.mobileNumber = "Please enter a valid 10-digit Indian mobile number";
    }

    if (formData.email && formData.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <form onSubmit={validateAndProceed} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl sm:text-3xl text-maroon-800 font-normal">
          Primary Contact Details
        </h3>
        <p className="font-sans text-xs sm:text-sm text-charcoal-500 mt-1">
          Please provide the primary contact person for your family or group.
        </p>
      </div>

      {/* Full Name */}
      <div className="space-y-1.5">
        <label
          htmlFor="contactName"
          className="block text-xs uppercase tracking-wider font-semibold text-charcoal-700"
        >
          Your Full Name <span className="text-maroon-600">*</span>
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-600 transition-colors group-focus-within:text-maroon-700">
            <User className="w-4 h-4" />
          </div>
          <input
            id="contactName"
            type="text"
            required
            autoComplete="name"
            placeholder="e.g. Vikram Malhotra / Sharma Family"
            value={formData.contactName}
            onChange={(e) => {
              updateFormData({ contactName: e.target.value });
              if (errors.contactName) setErrors({ ...errors, contactName: "" });
            }}
            className={`w-full pl-10 pr-4 py-3.5 rounded-xl bg-ivory-50/80 backdrop-blur-sm border text-charcoal-900 placeholder-charcoal-400 text-sm focus:outline-none transition-all shadow-inner-sm min-h-[46px] ${
              errors.contactName
                ? "border-red-400 focus:ring-2 focus:ring-red-200"
                : "border-gold-300/80 focus:border-maroon-700 focus:ring-2 focus:ring-gold-300/40 focus:bg-white"
            }`}
          />
        </div>
        {errors.contactName && (
          <p className="text-xs text-red-600 mt-1 font-medium">{errors.contactName}</p>
        )}
      </div>

      {/* Mobile Number */}
      <div className="space-y-1.5">
        <label
          htmlFor="mobileNumber"
          className="block text-xs uppercase tracking-wider font-semibold text-charcoal-700"
        >
          Mobile Number (WhatsApp Preferred) <span className="text-maroon-600">*</span>
        </label>
        <div className="relative flex rounded-xl border border-gold-300/80 bg-ivory-50/80 backdrop-blur-sm focus-within:border-maroon-700 focus-within:ring-2 focus-within:ring-gold-300/40 focus-within:bg-white transition-all overflow-hidden">
          <div className="flex items-center pl-3.5 pr-2.5 bg-ivory-200/50 border-r border-gold-300/40 text-charcoal-700 text-xs font-semibold select-none">
            <Phone className="w-3.5 h-3.5 text-gold-600 mr-1.5" />
            +91
          </div>
          <input
            id="mobileNumber"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel-national"
            maxLength={10}
            placeholder="98765 43210"
            value={formData.mobileNumber}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
              updateFormData({ mobileNumber: cleaned });
              if (errors.mobileNumber) setErrors({ ...errors, mobileNumber: "" });
            }}
            className="w-full px-3.5 py-3.5 bg-transparent text-charcoal-900 placeholder-charcoal-400 text-sm focus:outline-none min-h-[46px]"
          />
        </div>
        {errors.mobileNumber ? (
          <p className="text-xs text-red-600 mt-1 font-medium">{errors.mobileNumber}</p>
        ) : (
          <p className="text-[11px] text-charcoal-400">
            Used to send confirmation pass and locate your existing reservation.
          </p>
        )}
      </div>

      {/* Email (Optional) */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label
            htmlFor="email"
            className="block text-xs uppercase tracking-wider font-semibold text-charcoal-700"
          >
            Email Address
          </label>
          <span className="text-[10px] uppercase tracking-wider text-charcoal-400 font-medium">
            Optional
          </span>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-600 transition-colors group-focus-within:text-maroon-700">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="e.g. name@example.com"
            value={formData.email}
            onChange={(e) => {
              updateFormData({ email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            className={`w-full pl-10 pr-4 py-3.5 rounded-xl bg-ivory-50/80 backdrop-blur-sm border text-charcoal-900 placeholder-charcoal-400 text-sm focus:outline-none transition-all shadow-inner-sm min-h-[46px] ${
              errors.email
                ? "border-red-400 focus:ring-2 focus:ring-red-200"
                : "border-gold-300/80 focus:border-maroon-700 focus:ring-2 focus:ring-gold-300/40 focus:bg-white"
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-600 mt-1 font-medium">{errors.email}</p>
        )}
      </div>

      {/* Continue Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full min-h-[48px] py-3.5 px-6 rounded-full bg-gradient-to-r from-maroon-800 via-maroon-700 to-maroon-800 text-ivory-50 font-sans text-sm font-semibold tracking-wider uppercase shadow-luxe hover:shadow-luxe-hover flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all border border-gold-400/40"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
