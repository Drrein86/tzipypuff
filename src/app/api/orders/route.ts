import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOrdersByPhone } from "@/lib/data/orders";
import type { Order, PaymentMethod } from "@/lib/data/order-types";
import {
  verifyCustomerToken,
  CUSTOMER_COOKIE,
  phonesMatch,
} from "@/lib/orders/customer-session";
import { checkRateLimit, getClientIp } from "@/lib/orders/rate-limit";
import { OrderValidationError } from "@/lib/orders/validate-order";
import { createOrderFromCheckout } from "@/lib/orders/create-order";
import type { CartLineInput } from "@/lib/orders/validate-order";

const VALID_PAYMENTS: PaymentMethod[] = ["cod", "bit", "card"];

export async function GET(request: Request) {
  const phone = new URL(request.url).searchParams.get("phone");
  if (!phone?.trim()) {
    return NextResponse.json({ error: "Missing phone" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE)?.value;
  const verifiedPhone = token ? verifyCustomerToken(token) : null;

  if (!verifiedPhone || !phonesMatch(verifiedPhone, phone)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const orders = await getOrdersByPhone(phone);
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`order:${ip}`, 10, 3_600_000)) {
    return NextResponse.json({ error: "יותר מדי הזמנות. נסה שוב מאוחר יותר." }, { status: 429 });
  }

  const body = await request.json();
  const { customer, items, paymentMethod } = body as {
    customer: Order["customer"];
    items: CartLineInput[];
    paymentMethod?: PaymentMethod;
  };

  const payment: PaymentMethod = VALID_PAYMENTS.includes(paymentMethod as PaymentMethod)
    ? (paymentMethod as PaymentMethod)
    : "cod";

  try {
    const order = await createOrderFromCheckout({
      customer,
      items,
      paymentMethod: payment,
      sendEmail: true,
      setCustomerCookie: true,
    });
    return NextResponse.json(order);
  } catch (err) {
    if (err instanceof OrderValidationError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }
}
