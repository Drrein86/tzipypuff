import { auth } from "@/auth";
import { cookies } from "next/headers";
import { getAdminToken } from "./token";

const COOKIE = "tzipypuff_admin";

export { getAdminPassword, verifyPassword } from "./token";

export async function setAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, await getAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await auth();
  if (session?.user?.role === "admin") return true;

  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  return token === (await getAdminToken());
}

export async function requireAdmin(): Promise<boolean> {
  return isAdminAuthenticated();
}
