import type { SiteContentRecord } from "@/lib/db/schema";

const TS = "2026-01-01T00:00:00.000Z";

export const MOCK_CONTENT: SiteContentRecord = {
  id: "site-main",
  heroTagline: "PREMIUM SMOKE BOUTIQUE",
  heroCta: "לקנייה עכשיו",
  promoTitle: "משלוח חינם",
  promoSubtitle: "בהזמנות מעל ₪200",
  freeShippingThreshold: 200,
  contactPhone: "050-0000000",
  contactWhatsapp: "972500000000",
  contactEmail: "hello@tzipypuff.co.il",
  contactAddress: "תל אביב, ישראל",
  aboutText: "צ'יפי Puff — חנות פרימיום לעישון עם מוצרים מקוריים, שירות VIP ומשלוח מהיר לכל הארץ. אנחנו מציעים מבחר עשיר של טבק לנרגילה, נוזלים, וייפים ואביזרים ממותגים מובילים.",
  footerText: "© 2026 צ'יפי Puff — Premium Smoke Boutique",
  createdAt: TS,
  updatedAt: TS,
};
