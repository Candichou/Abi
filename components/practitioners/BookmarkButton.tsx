"use client";

import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { useEffect, useTransition } from "react";
import { savePractitioner } from "@/server/actions/savePractitioner";
import { unsavePractitioner } from "@/server/actions/unsavePractitioner";
import { useSavedPractitionersStore } from "@/store/savedPractitionersStore";

export function BookmarkButton({
  practitionerId,
  initialSaved,
  variant = "light",
  onUnsave,
}: {
  practitionerId: string;
  initialSaved: boolean;
  variant?: "light" | "dark";
  onUnsave?: (practitionerId: string) => void;
}) {
  const isSaved = useSavedPractitionersStore((state) =>
    state.savedIds.has(practitionerId),
  );
  const save = useSavedPractitionersStore((state) => state.save);
  const unsave = useSavedPractitionersStore((state) => state.unsave);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialSaved) {
      save(practitionerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practitionerId, initialSaved]);

  function handleClick() {
    startTransition(async () => {
      if (isSaved) {
        await unsavePractitioner(practitionerId);
        unsave(practitionerId);
        onUnsave?.(practitionerId);
      } else {
        await savePractitioner(practitionerId);
        save(practitionerId);
      }
    });
  }

  const isDark = variant === "dark";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-1.5 text-sm transition-colors disabled:opacity-50 ${
        isDark
          ? "text-cream/60 hover:text-cream"
          : "text-forest/60 hover:text-forest"
      }`}
      aria-label={isSaved ? "Retirer des favoris" : "Sauvegarder ce praticien"}
      aria-pressed={isSaved}
    >
      {isSaved ? (
        <BookmarkSolidIcon
          className={`w-5 h-5 ${isDark ? "text-cream" : "text-forest"}`}
        />
      ) : (
        <BookmarkIcon className="w-5 h-5" />
      )}
      <span className="font-body text-xs">
        {isSaved ? "Sauvegardé" : "Sauvegarder"}
      </span>
    </button>
  );
}
