"use client";

import Link from "next/link";
import { LockClosedIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function AuthGateModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-forest/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-cream rounded-3xl shadow-2xl max-w-sm w-full p-8 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-forest/40 hover:text-forest transition-colors"
          aria-label="Fermer"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-lavender flex items-center justify-center">
            <LockClosedIcon className="w-8 h-8 text-forest" />
          </div>

          <div>
            <h2 className="font-heading font-bold text-forest text-xl mb-2">
              Profil réservé.e aux membres
            </h2>
            <p className="text-forest/70 text-sm font-body leading-relaxed">
              Pour accéder à l&apos;identité et aux coordonnées des praticiens,
              créez un compte gratuit ou connectez-vous.
            </p>
          </div>

          <div className="w-full space-y-2.5 pt-2">
            <Link
              href="/signup"
              className="block w-full bg-forest text-cream text-sm font-body font-semibold px-6 py-3 rounded-full hover:bg-forest/90 transition-colors text-center"
            >
              Créer un compte gratuit
            </Link>
            <Link
              href="/signin"
              className="block w-full bg-lavender text-forest text-sm font-body font-semibold px-6 py-3 rounded-full hover:bg-lavender/80 transition-colors text-center"
            >
              Se connecter
            </Link>
          </div>

          <p className="text-xs text-forest/40 font-body">
            C&apos;est gratuit et sans engagement
          </p>
        </div>
      </div>
    </div>
  );
}
