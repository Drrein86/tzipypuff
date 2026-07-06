import type { Order } from "@/lib/data/order-types";

const PAYMENT_LABELS: Record<string, string> = {
  cod: "מזומן / ביט",
  bit: "Bit",
  card: "כרטיס אשראי",
};

function formatOrderHtml(order: Order): string {
  const items = order.items
    .map(
      (i) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #222">${i.nameHe}</td>` +
        `<td style="padding:8px;border-bottom:1px solid #222;text-align:center">${i.quantity}</td>` +
        `<td style="padding:8px;border-bottom:1px solid #222;text-align:left">₪${i.price * i.quantity}</td></tr>`
    )
    .join("");

  return `
    <div dir="rtl" style="font-family:Arial,sans-serif;background:#05070B;color:#fff;padding:24px;max-width:600px">
      <h1 style="color:#FF2EA6;margin:0 0 8px">הזמנה חדשה #${order.id}</h1>
      <p style="color:#888;margin:0 0 20px">${new Date(order.createdAt).toLocaleString("he-IL")}</p>
      <h2 style="color:#27B8FF;font-size:16px">פרטי לקוח</h2>
      <p><strong>${order.customer.name}</strong><br/>
      טלפון: ${order.customer.phone}<br/>
      ${order.customer.email ? `אימייל: ${order.customer.email}<br/>` : ""}
      ${order.customer.city}, ${order.customer.address}<br/>
      ${order.customer.notes ? `הערות: ${order.customer.notes}` : ""}</p>
      <h2 style="color:#27B8FF;font-size:16px">מוצרים</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <thead><tr style="color:#888">
          <th style="text-align:right;padding:8px">מוצר</th>
          <th style="padding:8px">כמות</th>
          <th style="text-align:left;padding:8px">סכום</th>
        </tr></thead>
        <tbody>${items}</tbody>
      </table>
      <p>משלוח: ${order.shipping === 0 ? "חינם" : `₪${order.shipping}`}<br/>
      <strong style="color:#C8A96A;font-size:18px">סה״כ: ₪${order.total}</strong><br/>
      תשלום: ${PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</p>
    </div>`;
}

function formatCustomerHtml(order: Order): string {
  return `
    <div dir="rtl" style="font-family:Arial,sans-serif;background:#05070B;color:#fff;padding:24px;max-width:600px">
      <h1 style="color:#FF2EA6">תודה על ההזמנה!</h1>
      <p>שלום ${order.customer.name},</p>
      <p>קיבלנו את ההזמנה שלך <strong>#${order.id}</strong>.</p>
      <p>סה״כ לתשלום: <strong style="color:#C8A96A">₪${order.total}</strong></p>
      <p>ניצור איתך קשר בקרוב לאישור ומשלוח.</p>
      <p style="color:#888;margin-top:24px">צ'יפי Puff — Premium Smoke Boutique</p>
    </div>`;
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "orders@tzipypuff.co.il";

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping email to", to);
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    console.error("[email] Failed:", await res.text());
    return false;
  }
  return true;
}

export async function sendOrderEmails(
  order: Order,
  storeEmail: string
): Promise<{ storeSent: boolean; customerSent: boolean }> {
  const storeSent = await sendEmail(
    storeEmail,
    `הזמנה חדשה #${order.id} — צ'יפי Puff`,
    formatOrderHtml(order)
  );

  let customerSent = false;
  if (order.customer.email) {
    customerSent = await sendEmail(
      order.customer.email,
      `אישור הזמנה #${order.id} — צ'יפי Puff`,
      formatCustomerHtml(order)
    );
  }

  return { storeSent, customerSent };
}
