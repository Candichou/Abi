"use server";

import { getCurrentUserId } from "@/server/auth/getCurrentUser";
import { updateUserRole } from "../queries/users";

export async function setUserRole(role: "patient" | "association") {
  const userId = await getCurrentUserId();

  const updated = await updateUserRole(userId, role);
  if (!updated)
    throw new Error(
      "Impossible de mettre à jour votre profil, veuillez vous reconnecter.",
    );
}
