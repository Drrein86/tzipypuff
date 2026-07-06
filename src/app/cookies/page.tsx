import { LegalLayout } from "@/components/legal/LegalLayout";
import { LEGAL_UPDATED } from "@/lib/constants";
import { getContent } from "@/lib/data/store";

export const metadata = {
  title: "מדיניות עוגיות | צ'יפי Puff",
  description: "מידע על השימוש בעוגיות וב-localStorage באתר צ'יפי Puff.",
};

export default async function CookiesPage() {
  const content = await getContent();

  return (
    <LegalLayout
      title="מדיניות עוגיות"
      subtitle="הסבר על עוגיות, localStorage וטכנולוגיות דומות באתר."
      updatedAt={LEGAL_UPDATED}
      sections={[
        {
          title: "מהן עוגיות?",
          paragraphs: [
            "עוגיות (Cookies) הן קבצי טקסט קטנים שנשמרים בדפדפן שלך. הן מאפשרות לאתר לזכור העדפות ולשפר את חוויית הגלישה.",
            "בנוסף, האתר משתמש ב-localStorage — אחסון מקומי בדפדפן — לעגלה, מועדפים והגדרות משתמש.",
          ],
        },
        {
          title: "עוגיות שאנו משתמשים בהן",
          paragraphs: ["האתר משתמש בעוגיות וב-localStorage לצרכים הבאים:"],
          list: [
            "tp_customer — אימות זהות לצפייה בהזמנות (HttpOnly, חתום)",
            "admin_session — כניסה לפאנל ניהול (רק למנהלים)",
            "age_verified — אישור גיל 18+ (localStorage)",
            "cart / user / wishlist — נתוני עגלה, פרופיל ומועדפים (localStorage)",
          ],
        },
        {
          title: "עוגיות חיוניות",
          paragraphs: [
            "עוגיות חיוניות נדרשות לתפקוד בסיסי של האתר — עגלה, checkout, אימות הזמנות. לא ניתן לבטלן מבלי לפגוע בחוויית השימוש.",
          ],
        },
        {
          title: "עוגיות אנליטיקה",
          paragraphs: [
            "כיום האתר אינו משתמש בכלי אנליטיקה חיצוניים (Google Analytics וכו'). אם יופעלו בעתיד — נעדכן מדיניות זו.",
          ],
        },
        {
          title: "ניהול עוגיות",
          paragraphs: [
            "ניתן למחוק עוגיות ו-localStorage דרך הגדרות הדפדפן. שים לב: מחיקה עלולה לרוקן את העגלה, לאפס מועדפים ולדרוש אימות גיל מחדש.",
            "להוראות: Chrome → הגדרות → פרטיות → עוגיות | Safari → העדפות → פרטיות",
          ],
        },
        {
          title: "יצירת קשר",
          paragraphs: [
            `שאלות בנושא עוגיות ופרטיות: ${content.contactEmail}`,
            "למידע נוסף — ראה גם את מדיניות הפרטיות שלנו.",
          ],
        },
      ]}
    />
  );
}
