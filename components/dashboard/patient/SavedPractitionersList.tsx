"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BookmarkButton } from "@/components/practitioners/BookmarkButton";
import { useSavedPractitionersStore } from "@/store/savedPractitionersStore";
import type { SavedPractitioner } from "@/server/queries/savedPractitioners";

export function SavedPractitionersList({
  practitioners,
}: {
  practitioners: SavedPractitioner[];
}) {
  const savedIds = useSavedPractitionersStore((state) => state.savedIds);
  const hydrate = useSavedPractitionersStore((state) => state.hydrate);

  useEffect(() => {
    hydrate(practitioners.map((p) => p.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const list = practitioners.filter((p) => savedIds.has(p.id));

  if (list.length === 0) {
    return (
      <p className="text-sm text-forest/60">
        Aucun praticien sauvegardé.e pour le moment.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {list.map((practitioner) => (
        <li
          key={practitioner.id}
          className="flex items-center justify-between gap-4 bg-white border-2 border-forest/20 rounded-2xl px-5 py-4 hover:border-forest transition-colors"
        >
          <Link
            href={`/practitioners/${practitioner.id}`}
            className="min-w-0 flex-1"
          >
            <p className="font-heading font-bold text-forest">
              {practitioner.firstName} {practitioner.lastName}
            </p>
            <p className="text-sm text-forest/60">{practitioner.specialty}</p>
          </Link>
          <BookmarkButton practitionerId={practitioner.id} initialSaved />
        </li>
      ))}
    </ul>
  );
}
