import { Logout } from "../Logout";
import { auth } from "@/lib/auth";

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

export function PageAsso({ session }: { session: Session }) {
  return (
    <main className="min-h-screen bg-cream">
      <div className="bg-forest text-cream px-4 py-6 md:px-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">
          Bienvenue, <span className="text-yellow">{session.user.name}</span> !
        </h1>
        <p className="text-sm mt-1 opacity-80">Espace association</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        <section
          className="bg-white border-2 border-forest rounded-3xl p-6 md:p-8 mb-8"
          aria-labelledby="profile-heading"
        >
          <h2 id="profile-heading" className="sr-only">
            Votre profil association
          </h2>

          <div className="flex items-start gap-4 md:gap-6 mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-forest flex items-center justify-center shrink-0">
              <span className="text-cream text-2xl md:text-3xl font-heading font-bold">
                {session.user.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-forest/60 mb-1">Association</p>
              <p className="text-lg md:text-xl font-heading font-bold text-forest break-all">
                {session.user.name}
              </p>
              <p className="text-xs text-forest/50 mt-2">
                Membre depuis{" "}
                {new Date(session.user.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4" aria-labelledby="actions-heading">
          <h2 id="actions-heading" className="sr-only">
            Actions disponibles
          </h2>
          <button
            disabled
            className="w-full py-4 px-6 rounded-full font-heading font-bold bg-lavender/50 text-forest/50 cursor-not-allowed border-2 border-lavender/30"
            aria-label="Gérer les praticiens (À venir)"
            title="Cette fonctionnalité arrive prochainement"
          >
            Gérer les praticiens
            <span className="block text-xs mt-1 font-body font-normal">
              À venir
            </span>
          </button>
          <Logout />
        </section>

        <p className="text-center text-xs text-forest/50 mt-12">
          Vos données sont chiffrées • Suppression à tout moment possible
        </p>
      </div>
    </main>
  );
}
