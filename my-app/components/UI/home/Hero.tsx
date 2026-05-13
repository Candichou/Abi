import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/solid";

export default function Hero() {
  return (
    <section className="bg-forest py-3 px-4">
      <h1 className="text-cream text-h1 font-heading font-bold ">
        Recherche ton praticien{" "}
        <span className="text-yellow">Bienveillant</span>
      </h1>
      <div className="md:bg-cream md:border md:border-forest/20 md:rounded-2xl md:p-8 mt-6 flex flex-col gap-4">
        <div className="relative">
          <MagnifyingGlassIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            className="bg-cream w-full pl-10 py-3 rounded-full border border-forest/20 outline-none focus:border-forest"
            aria-label="écrire la spécilaité du praticien recherché"
            placeholder="spécialité"
          ></input>
        </div>
        <div className="relative">
          <MapPinIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            className="bg-cream w-full pl-10 py-3 rounded-full border border-forest/20 outline-none focus:border-forest"
            aria-label="écrire la ville ou le code postal"
            placeholder="Ville, code postal "
          ></input>
        </div>
        <div>
          <button
            className="bg-lavender text-forest w-full
            px-2
            py-2 font-body rounded-full"
          >
            Rechercher
          </button>
        </div>
      </div>
    </section>
  );
}
