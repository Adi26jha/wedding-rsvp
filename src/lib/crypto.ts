import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits

export const DEFAULT_AADHAAR_KEY_HEX =
  "c39e8a719d45209b0b686d63428941cfb2e67a0e4c5b1c8e7425f190e82c5a93";

/**
 * Derives a 32-byte Buffer encryption key from a string or hex.
 */
function deriveKey(keyStr: string): Buffer {
  if (/^[0-9a-fA-F]{64}$/.test(keyStr)) {
    return Buffer.from(keyStr, "hex");
  }
  return crypto.createHash("sha256").update(keyStr).digest();
}

/**
 * Derives the active primary 32-byte Buffer encryption key.
 */
function getEncryptionKey(): Buffer {
  const envKey =
    process.env.AADHAAR_ENCRYPTION_KEY ||
    DEFAULT_AADHAAR_KEY_HEX;

  return deriveKey(envKey);
}

/**
 * Returns an array of unique Buffer keys to attempt when decrypting,
 * ensuring backwards compatibility across key rotations and environments.
 */
function getDecryptionKeys(): Buffer[] {
  const candidates: string[] = [
    process.env.AADHAAR_ENCRYPTION_KEY || "",
    DEFAULT_AADHAAR_KEY_HEX,
    process.env.ADMIN_ACCESS_PASSWORD || "",
    process.env.ADMIN_SECRET_KEY || "",
    "corbett-wedding-2026-aadhaar-encryption-secret-master-key-salt",
    "corbett2026admin",
  ].filter(Boolean);

  const seen = new Set<string>();
  const uniqueKeys: Buffer[] = [];

  for (const str of candidates) {
    const keyBuf = deriveKey(str);
    const hex = keyBuf.toString("hex");
    if (!seen.has(hex)) {
      seen.add(hex);
      uniqueKeys.push(keyBuf);
    }
  }

  return uniqueKeys;
}

export interface EncryptedPayload {
  ciphertext: string; // Base64 encoded
  iv: string; // Base64 encoded
  authTag: string; // Base64 encoded
}

/**
 * Encrypts sensitive string or buffer (e.g., Aadhaar number or document base64) using AES-256-GCM.
 */
export function encryptAadhaar(plaintext: string): EncryptedPayload {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag().toString("base64");

  return {
    ciphertext: encrypted,
    iv: iv.toString("base64"),
    authTag: authTag,
  };
}

/**
 * Decrypts an AES-256-GCM encrypted payload.
 * Tries the primary key first, followed by fallback candidate keys if needed.
 * Throws error if ciphertext or auth tag is corrupted or tampered with.
 */
export function decryptAadhaar(payload: EncryptedPayload): string {
  const keys = getDecryptionKeys();
  const iv = Buffer.from(payload.iv, "base64");
  const authTag = Buffer.from(payload.authTag, "base64");

  let lastError: unknown;
  for (const key of keys) {
    try {
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
        authTagLength: AUTH_TAG_LENGTH,
      });
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(payload.ciphertext, "base64", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to decrypt Aadhaar document payload with any configured key");
}

/**
 * Encrypts raw binary file buffer (e.g. uploaded Aadhaar PDF or image)
 */
export function encryptFileBuffer(buffer: Buffer): EncryptedPayload {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encryptedBuffer = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encryptedBuffer.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
}

/**
 * Decrypts encrypted file payload back into raw Buffer
 */
export function decryptFileBuffer(payload: EncryptedPayload): Buffer {
  const keys = getDecryptionKeys();
  const iv = Buffer.from(payload.iv, "base64");
  const authTag = Buffer.from(payload.authTag, "base64");
  const cipherBuffer = Buffer.from(payload.ciphertext, "base64");

  let lastError: unknown;
  for (const key of keys) {
    try {
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
        authTagLength: AUTH_TAG_LENGTH,
      });
      decipher.setAuthTag(authTag);
      return Buffer.concat([decipher.update(cipherBuffer), decipher.final()]);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to decrypt file buffer with any configured key");
}
