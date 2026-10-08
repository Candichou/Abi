import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  boolean,
  timestamp,
  decimal,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const associationStatusEnum = pgEnum("association_status", [
  "pending",
  "active",
  "suspended",
]);

export const practitionerStatusEnum = pgEnum("practitioner_status", [
  "pending",
  "validated",
  "rejected",
  "suspended",
]);

export const conventionEnum = pgEnum("convention", [
  "sector_1",
  "sector_2",
  "sector_3",
  "non_conventional",
]);

export const contributionStatusEnum = pgEnum("contribution_status", [
  "pending",
  "approved",
  "rejected",
]);

export const consentRequestStatusEnum = pgEnum("consent_request_status", [
  "pending",
  "consented",
  "refused",
  "expired",
]);

export const reportReasonEnum = pgEnum("report_reason", [
  "wrong_info",
  "ethics_violation",
  "other",
]);

// ─── Associations ─────────────────────────────────────────────────────────────
// V2 assumée : une association peut valider un praticien (confiance patient) et
// suivre les praticiens qu'elle connaît dans son propre dashboard. Pas encore
// écrite en dehors du seed — le parcours d'inscription "association" ne crée pas
// encore de ligne ici, c'est un chantier distinct de la validation du schéma.

export const associations = pgTable(
  "associations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    contactFirstName: varchar("contact_first_name", { length: 255 }),
    contactLastName: varchar("contact_last_name", { length: 255 }),
    website: varchar("website", { length: 255 }),
    address: text("address"),
    phone: varchar("phone", { length: 20 }),
    description: text("description"),
    status: associationStatusEnum("status").default("pending").notNull(),
    verifiedAt: timestamp("verified_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("unique_association_user").on(table.userId)],
);

// ─── Practitioners ────────────────────────────────────────────────────────────

export const practitioners = pgTable("practitioners", {
  id: uuid("id").primaryKey().defaultRandom(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  specialty: varchar("specialty", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  postalCode: varchar("postal_code", { length: 10 }),
  address: text("address"), // masqué pour non-connectés
  phone: varchar("phone", { length: 20 }), // masqué pour non-connectés
  price: decimal("price", { precision: 10, scale: 2 }),
  convention: conventionEnum("convention"),
  status: practitionerStatusEnum("status").default("pending").notNull(),
  isVisible: boolean("is_visible").default(false).notNull(),
  proposedBy: text("proposed_by").references(() => users.id, {
    onDelete: "set null",
  }),
  validatedBy: text("validated_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Tags ─────────────────────────────────────────────────────────────────────

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: varchar("label", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
});

export const practitionerTags = pgTable(
  "practitioner_tags",
  {
    practitionerId: uuid("practitioner_id")
      .notNull()
      .references(() => practitioners.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("unique_practitioner_tag").on(
      table.practitionerId,
      table.tagId,
    ),
  ],
);

// V2 assumée : vote d'un patient pour mettre en avant un tag sur un praticien.
// Le classement des tags affichés aujourd'hui vient du seed, pas encore de votes réels.
export const tagVotes = pgTable(
  "tag_votes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    practitionerId: uuid("practitioner_id")
      .notNull()
      .references(() => practitioners.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    votedAt: timestamp("voted_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("unique_tag_vote").on(
      table.userId,
      table.practitionerId,
      table.tagId,
    ),
  ],
);

// ─── Practitioner ↔ Association ───────────────────────────────────────────────
// V2 assumée : lien praticien-association, alimente le dashboard association
// (praticiens qu'elle connaît/soutient) et la validation de confiance patient.

export const practitionerAssociations = pgTable(
  "practitioner_associations",
  {
    practitionerId: uuid("practitioner_id")
      .notNull()
      .references(() => practitioners.id, { onDelete: "cascade" }),
    associationId: uuid("association_id")
      .notNull()
      .references(() => associations.id, { onDelete: "cascade" }),
    validationStatus: contributionStatusEnum("validation_status")
      .default("pending")
      .notNull(),
    validatedAt: timestamp("validated_at"),
    validatedBy: text("validated_by").references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    uniqueIndex("unique_practitioner_association").on(
      table.practitionerId,
      table.associationId,
    ),
  ],
);

// ─── Saved practitioners (patients uniquement) ────────────────────────────────

export const savedPractitioners = pgTable(
  "saved_practitioners",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    practitionerId: uuid("practitioner_id")
      .notNull()
      .references(() => practitioners.id, { onDelete: "cascade" }),
    savedAt: timestamp("saved_at").defaultNow().notNull(),
  },
  (table) => [
    // contrainte DB (pas juste applicative) : protège aussi contre un double-clic / race condition
    uniqueIndex("unique_saved_practitioner").on(
      table.userId,
      table.practitionerId,
    ),
  ],
);

// ─── Reports ──────────────────────────────────────────────────────────────────
// V2 assumée : signalement d'une fiche praticien/association erronée ou d'un
// problème éthique. Toute action liée à un signalement passera par une
// modération humaine, jamais d'automatisation (masquage auto, blacklist),
// pour éviter le risque légal (diffamation, responsabilité de plateforme).

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reporterId: text("reporter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  targetType: varchar("target_type", { length: 50 }).notNull(), // 'practitioner' | 'review'
  targetId: uuid("target_id").notNull(),
  reason: reportReasonEnum("reason").notNull(),
  details: text("details"),
  status: contributionStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Consent ──────────────────────────────────────────────────────────────────
// V2 assumée (RGPD) : demande de consentement envoyée à un praticien avant
// publication de sa fiche (practitioners.isVisible). En MVP ce process est
// manuel (email envoyé par l'admin) ; ces tables modélisent l'automatisation
// future (lien à usage unique, traçabilité IP/version CGU).

export const practitionerConsentRequests = pgTable(
  "practitioner_consent_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    practitionerId: uuid("practitioner_id")
      .notNull()
      .references(() => practitioners.id, { onDelete: "cascade" }),
    sentAt: timestamp("sent_at").defaultNow().notNull(),
    sentBy: text("sent_by").references(() => users.id, {
      onDelete: "set null",
    }),
    status: consentRequestStatusEnum("status").default("pending").notNull(),
  },
);

export const consentLogs = pgTable("consent_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  practitionerId: uuid("practitioner_id")
    .notNull()
    .references(() => practitioners.id, { onDelete: "cascade" }),
  consentedAt: timestamp("consented_at").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  cguVersion: varchar("cgu_version", { length: 20 }).notNull(),
  token: text("token").notNull().unique(),
  tokenExpiresAt: timestamp("token_expires_at").notNull(),
});
