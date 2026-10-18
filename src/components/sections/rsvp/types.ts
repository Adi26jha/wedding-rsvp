export interface AttendeeInput {
  fullName: string;
  ageGroup: "adult" | "child";
  // Uploaded Aadhaar Document
  documentName?: string;
  documentType?: string;
  documentSize?: number;
  documentBase64?: string;
  documentPreview?: string;
}

export interface RsvpFormState {
  contactName: string;
  mobileNumber: string;
  email: string;
  attendanceStatus: "attending" | "declined" | "";
  attendingEvents: string[]; // ['haldi', 'cocktail', 'chooda', 'wedding']
  guestCount: number;
  attendees: AttendeeInput[];
  consentGiven: boolean;
  notes: string;
  honeypot: string; // bot catch
  confirmUpdate: boolean;
}

export interface SubmissionResponse {
  success: boolean;
  rsvpId?: string;
  isUpdate?: boolean;
  primaryContactName?: string;
  mobileNumber?: string;
  attendanceStatus?: "attending" | "declined";
  attendingEvents?: string[];
  guestCount?: number;
  attendees?: Array<{
    id?: string;
    fullName: string;
    ageGroup: "adult" | "child";
    documentName?: string;
    documentSize?: number;
    hasEncryptedDocument: boolean;
  }>;
  timestamp?: string;
}
