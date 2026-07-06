import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOrderById } from "@/lib/data/orders";
import {
  createCustomerToken,
  CUSTOMER_COOKIE,
  normalizePhone,
  phonesMatch,
} from "@/lib/orders/customer-session";

export async function POST(request: Request) {
  const body = await request.json();
  const { orderId, phone } = body as { orderId?: string; phone?: string };

  if (!orderId?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: "Missing orderId or phone" }, { status: 400 });
  }

  const order = await getOrderById(orderId.trim());
  if (!order || !phonesMatch(order.customer.phone, phone)) {
    return NextResponse.json({ error: "הזמנה לא נמצאה" }, { status: 404 });
  }

  const token = createCustomerToken(normalizePhone(phone));
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  return NextResponse.json({ ok: true, phone: normalizePhone(phone) });
}
