"use client";

import Link from "next/link";
import {
  Flame,
  Zap,
  Droplets,
  Package,
  Percent,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/data/types";

const ICONS: Record<string, LucideIcon> = {
  tobacco: Flame,
  vapes: Zap,
  liquids: Droplets,
  accessories: Package,
  coals: Flame,
  filters: Package,
  rolling: Package,
  pipes: Package,
  bongs: Package,
  sales: Percent,
};

const LABEL_OVERRIDES: Record<string, string> = {
  tobacco: "טבק\nלנרגילה",
  vapes: "סיגריות\nאלקטרוניות",
  liquids: "נוזלים",
  accessories: "אביזרים",
};

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const sorted = [...categories].sort((a, b) => a.order - b.order);
  const mainIds = ["tobacco", "vapes", "liquids", "accessories"];
  const mainCats = mainIds
    .map((id) => sorted.find((c) => c.id === id))
    .filter(Boolean) as Category[];

  const items = [
    ...mainCats.map((c) => ({
      id: c.id,
      label: LABEL_OVERRIDES[c.id] ?? c.label.replace(/ /g, "\n"),
      href: `/catalog?cat=${c.id}`,
      color: c.color,
      icon: ICONS[c.id] ?? Package,
    })),
    {
      id: "sales",
      label: "מבצעים",
      href: "/promotions",
      color: "pink" as const,
      icon: Percent,
    },
  ];

  return (
    <section className="relative z-10 px-4 py-4 md:py-6">
      <div className="mb-4 text-center md:mb-5">
        <h2 className="text-base font-semibold text-white md:text-lg">קטגוריות</h2>
        <p className="mt-1 text-xs text-white/45 md:text-sm">גלו את המבחר שלנו — לחצו לכניסה ישירה לקטלוג</p>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-1 scrollbar-hide sm:mx-auto sm:max-w-2xl sm:overflow-visible sm:px-0">
        <div className="flex min-w-max gap-2 sm:grid sm:min-w-0 sm:grid-cols-5 sm:gap-2.5">
          {items.map((cat) => {
            const Icon = cat.icon;
            const isPink = cat.color === "pink";
            const neonClass = isPink ? "category-card--pink" : "category-card--blue";
            const iconColor = isPink ? "#FF2EA6" : "#1a4fd6";

            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="group block w-[76px] shrink-0 sm:w-auto sm:shrink"
              >
                <div
                  className={`category-card ${neonClass} flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2.5 transition-all duration-200 group-hover:scale-[1.03] group-active:scale-[0.98]`}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{
                      background: isPink
                        ? "radial-gradient(circle, rgba(255,46,166,0.1) 0%, transparent 70%)"
                        : "radial-gradient(circle, rgba(26,79,214,0.12) 0%, transparent 70%)",
                    }}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.35}
                      style={{
                        color: iconColor,
                        filter: `drop-shadow(0 0 4px ${iconColor}99)`,
                      }}
                    />
                  </div>
                  <span className="whitespace-pre-line text-center text-[9px] font-medium leading-tight text-white/90 sm:text-[10px]">
                    {cat.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <p className="mx-auto mt-4 max-w-md text-center text-[11px] leading-relaxed text-white/35">
        לא מצאתם?{" "}
        <Link href="/catalog" className="text-[#27B8FF]/80 underline-offset-2 hover:text-[#27B8FF] hover:underline">
          עברו לכל הקטלוג
        </Link>{" "}
        או דברו איתנו — נשמח לעזור.
      </p>
    </section>
  );
}
