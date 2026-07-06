import { Suspense } from "react";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { NeonLogo } from "@/components/ui/NeonLogo";

export const metadata = {
  title: "כניסה | צ'יפי Puff",
  description: "התחברות לחשבון עם Google",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="neon-border-blue w-full max-w-sm rounded-2xl bg-black/60 p-8 backdrop-blur-md">
        <Suspense fallback={null}>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}

function LoginContent() {
  return (
    <>
      <NeonLogo size="md" flicker={false} className="mb-6" />
      <h1 className="mb-2 text-center text-lg font-semibold text-white">כניסה לחשבון</h1>
      <p className="mb-6 text-center text-xs text-white/45">
        התחבר עם Google לצפייה בהזמנות, מועדון VIP ומועדפים
      </p>
      <GoogleSignInButton callbackUrl="/account" />
      <p className="mt-6 text-center text-[10px] text-white/30">
        בכניסה את/ה מאשר/ת שגילך 18+
      </p>
    </>
  );
}
