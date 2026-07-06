import { NextResponse } from "next/server";
import { verifyPassword, setAdminSession } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const { password } = await request.json();
  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401 });
  }
  await setAdminSession();
  return NextResponse.json({ ok: true });
}
