import { db } from "@/src/index";
import {
  practitioners,
  practitionerTags,
  tags,
  practitionerAssociations,
  associations,
  tagVotes,
} from "@/src/db/schema/app";
import { eq, and, ilike, sql, inArray } from "drizzle-orm";

export async function getSearchSuggestions(): Promise<{
  specialties: string[];
  cities: string[];
}> {
  const [specialtyRows, cityRows] = await Promise.all([
    db
      .selectDistinct({ specialty: practitioners.specialty })
      .from(practitioners)
      .where(and(eq(practitioners.status, "validated"), eq(practitioners.isVisible, true))),
    db
      .selectDistinct({ city: practitioners.city })
      .from(practitioners)
      .where(and(eq(practitioners.status, "validated"), eq(practitioners.isVisible, true))),
  ]);

  return {
    specialties: specialtyRows.map((r) => r.specialty).sort(),
    cities: cityRows.map((r) => r.city).sort(),
  };
}

export type PractitionerWithDetails = {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  city: string;
  price: string | null;
  convention: string | null;
  officialTags: {
    id: string;
    label: string;
    category: string;
    voteCount: number;
  }[];
  communityTags: {
    id: string;
    label: string;
    category: string;
    voteCount: number;
  }[];
  approvedAssos: { id: string; name: string }[];
};

export async function searchPractitioners(
  specialty?: string,
  city?: string,
): Promise<PractitionerWithDetails[]> {
  const conditions = [
    eq(practitioners.status, "validated"),
    eq(practitioners.isVisible, true),
  ] as ReturnType<typeof eq>[];

  if (specialty)
    conditions.push(ilike(practitioners.specialty, `%${specialty}%`));
  if (city) conditions.push(ilike(practitioners.city, `%${city}%`));

  const practitionerList = await db
    .select()
    .from(practitioners)
    .where(and(...conditions));

  if (practitionerList.length === 0) return [];

  const ids = practitionerList.map((practitioner) => practitioner.id);

  const [tagRows, voteRows, assoRows] = await Promise.all([
    db
      .select({
        practitionerId: practitionerTags.practitionerId,
        tagId: tags.id,
        label: tags.label,
        category: tags.category,
      })
      .from(practitionerTags)
      .innerJoin(tags, eq(practitionerTags.tagId, tags.id))
      .where(inArray(practitionerTags.practitionerId, ids)),

    db
      .select({
        practitionerId: tagVotes.practitionerId,
        tagId: tagVotes.tagId,
        count: sql<number>`count(*)::int`,
      })
      .from(tagVotes)
      .where(inArray(tagVotes.practitionerId, ids))
      .groupBy(tagVotes.practitionerId, tagVotes.tagId),

    db
      .select({
        practitionerId: practitionerAssociations.practitionerId,
        assoId: associations.id,
        name: associations.name,
      })
      .from(practitionerAssociations)
      .innerJoin(
        associations,
        eq(practitionerAssociations.associationId, associations.id),
      )
      .where(
        and(
          inArray(practitionerAssociations.practitionerId, ids),
          eq(practitionerAssociations.validationStatus, "approved"),
        ),
      ),
  ]);

  return practitionerList.map((practitioner) => {
    const officialTagIds = new Set(
      tagRows
        .filter((tag) => tag.practitionerId === practitioner.id)
        .map((tag) => tag.tagId),
    );

    const officialTags = tagRows
      .filter((tag) => tag.practitionerId === practitioner.id)
      .map((tag) => {
        const votes = voteRows.find(
          (vote) =>
            vote.practitionerId === practitioner.id && vote.tagId === tag.tagId,
        );
        return {
          id: tag.tagId,
          label: tag.label,
          category: tag.category,
          voteCount: votes?.count ?? 0,
        };
      });

    const communityTags = voteRows
      .filter(
        (vote) =>
          vote.practitionerId === practitioner.id &&
          !officialTagIds.has(vote.tagId),
      )
      .map((vote) => {
        const tag = tagRows.find((tag) => tag.tagId === vote.tagId);
        return {
          id: vote.tagId,
          label: tag?.label ?? "",
          category: tag?.category ?? "",
          voteCount: vote.count,
        };
      })
      .filter((tag) => tag.label);

    return {
      id: practitioner.id,
      firstName: practitioner.firstName,
      lastName: practitioner.lastName,
      specialty: practitioner.specialty,
      city: practitioner.city,
      price: practitioner.price,
      convention: practitioner.convention,
      officialTags,
      communityTags,
      approvedAssos: assoRows
        .filter((practiAsso) => practiAsso.practitionerId === practitioner.id)
        .map((practiAsso) => ({
          id: practiAsso.assoId,
          name: practiAsso.name,
        })),
    };
  });
}
