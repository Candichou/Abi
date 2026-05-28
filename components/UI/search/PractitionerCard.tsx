"use client";

import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import type { PractitionerWithDetails } from "@/lib/practitioners-search";
import { AuthGateModal } from "@/components/UI/AuthGateModal";

const TAG_CATEGORY_STYLES: Record<string, string> = {
  pathologie: "bg-teal/20 text-forest border border-teal/40",
  inclusivité: "bg-yellow/40 text-forest border border-yellow/60",
  pratique: "bg-lavender text-forest border border-lavender",
};

const TAG_CATEGORY_LABELS: Record<string, string> = {
  pathologie: "Pathologie",
  inclusivité: "Inclusivité",
  pratique: "Pratique",
};

const CONVENTION_LABELS: Record<string, string> = {
  sector_1: "Secteur 1",
  sector_2: "Secteur 2",
  sector_3: "Secteur 3",
  non_conventional: "Non conventionné",
};

function groupBy<T>(array: T[], key: (item: T) => string): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const k = key(item);
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export function PractitionerCard({
  practitioner,
  onHover,
  isHighlighted,
}: {
  practitioner: PractitionerWithDetails;
  onHover?: (id: string | null) => void;
  isHighlighted?: boolean;
}) {
  const [saved, setSaved] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const {
    firstName,
    lastName,
    specialty,
    city,
    price,
    convention,
    officialTags,
    communityTags,
    approvedAssos,
  } = practitioner;

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const tagsByCategory = groupBy(officialTags, (tag) => tag.category);

  return (
    <>
      {showAuthModal && <AuthGateModal onClose={() => setShowAuthModal(false)} />}

    <article
      className={`bg-white rounded-3xl border-2 p-5 transition-shadow ${
        isHighlighted
          ? "border-forest shadow-lg"
          : "border-forest/10 hover:shadow-md"
      }`}
      onMouseEnter={() => onHover?.(practitioner.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* En-tête */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-forest flex items-center justify-center shrink-0">
          <span className="text-cream font-heading font-bold text-lg blur-sm select-none">
            {initials}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-bold text-forest text-lg leading-tight blur-sm select-none">
            {firstName} {lastName}
          </h2>
          <p className="text-forest/70 text-sm">{specialty}</p>
          <p className="text-forest/50 text-xs mt-0.5">📍 {city}</p>
          {price && (
            <p className="text-forest/60 text-xs mt-0.5">
              💶 {parseFloat(price).toFixed(0)}€/séance
              {convention && (
                <span className="ml-1 text-forest/40">
                  · {CONVENTION_LABELS[convention]}
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Badge validé par asso */}
      {approvedAssos.length > 0 && (
        <div className="bg-peach/30 border border-peach rounded-xl px-4 py-2.5 mb-4">
          <p className="text-forest text-sm font-body">
            <span className="text-yellow font-bold mr-1">✦</span>
            Validé par :{" "}
            <span className="font-semibold">
              {approvedAssos.map((asso) => asso.name).join(", ")}
            </span>
          </p>
        </div>
      )}

      {/* Tags officiels groupés par catégorie */}
      {Object.keys(tagsByCategory).length > 0 && (
        <div className="space-y-2 mb-3">
          {Object.entries(tagsByCategory).map(([category, categoryTags]) => (
            <div key={category} className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-forest/40 font-body w-20 shrink-0 capitalize">
                {TAG_CATEGORY_LABELS[category] ?? category}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {categoryTags.map((tag) => (
                  <span
                    key={tag.id}
                    className={`text-xs px-2.5 py-1 rounded-full font-body ${
                      TAG_CATEGORY_STYLES[tag.category] ??
                      "bg-forest/5 text-forest/70"
                    }`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tags communauté */}
      {communityTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="text-xs text-forest/40 font-body w-20 shrink-0">
            Communauté
          </span>
          <div className="flex flex-wrap gap-1.5">
            {communityTags.map((tag) => (
              <span
                key={tag.id}
                className="text-xs px-2.5 py-1 rounded-full bg-forest/5 text-forest/70 border border-forest/15 font-body"
              >
                👍 {tag.label} ×{tag.voteCount}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-forest/10 mt-3">
        <button
          onClick={() => setSaved((save) => !save)}
          className="flex items-center gap-1.5 text-sm text-forest/60 hover:text-forest transition-colors"
          aria-label={
            saved ? "Retirer des favoris" : "Sauvegarder ce praticien"
          }
        >
          {saved ? (
            <BookmarkSolidIcon className="w-4 h-4 text-forest" />
          ) : (
            <BookmarkIcon className="w-4 h-4" />
          )}
          <span className="font-body text-xs">
            {saved ? "Sauvegardé" : "Sauvegarder"}
          </span>
        </button>
        <button
          onClick={() => setShowAuthModal(true)}
          className="bg-lavender text-forest text-sm font-body px-4 py-2 rounded-full hover:bg-lavender/80 transition-colors"
        >
          Voir le profil →
        </button>
      </div>
    </article>
    </>
  );
}
