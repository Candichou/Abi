"use client";

import { useState, useTransition } from "react";
import { savePractitioner } from "@/server/actions/savePractitioner";
import { unsavePractitioner } from "@/server/actions/unsavePractitioner";

export function SaveButton({
  practitionerId,
  initialSaved,
}: {
  practitionerId: string;
  initialSaved: boolean;
}) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      if (isSaved) {
        await unsavePractitioner(practitionerId);
      } else {
        await savePractitioner(practitionerId);
      }
      setIsSaved(!isSaved);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 bg-lavender text-forest text-xs font-body px-4 py-1.5 rounded-full hover:bg-lavender/80 transition-colors disabled:opacity-50"
    >
      {isPending ? "..." : isSaved ? "Retirer" : "Enregistrer"}
    </button>
  );
}
