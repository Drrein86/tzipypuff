import { LegalLayout } from "@/components/legal/LegalLayout";
import { LEGAL_UPDATED } from "@/lib/constants";
import { SHIPPING_COST } from "@/lib/orders/constants";
import { getContent } from "@/lib/data/store";

export const metadata = {
  title: "משלוחים והחזרות | צ'יפי Puff",
  description: "מדיניות משלוחים, זמני אספקה והחזרות בצ'יפי Puff.",
};

export default async function ShippingReturnsPage() {
  const content = await getContent();

  return (
    <LegalLayout
      title="משלוחים והחזרות"
      subtitle="כל מה שצריך לדעת על משלוח, מעקב והחזרת מוצרים."
      updatedAt={LEGAL_UPDATED}
      sections={[
        {
          title: "משלוחים",
          paragraphs: [
            `אנו משלמים לכל רחבי ישראל. עלות משלוח: ₪${SHIPPING_COST}.`,
            `משלוח חינם בהזמנות מעל ₪${content.freeShippingThreshold}.`,
            "זמן אספקה משוער: 2–5 ימי עסקים מרגע אישור ההזמנה ותשלום (אם רלוונטי).",
            "הזמנות שבוצעו בימי שישי-שבת יטופלו ביום העסקים הראשון.",
          ],
        },
        {
          title: "מעקב הזמנה",
          paragraphs: [
            "לאחר אישור ההזמנה תקבל אימייל/SMS עם מספר הזמנה.",
            "ניתן לצפות בסטטוס ההזמנה בדף \"החשבון שלי\" (לאחר אימות זהות).",
            "לשאלות — WhatsApp, טלפון או אימייל:",
          ],
          list: [
            content.contactPhone,
            content.contactEmail,
            `WhatsApp: wa.me/${content.contactWhatsapp}`,
          ],
        },
        {
          title: "קבלת המשלוח",
          paragraphs: [
            "ודא שהכתובת ומספר הטלפון נכונים. שליח ייצור קשר לפני הגעה.",
            "בדוק את האריזה בעת הקבלה. במקרה של נזק — צלם את האריזה ופנה אלינו תוך 24 שעות.",
          ],
        },
        {
          title: "החזרות",
          paragraphs: [
            "ניתן להחזיר מוצר שלא נפתח, באריזה מקורית וללא שימוש, תוך 14 יום מקבלת המשלוח — בהתאם לחוק הגנת הצרכן.",
            "מוצרים שלא ניתנים להחזרה:",
          ],
          list: [
            "מוצרים שנפתחו, נעשה בהם שימוש, או שאינם באריזה מקורית",
            "טבק, נוזלים ומוצרי consumables שנפתחו",
            "מוצרים בהתאמה אישית",
            "מוצרים במבצע שסומנו \"לא ניתן להחזרה\"",
          ],
        },
        {
          title: "תהליך החזרה",
          paragraphs: [
            "צור קשר עם שירות הלקוחות עם מספר ההזמנה וסיבת ההחזרה.",
            "לאחר אישור — שלח את המוצר לכתובת שתימסר. עלות משלוח החזרה — על הלקוח, אלא אם המוצר פגום או שגוי.",
            "החזר כספי יבוצע תוך 14 יום מקבלת המוצר, באותו אמצעי תשלום (בכפוף לחוק).",
          ],
        },
        {
          title: "מוצר פגום או שגוי",
          paragraphs: [
            "קיבלת מוצר פגום או שונה מההזמנה? פנה אלינו תוך 48 שעות עם תמונה ומספר הזמנה.",
            "נחליף את המוצר או נזכה אותך — ללא עלות משלוח נוספת.",
          ],
        },
      ]}
    />
  );
}
