import { describe, expect, it, vi, beforeEach } from "vitest";

// Faux client better-auth : on ne teste pas la librairie, seulement ce que signOut() fait de la session locale.
const mocks = vi.hoisted(() => {
  let state: Record<string, unknown> = {};
  return {
    signOut: vi.fn(),
    session: {
      get: () => state,
      set: (next: Record<string, unknown>) => {
        state = next;
      },
    },
  };
});

vi.mock("better-auth/react", () => ({
  createAuthClient: () => ({
    signOut: mocks.signOut,
    $store: { atoms: { session: mocks.session } },
  }),
}));

import { signOut } from "@/lib/auth/client";

describe("signOut (session locale)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.session.set({
      data: { user: { name: "colibri432" } },
      error: { status: 429 },
      isPending: false,
      isRefetching: false,
    });
  });

  it("vide la session locale dès que la déconnexion réussit, sans attendre /get-session", async () => {
    mocks.signOut.mockResolvedValue({ data: { success: true }, error: null });

    await signOut();

    expect(mocks.signOut).toHaveBeenCalledWith({
      fetchOptions: { disableSignal: true },
    });
    expect(mocks.session.get()).toMatchObject({
      data: null,
      error: null,
      isPending: false,
    });
  });

  it("laisse la session locale intacte si la déconnexion échoue", async () => {
    const error = { status: 500 };
    mocks.signOut.mockResolvedValue({ data: null, error });

    const result = await signOut();

    expect(result.error).toBe(error);
    expect(mocks.session.get()).toMatchObject({
      data: { user: { name: "colibri432" } },
    });
  });
});
