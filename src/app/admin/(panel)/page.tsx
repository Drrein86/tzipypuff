import Link from "next/link";
import { readStore } from "@/lib/data/store";
import { getAllOrders } from "@/lib/data/orders";
import { Package, FolderOpen, FileText, ExternalLink, ShoppingCart } from "lucide-react";

export default async function AdminDashboardPage() {
  const store = await readStore();
  const orders = await getAllOrders();
  const inStock = store.products.filter((p) => p.inStock).length;
  const onSale = store.products.filter((p) => p.onSale).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const cards = [
    { label: "מוצרים", value: store.products.length, sub: `${inStock} במלאי`, href: "/admin/products", icon: Package },
    { label: "הזמנות", value: orders.length, sub: `${pendingOrders} ממתינות`, href: "/admin/orders", icon: ShoppingCart },
    { label: "קטגוריות", value: store.categories.length, sub: "פעילות", href: "/admin/categories", icon: FolderOpen },
    { label: "מבצעים", value: onSale, sub: "מוצרים במבצע", href: "/admin/products", icon: Package },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">דשבורד ניהול</h1>
          <p className="mt-1 text-sm text-white/45">
            עודכן לאחרונה: {new Date(store.updatedAt).toLocaleString("he-IL")}
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="neon-border-blue flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white/70 hover:text-white"
        >
          <ExternalLink size={14} />
          צפייה באתר
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, sub, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="neon-border-pink rounded-xl bg-black/50 p-5 transition-all hover:bg-black/70"
          >
            <div className="mb-3 flex items-center justify-between">
              <Icon size={20} className="text-[#FF2EA6]" />
              <span className="text-2xl font-bold text-white">{value}</span>
            </div>
            <p className="font-medium text-white">{label}</p>
            <p className="text-xs text-white/40">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="neon-border-blue rounded-xl bg-black/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileText size={18} className="text-[#27B8FF]" />
          <h2 className="font-semibold text-white">פעולות מהירות</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products" className="rounded-lg bg-[#FF2EA6]/10 px-4 py-2 text-sm text-[#FF2EA6] hover:bg-[#FF2EA6]/20">
            + מוצר חדש
          </Link>
          <Link href="/admin/orders" className="rounded-lg bg-[#27B8FF]/10 px-4 py-2 text-sm text-[#27B8FF] hover:bg-[#27B8FF]/20">
            הזמנות
          </Link>
          <Link href="/admin/content" className="rounded-lg bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10">
            עריכת תוכן אתר
          </Link>
        </div>
      </div>
    </div>
  );
}
