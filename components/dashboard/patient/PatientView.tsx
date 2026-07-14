import Link from "next/link";
import { Logout } from "../Logout";
import { auth } from "@/lib/auth/config";
import { getSavedPractitioners } from "@/server/queries/savedPractitioners";

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

export async function PagePatient({ session }: { session: Session }) {
  const savedPractitioners = await getSavedPractitioners(session.user.id);

  return (
    <main className="min-h-screen bg-cream">
      {/* Header dark — cohérent avec la marque */}
      <div className="bg-forest text-cream px-4 py-6">
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-2xl md:text-3xl font-heading font-bold">
            Bienvenue, <span className="text-yellow">{session.user.name}</span>{" "}
            !
          </h1>
          <p className="text-sm mt-1 opacity-80">Vous êtes connecté.e</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        {/* Carte Profil */}
        <section
          className="bg-white border-2 border-forest rounded-3xl p-6 md:p-8 mb-8"
          aria-labelledby="profile-heading"
        >
          <h2 id="profile-heading" className="sr-only">
            Votre profil
          </h2>

          {/* Avatar symbolique + infos */}
          <div className="flex items-start gap-4 md:gap-6 mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-forest flex items-center justify-center shrink-0">
              <span className="text-cream text-2xl md:text-3xl font-heading font-bold">
                {session.user.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-forest/60 mb-1">Pseudonyme</p>
              <p className="text-lg md:text-xl font-heading font-bold text-forest break-all">
                {session.user.name}
              </p>
              <p className="text-xs text-forest/50 mt-2">
                Membre depuis{" "}
                {new Date(session.user.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          {/* Résumé stats */}
          <div className="pt-6 border-t border-forest/10">
            <div>
              <p className="text-xs text-forest/60 uppercase tracking-wide">
                Praticiens sauvegardés
              </p>
              <p className="text-2xl font-heading font-bold text-forest mt-1">
                {savedPractitioners.length}
              </p>
            </div>
          </div>
        </section>

        {/* Liste des praticiens sauvegardés */}
        <section
          className="mb-8"
          aria-labelledby="saved-heading"
        >
          <h2
            id="saved-heading"
            className="text-sm font-heading font-bold text-forest uppercase tracking-wide mb-3"
          >
            Praticiens sauvegardés
          </h2>
          {savedPractitioners.length === 0 ? (
            <p className="text-sm text-forest/60">
              Aucun praticien sauvegardé pour le moment.
            </p>
          ) : (
            <ul className="space-y-3">
              {savedPractitioners.map((practitioner) => (
                <li key={practitioner.id}>
                  <Link
                    href={`/practitioners/${practitioner.id}`}
                    className="block bg-white border-2 border-forest/20 rounded-2xl px-5 py-4 hover:border-forest transition-colors"
                  >
                    <p className="font-heading font-bold text-forest">
                      {practitioner.firstName} {practitioner.lastName}
                    </p>
                    <p className="text-sm text-forest/60">
                      {practitioner.specialty}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Actions */}
        <section className="space-y-4" aria-labelledby="actions-heading">
          <h2 id="actions-heading" className="sr-only">
            Actions disponibles
          </h2>
          {/* Bouton principal — AJouter praticien DISABLED */}
          <button
            disabled
            className="w-full py-4 px-6 rounded-full font-heading font-bold bg-lavender/50 text-forest/50 cursor-not-allowed border-2 border-lavender/30"
            aria-label="Ajouter un praticien (À venir)"
            title="Cette fonctionnalité arrive prochainement"
          >
            ➕ Ajouter un praticien
            <span className="block text-xs mt-1 font-body font-normal">
              À venir
            </span>
          </button>
          {/* Bouton déconnexion */}
          <Logout />
        </section>

        {/* Info privacy */}
        {/*      <p className="text-center text-xs text-forest/50 mt-12">
          Vos données sont chiffrées • Suppression à tout moment possible
        </p> */}
      </div>
    </main>
  );
}
