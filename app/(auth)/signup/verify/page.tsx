import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function VerifyPage() {
  return (
    <main className="flex flex-col gap-6 w-full max-w-md mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircleIcon className="w-12 h-12 mx-auto" aria-hidden="true" />
        <h1 className="font-heading font-bold text-h2">Compte créé!</h1>
        <p>
          Un e-mail de confirmation vous a été envoyé. Vérifiez vos courriers
          indésirables si besoin.
        </p>
        <Link
          href="/"
          className="bg-lavender text-forest font-heading font-bold rounded-full px-6 py-3 border border-forest/20 hover:opacity-90"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
