import { UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserMenu } from "./UserMenu";

export default async function Header() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <header className="bg-forest py-3 px-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="font-heading font-bold text-cream text-h1">
          Abi.
        </Link>
        {session ? (
          <UserMenu userName={session.user.name} />
        ) : (
          <Link
            href="/signin"
            className="bg-lavender text-forest rounded-full px-2 py-2 md:px-4 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-lavender focus:ring-offset-2 focus:ring-offset-forest"
            aria-label="Se connecter à votre compte"
          >
            <UserCircleIcon className="w-5 h-5" aria-hidden="true" />
            <span className="hidden md:inline text-sm font-heading font-bold">
              Se connecter
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}
