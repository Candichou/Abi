import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-forest text-cream py-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact */}
        <div>
          <h3 className="font-heading font-bold mb-2 text-sm uppercase">Contact</h3>
          <a
            href="mailto:contact@abi.fr"
            className="text-cream/70 hover:text-cream transition-colors text-sm"
          >
            contact@abi.fr
          </a>
        </div>

        {/* Légal */}
        <div>
          <h3 className="font-heading font-bold mb-2 text-sm uppercase">Légal</h3>
          <Link
            href="/rgpd"
            className="text-cream/70 hover:text-cream transition-colors text-sm"
          >
            Conditions d&apos;utilisation
          </Link>
        </div>

        {/* Brand */}
        <div className="text-center md:text-right">
          <p className="text-cream/60 text-xs">
            © Abi avec Bienveillance et Inclusion
          </p>
        </div>
      </div>
    </footer>
  );
}
