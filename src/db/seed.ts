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
const db = drizzle({
  client: sql,
});

// IDs des comptes créés manuellement via l'UI
const PATIENT_1_ID = process.env.PATIENT_1_ID!;
const PATIENT_2_ID = process.env.PATIENT_2_ID!;
const ASSO_USER_ID = process.env.ASSO_USER_ID!;
const ADMIN_ID = process.env.ADMIN_ID!;

async function seed() {
  //1. Tags
  type TagInsert = typeof tags.$inferInsert;
  const insertTags: TagInsert[] = [
    {
      label: "Fibromyalgie",
      slug: "fibromyalgie",
      category: "pathologie",
    },
    {
      label: "Endométriose",
      slug: "endometriose",
      category: "pathologie",
    },
    {
      label: "Cancer & post-cancer",
      slug: "cancer",
      category: "pathologie",
    },
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
      label: `Respecte l'autonomie reproductive`,
      slug: "autonomie-reproductive",
      category: "inclusivité",
    },
    {
      label: "Consentement éclairé",
      slug: "consentement",
      category: "pratique",
    },
    {
      label: `Tiers payant accepté`,
      slug: "tiers-payant",
      category: "pratique",
    },
    {
      label: "Accessible PMR",
      slug: "accessible-pmr",
      category: "pratique",
    },
    {
      label: "Tarif solidaire sur justificatif",
      slug: "tarif-solidaire",
      category: "pratique",
    },
  ];
  const insertedTags = await db
    .insert(tags)
    .values(insertTags)
    .onConflictDoNothing()
    .returning();
  const tagByLabel = Object.fromEntries(
    insertedTags.map((tag) => [tag.label, tag.id]),
  );

  console.log("✅ Tags created");

  /*  // 2. Associations
  type AssoInsert = typeof associations.$inferInsert;
  const insertAssos: AssoInsert[] = [
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
  ];

  await db.insert(associations).values(insertAssos).onConflictDoNothing();
  console.log("✅ Associations created"); */

  // 3. Practitioners
  type PractitionerInsert = typeof practitioners.$inferInsert;
  const insertPractitioners: PractitionerInsert[] = [
    // ===== VALIDATED (10) =====
    {
      lastName: "Moreau",
      firstName: "Sophie",
      specialty: "Gynécologue",
      city: "Paris",
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
      city: "Montreuil",
      address: "8 rue de Paris, 93100 Montreuil",
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
      city: "Vincennes",
      address: "3 avenue de Paris, 94300 Vincennes",
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
      city: "Saint-Denis",
      address: "27 rue de la République, 93200 Saint-Denis",
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
      city: "Créteil",
      address: "15 avenue du Général de Gaulle, 94000 Créteil",
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
      city: "Nanterre",
      address: "6 rue du Midi, 92000 Nanterre",
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
      city: "Versailles",
      address: "22 rue de la Paroisse, 78000 Versailles",
      phone: "01 39 50 11 22",
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
      city: "Boulogne-Billancourt",
      address: "9 rue du Vieux Pont de Sèvres, 92100 Boulogne-Billancourt",
      phone: "01 46 03 33 44",
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
      city: "Ivry-sur-Seine",
      address: "18 avenue Georges Gosnat, 94200 Ivry-sur-Seine",
      phone: "01 46 72 88 99",
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
      city: "Aubervilliers",
      address: "5 rue Henri Barbusse, 93300 Aubervilliers",
      phone: "01 48 33 44 55",
      price: "55",
      convention: "non_conventional",
      status: "validated",
      isVisible: true,
      validatedBy: ADMIN_ID,
    },

    // ===== PENDING (2) =====
    {
      lastName: "Chouaib",
      firstName: "Yasmine",
      specialty: "Nutritionniste",
      city: "Pantin",
      address: "34 avenue Jean Lolive, 93500 Pantin",
      phone: "01 48 91 66 77",
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
      city: "Bobigny",
      address: "11 avenue du Président Wilson, 93000 Bobigny",
      phone: "01 48 96 22 33",
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
      city: "Argenteuil",
      address: "7 boulevard du Général Leclerc, 95100 Argenteuil",
      phone: "01 39 61 11 22",
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
      city: "Évry-Courcouronnes",
      address: "2 cours Blaise Pascal, 91000 Évry-Courcouronnes",
      phone: "01 60 77 55 66",
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
      city: "Massy",
      address: "14 avenue du Général de Gaulle, 91300 Massy",
      phone: "01 69 20 44 55",
      price: "75",
      convention: "sector_2",
      status: "suspended",
      isVisible: false,
      validatedBy: null,
    },
  ];

  const insertedPractitioners = await db
    .insert(practitioners)
    .values(insertPractitioners)
    .onConflictDoNothing()
    .returning();

  const practitionerByName = Object.fromEntries(
    insertedPractitioners.map((practi) => [
      `${practi.firstName} ${practi.lastName}`,
      practi.id,
    ]),
  );

  console.log("✅ Practitioners created");

  //4 . practitionerTags
  type PractitionerTagImport = { name: string; tags: string[] };
  const practitionerTagsData: PractitionerTagImport[] = [
    {
      name: "Sophie Moreau",
      tags: [
        "Consentement éclairé",
        "LGBTQIA+ Friendly",
        "Respecte l'autonomie reproductive",
      ],
    },
    {
      name: "Karim Benali",
      tags: [
        "Attentif·ve aux vécus traumatiques",
        "LGBTQIA+ Friendly",
        "Tiers payant accepté",
      ],
    },
    {
      name: "Linh Nguyen",
      tags: ["Fibromyalgie", "Consentement éclairé", "Non-grossophobe"],
    },
    {
      name: "Claire Lefebvre",
      tags: ["Tiers payant accepté", "Accessible PMR", "Consentement éclairé"],
    },
    {
      name: "Aminata Diallo",
      tags: ["Non-grossophobe", "LGBTQIA+ Friendly"],
    },
    {
      name: "Elena Torres",
      tags: [
        "Attentif·ve aux vécus traumatiques",
        "Troubles alimentaires (TCA)",
        "LGBTQIA+ Friendly",
      ],
    },
    {
      name: "Marc Petit",
      tags: ["Accessible PMR", "Consentement éclairé", "Fibromyalgie"],
    },
    {
      name: "Isabelle Rousseau",
      tags: [
        "Endométriose",
        "Consentement éclairé",
        "Tarif solidaire sur justificatif",
      ],
    },
    {
      name: "Julien Fabre",
      tags: [
        "Tiers payant accepté",
        "Tarif solidaire sur justificatif",
        "Accessible PMR",
      ],
    },
    {
      name: "Nadia Lambert",
      tags: [
        "Cancer & post-cancer",
        "Consentement éclairé",
        "LGBTQIA+ Friendly",
      ],
    },
  ];

  const insertPractitionerTags = practitionerTagsData.flatMap(
    ({ name, tags: tagLabels }) =>
      tagLabels.map((label) => ({
        practitionerId: practitionerByName[name],
        tagId: tagByLabel[label],
      })),
  );

  await db
    .insert(practitionerTags)
    .values(insertPractitionerTags)
    .onConflictDoNothing();

  console.log("✅ PractitionerTags created");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
