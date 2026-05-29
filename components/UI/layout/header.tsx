import { UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Header() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isLoggedIn = !!session;

  return (
    <header className="bg-forest py-3 px-4">
      <div
        className="flex items-center justify-between max-w-7xl
          mx-auto
          w-full"
      >
        <Link href="/" className="font-heading font-bold text-cream text-h1">
          Abi.
        </Link>
        <Link
          href={isLoggedIn ? "/dashboard" : "/signin"}
          className="bg-lavender text-forest rounded-full
            px-2
            py-2 md:px-4 flex items-center gap-2"
          aria-label={
            isLoggedIn ? "Accéder à votre profil" : "Se connecter à votre compte"
          }
        >
          <UserCircleIcon className="w-5 h-5" aria-hidden="true" />
          <span className="hidden md:inline">
            {isLoggedIn ? "Mon profil" : "Se connecter"}
          </span>
        </Link>
      </div>
    </header>
  );
}
