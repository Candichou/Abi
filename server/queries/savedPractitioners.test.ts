import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/server/db/index";
import { practitioners } from "@/server/db/schema/app";
import { users } from "@/server/db/schema/auth";
import {
  getSavedPractitioners,
  isPractitionerSaved,
  savePractitioner,
  unsavePractitioner,
} from "@/server/queries/savedPractitioners";

const userId = "test-user-saved-practitioners-cycle";
let practitionerId: string;

beforeAll(async () => {
  await db.insert(users).values({
    id: userId,
    name: "Test Cycle",
    email: `${userId}@example.com`,
  });

  const [practitioner] = await db
    .insert(practitioners)
    .values({
      firstName: "Alix",
      lastName: "Dupont",
      specialty: "Gynécologie",
      city: "Lyon",
    })
    .returning({ id: practitioners.id });

  practitionerId = practitioner.id;
});

afterAll(async () => {
  await db.delete(practitioners).where(eq(practitioners.id, practitionerId));
  await db.delete(users).where(eq(users.id, userId));
});

describe("cycle save → apparaît dans la liste → unsave → disparaît", () => {
  it("le praticien n'est pas sauvegardé au départ", async () => {
    expect(await isPractitionerSaved(userId, practitionerId)).toBe(false);
  });

  it("apparaît dans la liste après save", async () => {
    await savePractitioner(userId, practitionerId);

    const saved = await getSavedPractitioners(userId);
    expect(saved.map((p) => p.id)).toContain(practitionerId);
    expect(await isPractitionerSaved(userId, practitionerId)).toBe(true);
  });

  it("disparaît de la liste après unsave", async () => {
    await unsavePractitioner(userId, practitionerId);

    const saved = await getSavedPractitioners(userId);
    expect(saved.map((p) => p.id)).not.toContain(practitionerId);
    expect(await isPractitionerSaved(userId, practitionerId)).toBe(false);
  });
});
