import { getPractitionerById } from "@/lib/practitioners-detail";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, MapPinIcon, PhoneIcon, LockClosedIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

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
  sector_1: "Secteur 1 — remboursé Sécurité Sociale",
  sector_2: "Secteur 2 — dépassements d'honoraires",
  sector_3: "Secteur 3 — non remboursé",
  non_conventional: "Non conventionné",
};

function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const k = key(item);
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export default async function PractitionerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [practitioner, session] = await Promise.all([
    getPractitionerById(id),
    auth.api.getSession({ headers: await headers() }),
  ]);

  if (!practitioner) notFound();

  const {
    firstName,
    lastName,
    specialty,
    city,
    address,
    phone,
    price,
    convention,
    officialTags,
    communityTags,
    approvedAssos,
    createdAt,
  } = practitioner;

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const tagsByCategory = groupBy(officialTags, (t) => t.category);
  const isLoggedIn = !!session;

  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-forest px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-cream/60 hover:text-cream text-sm mb-5 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Retour aux résultats
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-cream/10 flex items-center justify-center shrink-0">
              <span className="text-cream font-heading font-bold text-xl">{initials}</span>
            </div>
            <div>
              <h1 className="text-cream font-heading font-bold text-2xl leading-tight">
                {firstName} {lastName}
              </h1>
              <p className="text-cream/70 text-sm mt-0.5">{specialty}</p>
              <p className="text-cream/50 text-xs mt-0.5">📍 {city}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Badge validé par asso */}
        {approvedAssos.length > 0 && (
          <section className="bg-peach/30 border border-peach rounded-2xl px-5 py-4">
            <p className="text-forest text-sm font-body mb-2">
              <span className="text-yellow font-bold mr-1">✦</span>
              <span className="font-semibold">Validé par une association partenaire</span>
            </p>
            {approvedAssos.map((asso) => (
              <div key={asso.id} className="flex items-center justify-between">
                <span className="text-forest/80 text-sm">{asso.name}</span>
                {asso.website && (
                  <a
                    href={asso.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-forest/50 hover:text-forest transition-colors"
                  >
                    <GlobeAltIcon className="w-3.5 h-3.5" />
                    Site web
                  </a>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Tarif & Convention */}
        {(price || convention) && (
          <section className="bg-white border-2 border-forest/10 rounded-2xl px-5 py-4">
            <h2 className="font-heading font-bold text-forest text-base mb-3">Tarifs</h2>
            <div className="space-y-1.5 text-sm text-forest/70 font-body">
              {price && (
                <p>
                  💶 <span className="text-forest font-semibold">{parseFloat(price).toFixed(0)}€</span> par séance
                </p>
              )}
              {convention && (
                <p>📋 {CONVENTION_LABELS[convention]}</p>
              )}
            </div>
          </section>
        )}

        {/* Coordonnées */}
        <section className="bg-white border-2 border-forest/10 rounded-2xl px-5 py-4">
          <h2 className="font-heading font-bold text-forest text-base mb-3">Coordonnées</h2>
          {isLoggedIn ? (
            <div className="space-y-2 text-sm font-body">
              {address && (
                <div className="flex items-start gap-2 text-forest/70">
                  <MapPinIcon className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2 text-forest/70">
                  <PhoneIcon className="w-4 h-4 shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-forest transition-colors">
                    {phone}
                  </a>
                </div>
              )}
              {!address && !phone && (
                <p className="text-forest/40 text-xs">Aucune coordonnée renseignée.</p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-forest/50">
              <LockClosedIcon className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-sm text-forest/70 font-body">
                  Connectez-vous pour voir l'adresse et le téléphone.
                </p>
                <Link
                  href="/signin"
                  className="inline-block mt-2 bg-lavender text-forest text-xs font-body px-4 py-1.5 rounded-full hover:bg-lavender/80 transition-colors"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Tags officiels */}
        {Object.keys(tagsByCategory).length > 0 && (
          <section className="bg-white border-2 border-forest/10 rounded-2xl px-5 py-4">
            <h2 className="font-heading font-bold text-forest text-base mb-3">Caractéristiques</h2>
            <div className="space-y-3">
              {Object.entries(tagsByCategory).map(([category, categoryTags]) => (
                <div key={category}>
                  <p className="text-xs text-forest/40 font-body uppercase tracking-wide mb-1.5">
                    {TAG_CATEGORY_LABELS[category] ?? category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categoryTags.map((tag) => (
                      <span
                        key={tag.id}
                        className={`text-xs px-3 py-1.5 rounded-full font-body ${
                          TAG_CATEGORY_STYLES[tag.category] ?? "bg-forest/5 text-forest/70"
                        }`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tags communauté */}
        {communityTags.length > 0 && (
          <section className="bg-white border-2 border-forest/10 rounded-2xl px-5 py-4">
            <h2 className="font-heading font-bold text-forest text-base mb-1">
              Retours de la communauté
            </h2>
            <p className="text-xs text-forest/40 font-body mb-3">
              Tags ajoutés et votés par les patients
            </p>
            <div className="flex flex-wrap gap-2">
              {communityTags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs px-3 py-1.5 rounded-full bg-forest/5 text-forest/70 border border-forest/15 font-body"
                >
                  👍 {tag.label} ×{tag.voteCount}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Footer discret */}
        <p className="text-center text-xs text-forest/30 pb-8">
          Fiche créée le {new Date(createdAt).toLocaleDateString("fr-FR")}
        </p>
      </div>
    </main>
  );
}
