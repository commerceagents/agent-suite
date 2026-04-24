import SpaceHorizonHero from "@/components/SpaceHorizonHero";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import PeopleSection from "@/components/PeopleSection";
import TestimonialSection from "@/components/TestimonialSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative bg-black min-h-screen" suppressHydrationWarning>
      <SpaceHorizonHero />
      <AboutSection />
      <ProjectsSection />
      <PeopleSection />
      <TestimonialSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
