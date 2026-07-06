import type { Metadata } from "next";
import { Heebo, Cormorant_Garamond, Syne } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { readStore } from "@/lib/data/store";
import { logoHebrew } from "@/lib/fonts/logo-hebrew";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-logo-latin",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "צ'יפי Puff | Premium Smoke Boutique",
    template: "%s | צ'יפי Puff",
  },
  description:
    "חנות פרימיום לעישון — טבק לנרגילה, נוזלים, סיגריות אלקטרוניות ואביזרים. משלוח מהיר, מוצרים מקוריים, שירות VIP.",
  keywords: ["נרגילה", "טבק", "וייפ", "נוזלים", "עישון", "צ'יפי Puff"],
  openGraph: {
    title: "צ'יפי Puff | Premium Smoke Boutique",
    description: "חנות פרימיום לעישון — מוצרים מקוריים, משלוח מהיר, שירות VIP.",
    locale: "he_IL",
    type: "website",
    siteName: "צ'יפי Puff",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://tzipypuff.co.il"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = await readStore();

  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${cormorant.variable} ${logoHebrew.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AuthProvider>
          <AppShell content={store.content} categories={store.categories}>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
