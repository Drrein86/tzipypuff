"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { NeonLogo } from "@/components/ui/NeonLogo";

const NAV = [
  { href: "/", label: "דף הבית", match: (p: string) => p === "/" },
  { href: "/catalog", label: "מוצרים", match: (p: string) => p.startsWith("/catalog") || p.startsWith("/product") },
  { href: "/promotions", label: "מבצעים", match: (p: string) => p.startsWith("/promotions") },
  { href: "/about", label: "אודות", match: (p: string) => p.startsWith("/about") },
  { href: "/club", label: "מועדון", match: (p: string) => p.startsWith("/club") },
  { href: "/contact", label: "צור קשר", match: (p: string) => p.startsWith("/contact") },
  { href: "/admin/login", label: "כניסת חנות", match: (p: string) => p.startsWith("/admin") },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    onClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- close menu on navigation
  }, [pathname]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] sm:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="סגור תפריט"
      />
      <aside className="absolute top-0 right-0 flex h-full w-[min(100%,280px)] flex-col bg-[#05070B] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <NeonLogo size="sm" flicker={false} />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/50 hover:text-white"
            aria-label="סגור"
          >
            <X size={22} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {NAV.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-3.5 text-base transition-colors ${
                  active
                    ? "bg-[#FF2EA6]/15 text-[#FF2EA6]"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
