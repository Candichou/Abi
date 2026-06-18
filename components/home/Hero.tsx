import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { getSearchSuggestions } from "@/server/queries/practitioners";
import { SearchCombobox } from "@/components/practitioners/SearchCombobox";

export default async function Hero() {
  const { specialties, cities } = await getSearchSuggestions().catch(() => ({
    specialties: [],
    cities: [],
  }));

  return (
    <section className="bg-forest py-3 px-4">
      <div className="max-w-7xl mx-auto w-full">
      <h1 className="text-cream text-h1 font-heading font-bold ">
        Recherche ton praticien{" "}
        <span className="text-yellow">Bienveillant</span>
      </h1>
      <form
        action="/search"
        method="GET"
        className="md:bg-cream md:border md:border-forest/20 md:rounded-2xl md:p-8 mt-6 flex flex-col gap-4"
      >
        <SearchCombobox
          name="specialty"
          placeholder="spécialité"
          suggestions={specialties}
          icon={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
          inputClassName="bg-cream w-full pl-10 py-3 rounded-full border border-forest/20 outline-none focus:border-forest"
        />
        <SearchCombobox
          name="city"
          placeholder="Ville, code postal"
          suggestions={cities}
          icon={<MapPinIcon className="w-5 h-5 text-gray-400" />}
          inputClassName="bg-cream w-full pl-10 py-3 rounded-full border border-forest/20 outline-none focus:border-forest"
        />
        <button
          type="submit"
          className="bg-lavender text-forest w-full px-2 py-2 font-body rounded-full"
        >
          Rechercher
        </button>
      </form>
      </div>
    </section>
  );
}
