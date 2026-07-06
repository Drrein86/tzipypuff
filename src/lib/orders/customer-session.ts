import { createHmac, timingSafeEqual } from "crypto";
import { CUSTOMER_COOKIE } from "./constants";

export { CUSTOMER_COOKIE };

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "tzipypuff-dev";
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function createCustomerToken(phone: string): string {
  const normalized = normalizePhone(phone);
  const sig = createHmac("sha256", getSessionSecret()).update(normalized).digest("hex");
  return `${normalized}.${sig}`;
}

export function verifyCustomerToken(token: string): string | null {
  const dot = token.indexOf(".");
  if (dot <= 0) return null;

  const phone = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!phone || !sig) return null;

  const expected = createHmac("sha256", getSessionSecret()).update(phone).digest("hex");

  try {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  return phone;
}

export function phonesMatch(a: string, b: string): boolean {
  return normalizePhone(a) === normalizePhone(b);
}
