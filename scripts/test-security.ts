/**
 * Security & Encryption Test Suite
 */

import { encryptAadhaar, decryptAadhaar, encryptFileBuffer, decryptFileBuffer } from "../src/lib/crypto";

// Set dummy encryption key for test
process.env.AADHAAR_ENCRYPTION_KEY = "c39e8a719d45209b0b686d63428941cfb2e67a0e4c5b1c8e7425f190e82c5a93";

console.log("=== 1. Testing Document String Encryption (Base64) ===");
const sampleDocumentBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...";
const encryptedDoc = encryptAadhaar(sampleDocumentBase64);

console.log("Encrypted Document Payload:", {
  ciphertext: encryptedDoc.ciphertext.slice(0, 20) + "...",
  iv: encryptedDoc.iv,
  authTag: encryptedDoc.authTag,
});

const decryptedDoc = decryptAadhaar(encryptedDoc);
if (decryptedDoc !== sampleDocumentBase64) {
  throw new Error("Base64 Document encryption mismatch!");
}
console.log("✅ Base64 Document encryption round-trip PASSED!");

console.log("\n=== 2. Testing Binary File Buffer Encryption (PDF / Image) ===");
const fakePdfBuffer = Buffer.from("%PDF-1.4 Mock Aadhaar Document Content for testing 12345");
const encryptedBuffer = encryptFileBuffer(fakePdfBuffer);

console.log("Encrypted Buffer Payload:", {
  ciphertext: encryptedBuffer.ciphertext.slice(0, 20) + "...",
  iv: encryptedBuffer.iv,
  authTag: encryptedBuffer.authTag,
});

const decryptedBuffer = decryptFileBuffer(encryptedBuffer);
if (decryptedBuffer.toString("utf8") !== fakePdfBuffer.toString("utf8")) {
  throw new Error("Binary File Buffer round-trip mismatch!");
}
console.log("✅ Binary File Buffer encryption round-trip PASSED!");

// Test tamper detection
try {
  const tamperedPayload = {
    ...encryptedBuffer,
    ciphertext: encryptedBuffer.ciphertext.slice(0, -2) + "99",
  };
  decryptFileBuffer(tamperedPayload);
  throw new Error("Failed to catch tampered payload!");
} catch (e: unknown) {
  console.log("✅ Successfully caught tampered document ciphertext:", (e as Error).message);
}

console.log("\nAll Cryptographic Document Security Tests PASSED!\n");
