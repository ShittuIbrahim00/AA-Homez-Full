import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "exactly32characterslongkey!12345"; // 32 bytes
const IV_LENGTH = 16;

// Validate key immediately
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  console.log("Encryption key must be exactly 32 bytes long");
  // process.exit(1); // Uncomment to crash the app if key is invalid
}

export function encrypt(text) {
  if (!text) return null;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return iv.toString("base64") + ":" + encrypted;
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
}

export function decrypt(text) {
  if (!text) return null;
  try {
    const [iv, encrypted] = text.split(":");
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY),
      Buffer.from(iv, "base64")
    );
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}