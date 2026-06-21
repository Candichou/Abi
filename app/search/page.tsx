import { PractitionerCard } from "@/components/practitioners/PractitionerCard";
import {
  searchPractitioners,
  getSearchSuggestions,
} from "@/server/queries/practitioners";
import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { SearchCombobox } from "@/components/practitioners/SearchCombobox";
import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { headers } from "next/headers";
import { maskPractitioner } from "@/lib/privacy";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ specialty?: string; city?: string }>;
}) {
  const { specialty, city } = await searchParams;
  const [results, { specialties, cities }, session] = await Promise.all([
    searchPractitioners(specialty, city),
    getSearchSuggestions(),
    auth.api.getSession({ headers: await headers() }),
  ]);
  const isLoggedIn = !!session;

  const maskedResults = results.map((practitioner) =>
    maskPractitioner(practitioner, isLoggedIn),
  );

  const hasFilters = specialty || city;

  return (
    <main className="min-h-screen bg-cream">
      {/* Barre de recherche sticky */}
      <div className="bg-forest px-4 py-4 sticky top-0 z-10 shadow-md">
        <form
          action="/search"
          method="GET"
          className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-2"
        >
          <SearchCombobox
            name="specialty"
            placeholder="Spécialité"
            suggestions={specialties}
            defaultValue={specialty}
            icon={<MagnifyingGlassIcon className="w-4 h-4" />}
          />
          <SearchCombobox
            name="city"
            placeholder="Ville, code postal"
            suggestions={cities}
            defaultValue={city}
            icon={<MapPinIcon className="w-4 h-4" />}
          />
          <button
            type="submit"
            className="bg-lavender text-forest px-6 py-2.5 rounded-full text-sm font-body font-semibold hover:bg-lavender/80 transition-colors shrink-0"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Liste */}
      <div className="max-w-7xl mx-auto h-[calc(100vh-72px)] overflow-y-auto px-4 py-6">
        {/* Résumé */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-heading font-bold text-forest text-lg">
              {results.length > 0
                ? `${results.length} praticien${results.length > 1 ? "s" : ""} trouvé${results.length > 1 ? "s" : ""}`
                : "Aucun praticien trouvé"}
            </p>
            {hasFilters && (
              <p className="text-forest/50 text-xs mt-0.5">
                {[specialty, city].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          {hasFilters && (
            <Link
              href="/search"
              className="text-xs text-forest/50 hover:text-forest underline underline-offset-2"
            >
              Effacer les filtres
            </Link>
          )}
        </div>

        {/* Liste des cards */}
        {results.length > 0 ? (
          <div className="space-y-4 pb-8">
            {maskedResults.map((practitioner) => (
              <PractitionerCard
                key={practitioner.id}
                practitioner={practitioner}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-forest/50">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-heading font-semibold text-forest mb-1">
              Aucun résultat
            </p>
            <p className="text-sm">
              Essaie avec une autre spécialité ou ville.
            </p>
            <Link
              href="/search"
              className="inline-block mt-4 bg-lavender text-forest px-5 py-2 rounded-full text-sm font-body"
            >
              Voir tous les praticiens
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
