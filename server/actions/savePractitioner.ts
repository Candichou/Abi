"use server";

import { auth } from "@/lib/auth/config";
import { headers } from "next/headers";
import { savePractitioner as savePractitionerQuery } from "@/server/queries/savedPractitioners";
import { savedPractitionerSchema } from "@/lib/validations/savedPractitioners";

export async function savePractitioner(practitionerId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) throw new Error("Vous n'êtes pas connecté.e");

  const { practitionerId: validatedId } = savedPractitionerSchema.parse({
    practitionerId,
  });

  await savePractitionerQuery(session.user.id, validatedId);
}
