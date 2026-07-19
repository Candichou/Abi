"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/server/auth/getCurrentUser";
import { unsavePractitioner as unsavePractitionerQuery } from "@/server/queries/savedPractitioners";
import { savedPractitionerSchema } from "@/lib/validations/savedPractitioners";

export async function unsavePractitioner(practitionerId: string) {
  const userId = await getCurrentUserId();

  const { practitionerId: validatedId } = savedPractitionerSchema.parse({
    practitionerId,
  });

  await unsavePractitionerQuery(userId, validatedId);
  revalidatePath("/dashboard");
}
