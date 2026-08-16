"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/server/actions/auth";
import { useModalA11y } from "@/lib/hooks/useModalA11y";

export function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const containerRef = useModalA11y(onClose);

  async function handleDelete() {
    setIsLoading(true);
    setError(null);
    try {
      await deleteAccount();
      await authClient.signOut();
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de supprimer votre compte, veuillez réessayer.",
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-forest/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
        className="bg-cream rounded-3xl shadow-2xl max-w-sm p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-forest/70 hover:text-forest"
          aria-label="Fermer"
        >
          ✕
        </button>

        <h2
          id="delete-account-title"
          className="text-lg font-heading font-bold text-forest mb-2"
        >
          Êtes-vous sûr.e?
        </h2>
        <p className="text-sm text-forest/70 mb-6">
          La suppression de votre compte est irréversible. Toutes vos données
          seront définitivement supprimées.
        </p>

        {error && (
          <p className="text-sm text-red-600 mb-4" role="alert">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-full border-2 border-forest text-forest hover:bg-forest/5 transition-colors font-heading font-bold text-sm"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 py-2 px-4 rounded-full bg-red-600 text-cream hover:bg-red-700 transition-colors font-heading font-bold text-sm disabled:opacity-50"
          >
            {isLoading ? "Suppression…" : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
