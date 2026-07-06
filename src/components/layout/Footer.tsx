"use client";

import Link from "next/link";
import { MessageCircle, Mail, Share2 } from "lucide-react";
import { NeonLogo } from "@/components/ui/NeonLogo";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { NAV_LINKS, LEGAL_LINKS } from "@/lib/constants";
import type { Category, SiteContent } from "@/lib/data/types";

interface FooterProps {
  content: SiteContent;
  categories: Category[];
}

export function Footer({ content, categories }: FooterProps) {
  const sorted = [...categories].sort((a, b) => a.order - b.order).slice(0, 6);

  return (
    <footer className="relative z-10 mt-8 border-t border-white/5 bg-black/30 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <NeonLogo size="sm" flicker={false} />
            <p className="mt-4 text-xs leading-relaxed text-white/40">{content.aboutText}</p>
            <div className="mt-4 flex gap-3">
              <a
                href={`https://wa.me/${content.contactWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 p-2 text-white/45 transition-colors hover:border-[#FF2EA6]/40 hover:text-[#FF2EA6]"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href={`mailto:${content.contactEmail}`}
                className="rounded-full border border-white/10 p-2 text-white/45 transition-colors hover:border-[#27B8FF]/40 hover:text-[#27B8FF]"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
              <a
                href="#"
                className="rounded-full border border-white/10 p-2 text-white/45 transition-colors hover:text-white"
                aria-label="Share"
              >
                <Share2 size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#C8A96A]">קטגוריות</h3>
            <ul className="space-y-2">
              {sorted.map((c) => (
                <li key={c.id}>
                  <Link href={`/catalog?cat=${c.id}`} className="text-sm text-white/45 hover:text-white">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#C8A96A]">ניווט</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/45 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C8A96A]">Newsletter</h3>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row">
          <p className="text-[10px] text-white/25">{content.footerText}</p>
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-[10px] text-white/35 hover:text-white/70">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-4 text-[10px] text-white/25">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Bit</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
