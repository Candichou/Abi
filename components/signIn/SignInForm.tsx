"use client";

import { authClient } from "@/lib/auth-client";
import { signinSchema } from "@/lib/validations/auth";
import { formatZodErrors } from "@/lib/validations/utils";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../UI/Button";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const router = useRouter();

  function validate(): boolean {
    const result = signinSchema.safeParse({ email, password });
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

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });

    if (error) {
      setServerError("Compte ou mot de passe incorrectes");
      setIsLoading(false);
      return;
    }

    router.refresh();
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
      {/* En-tête */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading font-bold text-h2 text-forest">
          Connexion à votre compte
        </h1>
      </div>

      {/* Erreur serveur */}
      {serverError && (
        <p role="alert" className="text-sm text-red-600 font-body">
          {serverError}
        </p>
      )}

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="email"
          className="font-heading font-bold text-sm text-forest"
        >
          Adresse e-mail <span aria-hidden="true">*</span>
        </label>
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
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
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
        <Link
          href="/signup"
          className="bg-transparent border border-forest text-forest font-heading font-bold rounded-full px-6 py-3 min-h-11 hover:bg-forest hover:text-cream"
        >
          Créer un compte
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Connexion…" : "Se connecter"}
        </Button>
      </div>

      {/* Footer éthique */}
      {/*      <p className="text-center font-body text-xs text-forest/50 mt-2">
        Sans traceur · sans CAPTCHA visuel · données minimales · hébergement UE
      </p> */}
    </form>
  );
}
