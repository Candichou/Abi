import { db } from "@/src/index";
import {
  practitioners,
  practitionerTags,
  tags,
  practitionerAssociations,
  associations,
  tagVotes,
} from "@/src/db/schema/app";
import { eq, and, sql } from "drizzle-orm";

export type PractitionerFull = {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  city: string;
  address: string | null;
  phone: string | null;
  price: string | null;
  convention: string | null;
  createdAt: Date;
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
  approvedAssos: {
    id: string;
    name: string;
    website: string | null;
  }[];
};

export async function getPractitionerById(
  id: string,
): Promise<PractitionerFull | null> {
  const [practitioner] = await db
    .select()
    .from(practitioners)
    .where(
      and(
        eq(practitioners.id, id),
        eq(practitioners.status, "validated"),
        eq(practitioners.isVisible, true),
      ),
    )
    .limit(1);

  if (!practitioner) return null;

  const [tagRows, voteRows, assoRows] = await Promise.all([
    db
      .select({
        tagId: tags.id,
        label: tags.label,
        category: tags.category,
      })
      .from(practitionerTags)
      .innerJoin(tags, eq(practitionerTags.tagId, tags.id))
      .where(eq(practitionerTags.practitionerId, id)),

    db
      .select({
        tagId: tagVotes.tagId,
        label: tags.label,
        category: tags.category,
        count: sql<number>`count(*)::int`,
      })
      .from(tagVotes)
      .innerJoin(tags, eq(tagVotes.tagId, tags.id))
      .where(eq(tagVotes.practitionerId, id))
      .groupBy(tags.id, tags.label, tags.category),

    db
      .select({
        assoId: associations.id,
        name: associations.name,
        website: associations.website,
      })
      .from(practitionerAssociations)
      .innerJoin(
        associations,
        eq(practitionerAssociations.associationId, associations.id),
      )
      .where(
        and(
          eq(practitionerAssociations.practitionerId, id),
          eq(practitionerAssociations.validationStatus, "approved"),
        ),
      ),
  ]);

  const officialTagIds = new Set(tagRows.map((t) => t.tagId));

  const officialTags = tagRows.map((t) => ({
    id: t.tagId,
    label: t.label,
    category: t.category,
    voteCount: voteRows.find((v) => v.tagId === t.tagId)?.count ?? 0,
  }));

  const communityTags = voteRows
    .filter((v) => !officialTagIds.has(v.tagId))
    .map((v) => {
      return {
        id: v.tagId,
        label: v.label,
        category: v.category,
        voteCount: v.count,
      };
    });

  return {
    id: practitioner.id,
    firstName: practitioner.firstName,
    lastName: practitioner.lastName,
    specialty: practitioner.specialty,
    city: practitioner.city,
    address: practitioner.address,
    phone: practitioner.phone,
    price: practitioner.price,
    convention: practitioner.convention,
    createdAt: practitioner.createdAt,
    officialTags,
    communityTags,
    approvedAssos: assoRows.map((a) => ({
      id: a.assoId,
      name: a.name,
      website: a.website,
    })),
  };
}
