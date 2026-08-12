"use server";

import { getCurrentUserId } from "@/server/auth/getCurrentUser";
import { updateUserRole, deleteUser } from "../queries/users";
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

// RGPD : suppression du compte et de toutes les données liées (cascade en DB
// via onDelete: "cascade" sur chaque table référençant users.id). Le
// désabonnement des sessions est géré par better-auth côté client après coup.
export async function deleteAccount() {
  const userId = await getCurrentUserId();
  const deleted = await deleteUser(userId);
  if (!deleted)
    throw new Error(
      "Impossible de supprimer votre compte, veuillez réessayer.",
    );
}
