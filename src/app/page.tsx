import { Effects } from "@/components/Effects";
import { HeroSpatial } from "@/components/HeroSpatial";
import { Monoliths } from "@/components/Monoliths";
import { EngineSection, ExperienceSection, SkillsSection, AskSection, ContactSection } from "@/components/HomeSections";

export default function HomePage() {
  return (
    <>
      <Effects />
      <HeroSpatial />
      <EngineSection />
      <Monoliths />
      <ExperienceSection />
      <SkillsSection />
      <AskSection />
      <ContactSection />
    </>
  );
}
