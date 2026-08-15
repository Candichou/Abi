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
import { getSavedPractitionerIds } from "@/server/queries/savedPractitioners";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ specialty?: string; city?: string; page?: string }>;
}) {
  const { specialty, city, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1"));
  const ITEMS_PER_PAGE = 10;

  const [allResults, { specialties, cities }, session] = await Promise.all([
    searchPractitioners(specialty, city),
    getSearchSuggestions(),
    auth.api.getSession({ headers: await headers() }),
  ]);
  const isLoggedIn = !!session;
  const savedIds = isLoggedIn
    ? new Set(await getSavedPractitionerIds(session.user.id))
    : new Set<string>();

  const totalPages = Math.ceil(allResults.length / ITEMS_PER_PAGE);
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const results = allResults.slice(startIdx, startIdx + ITEMS_PER_PAGE);

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
              {allResults.length > 0
                ? `${allResults.length} praticien${allResults.length > 1 ? "s" : ""} trouvé${allResults.length > 1 ? ".e.s" : ".e"}`
                : "Aucun praticien trouvé.e"}
            </p>
            {hasFilters && (
              <p className="text-forest/70 text-xs mt-0.5">
                {[specialty, city].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>

        {/* Liste des cards */}
        {allResults.length > 0 ? (
          <>
            <div className="space-y-4 pb-8">
              {maskedResults.map((practitioner) => (
                <PractitionerCard
                  key={practitioner.id}
                  practitioner={practitioner}
                  isLoggedIn={isLoggedIn}
                  isSaved={savedIds.has(practitioner.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between py-6 border-t border-forest/10">
                <Link
                  href={`/search?specialty=${specialty || ""}&city=${city || ""}&page=${page - 1}`}
                  className={`px-4 py-2 rounded-full text-sm font-heading font-bold ${
                    page === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-lavender text-forest hover:bg-lavender/80"
                  }`}
                  aria-disabled={page === 1}
                >
                  ← Précédent
                </Link>
                <span className="text-sm text-forest/70 font-body">
                  Page {page}/{totalPages}
                </span>
                <Link
                  href={`/search?specialty=${specialty || ""}&city=${city || ""}&page=${page + 1}`}
                  className={`px-4 py-2 rounded-full text-sm font-heading font-bold ${
                    page === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-lavender text-forest hover:bg-lavender/80"
                  }`}
                  aria-disabled={page === totalPages}
                >
                  Suivant →
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-forest/70">
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
