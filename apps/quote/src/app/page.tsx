import SpaceHorizonHero from "@/components/SpaceHorizonHero";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <SpaceHorizonHero />
      <AboutSection />
      <ProjectsSection />
    </main>
  );
}
