import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { getContent } from "@/lib/data/store";

export default async function ContactPage() {
  const content = await getContent();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-center text-2xl font-bold text-white">צור קשר</h1>
      <p className="mb-10 text-center text-sm text-white/50">{content.aboutText}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href={`tel:${content.contactPhone}`}
          className="neon-border-blue flex items-center gap-4 rounded-xl bg-black/40 p-5 transition-all hover:bg-black/60"
        >
          <Phone size={22} className="text-[#27B8FF]" />
          <div>
            <p className="text-xs text-white/40">טלפון</p>
            <p className="font-medium text-white">{content.contactPhone}</p>
          </div>
        </a>

        <a
          href={`https://wa.me/${content.contactWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="neon-border-pink flex items-center gap-4 rounded-xl bg-black/40 p-5 transition-all hover:bg-black/60"
        >
          <MessageCircle size={22} className="text-[#FF2EA6]" />
          <div>
            <p className="text-xs text-white/40">WhatsApp</p>
            <p className="font-medium text-white">שלח הודעה</p>
          </div>
        </a>

        <a
          href={`mailto:${content.contactEmail}`}
          className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-5 hover:bg-black/60"
        >
          <Mail size={22} className="text-white/50" />
          <div>
            <p className="text-xs text-white/40">אימייל</p>
            <p className="font-medium text-white">{content.contactEmail}</p>
          </div>
        </a>

        <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-5">
          <MapPin size={22} className="text-[#C8A96A]" />
          <div>
            <p className="text-xs text-white/40">כתובת</p>
            <p className="font-medium text-white">{content.contactAddress}</p>
          </div>
        </div>
      </div>

      <p className="mt-10 text-center">
        <Link href="/catalog" className="text-sm text-[#27B8FF] hover:underline">
          חזרה למוצרים
        </Link>
      </p>
    </div>
  );
}
