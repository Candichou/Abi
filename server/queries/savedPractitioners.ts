import { db } from "@/server/db/index";
import { savedPractitioners, practitioners } from "@/server/db/schema/app";
import { eq, and } from "drizzle-orm";

export type SavedPractitioner = {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
};

export async function getSavedPractitioners(
  userId: string,
): Promise<SavedPractitioner[]> {
  const rows = await db
    .select({
      id: practitioners.id,
      firstName: practitioners.firstName,
      lastName: practitioners.lastName,
      specialty: practitioners.specialty,
    })
    .from(savedPractitioners)
    .innerJoin(
      practitioners,
      eq(savedPractitioners.practitionerId, practitioners.id),
    )
    .where(eq(savedPractitioners.userId, userId));

  return rows;
}

export async function isPractitionerSaved(
  userId: string,
  practitionerId: string,
): Promise<boolean> {
  const [row] = await db
    .select({ practitionerId: savedPractitioners.practitionerId })
    .from(savedPractitioners)
    .where(
      and(
        eq(savedPractitioners.userId, userId),
        eq(savedPractitioners.practitionerId, practitionerId),
      ),
    )
    .limit(1);

  return !!row;
}

export async function savePractitioner(
  userId: string,
  practitionerId: string,
): Promise<void> {
  await db
    .insert(savedPractitioners)
    .values({ userId, practitionerId })
    .onConflictDoNothing(); // idempotent : si déjà sauvegardé, ne relève pas d'erreur (protégé aussi par unique_saved_practitioner)
}

export async function unsavePractitioner(
  userId: string,
  practitionerId: string,
): Promise<void> {
  await db
    .delete(savedPractitioners)
    .where(
      and(
        eq(savedPractitioners.userId, userId),
        eq(savedPractitioners.practitionerId, practitionerId),
      ),
    );
}
