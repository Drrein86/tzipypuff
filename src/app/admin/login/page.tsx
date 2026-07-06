"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { NeonLogo } from "@/components/ui/NeonLogo";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user?.role === "admin") {
      router.replace("/admin");
    }
  }, [session, router]);

  const accessDenied =
    status === "authenticated" && session?.user && session.user.role !== "admin";

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("סיסמה שגויה");
      return;
    }
    router.push("/admin");
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="neon-border-pink w-full max-w-sm rounded-2xl bg-black/60 p-8 backdrop-blur-md">
        <NeonLogo size="md" flicker={false} className="mb-6" />
        <h1 className="mb-2 text-center text-lg font-semibold text-white">כניסת חנות</h1>
        <p className="mb-6 text-center text-xs text-white/40">ניהול מוצרים, הזמנות ותוכן האתר</p>

        <GoogleSignInButton callbackUrl="/admin/login" label="כניסה עם Google (בעל החנות)" />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] text-white/30">או סיסמה</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={submitPassword}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="סיסמת מנהל"
            className="mb-4 w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-[#FF2EA6]/50"
          />
          {error && <p className="mb-3 text-center text-sm text-red-400">{error}</p>}
          {accessDenied && !error && (
            <p className="mb-3 text-center text-sm text-red-400">
              אין לך הרשאת ניהול. רק בעל החנות יכול להיכנס.
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="neon-border-pink w-full rounded-lg bg-[#FF2EA6]/10 py-3 text-sm font-semibold text-white hover:glow-pink disabled:opacity-50"
          >
            {loading ? "מתחבר..." : "כניסה בסיסמה"}
          </button>
        </form>

        <p className="mt-4 text-center text-[10px] text-white/30">
          הגדר ADMIN_EMAILS ו-Google OAuth ב-.env
        </p>
      </div>
    </div>
  );
}
