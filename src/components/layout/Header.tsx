"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Heart, ShoppingBag, Menu } from "lucide-react";
import { NeonLogo } from "@/components/ui/NeonLogo";
import { LiveSearch } from "@/components/search/LiveSearch";
import { MobileNav } from "@/components/layout/MobileNav";
import { useCartStore } from "@/lib/store/cart";
import { useMounted } from "@/lib/hooks/use-mounted";

const NAV = [
  { href: "/", label: "דף הבית", match: (p: string) => p === "/" },
  { href: "/catalog", label: "מוצרים", match: (p: string) => p.startsWith("/catalog") || p.startsWith("/product") },
  { href: "/promotions", label: "מבצעים", match: (p: string) => p.startsWith("/promotions") },
  { href: "/about", label: "אודות", match: (p: string) => p.startsWith("/about") },
  { href: "/club", label: "מועדון", match: (p: string) => p.startsWith("/club") },
  { href: "/contact", label: "צור קשר", match: (p: string) => p.startsWith("/contact") },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const mounted = useMounted();
  const itemCount = useCartStore((s) => s.itemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-strong shadow-lg shadow-black/20" : "bg-[#05070B]/75 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto max-w-5xl px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="shrink-0 rounded-lg p-2 text-white/60 hover:text-white sm:hidden"
              aria-label="תפריט"
            >
              <Menu size={22} />
            </button>

            <Link href="/" className="shrink-0">
              <NeonLogo size="sm" flicker={false} />
            </Link>

            <LiveSearch className="relative mx-auto hidden max-w-sm flex-1 sm:block" />

            <div className="flex shrink-0 items-center">
              <Link href="/account" className="p-2 text-white/55 hover:text-white" aria-label="חשבון">
                <User size={19} strokeWidth={1.5} />
              </Link>
              <Link href="/account/wishlist" className="hidden p-2 text-white/55 hover:text-white sm:block" aria-label="מועדפים">
                <Heart size={19} strokeWidth={1.5} />
              </Link>
              <button
                type="button"
                onClick={toggleCart}
                className="relative p-2 text-white/55 hover:text-white"
                aria-label="עגלה"
              >
                <ShoppingBag size={19} strokeWidth={1.5} />
                {mounted && itemCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FF2EA6] text-[8px] font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="mt-2 sm:hidden">
            <LiveSearch className="relative w-full" />
          </div>

          <nav className="mt-2.5 hidden items-center justify-center gap-5 text-[13px] sm:flex md:gap-8">
            {NAV.map((link) => {
              const active = link.match(pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative pb-1.5 transition-colors ${
                    active ? "text-white" : "text-white/45 hover:text-white/75"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 right-0 left-0 mx-auto h-[2px] w-full max-w-[80%] rounded-full bg-[#FF2EA6] shadow-[0_0_10px_#FF2EA6]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="h-[120px] shrink-0 sm:h-[112px]" aria-hidden="true" />
    </>
  );
}
