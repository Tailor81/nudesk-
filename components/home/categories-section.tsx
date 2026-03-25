import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Ruler,
  Atom,
  FlaskConical,
  Dna,
  Code,
  TrendingUp,
  BarChart3,
  Stethoscope,
} from "lucide-react";

const categories = [
  { name: "Mathematics", Icon: Ruler, bg: "bg-violet-100" },
  { name: "Physics", Icon: Atom, bg: "bg-orange-50" },
  { name: "Chemistry", Icon: FlaskConical, bg: "bg-green-50" },
  { name: "Biology", Icon: Dna, bg: "bg-red-50" },
  { name: "Computer Science", Icon: Code, bg: "bg-blue-50" },
  { name: "Economics", Icon: TrendingUp, bg: "bg-emerald-50" },
  { name: "Statistics", Icon: BarChart3, bg: "bg-amber-50" },
  { name: "Medicine", Icon: Stethoscope, bg: "bg-fuchsia-50" },
];

export function CategoriesSection() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-end justify-between mb-9 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-primary-light text-primary border-[1.5px] border-primary-muted text-[.72rem] font-bold px-3.5 py-1 rounded-full uppercase tracking-[0.07em] mb-3.5">
              Browse by Subject
            </div>
            <h2 className="text-[2.1rem] font-extrabold text-neutral-900 leading-[1.2] tracking-[-0.03em]">
              Find Your Perfect Subject
            </h2>
          </div>
          <Button variant="outline-v" href="/courses">View All Courses</Button>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href="/courses"
              className="inline-flex items-center gap-2.5 px-[18px] py-2.5 pl-2.5 rounded-xl border-[1.5px] border-neutral-200 bg-white text-sm font-semibold text-neutral-700 shadow-sm hover:border-primary hover:text-primary hover:bg-primary-light hover:shadow-md transition-all whitespace-nowrap"
            >
              <div
                className={`w-[38px] h-[38px] rounded-lg flex items-center justify-center shrink-0 ${cat.bg}`}
              >
                <cat.Icon className="w-5 h-5" />
              </div>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
