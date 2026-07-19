import { z } from "zod";

// Source unique de vérité pour les rôles utilisateur : le type TS est déduit
// de ce schéma Zod, pour éviter toute divergence entre validation et typage.
export const roleSchema = z.enum(["patient", "association"]);
export type Role = z.infer<typeof roleSchema>;
