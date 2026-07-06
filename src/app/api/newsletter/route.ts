import { NextResponse } from "next/server";
import { subscribeEmail } from "@/lib/data/newsletter";

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }
  const ok = await subscribeEmail(String(email));
  if (!ok) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
