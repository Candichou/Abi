import { Logout } from "../Logout";
import { auth } from "@/lib/auth/config";
import { getSavedPractitioners } from "@/server/queries/savedPractitioners";
import { SavedPractitionersList } from "./SavedPractitionersList";
import { DeleteAccountButton } from "../DeleteAccountButton";
import Link from "next/link";

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

export async function PatientView({ session }: { session: Session }) {
  const savedPractitioners = await getSavedPractitioners(session.user.id);

  return (
    <main className="min-h-screen bg-cream">
      {/* Contenu principal */}
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        {/* Bandeau de bienvenue — distinct du header/nav */}
        <div className="bg-teal/20 border border-teal/40 rounded-3xl px-6 py-5 mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-forest">
            Bienvenue,{" "}
            <span className="text-forest underline decoration-yellow decoration-4">
              {session.user.name}
            </span>{" "}
            !
          </h1>
          <p className="text-sm mt-1 text-forest/70">Vous êtes connecté.e</p>
        </div>

        {/* Carte Profil */}
        <section
          className="bg-white border-2 border-forest rounded-3xl p-6 md:p-8 mb-8"
          aria-labelledby="profile-heading"
        >
          <h2 id="profile-heading" className="sr-only">
            Votre profil
          </h2>

          {/* Avatar symbolique + infos + actions */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-forest flex items-center justify-center shrink-0">
                <span className="text-cream text-2xl md:text-3xl font-heading font-bold">
                  {session.user.name.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-forest/70 mb-1">Profil</p>
                <p className="text-lg md:text-xl font-heading font-bold text-forest break-all">
                  {session.user.name}
                </p>
                <p className="text-xs text-forest/70 mt-2">
                  Vous êtes membre depuis{" "}
                  {new Date(session.user.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <Link
                href="/dashboard/edit"
                className="py-2 px-4 rounded-full font-heading font-bold text-sm text-forest bg-teal/20 border border-teal/40 hover:bg-teal/30 transition-colors whitespace-nowrap"
              >
                Modifier mes informations
              </Link>
              <DeleteAccountButton compact />
            </div>
          </div>

          {/* Résumé stats */}
          <div className="pt-6 border-t border-forest/10">
            <div>
              <p className="text-xs text-forest/70 uppercase tracking-wide">
                Vos praticiens sauvegardé.e.s
              </p>
              <p className="text-2xl font-heading font-bold text-forest mt-1">
                {savedPractitioners.length}
              </p>
            </div>
          </div>
        </section>

        {/* Liste des praticiens sauvegardés */}
        <section className="mb-4" aria-labelledby="saved-heading">
          <h2
            id="saved-heading"
            className="text-sm font-heading font-bold text-forest uppercase tracking-wide mb-3"
          >
            Praticiens sauvegardé.e.s
          </h2>
          <SavedPractitionersList practitioners={savedPractitioners} />
        </section>

        {/* Bouton recherche — proche de la liste sauvegardée */}
        <Link
          href="/search"
          className="w-full py-4 px-6 rounded-full font-heading font-bold text-forest bg-lavender hover:bg-lavender/80 transition-colors text-center block mb-10"
        >
          Chercher d&apos;autres praticiens
        </Link>

        {/* Actions */}
        <section className="space-y-4" aria-labelledby="actions-heading">
          <h2 id="actions-heading" className="sr-only">
            Actions disponibles
          </h2>

          {/* Bouton déconnexion */}
          <Logout />
        </section>

        {/* Info privacy */}
        {/*      <p className="text-center text-xs text-forest/70 mt-12">
          Vos données sont chiffrées • Suppression à tout moment possible
        </p> */}
      </div>
    </main>
  );
}
