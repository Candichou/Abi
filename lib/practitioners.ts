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

export type PractitionerWithDetails = {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  city: string;
  price: string | null;
  convention: string | null;
  officialTags: { id: string; label: string; category: string; voteCount: number }[];
  communityTags: { id: string; label: string; category: string; voteCount: number }[];
  approvedAssos: { id: string; name: string }[];
};

export async function searchPractitioners(
  specialty?: string,
  city?: string
): Promise<PractitionerWithDetails[]> {
  const conditions = [
    eq(practitioners.status, "validated"),
    eq(practitioners.isVisible, true),
  ] as ReturnType<typeof eq>[];

  if (specialty) conditions.push(ilike(practitioners.specialty, `%${specialty}%`));
  if (city) conditions.push(ilike(practitioners.city, `%${city}%`));

  const practitionerList = await db
    .select()
    .from(practitioners)
    .where(and(...conditions));

  if (practitionerList.length === 0) return [];

  const ids = practitionerList.map((p) => p.id);

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
      .innerJoin(associations, eq(practitionerAssociations.associationId, associations.id))
      .where(
        and(
          inArray(practitionerAssociations.practitionerId, ids),
          eq(practitionerAssociations.validationStatus, "approved")
        )
      ),
  ]);

  return practitionerList.map((p) => {
    const officialTagIds = new Set(
      tagRows.filter((t) => t.practitionerId === p.id).map((t) => t.tagId)
    );

    const officialTags = tagRows
      .filter((t) => t.practitionerId === p.id)
      .map((t) => {
        const vote = voteRows.find(
          (v) => v.practitionerId === p.id && v.tagId === t.tagId
        );
        return {
          id: t.tagId,
          label: t.label,
          category: t.category,
          voteCount: vote?.count ?? 0,
        };
      });

    const communityTags = voteRows
      .filter((v) => v.practitionerId === p.id && !officialTagIds.has(v.tagId))
      .map((v) => {
        const tag = tagRows.find((t) => t.tagId === v.tagId);
        return {
          id: v.tagId,
          label: tag?.label ?? "",
          category: tag?.category ?? "",
          voteCount: v.count,
        };
      })
      .filter((t) => t.label);

    return {
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      specialty: p.specialty,
      city: p.city,
      price: p.price,
      convention: p.convention,
      officialTags,
      communityTags,
      approvedAssos: assoRows
        .filter((a) => a.practitionerId === p.id)
        .map((a) => ({ id: a.assoId, name: a.name })),
    };
  });
}
