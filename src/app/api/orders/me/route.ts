import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getOrdersByEmail } from "@/lib/data/orders";

/** הזמנות של המשתמש המחובר (Google) */
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;
  const byEmail = await getOrdersByEmail(email);

  return NextResponse.json({
    orders: byEmail,
    user: {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      role: session.user.role,
    },
  });
}
