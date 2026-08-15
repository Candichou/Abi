import Link from "next/link";

export default function RGPDPage() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="bg-forest text-cream px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-heading font-bold">
            Conditions d&apos;utilisation & Confidentialité
          </h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-12">
        <div className="space-y-6 text-forest/80 font-body">
          <section>
            <h2 className="text-lg font-heading font-bold text-forest mb-2">
              Vos données
            </h2>
            <p>
              Abi respecte votre confidentialité. Vos données personnelles
              (email, pseudonyme) ne sont jamais vendues ou partagées.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-bold text-forest mb-2">
              Suppression de compte
            </h2>
            <p>
              Vous pouvez demander la suppression de votre compte à tout moment.
              Toutes vos données seront définitivement supprimées.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-bold text-forest mb-2">
              Questions?
            </h2>
            <p>
              Contactez-nous:{" "}
              <a href="mailto:contact@abi.fr" className="text-forest underline">
                contact@abi.fr
              </a>
            </p>
          </section>
        </div>

        <Link
          href="/"
          className="inline-block mt-8 text-forest/70 hover:text-forest underline"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
