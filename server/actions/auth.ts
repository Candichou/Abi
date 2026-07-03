"use server";

import { auth } from "@/lib/auth/config";
import { headers } from "next/headers";
import { updateUserRole } from "../queries/users";

export async function setUserRole(role: "patient" | "association") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) throw new Error("Vous n'êtes pas connecté.e");

  const updated = await updateUserRole(session.user.id, role);
  if (!updated)
    throw new Error(
      "Impossible de mettre à jour votre profil, veuillez vous reconnecter.",
    );
}
