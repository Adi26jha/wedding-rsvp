import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Derives a 32-byte Buffer encryption key from environment variable.
 */
function getEncryptionKey(): Buffer {
  const envKey =
    process.env.AADHAAR_ENCRYPTION_KEY ||
    process.env.ADMIN_ACCESS_PASSWORD ||
    process.env.ADMIN_SECRET_KEY ||
    "corbett-wedding-2026-aadhaar-encryption-secret-master-key-salt";

  // Check if 64-character hex string (32 bytes)
  if (/^[0-9a-fA-F]{64}$/.test(envKey)) {
    return Buffer.from(envKey, "hex");
  }

  // Fallback: derive 32 bytes using SHA-256
  return crypto.createHash("sha256").update(envKey).digest();
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
 * Throws error if ciphertext or auth tag is corrupted or tampered with.
 */
export function decryptAadhaar(payload: EncryptedPayload): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(payload.iv, "base64");
  const authTag = Buffer.from(payload.authTag, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(payload.ciphertext, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
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
  const key = getEncryptionKey();
  const iv = Buffer.from(payload.iv, "base64");
  const authTag = Buffer.from(payload.authTag, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);

  const cipherBuffer = Buffer.from(payload.ciphertext, "base64");
  return Buffer.concat([decipher.update(cipherBuffer), decipher.final()]);
}
