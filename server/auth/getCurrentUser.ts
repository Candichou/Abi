import { auth } from "@/lib/auth/config";
import { headers } from "next/headers";

// Seul point du projet qui connaît BetterAuth + next/headers pour la session.
// Les Server Actions ne dépendent que de cette fonction, jamais directement de `auth.api.getSession`.
export async function getCurrentUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Vous n'êtes pas connecté.e");
  return session.user.id;
}
