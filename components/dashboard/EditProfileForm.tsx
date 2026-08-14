"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/common/Button";
import { updatePseudoSchema } from "@/lib/validations/user";
import { updatePseudo } from "@/server/actions/updatePseudo";

interface EditProfileFormProps {
  session: {
    user: {
      name: string;
      email: string;
    };
  };
}

export default function EditProfileForm({ session }: EditProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(session.user.name);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const trimmedName = name.trim();
  const validation = updatePseudoSchema.safeParse({ name });
  const isUnchanged = trimmedName === session.user.name.trim();
  const isDisabled = !validation.success || isUnchanged || isLoading;

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (!validation.success || isUnchanged) return;

    setIsLoading(true);
    setError("");

    const result = await updatePseudo(validation.data.name);

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <p className="text-sm text-forest/70">
        Le pseudonyme est la seule information de profil modifiable dans la
        version actuelle.
      </p>

      {error && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600"
        >
          {error}
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
          aria-invalid={!validation.success}
          aria-describedby={!validation.success ? "name-error" : undefined}
          className="w-full rounded-full px-4 py-3 bg-cream border border-forest/20 font-body text-sm text-forest placeholder:text-forest/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest"
        />
        {!validation.success && (
          <p id="name-error" role="alert" className="text-xs text-red-600 mt-1">
            {validation.error.issues[0].message}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-forest text-forest hover:bg-forest/5 transition-colors font-heading font-bold"
        >
          Retour
        </Link>
        <Button type="submit" disabled={isDisabled}>
          {isLoading ? "Enregistrement…" : "Enregistrer les modifications"}
        </Button>
      </div>
    </form>
  );
}
