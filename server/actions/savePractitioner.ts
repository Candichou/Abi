"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/server/auth/getCurrentUser";
import { savePractitioner as savePractitionerQuery } from "@/server/queries/savedPractitioners";
import { savedPractitionerSchema } from "@/lib/validations/savedPractitioners";

export async function savePractitioner(
  practitionerId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const userId = await getCurrentUserId();

    const { practitionerId: validatedId } = savedPractitionerSchema.parse({
      practitionerId,
    });

    await savePractitionerQuery(userId, validatedId);
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Impossible de sauvegarder ce praticien. Veuillez réessayer.",
    };
  }
}
