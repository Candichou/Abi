import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/server/db/index";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { Resend } from "resend";
import * as schema from "@/server/db/schema/auth";
import { NextRequest } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema, //import le schema auth db
    usePlural: true, // indication à betterAtuh que mes tables sont au pluriel
  }),
  emailAndPassword: { enabled: true, requireEmailVerification: false }, // TODO: passer à true avant demo day
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Vérification de votre email",
        html: `<p>Bonjour,</p><a href="${url}">Vérifier mon email</a>`, // TODO: faire un mail de vérification plus UX
      });
    },
  },
  pages: {
    signIn: "/signin",
    signUp: "/signup",
    /*  verifyEmail: "/auth/verify", */ //todo: se décider si on garde resend pour demoday
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
