import SpaceHorizonHero from "@/components/SpaceHorizonHero";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import PeopleSection from "@/components/PeopleSection";
import TestimonialSection from "@/components/TestimonialSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <SpaceHorizonHero />
      <AboutSection />
      <ProjectsSection />
      <PeopleSection />
      <TestimonialSection />
      <ContactSection />
    </main>
  );
}
