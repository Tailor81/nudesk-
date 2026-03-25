import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import { Ruler, Atom, FlaskConical, Code } from "lucide-react";
import type { ReactNode } from "react";

interface CourseCardData {
  title: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  Icon: typeof Ruler;
  thumbGradient: string;
  badge?: { text: string; color: string };
  rating: number;
  reviewCount: number;
  modules: number;
  instructor: { initials: string; name: string; color: "violet" | "orange" | "green" };
  price: number;
  originalPrice: number;
  accentBtn?: boolean;
}

const courses: CourseCardData[] = [
  {
    title: "Advanced Calculus I: Limits, Derivatives & Integration",
    category: "Mathematics",
    categoryColor: "text-primary",
    categoryBg: "bg-primary-light",
    Icon: Ruler,
    thumbGradient: "from-violet-100 to-violet-200",
    badge: { text: "Bestseller", color: "bg-primary" },
    rating: 4.9,
    reviewCount: 312,
    modules: 12,
    instructor: { initials: "SO", name: "Dr. Sarah Osei", color: "violet" },
    price: 49,
    originalPrice: 99,
  },
  {
    title: "Quantum Physics Foundations: From Zero to Schrodinger",
    category: "Physics",
    categoryColor: "text-orange-600",
    categoryBg: "bg-accent-light",
    Icon: Atom,
    thumbGradient: "from-orange-50 to-orange-100",
    badge: { text: "New", color: "bg-accent" },
    rating: 4.8,
    reviewCount: 187,
    modules: 15,
    instructor: { initials: "KA", name: "Prof. Kwame Asante", color: "orange" },
    price: 59,
    originalPrice: 119,
    accentBtn: true,
  },
  {
    title: "Organic Chemistry Masterclass: Reactions & Mechanisms",
    category: "Chemistry",
    categoryColor: "text-green-700",
    categoryBg: "bg-success-light",
    Icon: FlaskConical,
    thumbGradient: "from-green-50 to-green-100",
    rating: 4.9,
    reviewCount: 248,
    modules: 8,
    instructor: { initials: "AM", name: "Dr. Ama Mensah", color: "green" },
    price: 44,
    originalPrice: 89,
  },
  {
    title: "Data Structures & Algorithms in Python",
    category: "Computer Science",
    categoryColor: "text-blue-700",
    categoryBg: "bg-blue-50",
    Icon: Code,
    thumbGradient: "from-blue-50 to-blue-100",
    rating: 4.7,
    reviewCount: 421,
    modules: 10,
    instructor: { initials: "NO", name: "Nadia Osei-Bonsu", color: "violet" },
    price: 54,
    originalPrice: 109,
  },
];

function CourseCard({ course }: { course: CourseCardData }) {
  return (
    <div className="bg-white border-[1.5px] border-neutral-200 rounded-[20px] overflow-hidden transition-all duration-200 hover:shadow-2xl hover:-translate-y-[5px] hover:border-violet-200 cursor-pointer">
      <div className="aspect-video overflow-hidden relative flex items-center justify-center">
        <div
          className={`w-full h-full bg-gradient-to-br ${course.thumbGradient} flex items-center justify-center`}
        >
          <course.Icon className="w-12 h-12 text-neutral-400" />
        </div>
        {course.badge && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[.7rem] font-bold text-white uppercase tracking-wide ${course.badge.color}`}
          >
            {course.badge.text}
          </span>
        )}
      </div>

      <div className="px-[18px] py-4 pb-5">
        <span
          className={`inline-flex px-2.5 py-[3px] rounded-full text-[.7rem] font-bold mb-2 ${course.categoryBg} ${course.categoryColor}`}
        >
          {course.category}
        </span>
        <div className="text-[.975rem] font-bold text-neutral-900 leading-snug mb-2 line-clamp-2">
          {course.title}
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3 flex-wrap">
          <span className="text-orange-500 font-bold">{course.rating}</span>
          <StarRating rating={course.rating} />
          <span>({course.reviewCount})</span>
          <span className="w-[3px] h-[3px] rounded-full bg-neutral-300 shrink-0" />
          <span>{course.modules} modules</span>
        </div>
        <div className="flex items-center gap-2 pt-3 border-t border-neutral-200">
          <Avatar initials={course.instructor.initials} size="sm" color={course.instructor.color} />
          <span className="text-[.8rem] font-medium text-neutral-700">
            {course.instructor.name}
          </span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-[1.05rem] font-extrabold text-neutral-900">
              ${course.price}
            </span>
            <span className="text-[.8rem] text-neutral-400 line-through ml-1.5">
              ${course.originalPrice}
            </span>
          </div>
          <Button
            variant={course.accentBtn ? "accent" : "primary"}
            size="sm"
          >
            Enroll
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CoursesSection() {
  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-end justify-between mb-9 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-primary-light text-primary border-[1.5px] border-primary-muted text-[.72rem] font-bold px-3.5 py-1 rounded-full uppercase tracking-[0.07em] mb-3.5">
              <StarRating rating={1} max={1} /> Top Rated
            </div>
            <h2 className="text-[2.1rem] font-extrabold text-neutral-900 leading-[1.2] tracking-[-0.03em] mb-3.5">
              Most Popular Courses
            </h2>
            <p className="text-base text-neutral-500 max-w-[520px] leading-[1.65]">
              Hand-picked from our best-reviewed tutors.
            </p>
          </div>
          <Button variant="outline-v" href="/courses">All Courses</Button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-5">
          {courses.map((c) => (
            <CourseCard key={c.title} course={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
