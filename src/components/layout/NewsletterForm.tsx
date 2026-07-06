"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "ok" : "err");
    if (res.ok) setEmail("");
  };

  return (
    <form onSubmit={submit} className="mt-3">
      <p className="mb-2 text-xs text-white/45">הירשמו לעדכונים ומבצעים בלעדיים</p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-[#FF2EA6]/40"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="neon-border-pink shrink-0 rounded-lg bg-[#FF2EA6]/10 px-3 py-2 text-white transition-all hover:glow-pink disabled:opacity-50"
          aria-label="הרשמה"
        >
          <Send size={16} />
        </button>
      </div>
      {status === "ok" && <p className="mt-2 text-xs text-green-400">נרשמת בהצלחה!</p>}
      {status === "err" && <p className="mt-2 text-xs text-red-400">שגיאה — נסה שוב</p>}
    </form>
  );
}
