import SpaceHorizonHero from "@/components/SpaceHorizonHero";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";
import PeopleSection from "@/components/PeopleSection";
import TestimonialSection from "@/components/TestimonialSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative bg-black min-h-screen" suppressHydrationWarning>
      <SpaceHorizonHero />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <TestimonialSection />
      <StatsSection />
      <PeopleSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
