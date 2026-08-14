import { z } from "zod";

export const updatePseudoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le pseudonyme doit contenir au moins 2 caractères")
    .max(30, "Le pseudonyme doit contenir au plus 30 caractères"),
});
