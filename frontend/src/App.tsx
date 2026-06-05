import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import InternshipDiscovery from "./sections/InternshipDiscovery";
import ColdEmailGuide from "./sections/ColdEmailGuide";
import ResumeAnalyzer from "./sections/ResumeAnalyzer";
import CareerRoadmap from "./sections/CareerRoadmap";
import PersonalBranding from "./sections/PersonalBranding";
import SmartSuggestions from "./sections/SmartSuggestions";
import Resources from "./sections/Resources";
import { useLenis } from "./hooks/useLenis";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useLenis();

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      gsap.fromTo(
        section.querySelectorAll("h2, h3"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div className="grain relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-radial-glow" />
      <Navbar />
      <main>
        <Hero />
        <InternshipDiscovery />
        <ColdEmailGuide />
        <ResumeAnalyzer />
        <CareerRoadmap />
        <PersonalBranding />
        <SmartSuggestions />
        <Resources />
      </main>
      <Footer />
    </div>
  );
}
