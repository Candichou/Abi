"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/server/auth/getCurrentUser";
import { unsavePractitioner as unsavePractitionerQuery } from "@/server/queries/savedPractitioners";
import { savedPractitionerSchema } from "@/lib/validations/savedPractitioners";

export async function unsavePractitioner(
  practitionerId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const userId = await getCurrentUserId();

    const { practitionerId: validatedId } = savedPractitionerSchema.parse({
      practitionerId,
    });

    await unsavePractitionerQuery(userId, validatedId);
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Impossible de retirer ce praticien. Veuillez réessayer.",
    };
  }
}
