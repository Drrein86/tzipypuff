import { Suspense } from "react";
import CheckoutSuccessClient from "./CheckoutSuccessClient";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-white/40">טוען...</p>}>
      <CheckoutSuccessClient />
    </Suspense>
  );
}
