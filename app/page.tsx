import Hero from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { SpecialtiesButtons } from "@/components/home/SpecialtiesButtons";
import { ViewAllButton } from "@/components/home/ViewAllButton";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <SpecialtiesButtons />
      <ViewAllButton />
    </>
  );
}
