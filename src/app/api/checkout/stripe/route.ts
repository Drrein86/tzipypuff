import { NextResponse } from "next/server";
import type Stripe from "stripe";
import type { Order } from "@/lib/data/order-types";
import { checkRateLimit, getClientIp } from "@/lib/orders/rate-limit";
import { OrderValidationError } from "@/lib/orders/validate-order";
import { createOrderFromCheckout } from "@/lib/orders/create-order";
import type { CartLineInput } from "@/lib/orders/validate-order";
import { getSiteUrl, getStripe, isStripeEnabled } from "@/lib/payments/stripe";

export async function POST(request: Request) {
  if (!isStripeEnabled()) {
    return NextResponse.json({ error: "תשלום בכרטיס אינו זמין כרגע" }, { status: 503 });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(`stripe:${ip}`, 10, 3_600_000)) {
    return NextResponse.json({ error: "יותר מדי ניסיונות. נסה שוב מאוחר יותר." }, { status: 429 });
  }

  const body = await request.json();
  const { customer, items } = body as {
    customer: Order["customer"];
    items: CartLineInput[];
  };

  if (!customer?.email?.trim()) {
    return NextResponse.json({ error: "אימייל נדרש לתשלום בכרטיס" }, { status: 400 });
  }

  try {
    const order = await createOrderFromCheckout({
      customer,
      items,
      paymentMethod: "card",
      sendEmail: false,
      setCustomerCookie: true,
    });

    const stripe = getStripe();
    const siteUrl = getSiteUrl();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map((item) => {
      const productData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData = {
        name: item.nameHe,
      };
      if (item.image.startsWith("https://")) {
        productData.images = [item.image];
      }

      return {
        quantity: item.quantity,
        price_data: {
          currency: "ils",
          unit_amount: Math.round(item.price * 100),
          product_data: productData,
        },
      };
    });

    if (order.shipping > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "ils",
          unit_amount: Math.round(order.shipping * 100),
          product_data: { name: "משלוח" },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email.trim(),
      line_items: lineItems,
      metadata: { orderId: order.id },
      success_url: `${siteUrl}/checkout/success?id=${order.id}&paid=1`,
      cancel_url: `${siteUrl}/checkout?cancelled=1`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "שגיאה ביצירת תשלום" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url, orderId: order.id });
  } catch (err) {
    if (err instanceof OrderValidationError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[stripe checkout]", err);
    return NextResponse.json({ error: "שגיאה ביצירת תשלום" }, { status: 500 });
  }
}
