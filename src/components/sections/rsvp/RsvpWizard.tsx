"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressBar } from "./ProgressBar";
import { Step1Contact } from "./Step1Contact";
import { Step2Attendance } from "./Step2Attendance";
import { Step3EventsCount } from "./Step3EventsCount";
import { Step4Attendees } from "./Step4Attendees";
import { Step5ReviewConsent } from "./Step5ReviewConsent";
import { Step6SuccessPass } from "./Step6SuccessPass";
import { DuplicateConfirmModal } from "./DuplicateConfirmModal";
import { RsvpFormState, SubmissionResponse } from "./types";
import { FloralArch } from "@/components/decorative/FloralArch";
import { AlertCircle } from "lucide-react";

interface RsvpWizardProps {
  initialFamilyParam?: string;
}

const STORAGE_KEY = "priyal_justin_rsvp_draft_v2";

const initialFormState: RsvpFormState = {
  contactName: "",
  mobileNumber: "",
  email: "",
  attendanceStatus: "",
  attendingEvents: ["haldi", "sangeet", "wedding"],
  guestCount: 1,
  attendees: [{ fullName: "", ageGroup: "adult" }],
  consentGiven: false,
  notes: "",
  honeypot: "",
  confirmUpdate: false,
};

export const RsvpWizard: React.FC<RsvpWizardProps> = ({ initialFamilyParam }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<RsvpFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submissionResponse, setSubmissionResponse] = useState<SubmissionResponse | null>(null);

  // Duplicate prompt modal state
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateExistingName, setDuplicateExistingName] = useState("");

  // Restore draft from sessionStorage on client load
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } else if (initialFamilyParam) {
        setFormData((prev) => ({
          ...prev,
          contactName: `${initialFamilyParam.charAt(0).toUpperCase() + initialFamilyParam.slice(1)} Family`,
        }));
      }
    } catch {}
  }, [initialFamilyParam]);

  // Autosave progress to sessionStorage
  useEffect(() => {
    if (currentStep < 6 && formData.contactName) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch {}
    }
  }, [formData, currentStep]);

  const updateFormData = (fields: Partial<RsvpFormState>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    if (serverError) setServerError(null);
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(6, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const submitRsvp = async (forceUpdate = false) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const payload = {
        ...formData,
        confirmUpdate: forceUpdate || formData.confirmUpdate,
      };

      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Submission failed. Please check your details and try again.");
        setIsSubmitting(false);
        return;
      }

      // Check if duplicate prompt returned
      if (data.exists) {
        setDuplicateExistingName(data.existingName);
        setShowDuplicateModal(true);
        setIsSubmitting(false);
        return;
      }

      // Successful submission
      setSubmissionResponse(data);
      setCurrentStep(6);
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
    } catch (err: unknown) {
      console.error("Submission request error:", err);
      setServerError("Network error. Please ensure you are connected and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDuplicateUpdate = async () => {
    setShowDuplicateModal(false);
    updateFormData({ confirmUpdate: true });
    await submitRsvp(true);
  };

  return (
    <section id="rsvp-section" className="py-24 px-4 bg-[#FAF7F2] relative overflow-hidden">
      {/* Background Indian Botanical Line Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#6A1B29_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-2xl mx-auto relative z-10">
        <FloralArch variant="card" className="bg-ivory-50/95 backdrop-blur-md rounded-[36px] p-6 sm:p-12 shadow-luxe border-2 border-gold-300/90 relative">
          {/* Stepper Progress */}
          <ProgressBar
            currentStep={currentStep}
            totalSteps={5}
            isDeclined={formData.attendanceStatus === "declined"}
          />

          {/* Server Error Notification Banner */}
          {serverError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to process submission</p>
                <p className="mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          {/* Step Views Animated Transitions with Spring Physics */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.98 }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {currentStep === 1 && (
                <Step1Contact
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={handleNext}
                />
              )}

              {currentStep === 2 && (
                <Step2Attendance
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                  onFastSubmitDeclined={() => submitRsvp(false)}
                  isSubmitting={isSubmitting}
                />
              )}

              {currentStep === 3 && (
                <Step3EventsCount
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 4 && (
                <Step4Attendees
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 5 && (
                <Step5ReviewConsent
                  formData={formData}
                  updateFormData={updateFormData}
                  onSubmit={() => submitRsvp(false)}
                  onBack={handleBack}
                  isSubmitting={isSubmitting}
                />
              )}

              {currentStep === 6 && submissionResponse && (
                <Step6SuccessPass
                  response={submissionResponse}
                  onEditAgain={() => setCurrentStep(1)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </FloralArch>
      </div>

      {/* Duplicate RSVP Confirmation Modal */}
      <DuplicateConfirmModal
        isOpen={showDuplicateModal}
        existingName={duplicateExistingName}
        onConfirm={handleConfirmDuplicateUpdate}
        onCancel={() => setShowDuplicateModal(false)}
        isSubmitting={isSubmitting}
      />
    </section>
  );
};
