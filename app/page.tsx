import { HeroSection, StatsBar } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { CoursesSection } from "@/components/home/courses-section";
import { FeaturesSection } from "@/components/home/features-section";
import { InstructorsSection } from "@/components/home/instructors-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CtaSection } from "@/components/home/cta-section";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsBar />
        <CategoriesSection />
        <CoursesSection />
        <FeaturesSection />
        <InstructorsSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
