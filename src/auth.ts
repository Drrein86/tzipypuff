import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isAdminEmail, isGoogleAuthConfigured } from "@/lib/admin/emails";

const providers = isGoogleAuthConfigured()
  ? [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ]
  : [];

function getAuthSecret(): string {
  const fromEnv = process.env.AUTH_SECRET ?? process.env.ADMIN_SESSION_SECRET;
  if (fromEnv?.trim()) return fromEnv.trim();
  return "tzipypuff-dev-auth-secret";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: getAuthSecret(),
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.email) {
        token.role = isAdminEmail(user.email) ? "admin" : "user";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as "admin" | "user") ?? "user";
      }
      return session;
    },
  },
});
