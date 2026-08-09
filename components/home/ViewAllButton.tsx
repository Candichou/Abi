import Link from "next/link";

export function ViewAllButton() {
  return (
    <div className="text-center py-8 px-4">
      <Link
        href="/search"
        className="inline-block bg-lavender text-forest px-8 py-3 rounded-full font-heading font-bold hover:bg-lavender/80 transition-colors"
      >
        Voir tous les praticiens →
      </Link>
    </div>
  );
}
