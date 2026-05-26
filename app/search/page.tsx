import { PractitionerCard } from "@/components/UI/search/PractitionerCard";
import { searchPractitioners } from "@/lib/practitioners";
import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ specialty?: string; city?: string }>;
}) {
  const { specialty, city } = await searchParams;
  const results = await searchPractitioners(specialty, city);

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
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/50" />
            <input
              name="specialty"
              defaultValue={specialty}
              placeholder="Spécialité"
              className="w-full bg-cream pl-9 pr-4 py-2.5 rounded-full text-sm border border-transparent outline-none focus:border-forest/20"
            />
          </div>
          <div className="relative flex-1">
            <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/50" />
            <input
              name="city"
              defaultValue={city}
              placeholder="Ville, code postal"
              className="w-full bg-cream pl-9 pr-4 py-2.5 rounded-full text-sm border border-transparent outline-none focus:border-forest/20"
            />
          </div>
          <button
            type="submit"
            className="bg-lavender text-forest px-6 py-2.5 rounded-full text-sm font-body font-semibold hover:bg-lavender/80 transition-colors shrink-0"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Layout split */}
      <div className="max-w-7xl mx-auto flex h-[calc(100vh-72px)]">
        {/* Colonne liste */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
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
              {results.map((practitioner) => (
                <PractitionerCard key={practitioner.id} practitioner={practitioner} />
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

        {/* Colonne carte — placeholder */}
        <div className="hidden lg:flex w-[45%] shrink-0 sticky top-0 h-full bg-forest/5 items-center justify-center border-l border-forest/10">
          <div className="text-center px-8">
            <div className="w-16 h-16 rounded-full bg-teal/20 flex items-center justify-center mx-auto mb-4">
              <MapPinIcon className="w-8 h-8 text-teal" />
            </div>
            <p className="font-heading font-bold text-forest text-lg mb-1">
              Carte interactive
            </p>
            <p className="text-forest/50 text-sm">
              La carte géographique sera disponible prochainement.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
