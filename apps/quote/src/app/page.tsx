import SpaceHorizonHero from "@/components/SpaceHorizonHero";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import PeopleSection from "@/components/PeopleSection";
import TestimonialSection from "@/components/TestimonialSection";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <SpaceHorizonHero />
      <AboutSection />
      <ProjectsSection />
      <PeopleSection />
      <TestimonialSection />
    </main>
  );
}
