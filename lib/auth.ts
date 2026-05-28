import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/src/index";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { Resend } from "resend";
import * as schema from "@/src/db/schema/auth-schema";

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
    signIn: "/auth",
    signUp: "/auth",
    verifyEmail: "/auth/verify",
    afterSignIn: "/dashboard",
    afterSignUp: "/dashboard",
  },
  plugins: [nextCookies(), admin()], //permet de sauvegarder les cookies better-auth dans l'appli next
});
