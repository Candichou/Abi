const SPECIALTIES = [
  "Gynécologue",
  "Psychologue",
  "Nutritionniste",
  "Homéopathe",
  "Ostéopathe",
  "Sage-femme",
];

export function SpecialtiesButtons() {
  return (
    <section className="bg-cream py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-center text-sm text-forest/60 mb-6 uppercase tracking-wide">
          Chercher par spécialité
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {SPECIALTIES.map((specialty) => (
            <a
              key={specialty}
              href={`/search?specialty=${encodeURIComponent(specialty)}`}
              className="bg-white border-2 border-forest/20 text-forest px-5 py-2.5 rounded-full hover:border-forest hover:bg-forest/5 transition-colors text-sm font-body"
            >
              {specialty}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
