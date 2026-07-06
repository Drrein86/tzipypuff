import Link from "next/link";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <Heart size={48} className="mx-auto text-[#FF2EA6]/60" />
      <h1 className="mt-4 text-2xl font-bold text-white">מועדפים</h1>
      <p className="mt-3 text-sm text-white/50">רשימת המועדפים שלך תופיע כאן בקרוב</p>
      <Link href="/catalog" className="mt-8 inline-block text-sm text-[#27B8FF] hover:underline">
        חזרה למוצרים
      </Link>
    </div>
  );
}
