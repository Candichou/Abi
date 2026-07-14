"use client";

import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { useState, useTransition } from "react";
import { savePractitioner } from "@/server/actions/savePractitioner";
import { unsavePractitioner } from "@/server/actions/unsavePractitioner";

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
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      if (isSaved) {
        await unsavePractitioner(practitionerId);
        onUnsave?.(practitionerId);
      } else {
        await savePractitioner(practitionerId);
      }
      setIsSaved(!isSaved);
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
