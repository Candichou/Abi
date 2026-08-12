import { describe, it, expect } from "vitest";
import { checkPasswordStrength } from "./passwordStrength";

describe("checkPasswordStrength", () => {
  it("rejette un mot de passe trop court sans majuscule/chiffre/symbole", () => {
    expect(checkPasswordStrength("abc")).toEqual({
      minLength: false,
      hasUpperCase: false,
      hasDigit: false,
      hasSymbol: false,
    });
  });

  it("valide un mot de passe conforme", () => {
    expect(checkPasswordStrength("Motdepasse1!")).toEqual({
      minLength: true,
      hasUpperCase: true,
      hasDigit: true,
      hasSymbol: true,
    });
  });

  it("détecte chaque critère indépendamment", () => {
    expect(checkPasswordStrength("motdepasseminuscule").hasUpperCase).toBe(
      false,
    );
    expect(checkPasswordStrength("MOTDEPASSE").hasDigit).toBe(false);
    expect(checkPasswordStrength("Motdepasse1").hasSymbol).toBe(false);
  });
});
