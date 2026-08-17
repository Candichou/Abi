import { create } from "zustand";

type SavedPractitionersState = {
  savedIds: Set<string>;
  hydrate: (ids: string[]) => void;
  save: (practitionerId: string) => void;
  unsave: (practitionerId: string) => void;
};

export const useSavedPractitionersStore = create<SavedPractitionersState>(
  (set) => ({
    savedIds: new Set(),
    hydrate: (ids) => set({ savedIds: new Set(ids) }),
    save: (practitionerId) =>
      set((state) => ({
        savedIds: new Set(state.savedIds).add(practitionerId),
      })),
    unsave: (practitionerId) =>
      set((state) => {
        const savedIds = new Set(state.savedIds);
        savedIds.delete(practitionerId);
        return { savedIds };
      }),
  }),
);
