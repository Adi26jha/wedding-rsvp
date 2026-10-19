"use client";

import React, { useState, useRef } from "react";
import {
  User,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Shield,
  X,
  Camera,
} from "lucide-react";
import { RsvpFormState, AttendeeInput } from "./types";
import { AnimatedCheckmark } from "@/components/decorative/AnimatedCheckmark";

interface Step4Props {
  formData: RsvpFormState;
  updateFormData: (fields: Partial<RsvpFormState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB raw allowance, compressed to <200KB

/**
 * Client-side high-quality image compressor
 * Downscales camera photos (e.g. 12MP/5MB) to max 1400px width at 0.82 JPEG quality (~150KB)
 */
function compressImage(file: File, maxWidth = 1400, quality = 0.82): Promise<{ base64: string; size: number }> {
  return new Promise((resolve, reject) => {
    // If it's a PDF, bypass canvas compression
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        resolve({ base64, size: file.size });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ base64: e.target?.result as string, size: file.size });
        reader.readAsDataURL(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
      const approxSize = Math.round((compressedBase64.length * 3) / 4);
      resolve({ base64: compressedBase64, size: approxSize });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      const reader = new FileReader();
      reader.onload = (e) => resolve({ base64: e.target?.result as string, size: file.size });
      reader.readAsDataURL(file);
    };
    img.src = url;
  });
}

export const Step4Attendees: React.FC<Step4Props> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const handleNameChange = (index: number, name: string) => {
    const updated = [...formData.attendees];
    if (!updated[index]) {
      updated[index] = { fullName: "", ageGroup: "adult" };
    }
    updated[index].fullName = name;
    updateFormData({ attendees: updated });

    if (errors[`${index}-name`]) {
      const copy = { ...errors };
      delete copy[`${index}-name`];
      setErrors(copy);
    }
  };

  const handleAgeChange = (index: number, age: "adult" | "child") => {
    const updated = [...formData.attendees];
    if (!updated[index]) {
      updated[index] = { fullName: "", ageGroup: "adult" };
    }
    updated[index].ageGroup = age;
    updateFormData({ attendees: updated });
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setErrors({
        ...errors,
        [`${index}-file`]: "File size exceeds 10MB. Please choose a smaller photo or document.",
      });
      return;
    }

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!validTypes.includes(file.type) && !file.type.startsWith("image/")) {
      setErrors({
        ...errors,
        [`${index}-file`]: "Please upload an image (JPG, PNG) or PDF document.",
      });
      return;
    }

    try {
      const { base64, size } = await compressImage(file);
      const updated = [...formData.attendees];
      if (!updated[index]) {
        updated[index] = { fullName: "", ageGroup: "adult" };
      }

      updated[index].documentName = file.name;
      updated[index].documentType = file.type.startsWith("image/") ? "image/jpeg" : file.type;
      updated[index].documentSize = size;
      updated[index].documentBase64 = base64;
      updated[index].documentPreview = file.type.startsWith("image/") ? base64 : undefined;

      updateFormData({ attendees: updated });

      if (errors[`${index}-file`]) {
        const copy = { ...errors };
        delete copy[`${index}-file`];
        setErrors(copy);
      }
    } catch {
      setErrors({
        ...errors,
        [`${index}-file`]: "Could not process this file. Please try another photo or document.",
      });
    }
  };

  const removeFile = (index: number) => {
    const updated = [...formData.attendees];
    if (updated[index]) {
      updated[index].documentName = undefined;
      updated[index].documentType = undefined;
      updated[index].documentSize = undefined;
      updated[index].documentBase64 = undefined;
      updated[index].documentPreview = undefined;
      updateFormData({ attendees: updated });
    }
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = "";
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    formData.attendees.slice(0, formData.guestCount).forEach((att, idx) => {
      if (!att.fullName || att.fullName.trim().length < 2) {
        newErrors[`${idx}-name`] = `Please enter full name for Guest ${idx + 1}`;
      }

      if (!att.documentBase64 || !att.documentName) {
        newErrors[`${idx}-file`] = `Please upload the Aadhaar card document for ${att.fullName || `Guest ${idx + 1}`}`;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <form onSubmit={validateAndProceed} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl sm:text-3xl text-maroon-800 font-normal">
          Attendee ID Verification
        </h3>
        <p className="font-sans text-xs sm:text-sm text-charcoal-500 mt-1 max-w-md mx-auto">
          Please upload the Aadhaar card for each attending member for mandatory resort booking &amp; Uttarakhand forest zone compliance.
        </p>

        {/* Security reassurance banner */}
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-sans shadow-xs">
          <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Uploaded ID cards are encrypted server-side with AES-256-GCM</span>
        </div>
      </div>

      {/* Dynamic Attendee Cards */}
      <div className="space-y-5">
        {formData.attendees.slice(0, formData.guestCount).map((attendee, index) => {
          const nameError = errors[`${index}-name`];
          const fileError = errors[`${index}-file`];
          const hasFile = Boolean(attendee.documentBase64 && attendee.documentName);

          return (
            <div
              key={index}
              className="bg-ivory-50 rounded-2xl p-5 sm:p-6 border border-gold-300/80 shadow-sm relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gold-200/60">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-maroon-800 text-ivory-50 text-xs font-serif flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <h4 className="font-serif text-lg sm:text-xl text-maroon-900 font-medium">
                    Guest {index + 1}
                    {index === 0 && (
                      <span className="text-xs font-sans text-gold-700 ml-2 font-normal">
                        (Primary Guest)
                      </span>
                    )}
                  </h4>
                </div>

                {/* Age selector */}
                <div className="flex items-center gap-1 bg-ivory-200/70 p-1 rounded-lg border border-gold-300/40 text-xs">
                  <button
                    type="button"
                    onClick={() => handleAgeChange(index, "adult")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      attendee.ageGroup === "adult"
                        ? "bg-white text-maroon-800 shadow-xs"
                        : "text-charcoal-600 hover:text-charcoal-900"
                    }`}
                  >
                    Adult
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAgeChange(index, "child")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      attendee.ageGroup === "child"
                        ? "bg-white text-maroon-800 shadow-xs"
                        : "text-charcoal-600 hover:text-charcoal-900"
                    }`}
                  >
                    Child
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5 mb-4">
                <label
                  htmlFor={`guest-name-${index}`}
                  className="block text-xs uppercase tracking-wider font-semibold text-charcoal-700"
                >
                  Full Name (As on Aadhaar Card) <span className="text-maroon-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gold-600">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id={`guest-name-${index}`}
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={attendee.fullName}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-ivory-100/60 border text-charcoal-900 placeholder-charcoal-400 text-sm focus:outline-none focus:ring-2 transition-all min-h-[44px] ${
                      nameError
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gold-300/80 focus:border-maroon-700 focus:ring-maroon-100"
                    }`}
                  />
                </div>
                {nameError && (
                  <p className="text-xs text-red-600 font-medium">{nameError}</p>
                )}
              </div>

              {/* Aadhaar Document Upload Zone */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal-700">
                  Aadhaar Card Document (Photo or PDF) <span className="text-maroon-600">*</span>
                </label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  id={`aadhaar-file-${index}`}
                  ref={(el) => {
                    fileInputRefs.current[index] = el;
                  }}
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(index, file);
                  }}
                />

                {!hasFile ? (
                  /* Empty Upload Dropzone */
                  <div
                    onClick={() => fileInputRefs.current[index]?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleFileUpload(index, file);
                    }}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group min-h-[130px] ${
                      fileError
                        ? "border-red-400 bg-red-50/40"
                        : "border-gold-400/80 bg-ivory-100/50 hover:bg-gold-50/60 hover:border-gold-500"
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-gold-100 text-maroon-800 flex items-center justify-center border border-gold-300/60 group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-5 h-5 text-gold-700" />
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-semibold text-maroon-900">
                        Tap to Upload or Take Photo
                      </p>
                      <p className="text-[11px] text-charcoal-500 font-sans">
                        Supports PDF, JPG, PNG or WEBP (Max 5MB)
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-charcoal-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Camera className="w-3 h-3 text-gold-600" /> Mobile Camera
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-gold-600" /> PDF Document
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Attached Document State Card */
                  <div className="bg-gradient-to-r from-emerald-50/90 to-emerald-100/60 border border-emerald-300/90 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {/* Image Thumbnail or PDF Icon */}
                      {attendee.documentPreview ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-emerald-300 shrink-0 bg-white shadow-xs">
                          <img
                            src={attendee.documentPreview}
                            alt="Aadhaar Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-300 shrink-0">
                          <FileText className="w-6 h-6 text-emerald-700" />
                        </div>
                      )}

                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <AnimatedCheckmark size={15} strokeColor="#047857" />
                          <span className="text-xs font-semibold text-emerald-950 truncate max-w-[200px]">
                            {attendee.documentName}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-800 font-sans block mt-0.5">
                          {formatFileSize(attendee.documentSize)} &bull; Ready for AES-256 encryption
                        </span>
                      </div>
                    </div>

                    {/* Change / Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1.5 rounded-full hover:bg-emerald-200/80 text-emerald-700 hover:text-emerald-950 transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {fileError && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1 pt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fileError}</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
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
          type="submit"
          className="min-h-[44px] px-6 py-2.5 rounded-full bg-gradient-to-r from-maroon-800 to-maroon-700 text-ivory-50 text-xs font-sans font-semibold tracking-wider uppercase shadow-luxe flex items-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Review &amp; Consent</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
};
