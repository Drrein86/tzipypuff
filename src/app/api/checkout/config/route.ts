import { NextResponse } from "next/server";
import { getContent } from "@/lib/data/store";
import { SHIPPING_COST } from "@/lib/orders/constants";
import { isStripeEnabled } from "@/lib/payments/stripe";

export async function GET() {
  const content = await getContent();
  return NextResponse.json({
    shippingCost: SHIPPING_COST,
    freeShippingThreshold: content.freeShippingThreshold,
    stripeEnabled: isStripeEnabled(),
  });
}
