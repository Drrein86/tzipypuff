import { cookies } from "next/headers";
import { generateOrderId, saveOrder } from "@/lib/data/orders";
import { sendOrderEmails } from "@/lib/email/send-order-emails";
import type { Order, PaymentMethod } from "@/lib/data/order-types";
import {
  createCustomerToken,
  CUSTOMER_COOKIE,
  normalizePhone,
} from "@/lib/orders/customer-session";
import {
  calcOrderTotals,
  OrderValidationError,
  validateAndBuildOrderItems,
  type CartLineInput,
} from "@/lib/orders/validate-order";
import { getContent } from "@/lib/data/store";

export interface CreateOrderInput {
  customer: Order["customer"];
  items: CartLineInput[];
  paymentMethod: PaymentMethod;
  /** שליחת מייל מיד (cod/bit). ל-Stripe — רק אחרי webhook */
  sendEmail?: boolean;
  setCustomerCookie?: boolean;
}

export async function createOrderFromCheckout(input: CreateOrderInput): Promise<Order> {
  const { customer, items, paymentMethod, sendEmail = true, setCustomerCookie = true } = input;

  if (!customer?.name?.trim() || !customer?.phone?.trim() || !customer?.city?.trim() || !customer?.address?.trim()) {
    throw new OrderValidationError("פרטי משלוח חסרים");
  }

  if (!items?.length) {
    throw new OrderValidationError("העגלה ריקה");
  }

  const validatedItems = await validateAndBuildOrderItems(items);
  const subtotal = validatedItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const totals = await calcOrderTotals(subtotal);

  const order: Order = {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      email: customer.email?.trim() ?? "",
      city: customer.city.trim(),
      address: customer.address.trim(),
      notes: customer.notes?.trim(),
    },
    items: validatedItems,
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    total: totals.total,
    status: "pending",
    paymentMethod,
  };

  await saveOrder(order);

  if (setCustomerCookie) {
    const token = createCustomerToken(normalizePhone(order.customer.phone));
    const cookieStore = await cookies();
    cookieStore.set(CUSTOMER_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  if (sendEmail) {
    try {
      const content = await getContent();
      await sendOrderEmails(order, content.contactEmail);
    } catch (err) {
      console.error("[orders] Email failed:", err);
    }
  }

  return order;
}
