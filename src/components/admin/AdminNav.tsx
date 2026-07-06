"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Package, FolderOpen, FileText, LayoutDashboard, LogOut, ShoppingCart } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "דשבורד", icon: LayoutDashboard },
  { href: "/admin/products", label: "מוצרים", icon: Package },
  { href: "/admin/orders", label: "הזמנות", icon: ShoppingCart },
  { href: "/admin/categories", label: "קטגוריות", icon: FolderOpen },
  { href: "/admin/content", label: "תוכן ומלל", icon: FileText },
];

export function AdminNav() {
  const pathname = usePathname();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <aside className="neon-border-blue w-full shrink-0 rounded-xl bg-black/60 p-4 backdrop-blur-md lg:w-52">
      <p className="mb-4 text-sm font-bold text-[#FF2EA6]">ניהול ציפי Puff</p>
      <nav className="flex flex-col gap-1">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                active
                  ? "bg-[#FF2EA6]/15 text-[#FF2EA6]"
                  : "text-white/55 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={logout}
        className="mt-6 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/40 hover:text-red-400"
      >
        <LogOut size={16} />
        התנתק
      </button>
    </aside>
  );
}
