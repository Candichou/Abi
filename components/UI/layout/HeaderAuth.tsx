"use client";

import { authClient } from "@/lib/auth-client";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { UserMenu } from "./UserMenu";

export function HeaderAuth() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div
        className="w-9 h-9 rounded-full bg-lavender/30 animate-pulse"
        aria-hidden="true"
      />
    );
  }

  if (session) {
    return <UserMenu userName={session.user.name} />;
  }

  return (
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
  );
}
