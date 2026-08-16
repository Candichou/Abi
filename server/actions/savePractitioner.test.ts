import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/server/auth/getCurrentUser", () => ({
  getCurrentUserId: vi.fn(),
}));

vi.mock("@/server/queries/savedPractitioners", () => ({
  savePractitioner: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { getCurrentUserId } from "@/server/auth/getCurrentUser";
import { savePractitioner as savePractitionerQuery } from "@/server/queries/savedPractitioners";
import { savePractitioner } from "@/server/actions/savePractitioner";

describe("savePractitioner (autorisation)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("refuse l'opération et n'accède pas aux données si l'utilisateur n'est pas authentifié", async () => {
    vi.mocked(getCurrentUserId).mockRejectedValue(
      new Error("Vous n'êtes pas connecté.e"),
    );

    const result = await savePractitioner("11111111-1111-1111-1111-111111111111");

    expect(result).toEqual({
      success: false,
      error: "Impossible de sauvegarder ce praticien. Veuillez réessayer.",
    });
    expect(savePractitionerQuery).not.toHaveBeenCalled();
  });
});
