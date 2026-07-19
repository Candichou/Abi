"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/server/auth/getCurrentUser";
import { savePractitioner as savePractitionerQuery } from "@/server/queries/savedPractitioners";
import { savedPractitionerSchema } from "@/lib/validations/savedPractitioners";

export async function savePractitioner(practitionerId: string) {
  const userId = await getCurrentUserId();

  const { practitionerId: validatedId } = savedPractitionerSchema.parse({
    practitionerId,
  });

  await savePractitionerQuery(userId, validatedId);
  revalidatePath("/dashboard");
}
