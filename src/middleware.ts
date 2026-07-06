import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getAdminToken } from "@/lib/admin/token";

export default auth(async (request) => {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (request.auth?.user?.role === "admin") {
    return NextResponse.next();
  }

  const legacyToken = request.cookies.get("tzipypuff_admin")?.value;
  if (legacyToken === (await getAdminToken())) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
});

export const config = {
  matcher: ["/admin/:path*"],
};
