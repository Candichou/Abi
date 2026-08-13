import Link from "next/link";
import { MapPinIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cream flex flex-col">
      <div className="bg-forest px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <span className="text-cream font-heading font-bold text-lg">
            Abi
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-sm text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-lavender/40 flex items-center justify-center">
            <MapPinIcon className="w-8 h-8 text-forest" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h1 className="font-heading font-bold text-forest text-h2">
              404
            </h1>
            <p className="font-heading font-bold text-forest text-h3">
              Cette page n&apos;existe pas
            </p>
            <p className="text-forest/60 text-sm font-body">
              La fiche ou la page que vous cherchez a été déplacée, supprimée,
              ou n&apos;a jamais existé.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-lavender text-forest text-sm font-body px-6 py-2.5 rounded-full hover:bg-lavender/80 transition-colors"
          >
            <HomeIcon className="w-4 h-4" />
            Retour à la recherche
          </Link>
        </div>
      </div>
    </main>
  );
}
