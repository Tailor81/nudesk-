import { CategoriesSection } from "@/components/home/categories-section";
import { CoursesSection } from "@/components/home/courses-section";

export const metadata = {
  title: "All Courses - NuDesk",
  description: "Browse 3,200+ courses from expert tutors across 60+ subjects.",
};

export default function CoursesPage() {
  return (
    <>
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-[2.6rem] font-extrabold text-neutral-900 leading-tight tracking-tight">
              All Courses
            </h1>
            <p className="text-base text-neutral-500 max-w-[520px] leading-relaxed mt-3.5">
              Browse 3,200+ courses from expert tutors across 60+ subjects.
            </p>
          </div>
        </div>
      </section>
      <CategoriesSection />
      <CoursesSection />
    </>
  );
}
