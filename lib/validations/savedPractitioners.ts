import { z } from "zod";

export const savedPractitionerSchema = z.object({
  practitionerId: z.uuid("Identifiant praticien invalide"),
});
