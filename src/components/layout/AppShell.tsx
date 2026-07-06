"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { SmokeEngine } from "@/components/effects/SmokeEngine";
import { NeonCursor } from "@/components/effects/NeonCursor";
import { SiteLoader } from "@/components/layout/SiteLoader";
import { AgeGate } from "@/components/layout/AgeGate";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import type { Category, SiteContent } from "@/lib/data/types";

const AGE_KEY = "tzipypuff-age-verified";
const AGE_EVENT = "tzipypuff-age-verified";

function readAgeVerified(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AGE_KEY) === "true";
}

function subscribeAgeGate(onStoreChange: () => void) {
  window.addEventListener(AGE_EVENT, onStoreChange);
  return () => window.removeEventListener(AGE_EVENT, onStoreChange);
}

function subscribeClient() {
  return () => {};
}

export function AppShell({
  children,
  content,
  categories,
}: {
  children: React.ReactNode;
  content: SiteContent;
  categories: Category[];
}) {
  const [loaderDismissed, setLoaderDismissed] = useState(false);
  const mounted = useSyncExternalStore(subscribeClient, () => true, () => false);
  const ageVerified = useSyncExternalStore(subscribeAgeGate, readAgeVerified, () => false);

  const pathname = usePathname();
  const skipLoader = ageVerified || pathname.startsWith("/admin");
  const showLoader = mounted && !loaderDismissed && !skipLoader;

  const handleLoaderComplete = useCallback(() => setLoaderDismissed(true), []);
  const handleAgeVerified = useCallback(() => {
    sessionStorage.setItem(AGE_KEY, "true");
    window.dispatchEvent(new Event(AGE_EVENT));
  }, []);

  const gateActive = mounted && !showLoader && !ageVerified && !pathname.startsWith("/admin");

  return (
    <>
      <SmokeEngine />

      <div className="relative z-10 flex min-h-screen flex-col">
        <NeonCursor />
        <Header />
        <main className="relative flex-1">{children}</main>
        <Footer content={content} categories={categories} />
        <CartSidebar />
      </div>

      {showLoader && <SiteLoader onComplete={handleLoaderComplete} />}
      {gateActive && <AgeGate onVerified={handleAgeVerified} />}
    </>
  );
}
