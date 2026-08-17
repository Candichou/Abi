import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  tags,
  associations,
  practitioners,
  practitionerTags,
  practitionerAssociations,
} from "./schema/app";
import { config } from "dotenv";
config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const ASSO_USER_ID = process.env.ASSO_USER_ID!;
const ADMIN_ID = process.env.ADMIN_ID!;

async function seed() {
  // 1. Tags
  const insertedTags = await db
    .insert(tags)
    .values([
      { label: "Fibromyalgie", slug: "fibromyalgie", category: "pathologie" },
      { label: "Endométriose", slug: "endometriose", category: "pathologie" },
      { label: "Cancer & post-cancer", slug: "cancer", category: "pathologie" },
      {
        label: "Troubles alimentaires (TCA)",
        slug: "troubles-alimentaires",
        category: "pathologie",
      },
      {
        label: "LGBTQIA+ Friendly",
        slug: "lgbtqia-friendly",
        category: "inclusivité",
      },
      {
        label: "Non-grossophobe",
        slug: "non-grossophobe",
        category: "inclusivité",
      },
      {
        label: "Attentif·ve aux vécus traumatiques",
        slug: "vécus-traumatiques",
        category: "inclusivité",
      },
      {
        label: "Respecte l'autonomie reproductive",
        slug: "autonomie-reproductive",
        category: "inclusivité",
      },
      {
        label: "Consentement éclairé",
        slug: "consentement",
        category: "pratique",
      },
      {
        label: "Tiers payant accepté",
        slug: "tiers-payant",
        category: "pratique",
      },
      { label: "Accessible PMR", slug: "accessible-pmr", category: "pratique" },
      {
        label: "Tarif solidaire sur justificatif",
        slug: "tarif-solidaire",
        category: "pratique",
      },
    ] satisfies (typeof tags.$inferInsert)[])
    .onConflictDoNothing()
    .returning();

  const tagByLabel = Object.fromEntries(
    insertedTags.map((t) => [t.label, t.id]),
  );
  console.log("✅ Tags created");

  // 2. Associations
  const insertedAssos = await db
    .insert(associations)
    .values([
      {
        userId: ASSO_USER_ID,
        name: "Collectif Santé Pour Toutes",
        contactFirstName: "Nadia",
        contactLastName: "Ferreira",
        website: "https://sante-pour-toutes.fr",
        address: "14 rue des Lilas, 75011 Paris",
        phone: "0143567890",
        description: `Association de soutien aux femmes victimes de violences gynécologiques et obstétricales. Nous référençons et validons les praticiens formés au consentement éclairé et à l'accueil des publics vulnérables.`,
        status: "active",
      },
    ] satisfies (typeof associations.$inferInsert)[])
    .onConflictDoNothing()
    .returning();

  const assoId = insertedAssos[0].id;
  console.log("✅ Associations created");

  // 3. Practitioners
  const insertedPractitioners = await db
    .insert(practitioners)
    .values([
      // ===== VALIDATED (10) =====
      {
        lastName: "Moreau",
        firstName: "Sophie",
        specialty: "Gynécologue",
        city: "Paris",
        postalCode: "75002",
        address: "12 rue de la Paix, 75002 Paris",
        phone: "01 42 33 44 55",
        price: "90",
        convention: "sector_1",
        status: "validated",
        isVisible: true,
        validatedBy: ADMIN_ID,
      },
      {
        lastName: "Benali",
        firstName: "Karim",
        specialty: "Psychiatre",
        city: "Paris",
        postalCode: "75010",
        address: "22 boulevard de Strasbourg, 75010 Paris",
        phone: "01 48 57 22 33",
        price: "60",
        convention: "sector_2",
        status: "validated",
        isVisible: true,
        validatedBy: ADMIN_ID,
      },
      {
        lastName: "Nguyen",
        firstName: "Linh",
        specialty: "Sophrologue",
        city: "Paris",
        postalCode: "75012",
        address: "5 avenue du Bel Air, 75012 Paris",
        phone: "01 43 74 90 12",
        price: "65",
        convention: "non_conventional",
        status: "validated",
        isVisible: true,
        validatedBy: ADMIN_ID,
      },
      {
        lastName: "Lefebvre",
        firstName: "Claire",
        specialty: "Médecin généraliste",
        city: "Paris",
        postalCode: "75018",
        address: "33 rue des Abbesses, 75018 Paris",
        phone: "01 48 09 55 66",
        price: "30",
        convention: "sector_1",
        status: "validated",
        isVisible: true,
        validatedBy: ADMIN_ID,
      },
      {
        lastName: "Diallo",
        firstName: "Aminata",
        specialty: "Dermatologue",
        city: "Paris",
        postalCode: "75013",
        address: "18 avenue de Choisy, 75013 Paris",
        phone: "01 42 07 33 44",
        price: "75",
        convention: "sector_2",
        status: "validated",
        isVisible: true,
        validatedBy: ADMIN_ID,
      },
      {
        lastName: "Torres",
        firstName: "Elena",
        specialty: "Psychologue clinicienne",
        city: "Paris",
        postalCode: "75016",
        address: "9 rue de la Pompe, 75016 Paris",
        phone: "01 47 21 44 55",
        price: "70",
        convention: "non_conventional",
        status: "validated",
        isVisible: true,
        validatedBy: ADMIN_ID,
      },
      {
        lastName: "Petit",
        firstName: "Marc",
        specialty: "Kinésithérapeute",
        city: "Paris",
        postalCode: "75015",
        address: "14 rue du Commerce, 75015 Paris",
        phone: "01 45 79 11 22",
        price: "40",
        convention: "sector_1",
        status: "validated",
        isVisible: true,
        validatedBy: ADMIN_ID,
      },
      {
        lastName: "Rousseau",
        firstName: "Isabelle",
        specialty: "Ostéopathe",
        city: "Paris",
        postalCode: "75014",
        address: "7 rue d'Alésia, 75014 Paris",
        phone: "01 45 40 33 44",
        price: "60",
        convention: "non_conventional",
        status: "validated",
        isVisible: true,
        validatedBy: ADMIN_ID,
      },
      {
        lastName: "Fabre",
        firstName: "Julien",
        specialty: "Médecin généraliste",
        city: "Paris",
        postalCode: "75005",
        address: "28 rue des Écoles, 75005 Paris",
        phone: "01 43 54 88 99",
        price: "30",
        convention: "sector_1",
        status: "validated",
        isVisible: true,
        validatedBy: ADMIN_ID,
      },
      {
        lastName: "Lambert",
        firstName: "Nadia",
        specialty: "Acupuncteur",
        city: "Paris",
        postalCode: "75019",
        address: "41 avenue Jean Jaurès, 75019 Paris",
        phone: "01 42 41 44 55",
        price: "55",
        convention: "non_conventional",
        status: "validated",
        isVisible: true,
        validatedBy: ADMIN_ID,
      },
      // ===== GYNÉCOLOGUES NON-GROSSOPHOBES (non validés par une association) (5) =====
      {
        lastName: "Aubert",
        firstName: "Céline",
        specialty: "Gynécologue",
        city: "Paris",
        postalCode: "75006",
        address: "17 rue de Rennes, 75006 Paris",
        phone: "01 45 44 55 66",
        price: "95",
        convention: "sector_1",
        status: "validated",
        isVisible: true,
        validatedBy: ADMIN_ID,
      },
      {
        lastName: "Marchand",
        firstName: "Delphine",
        specialty: "Gynécologue",
        city: "Paris",
        postalCode: "75008",
        address: "54 rue du Faubourg Saint-Honoré, 75008 Paris",
        phone: "01 42 66 77 88",
        price: "100",
        convention: "sector_2",
        status: "validated",
        isVisible: true,
        validatedBy: ADMIN_ID,
      },
      {
        lastName: "Osei",
        firstName: "Abena",
        specialty: "Gynécologue",
        city: "Paris",
        postalCode: "75004",
        address: "3 rue de Rivoli, 75004 Paris",
        phone: "01 42 72 22 11",
        price: "85",
        convention: "sector_1",
        status: "validated",
        isVisible: true,
        validatedBy: ADMIN_ID,
      },
      {
        lastName: "Chevalier",
        firstName: "Pauline",
        specialty: "Gynécologue",
        city: "Paris",
        postalCode: "75011",
        address: "26 rue Oberkampf, 75011 Paris",
        phone: "01 43 55 88 99",
        price: "90",
        convention: "sector_2",
        status: "validated",
        isVisible: true,
        validatedBy: ADMIN_ID,
      },
      {
        lastName: "Idrissi",
        firstName: "Sara",
        specialty: "Gynécologue",
        city: "Paris",
        postalCode: "75017",
        address: "8 avenue de Clichy, 75017 Paris",
        phone: "01 42 29 44 55",
        price: "95",
        convention: "sector_1",
        status: "validated",
        isVisible: true,
        validatedBy: ADMIN_ID,
      },
      // ===== PENDING (2) =====
      {
        lastName: "Chouaib",
        firstName: "Yasmine",
        specialty: "Nutritionniste",
        city: "Paris",
        postalCode: "75020",
        address: "19 rue de Belleville, 75020 Paris",
        phone: "01 43 49 66 77",
        price: "80",
        convention: "non_conventional",
        status: "pending",
        isVisible: false,
        validatedBy: null,
      },
      {
        lastName: "Gomes",
        firstName: "Rafael",
        specialty: "Psychomotricien",
        city: "Paris",
        postalCode: "75009",
        address: "11 rue de la Chaussée d'Antin, 75009 Paris",
        phone: "01 42 81 22 33",
        price: "50",
        convention: "sector_2",
        status: "pending",
        isVisible: false,
        validatedBy: null,
      },
      // ===== REJECTED (2) =====
      {
        lastName: "Vidal",
        firstName: "Christophe",
        specialty: "Naturopathe",
        city: "Paris",
        postalCode: "75003",
        address: "6 rue des Archives, 75003 Paris",
        phone: "01 42 77 11 22",
        price: "90",
        convention: "non_conventional",
        status: "rejected",
        isVisible: false,
        validatedBy: null,
      },
      {
        lastName: "Blanc",
        firstName: "Séverine",
        specialty: "Naturopathe",
        city: "Paris",
        postalCode: "75007",
        address: "30 avenue de la Motte-Picquet, 75007 Paris",
        phone: "01 47 05 55 66",
        price: "70",
        convention: "non_conventional",
        status: "rejected",
        isVisible: false,
        validatedBy: null,
      },
      // ===== SUSPENDED (1) =====
      {
        lastName: "Martin",
        firstName: "François",
        specialty: "Psychothérapeute",
        city: "Paris",
        postalCode: "75001",
        address: "2 place du Palais Royal, 75001 Paris",
        phone: "01 42 60 44 55",
        price: "75",
        convention: "sector_2",
        status: "suspended",
        isVisible: false,
        validatedBy: null,
      },
    ] satisfies (typeof practitioners.$inferInsert)[])
    .onConflictDoNothing()
    .returning();

  const practitionerByName = Object.fromEntries(
    insertedPractitioners.map((p) => [`${p.firstName} ${p.lastName}`, p.id]),
  );
  console.log("✅ Practitioners created");

  // 4. PractitionerTags
  const practitionerTagsData: { name: string; tagLabels: string[] }[] = [
    {
      name: "Sophie Moreau",
      tagLabels: [
        "Consentement éclairé",
        "LGBTQIA+ Friendly",
        "Respecte l'autonomie reproductive",
      ],
    },
    {
      name: "Karim Benali",
      tagLabels: [
        "Attentif·ve aux vécus traumatiques",
        "LGBTQIA+ Friendly",
        "Tiers payant accepté",
      ],
    },
    {
      name: "Linh Nguyen",
      tagLabels: ["Fibromyalgie", "Consentement éclairé", "Non-grossophobe"],
    },
    {
      name: "Claire Lefebvre",
      tagLabels: [
        "Tiers payant accepté",
        "Accessible PMR",
        "Consentement éclairé",
      ],
    },
    {
      name: "Aminata Diallo",
      tagLabels: ["Non-grossophobe", "LGBTQIA+ Friendly"],
    },
    {
      name: "Elena Torres",
      tagLabels: [
        "Attentif·ve aux vécus traumatiques",
        "Troubles alimentaires (TCA)",
        "LGBTQIA+ Friendly",
      ],
    },
    {
      name: "Marc Petit",
      tagLabels: ["Accessible PMR", "Consentement éclairé", "Fibromyalgie"],
    },
    {
      name: "Isabelle Rousseau",
      tagLabels: [
        "Endométriose",
        "Consentement éclairé",
        "Tarif solidaire sur justificatif",
      ],
    },
    {
      name: "Julien Fabre",
      tagLabels: [
        "Tiers payant accepté",
        "Tarif solidaire sur justificatif",
        "Accessible PMR",
      ],
    },
    {
      name: "Nadia Lambert",
      tagLabels: [
        "Cancer & post-cancer",
        "Consentement éclairé",
        "LGBTQIA+ Friendly",
      ],
    },
    {
      name: "Céline Aubert",
      tagLabels: [
        "Non-grossophobe",
        "Consentement éclairé",
        "Respecte l'autonomie reproductive",
      ],
    },
    {
      name: "Delphine Marchand",
      tagLabels: ["Non-grossophobe", "LGBTQIA+ Friendly", "Endométriose"],
    },
    {
      name: "Abena Osei",
      tagLabels: [
        "Non-grossophobe",
        "Attentif·ve aux vécus traumatiques",
        "Tiers payant accepté",
      ],
    },
    {
      name: "Pauline Chevalier",
      tagLabels: [
        "Non-grossophobe",
        "Consentement éclairé",
        "Tarif solidaire sur justificatif",
      ],
    },
    {
      name: "Sara Idrissi",
      tagLabels: [
        "Non-grossophobe",
        "Respecte l'autonomie reproductive",
        "LGBTQIA+ Friendly",
      ],
    },
  ];

  await db
    .insert(practitionerTags)
    .values(
      practitionerTagsData.flatMap(({ name, tagLabels }) =>
        tagLabels.map((label) => ({
          practitionerId: practitionerByName[name],
          tagId: tagByLabel[label],
        })),
      ),
    )
    .onConflictDoNothing();
  console.log("✅ PractitionerTags created");

  // 5. PractitionerAssociations
  const validatedNames = [
    "Sophie Moreau",
    "Karim Benali",
    "Linh Nguyen",
    "Claire Lefebvre",
    "Aminata Diallo",
    "Elena Torres",
    "Marc Petit",
    "Isabelle Rousseau",
    "Julien Fabre",
    "Nadia Lambert",
    "Sara Idrissi",
    "Delphine Marchand",
  ];

  await db
    .insert(practitionerAssociations)
    .values(
      validatedNames.map((name) => ({
        practitionerId: practitionerByName[name],
        associationId: assoId,
        validationStatus: "approved" as const,
        validatedBy: ADMIN_ID,
      })),
    )
    .onConflictDoNothing();

  console.log("✅ PractitionerAssociations created");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
