import Link from "next/link";

export interface LegalSection {
  title: string;
  paragraphs: string[];
  list?: string[];
}

interface LegalLayoutProps {
  title: string;
  subtitle?: string;
  sections: LegalSection[];
  updatedAt?: string;
}

export function LegalLayout({ title, subtitle, sections, updatedAt }: LegalLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <header className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-white md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-3 text-sm text-white/50">{subtitle}</p>}
        {updatedAt && (
          <p className="mt-2 text-[10px] text-white/30">עודכן לאחרונה: {updatedAt}</p>
        )}
      </header>

      <article className="space-y-8">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-xl border border-white/10 bg-black/40 p-6 md:p-8"
          >
            <h2 className="mb-4 text-lg font-semibold text-[#C8A96A]">{section.title}</h2>
            <div className="space-y-3 text-sm leading-relaxed text-white/65">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              {section.list && (
                <ul className="list-inside list-disc space-y-1.5 pr-2 text-white/55">
                  {section.list.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </article>

      <nav className="mt-10 flex flex-wrap justify-center gap-4 border-t border-white/5 pt-8 text-xs text-white/40">
        <Link href="/privacy" className="hover:text-white">
          מדיניות פרטיות
        </Link>
        <Link href="/terms" className="hover:text-white">
          תקנון
        </Link>
        <Link href="/shipping-returns" className="hover:text-white">
          משלוחים והחזרות
        </Link>
        <Link href="/cookies" className="hover:text-white">
          עוגיות
        </Link>
        <Link href="/contact" className="hover:text-[#27B8FF]">
          צור קשר
        </Link>
      </nav>
    </div>
  );
}
