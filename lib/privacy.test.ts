import { describe, expect, it } from "vitest";
import { maskPractitioner, maskPractitionerFull } from "@/lib/privacy";
import type {
  PractitionerFull,
  PractitionerWithDetails,
} from "@/server/queries/practitioners";

const basePractitioner: PractitionerWithDetails = {
  id: "practitioner-1",
  firstName: "Alix",
  lastName: "Dupont",
  specialty: "Gynécologie",
  city: "Lyon",
  price: null,
  convention: null,
  officialTags: [],
  communityTags: [],
  approvedAssos: [],
};

const baseFull: PractitionerFull = {
  id: "practitioner-1",
  firstName: "Alix",
  lastName: "Dupont",
  specialty: "Gynécologie",
  city: "Lyon",
  price: null,
  convention: null,
  officialTags: [],
  communityTags: [],
  approvedAssos: [],
  address: "12 rue des Lilas, 69001 Lyon",
  phone: "0600000000",
  createdAt: new Date(),
};

describe("maskPractitioner — visiteur non connecté ne reçoit jamais nom/adresse", () => {
  it("masque le prénom et le nom si non authentifié", () => {
    const masked = maskPractitioner(basePractitioner, false);

    expect(masked.firstName).toBe("Prénom");
    expect(masked.lastName).toBe("Nom");
  });

  it("laisse le prénom et le nom intacts si authentifié", () => {
    const masked = maskPractitioner(basePractitioner, true);

    expect(masked.firstName).toBe("Alix");
    expect(masked.lastName).toBe("Dupont");
  });
});

describe("maskPractitionerFull — visiteur non connecté ne reçoit jamais nom/adresse", () => {
  it("masque nom, prénom, adresse et téléphone si non authentifié", () => {
    const masked = maskPractitionerFull(baseFull, false);

    expect(masked.firstName).toBe("Prénom");
    expect(masked.lastName).toBe("Nom");
    expect(masked.address).toBeNull();
    expect(masked.phone).toBeNull();
  });

  it("laisse toutes les données intactes si authentifié", () => {
    const masked = maskPractitionerFull(baseFull, true);

    expect(masked.firstName).toBe("Alix");
    expect(masked.lastName).toBe("Dupont");
    expect(masked.address).toBe(baseFull.address);
    expect(masked.phone).toBe(baseFull.phone);
  });
});
