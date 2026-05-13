import { UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Header() {
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
          href="/auth"
          className="bg-lavender text-forest rounded-full
            px-2
            py-2 md:px-4 flex items-center gap-2"
          aria-label="Se connecter à votre compte"
        >
          <UserCircleIcon className="w-5 h-5" aria-hidden="true" />
          <span className="hidden md:inline ">Se connecter</span>
        </Link>
      </div>
    </header>
  );
}
