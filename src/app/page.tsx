import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Competencies } from "@/components/sections/Competencies";
import { Experience } from "@/components/sections/Experience";
import { EducationAndInterests } from "@/components/sections/OtherInfo";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <Competencies />
        <Experience />
        <EducationAndInterests />
      </main>
      
      <footer className="py-12 bg-[#050505] border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/30 text-xs uppercase tracking-[0.2em]">
            © 2026 BUI MINH LONG. Designed for Excellence in Real Estate.
          </p>
        </div>
      </footer>
    </>
  );
}
