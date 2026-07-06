import { promises as fs } from "fs";
import path from "path";
import { isDatabaseEnabled } from "@/lib/db/sql";
import * as pg from "@/lib/db/postgres";

const NEWSLETTER_PATH = path.join(process.cwd(), "data", "newsletter.json");

interface NewsletterData {
  emails: { email: string; subscribedAt: string }[];
}

export async function readNewsletter(): Promise<NewsletterData> {
  try {
    const raw = await fs.readFile(NEWSLETTER_PATH, "utf-8");
    return JSON.parse(raw) as NewsletterData;
  } catch {
    return { emails: [] };
  }
}

export async function subscribeEmail(email: string): Promise<boolean> {
  if (isDatabaseEnabled()) return pg.pgSubscribeEmail(email);

  const normalized = email.trim().toLowerCase();
  if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return false;

  const data = await readNewsletter();
  if (data.emails.some((e) => e.email === normalized)) return true;

  data.emails.push({ email: normalized, subscribedAt: new Date().toISOString() });
  await fs.mkdir(path.dirname(NEWSLETTER_PATH), { recursive: true });
  await fs.writeFile(NEWSLETTER_PATH, JSON.stringify(data, null, 2), "utf-8");
  return true;
}
