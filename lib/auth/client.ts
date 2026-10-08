import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

// Déconnexion qui vide la session locale tout de suite. Avec authClient.signOut() seul, useSession()
// garde l'ancien utilisateur jusqu'à la réponse de /get-session, et pour toujours si cet appel échoue
// (429, réseau…) : better-auth ne vide la donnée que sur une 401. On connaît déjà le résultat, donc on
// désactive ce second appel (disableSignal). Contrepartie : les autres onglets ouverts ne sont pas
// prévenus, ils se mettent à jour au prochain retour sur l'onglet.
export async function signOut() {
  const result = await authClient.signOut({
    fetchOptions: { disableSignal: true },
  });
  if (!result.error) {
    const session = authClient.$store.atoms.session;
    session.set({ ...session.get(), data: null, error: null, isPending: false });
  }
  return result;
}
