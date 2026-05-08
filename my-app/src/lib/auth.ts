import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/src/index";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true, // indication à betterAtuh que mes tables sont au pluriel
  }),
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()], //permet de sauvegarder les cookies better-auth dans l'appli next
});
