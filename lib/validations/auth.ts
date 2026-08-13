import { z } from "zod";

export const credentialsSchema = z.object({
  name: z.string().min(1, "Pseudonyme requis"),
  email: z.email("Email invalide"),
  password: z
    .string()
    .min(12, "12 caractères minimum")
    .regex(/[A-Z]/, "Une majuscule requise")
    .regex(/[0-9]/, "Un chiffre requis")
    .regex(/[^a-zA-Z0-9]/, "Un symbole requis"),
});

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, "Adresse e-mail requise.")
    .email("Adresse e-mail invalide."),
  password: z.string().min(1, "Mot de passe requis."),
});
