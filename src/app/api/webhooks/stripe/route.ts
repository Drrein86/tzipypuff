import { NextResponse } from "next/server";
import type Stripe from "stripe";
import type { Order } from "@/lib/data/order-types";
import { getOrderById, updateOrderStatus } from "@/lib/data/orders";
import { sendOrderEmails } from "@/lib/email/send-order-emails";
import { getContent } from "@/lib/data/store";
import { getStripe, isStripeEnabled } from "@/lib/payments/stripe";

export async function POST(request: Request) {
  if (!isStripeEnabled()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret missing" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] Signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId && session.payment_status === "paid") {
      const order = await getOrderById(orderId);
      if (order && order.status === "pending") {
        await updateOrderStatus(orderId, "confirmed");
        try {
          const content = await getContent();
          await sendOrderEmails({ ...order, status: "confirmed" }, content.contactEmail);
        } catch (err) {
          console.error("[stripe webhook] Email failed:", err);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
