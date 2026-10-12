/**
 * Verhoeff Algorithm for Aadhaar Validation
 * 
 * Aadhaar numbers are 12-digit numbers where the 12th digit is a checksum
 * calculated using the Verhoeff algorithm (based on dihedral group D5).
 * 
 * Verhoeff algorithm detects all single-digit errors and all transposition errors
 * of adjacent digits.
 */

// Multiplication table d(i, j) based on dihedral group D5
const d: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

// Permutation table p(i, j)
const p: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

// Inverse table inv(j)
const inv: number[] = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Validates whether a given string is a valid 12-digit Aadhaar number
 * using the Verhoeff checksum algorithm.
 */
export function validateAadhaarVerhoeff(aadhaar: string): {
  isValid: boolean;
  error?: string;
} {
  // 1. Strip spaces and hyphens
  const cleaned = aadhaar.replace(/[\s-]/g, "");

  // 2. Check length and numeric composition
  if (!/^\d{12}$/.test(cleaned)) {
    return {
      isValid: false,
      error: "Aadhaar number must be exactly 12 digits",
    };
  }

  // 3. Aadhaar cannot start with 0 or 1 per UIDAI specifications
  if (cleaned[0] === "0" || cleaned[0] === "1") {
    return {
      isValid: false,
      error: "Aadhaar number cannot begin with 0 or 1",
    };
  }

  // 4. Verhoeff checksum calculation
  let c = 0;
  const digits = cleaned.split("").map(Number).reverse();

  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    const perm = p[i % 8][digit];
    c = d[c][perm];
  }

  if (c !== 0) {
    return {
      isValid: false,
      error: "Invalid Aadhaar number (checksum failed)",
    };
  }

  return { isValid: true };
}

/**
 * Generates the Verhoeff checksum digit for an 11-digit prefix.
 * Useful for test fixture generation and testing.
 */
export function generateVerhoeffChecksum(numStr: string): number {
  let c = 0;
  const digits = numStr.split("").map(Number).reverse();

  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    const perm = p[(i + 1) % 8][digit];
    c = d[c][perm];
  }

  return inv[c];
}

/**
 * Formats an Aadhaar string into `XXXX XXXX XXXX` chunks.
 */
export function formatAadhaarInput(val: string): string {
  const digits = val.replace(/\D/g, "").slice(0, 12);
  const parts: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join(" ");
}

/**
 * Masks an Aadhaar string: `XXXX XXXX 1234`
 */
export function maskAadhaar(aadhaar: string): string {
  const cleaned = aadhaar.replace(/\D/g, "");
  if (cleaned.length < 4) return "XXXX XXXX XXXX";
  const last4 = cleaned.slice(-4);
  return `XXXX XXXX ${last4}`;
}
