"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/server/auth/getCurrentUser";
import { updateUserName } from "@/server/queries/users";
import { updatePseudoSchema } from "@/lib/validations/user";

export async function updatePseudo(
  name: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const userId = await getCurrentUserId();

    const { name: validatedName } = updatePseudoSchema.parse({ name });

    const updated = await updateUserName(userId, validatedName);
    if (!updated) {
      return {
        success: false,
        error: "Impossible de mettre à jour le pseudonyme. Veuillez réessayer.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/edit");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Impossible de mettre à jour le pseudonyme. Veuillez réessayer.",
    };
  }
}
