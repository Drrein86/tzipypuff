"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

interface GoogleSignInButtonProps {
  callbackUrl?: string;
  label?: string;
  className?: string;
}

export function GoogleSignInButton({
  callbackUrl = "/account",
  label = "המשך עם Google",
  className = "",
}: GoogleSignInButtonProps) {
  const [googleEnabled, setGoogleEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/config")
      .then((r) => r.json())
      .then((data) => setGoogleEnabled(Boolean(data.googleEnabled)))
      .catch(() => setGoogleEnabled(false));
  }, []);

  if (googleEnabled === null) {
    return (
      <div className="h-12 w-full animate-pulse rounded-lg bg-white/5" aria-hidden="true" />
    );
  }

  if (!googleEnabled) {
    return (
      <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-xs text-amber-200/90">
        כניסת Google לא מוגדרת. הוסף AUTH_SECRET, GOOGLE_CLIENT_ID ו-GOOGLE_CLIENT_SECRET ל-.env
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl })}
      className={`flex w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.223 36 24 36c-5.522 0-10-4.477-10-10s4.478-10 10-10c2.837 0 5.402 1.192 7.207 3.093l5.657-5.657C33.64 10.053 29.082 8 24 8 12.955 8 4 16.955 4 28s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 13 24 13c2.837 0 5.402 1.192 7.207 3.093l5.657-5.657C33.64 10.053 29.082 8 24 8 12.626 8 5.337 13.746 3.507 20.309l2.799 2.382z"
        />
        <path
          fill="#4CAF50"
          d="M24 48c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 39.091 26.715 40 24 40c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C7.098 42.203 14.917 48 24 48z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.194 8-11.303 8-5.522 0-10-4.477-10-10s4.478-10 10-10c2.837 0 5.402 1.192 7.207 3.093l5.657-5.657C33.64 10.053 29.082 8 24 8 12.955 8 4 16.955 4 28s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>
      {label}
    </button>
  );
}
