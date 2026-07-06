import { NextResponse } from "next/server";
import { isGoogleAuthConfigured } from "@/lib/admin/emails";

export async function GET() {
  return NextResponse.json({
    googleEnabled: isGoogleAuthConfigured(),
  });
}
