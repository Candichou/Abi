import type {
  PractitionerFull,
  PractitionerWithDetails,
} from "@/server/queries/practitioners";

export function maskPractitioner(
  p: PractitionerWithDetails,
  isAuthenticated: boolean,
): PractitionerWithDetails {
  if (isAuthenticated) return p;
  return {
    ...p,
    firstName: "Prénom",
    lastName: "Nom",
  };
}

export function maskPractitionerFull(
  pf: PractitionerFull,
  isAuthenticated: boolean,
): PractitionerFull {
  if (isAuthenticated) return pf;
  return {
    ...pf,
    firstName: "Prénom",
    lastName: "Nom",
    address: null,
    phone: null,
  };
}
