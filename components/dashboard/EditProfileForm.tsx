"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";

interface EditProfileFormProps {
  session: {
    user: {
      name: string;
      email: string;
    };
  };
}

export default function EditProfileForm({ session }: EditProfileFormProps) {
  const [name, setName] = useState(session.user.name);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // TODO: Implémenter update user endpoint
    // Pour v1, afficher message "à venir"
    setError("Modification de profil — à implémenter en v2");
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      {error && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          role="status"
          className="bg-teal/20 border border-teal rounded-xl p-4 text-sm text-teal"
        >
          {success}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-heading font-bold text-forest mb-2"
        >
          Pseudonyme
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-3 bg-cream border border-forest/20 font-body text-sm text-forest placeholder:text-forest/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-heading font-bold text-forest mb-2"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={session.user.email}
          disabled
          className="w-full rounded-full px-4 py-3 bg-cream/50 border border-forest/20 font-body text-sm text-forest/50 cursor-not-allowed"
        />
        <p className="text-xs text-forest/50 mt-1">
          Modification email non disponible pour v1
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Mise à jour…" : "Mettre à jour"}
        </Button>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-forest text-forest hover:bg-forest/5 transition-colors font-heading font-bold"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
