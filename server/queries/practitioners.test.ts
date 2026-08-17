import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/server/db/index";
import { practitioners } from "@/server/db/schema/app";
import { searchPractitioners } from "@/server/queries/practitioners";

const citySuffix = "search-test-creteil";
let practitionerId: string;

beforeAll(async () => {
  const [practitioner] = await db
    .insert(practitioners)
    .values({
      firstName: "Test",
      lastName: `Search-${citySuffix}`,
      specialty: "Gynécologie",
      city: `Créteil-${citySuffix}`,
      status: "validated",
      isVisible: true,
    })
    .returning({ id: practitioners.id });

  practitionerId = practitioner.id;
});

afterAll(async () => {
  await db.delete(practitioners).where(eq(practitioners.id, practitionerId));
});

describe("searchPractitioners", () => {
  it("trouve le praticien par spécialité et ville sans tenir compte des accents", async () => {
    const results = await searchPractitioners(
      "Gynecologie",
      `creteil-${citySuffix}`,
    );

    const match = results.find((p) => p.id === practitionerId);
    expect(match).toBeDefined();
    expect(match?.specialty).toBe("Gynécologie");
    expect(match?.city).toBe(`Créteil-${citySuffix}`);
  });
});
