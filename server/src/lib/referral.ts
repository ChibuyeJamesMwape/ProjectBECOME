import crypto from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

export function generateReferralCode(): string {
  const bytes = crypto.randomBytes(4);
  let code = "";
  for (const b of bytes) code += ALPHABET[b % ALPHABET.length];
  return `BCM-${code}`;
}
