import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/src/index";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true, // indication à betterAtuh que mes tables sont au pluriel
  }),
  emailAndPassword: { enabled: true },
  plugins: [nextCookies(), admin()], //permet de sauvegarder les cookies better-auth dans l'appli next
});
