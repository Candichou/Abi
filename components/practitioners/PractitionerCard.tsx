"use client";

import { useState } from "react";
import Link from "next/link";
import type { PractitionerWithDetails } from "@/server/queries/practitioners";
import { AuthGateModal } from "@/components/common/AuthGateModal";
import { BookmarkButton } from "@/components/practitioners/BookmarkButton";
import {
  MapPinIcon,
  CurrencyEuroIcon,
  StarIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/solid";

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
  isLoggedIn = false,
  isSaved = false,
}: {
  practitioner: PractitionerWithDetails;
  onHover?: (id: string | null) => void;
  isHighlighted?: boolean;
  isLoggedIn?: boolean;
  isSaved?: boolean;
}) {
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
      {showAuthModal && (
        <AuthGateModal onClose={() => setShowAuthModal(false)} />
      )}

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
            <span
              className={`text-cream font-heading font-bold text-lg ${!isLoggedIn ? "blur-sm select-none" : ""}`}
              aria-hidden={!isLoggedIn}
            >
              {initials}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2
              className={`font-heading font-bold text-forest text-lg leading-tight ${!isLoggedIn ? "blur-sm select-none" : ""}`}
              aria-label={
                !isLoggedIn ? "Nom masqué — connexion requise" : undefined
              }
            >
              {firstName} {lastName}
            </h2>
            <p className="text-forest/70 text-sm">{specialty}</p>
            <div className="flex items-center gap-1 text-forest/70 text-xs mt-0.5">
              <MapPinIcon className="w-3.5 h-3.5" />
              <span>{city}</span>
            </div>
            {price && (
              <div className="flex items-center gap-1 text-forest/70 text-xs mt-0.5">
                <CurrencyEuroIcon className="w-3.5 h-3.5" />
                <span>{parseFloat(price).toFixed(0)}€/séance</span>
                {convention && (
                  <span className="text-forest/70">
                    · {CONVENTION_LABELS[convention]}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Badge validé par asso */}
        {approvedAssos.length > 0 && (
          <div className="bg-teal/20 border border-teal/40 rounded-xl px-4 py-2.5 mb-4">
            <p className="text-forest text-sm font-body flex items-center gap-1">
              <StarIcon className="w-4 h-4 text-yellow" aria-hidden="true" />
              <span>
                Validé.e par :{" "}
                <span className="font-semibold">
                  {approvedAssos.map((asso) => asso.name).join(", ")}
                </span>
              </span>
            </p>
          </div>
        )}

        {/* Tags officiels groupés par catégorie */}
        {Object.keys(tagsByCategory).length > 0 && (
          <div className="space-y-2 mb-3">
            {Object.entries(tagsByCategory).map(([category, categoryTags]) => (
              <div
                key={category}
                className="flex flex-wrap items-center gap-1.5"
              >
                <span className="text-xs text-forest/70 font-body w-20 shrink-0 capitalize">
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
            <span className="text-xs text-forest/70 font-body w-20 shrink-0">
              Communauté
            </span>
            <div className="flex flex-wrap gap-1.5">
              {communityTags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs px-2.5 py-1 rounded-full bg-forest/5 text-forest/70 border border-forest/15 font-body flex items-center gap-1"
                >
                  <HandThumbUpIcon className="w-3 h-3" aria-hidden="true" />
                  <span>{tag.label} ×{tag.voteCount}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-forest/10 mt-3">
          {isLoggedIn ? (
            <BookmarkButton
              practitionerId={practitioner.id}
              initialSaved={isSaved}
            />
          ) : (
            <span />
          )}
          {isLoggedIn ? (
            <Link
              href={`/practitioners/${practitioner.id}`}
              className="bg-lavender text-forest text-sm font-body px-4 py-2 rounded-full hover:bg-lavender/80 transition-colors"
            >
              Voir le profil →
            </Link>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-lavender text-forest text-sm font-body px-4 py-2 rounded-full hover:bg-lavender/80 transition-colors"
              aria-label="Voir le profil — connexion requise"
            >
              Voir le profil →
            </button>
          )}
        </div>
      </article>
    </>
  );
}
