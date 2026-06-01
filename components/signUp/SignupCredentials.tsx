"use client";

import { credentialsSchema } from "@/lib/validations/auth";
import { formatZodErrors } from "@/lib/validations/utils";
import { authClient } from "@/lib/auth-client";
import { setUserRole } from "@/app/actions/auth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../UI/Button";
import Link from "next/link";

interface SignupCredentialsProps {
  role: "patient" | "association";
  onBack: () => void;
  disabled: (isLoading: boolean) => void;
}

export default function SignupCredentials({
  role,
  onBack,
}: SignupCredentialsProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  function validate(): boolean {
    const result = credentialsSchema.safeParse({ name, email, password });
    if (!result.success) {
      setErrors(formatZodErrors(result.error));
      return false;
    }
    setErrors({});
    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setIsLoading(true);
    setServerError(null);

    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/dashboard",
    });

    if (error) {
      setServerError("Une erreur est survenue. Vérifie tes informations.");
      setIsLoading(false);
      return;
    }

    const dbRole = role === "association" ? "asso" : "patient";
    await setUserRole(dbRole);

    router.push("/dashboard");
  }

  return (
    <form
      className="flex flex-col gap-6 w-full max-w-md mx-auto px-4 py-8"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* Indicateur d'étape */}
      {/*    <p className="font-body text-sm text-forest/60">étape 1 sur 2</p> */}
      {/*  //todo: quand la deuxième étape sera prête */}

      {/* En-tête */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading font-bold text-h2 text-forest">
          git Votre compte
        </h1>
        <p className="font-body text-sm text-forest/70">
          Nous collectons le strict minimum — pseudonyme et e-mail uniquement.
        </p>
      </div>

      {/* Erreur serveur */}
      {serverError && (
        <p role="alert" className="text-sm text-red-600 font-body">
          {serverError}
        </p>
      )}

      {/* Pseudonyme */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="pseudonyme"
          className="font-heading font-bold text-sm text-forest"
        >
          Pseudonyme <span aria-hidden="true">*</span>
        </label>
        <p className="font-body text-sm text-forest/60">
          Aucun nom réel requis. Affiché publiquement.
        </p>
        <input
          id="pseudonyme"
          type="text"
          autoComplete="username"
          placeholder="ex. colibri432"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-describedby={errors.name ? "pseudonyme-error" : undefined}
          className="w-full rounded-full px-4 py-3 bg-cream border border-forest/20 font-body text-sm text-forest placeholder:text-forest/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest"
        />
        {errors.name && (
          <p
            id="pseudonyme-error"
            role="alert"
            className="text-sm text-red-600 font-body"
          >
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="email"
          className="font-heading font-bold text-sm text-forest"
        >
          Adresse e-mail <span aria-hidden="true">*</span>
        </label>
        <p className="font-body text-sm text-forest/60">
          Pour la connexion uniquement. Non visible des autres utilisateurs.
        </p>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full rounded-full px-4 py-3 bg-cream border border-forest/20 font-body text-sm text-forest placeholder:text-forest/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest"
        />
        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="text-sm text-red-600 font-body"
          >
            {errors.email}
          </p>
        )}
      </div>

      {/* Mot de passe */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="password"
          className="font-heading font-bold text-sm text-forest"
        >
          Mot de passe <span aria-hidden="true">*</span>
        </label>
        <p className="font-body text-sm text-forest/60">
          12 caractères minimum, majuscule + chiffre + symbole.
        </p>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="w-full rounded-full px-4 py-3 pr-12 bg-cream border border-forest/20 font-body text-sm text-forest placeholder:text-forest/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-full"
          >
            {showPassword ? (
              <EyeSlashIcon
                className="w-5 h-5 text-forest/50"
                aria-hidden="true"
              />
            ) : (
              <EyeIcon className="w-5 h-5 text-forest/50" aria-hidden="true" />
            )}
          </button>
        </div>
        {errors.password && (
          <p
            id="password-error"
            role="alert"
            className="text-sm text-red-600 font-body"
          >
            {errors.password}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between gap-3 mt-2">
        <Button type="button" variant="ghost" onClick={onBack}>
          Retour
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Création…" : "Créer mon compte"}
        </Button>
      </div>
      <span>
        Déjà un compte ? <Link href="/signin">se connecter</Link>
      </span>
      {/* Footer éthique */}
      <p className="text-center font-body text-xs text-forest/50 mt-2">
        Sans traceur · sans CAPTCHA visuel · données minimales · hébergement UE
      </p>
    </form>
  );
}
