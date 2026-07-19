"use server";

import { getCurrentUserId } from "@/server/auth/getCurrentUser";
import { updateUserRole } from "../queries/users";
import { roleSchema, type Role } from "@/lib/validations/role";

export async function setUserRole(role: Role) {
  const userId = await getCurrentUserId();
  const validatedRole = roleSchema.parse(role);

  // Le parcours association (formulaire de profil, workflow de validation)
  // n'est pas encore implémenté : reporté en V2, refusé côté serveur pour
  // ne pas dépendre uniquement du blocage visuel du sélecteur de rôle.
  if (validatedRole === "association") {
    throw new Error(
      "L'inscription en tant qu'association n'est pas encore disponible. Ce parcours arrive dans une prochaine version.",
    );
  }

  const updated = await updateUserRole(userId, validatedRole);
  if (!updated)
    throw new Error(
      "Impossible de mettre à jour votre profil, veuillez vous reconnecter.",
    );
}
