import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/server/db/index";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import * as schema from "@/server/db/schema/auth";
import { NextRequest } from "next/server";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema, //import le schema auth db
    usePlural: true, // indication à betterAtuh que mes tables sont au pluriel
  }),
  emailAndPassword: { enabled: true },
  pages: {
    signIn: "/signin",
    signUp: "/signup",
    afterSignIn: "/dashboard",
    afterSignUp: "/dashboard",
  },
  session: {
    expiresIn: 60 * 60 * 24,
    updateAge: 60 * 60,
  },
  plugins: [admin(), nextCookies()], //permet de sauvegarder les cookies better-auth dans l'appli next
});

export async function getSessionFromRequest(request: NextRequest) {
  try {
    const token = request.cookies.get("better-auth.session_token")?.value;

    if (!token) {
      return null;
    }

    return { token };
  } catch (error) {
    console.error("Session retrieval error:", error);
    return null;
  }
}
