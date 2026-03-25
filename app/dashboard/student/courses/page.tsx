import { Plus, Play, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";

const courses = [
  {
    emoji: "📐",
    title: "Advanced Calculus I",
    pct: 42,
    color: "violet" as const,
    gradient: "from-violet-50 to-violet-100",
    meta: "42% · Module 5 of 12",
    instructor: "Dr. Sarah Osei",
    initials: "SO",
    avColor: "bg-violet-100 text-violet-700",
    badgeLabel: "In Progress",
    badgeBg: "bg-primary",
    btnVariant: "primary" as const,
    btnLabel: "Resume",
  },
  {
    emoji: "⚛️",
    title: "Quantum Physics Foundations",
    pct: 53,
    color: "orange" as const,
    gradient: "from-orange-50 to-orange-100",
    meta: "53% · Module 8 of 15",
    instructor: "Prof. Kwame Asante",
    initials: "KA",
    avColor: "bg-orange-100 text-orange-700",
    badgeLabel: "In Progress",
    badgeBg: "bg-accent",
    btnVariant: "accent" as const,
    btnLabel: "Resume",
  },
  {
    emoji: "🧪",
    title: "Organic Chemistry Masterclass",
    pct: 100,
    color: "green" as const,
    gradient: "from-green-50 to-emerald-100",
    meta: "100% · All 8 modules",
    instructor: "Dr. Ama Mensah",
    initials: "AM",
    avColor: "bg-green-100 text-green-700",
    badgeLabel: "✓ Complete",
    badgeBg: "bg-success",
    btnVariant: "secondary" as const,
    btnLabel: "Rewatch",
    showCert: true,
  },
  {
    emoji: "💻",
    title: "Data Structures & Algorithms",
    pct: 20,
    color: "violet" as const,
    gradient: "from-blue-50 to-blue-100",
    meta: "20% · Module 2 of 10",
    instructor: "Nadia Osei-Bonsu",
    initials: "NO",
    avColor: "bg-violet-100 text-violet-700",
    badgeLabel: "In Progress",
    badgeBg: "bg-neutral-700",
    btnVariant: "primary" as const,
    btnLabel: "Resume",
  },
];

export default function StudentCoursesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">
          My Courses
        </h2>
        <Button variant="primary" href="/courses">
          <Plus className="w-[15px] h-[15px]" />
          Browse Courses
        </Button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {courses.map((c) => (
          <div
            key={c.title}
            className="bg-white border-[1.5px] border-neutral-200 rounded-[20px] overflow-hidden hover:border-violet-200 hover:shadow-2xl hover:-translate-y-[5px] transition-all cursor-pointer"
          >
            {/* Thumb */}
            <div className="relative aspect-video overflow-hidden">
              <div
                className={`w-full h-full bg-gradient-to-br ${c.gradient} flex items-center justify-center text-[3rem]`}
              >
                {c.emoji}
              </div>
              <span
                className={`absolute top-3 right-3 ${c.badgeBg} text-white text-[.72rem] font-bold px-2.5 py-1 rounded-full`}
              >
                {c.badgeLabel}
              </span>
            </div>
            {/* Body */}
            <div className="px-[18px] pt-4 pb-5">
              <div className="text-[.975rem] font-bold leading-[1.4] mb-2">
                {c.title}
              </div>
              <ProgressBar value={c.pct} color={c.color} className="mb-1.5" />
              <div className="text-xs text-neutral-500 mb-3">{c.meta}</div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[.65rem] font-bold ${c.avColor}`}
                >
                  {c.initials}
                </div>
                <span className="text-[.8rem] font-medium text-neutral-700">
                  {c.instructor}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant={c.btnVariant} size="sm" className="flex-1">
                  {c.btnLabel !== "Rewatch" && (
                    <Play className="w-3 h-3" />
                  )}
                  {c.btnLabel}
                </Button>
                {c.showCert && (
                  <Button variant="success-ghost" size="sm">
                    <Award className="w-[13px] h-[13px]" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
