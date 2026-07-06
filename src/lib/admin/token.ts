export async function getAdminToken(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "tzipypuff2026";
  const data = new TextEncoder().encode(`${secret}:tzipypuff-admin-v1`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "tzipypuff2026";
}

export function verifyPassword(input: string): boolean {
  return input === getAdminPassword();
}
