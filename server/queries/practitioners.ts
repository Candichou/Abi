import { db } from "@/server/db/index";
import {
  practitioners,
  practitionerTags,
  tags,
  practitionerAssociations,
  associations,
  tagVotes,
} from "@/server/db/schema/app";
import { eq, and, or, ilike, sql, inArray } from "drizzle-orm";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Queries ──────────────────────────────────────────────────────────────────

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
      .groupBy(tagVotes.tagId, tags.id, tags.label, tags.category),

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
    .map((v) => ({
      id: v.tagId,
      label: v.label,
      category: v.category,
      voteCount: v.count,
    }));

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

export async function getSearchSuggestions(): Promise<{
  specialties: string[];
  cities: string[];
}> {
  const [specialtyRows, cityRows] = await Promise.all([
    db
      .selectDistinct({ specialty: practitioners.specialty })
      .from(practitioners)
      .where(
        and(
          eq(practitioners.status, "validated"),
          eq(practitioners.isVisible, true),
        ),
      ),
    db
      .selectDistinct({ city: practitioners.city })
      .from(practitioners)
      .where(
        and(
          eq(practitioners.status, "validated"),
          eq(practitioners.isVisible, true),
        ),
      ),
  ]);

  return {
    specialties: specialtyRows.map((r) => r.specialty).sort(),
    cities: cityRows.map((r) => r.city).sort(),
  };
}

export async function searchPractitioners(
  specialty?: string,
  city?: string,
): Promise<PractitionerWithDetails[]> {
  const conditions = [
    eq(practitioners.status, "validated"),
    eq(practitioners.isVisible, true),
  ] as ReturnType<typeof eq>[];

  if (specialty)
    conditions.push(
      sql`unaccent(${practitioners.specialty}) ILIKE unaccent(${`%${specialty}%`})`,
    );
  if (city)
    conditions.push(
      or(
        sql`unaccent(${practitioners.city}) ILIKE unaccent(${`%${city}%`})`,
        ilike(practitioners.postalCode, `%${city}%`),
      )!,
    );

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
        tagId: tags.id,
        label: tags.label,
        category: tags.category,
        count: sql<number>`count(*)::int`,
      })
      .from(tagVotes)
      .innerJoin(tags, eq(tagVotes.tagId, tags.id))
      .where(inArray(tagVotes.practitionerId, ids))
      .groupBy(tagVotes.practitionerId, tags.id, tags.label, tags.category),

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
      .map((vote) => ({
        id: vote.tagId,
        label: vote.label,
        category: vote.category,
        voteCount: vote.count,
      }));

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
