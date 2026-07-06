import { Shield, Truck, Award, Sparkles, Users, Clock } from "lucide-react";
import { readStore } from "@/lib/data/store";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonLogo } from "@/components/ui/NeonLogo";

export const metadata = {
  title: "אודות | צ'יפי Puff",
  description: "הכירו את צ'יפי Puff — חנות פרימיום לעישון עם מוצרים מקוריים, שירות VIP ומשלוח מהיר.",
};

export default async function AboutPage() {
  const store = await readStore();
  const { content } = store;

  const values = [
    { icon: Shield, title: "מקוריות", text: "100% מוצרים מקוריים מיבואן מאושר", color: "#FF2EA6" },
    { icon: Truck, title: "משלוח מהיר", text: "2-5 ימי עסקים לכל הארץ", color: "#27B8FF" },
    { icon: Award, title: "שירות VIP", text: "ליווי אישי לכל לקוח", color: "#C8A96A" },
    { icon: Sparkles, title: "מבחר פרימיום", text: "מותגים מובילים מהעולם", color: "#FF2EA6" },
    { icon: Users, title: "קהילה", text: "מועדון לקוחות עם הטבות בלעדיות", color: "#27B8FF" },
    { icon: Clock, title: "זמינות", text: "שירות לקוחות 24/7", color: "#C8A96A" },
  ];

  const timeline = [
    { year: "2020", text: "הקמת החנות הראשונה בתל אביב" },
    { year: "2022", text: "הרחבת המבחר למותגים בינלאומיים" },
    { year: "2024", text: "השקת מועדון VIP והחנות המקוונת" },
    { year: "2026", text: "צ'יפי Puff — חוויית קנייה פרימיום מלאה" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-12 flex flex-col items-center text-center">
        <NeonLogo size="lg" flicker={false} showTagline tagline="PREMIUM SMOKE BOUTIQUE" />
        <h1 className="sr-only">{"אודות צ'יפי Puff"}</h1>
      </div>

      <div className="neon-border-blue rounded-2xl bg-black/40 p-6 md:p-10">
        <h2 className="mb-4 text-xl font-bold text-white">הסיפור שלנו</h2>
        <p className="text-sm leading-relaxed text-white/70 md:text-base">{content.aboutText}</p>
        <p className="mt-4 text-sm leading-relaxed text-white/55 md:text-base">
          אנחנו מאמינים שכל לקוח ראוי לחוויית קנייה ייחודית — ממוצרים איכותיים ועד שירות אישי
          שמלווה אותך מהרגע הראשון. בין אם אתה מחפש טבק לנרגילה, נוזלים, וייפים או אביזרים —
          תמצא אצלנו את המבחר הטוב ביותר.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {values.map(({ icon: Icon, title, text, color }) => (
          <div
            key={title}
            className="rounded-xl border border-white/10 bg-black/30 p-5 text-center transition-all hover:border-white/20"
          >
            <Icon size={28} className="mx-auto" style={{ color }} />
            <p className="mt-3 font-medium text-white">{title}</p>
            <p className="mt-1 text-xs text-white/45">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-center text-lg font-bold text-white">הדרך שלנו</h2>
        <div className="space-y-4">
          {timeline.map(({ year, text }) => (
            <div key={year} className="flex items-center gap-4 rounded-xl border border-white/5 bg-black/20 px-5 py-4">
              <span className="shrink-0 text-2xl font-bold text-[#FF2EA6]">{year}</span>
              <p className="text-sm text-white/65">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-2xl border border-[#C8A96A]/20 bg-[#C8A96A]/5 p-8 text-center">
        <p className="text-sm text-white/50">{content.contactAddress}</p>
        <p className="mt-2 text-sm text-white/40">
          {content.contactPhone} · {content.contactEmail}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <NeonButton href="/contact">צור קשר</NeonButton>
          <NeonButton href="/catalog" variant="blue">
            לקטלוג
          </NeonButton>
        </div>
      </div>
    </div>
  );
}
