import { z } from "zod";

// Indian mobile number regex: optional +91 or 0 prefix followed by 10 digits starting with 6,7,8,9
const indianMobileRegex = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export const attendeeSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  ageGroup: z.enum(["adult", "child"]).default("adult"),
  // Aadhaar Document Upload
  documentName: z.string().min(1, "Please upload an Aadhaar card document"),
  documentType: z.string().refine(
    (type) => ACCEPTED_FILE_TYPES.includes(type) || type.startsWith("image/"),
    { message: "File must be an image (JPG, PNG, WEBP) or PDF" }
  ),
  documentSize: z.number().max(MAX_FILE_SIZE, "File size must not exceed 5MB"),
  documentBase64: z.string().min(10, "Invalid file content"),
  documentPreview: z.string().optional(),
});

export const rsvpFormSchema = z
  .object({
    contactName: z
      .string()
      .trim()
      .min(2, "Please enter your full name")
      .max(100, "Name is too long"),
    mobileNumber: z
      .string()
      .trim()
      .transform((val) => val.replace(/[\s-]/g, ""))
      .refine((val) => indianMobileRegex.test(val), {
        message: "Please enter a valid 10-digit Indian mobile number",
      }),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),
    attendanceStatus: z.enum(["attending", "declined"], {
      required_error: "Please select whether you will attend",
    }),
    attendingEvents: z.array(z.string()).default([]),
    guestCount: z.number().int().min(1).max(10).default(1),
    attendees: z.array(attendeeSchema).default([]),
    consentGiven: z.boolean().default(false),
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
    honeypot: z.string().max(0, "Bot detected").optional().or(z.literal("")),
    confirmUpdate: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    // If attending, require at least one event selected
    if (data.attendanceStatus === "attending") {
      if (data.attendingEvents.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["attendingEvents"],
          message: "Please select at least one event you plan to attend",
        });
      }

      // Check attendees array matches guestCount
      if (data.attendees.length !== data.guestCount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["attendees"],
          message: `Please provide Aadhaar card documents for all ${data.guestCount} attendees`,
        });
      }

      // Consent must be true
      if (!data.consentGiven) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["consentGiven"],
          message: "Consent is required to submit ID details for venue arrangements",
        });
      }
    }
  });

export type RsvpFormData = z.infer<typeof rsvpFormSchema>;
export type AttendeeData = z.infer<typeof attendeeSchema>;
