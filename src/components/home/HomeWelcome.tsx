interface HomeWelcomeProps {
  aboutText?: string;
}

export function HomeWelcome({ aboutText }: HomeWelcomeProps) {
  return (
    <section className="relative z-10 px-4 py-5 text-center md:py-7">
      <h2 className="text-lg font-bold text-white md:text-xl">ברוכים הבאים לצ&apos;יפי Puff</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/55 md:text-[15px]">
        יעד אחד לכל מה שצריך לעישון פרימיום — טבק לנרגילה, וייפים, נוזלים ואביזרים ממותגים
        מובילים. משלוח מהיר, מוצרים מקוריים ושירות שמרגיש VIP.
      </p>
      {aboutText && (
        <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-white/35 md:text-sm">
          {aboutText.split(".").slice(0, 1).join(".")}.
        </p>
      )}
    </section>
  );
}
