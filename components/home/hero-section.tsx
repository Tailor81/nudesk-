import { Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  Award,
  Video,
  Ruler,
  Atom,
  Code,
} from "lucide-react";

function HeroCard() {
  const courses = [
    { name: "Advanced Calculus I", pct: 42, color: "violet" as const, Icon: Ruler },
    { name: "Quantum Physics", pct: 53, color: "orange" as const, Icon: Atom },
    { name: "Data Structures", pct: 20, color: "green" as const, Icon: Code },
  ];

  return (
    <div className="relative flex justify-center items-center">
      <div className="bg-gradient-to-br from-violet-100 to-violet-200 rounded-3xl border-2 border-violet-200 shadow-2xl w-full max-w-[420px] aspect-[1/1.05] p-4 flex flex-col gap-2.5">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/70 backdrop-blur rounded-xl p-3">
            <div className="text-[.7rem] text-neutral-500 font-semibold mb-1">ENROLLED</div>
            <div className="text-2xl font-extrabold text-neutral-900">7</div>
            <div className="text-[.7rem] text-violet-500">Courses</div>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-xl p-3">
            <div className="text-[.7rem] text-neutral-500 font-semibold mb-1">STREAK</div>
            <div className="text-2xl font-extrabold text-neutral-900">12</div>
            <div className="text-[.7rem] text-orange-500">Days</div>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur rounded-xl p-3 flex-1">
          <div className="text-xs font-bold mb-2.5">Continue Learning</div>
          <div className="flex flex-col gap-2">
            {courses.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <div className="w-[30px] h-[30px] rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                  <c.Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[.72rem] font-semibold mb-1 truncate">{c.name}</div>
                  <ProgressBar value={c.pct} color={c.color} />
                </div>
                <span className="text-[.68rem] font-bold text-primary">{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating cards */}
      <div className="absolute bottom-[8%] left-[-5%] bg-white border-[1.5px] border-neutral-200 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2.5 animate-float">
        <div className="w-9 h-9 rounded-full bg-success-light flex items-center justify-center">
          <Award className="w-4 h-4 text-success" />
        </div>
        <div>
          <div className="text-[.78rem] font-bold">Certificate Earned!</div>
          <div className="text-[.7rem] text-neutral-500">Linear Algebra I</div>
        </div>
      </div>

      <div className="absolute top-[10%] right-[-4%] bg-white border-[1.5px] border-neutral-200 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2.5 animate-float-delay">
        <div className="w-9 h-9 rounded-full bg-accent-light flex items-center justify-center">
          <Video className="w-4 h-4 text-accent" />
        </div>
        <div>
          <div className="text-[.78rem] font-bold">Live Now</div>
          <div className="text-[.7rem] text-neutral-500">63 students attending</div>
        </div>
      </div>
    </div>
  );
}

const popularTags = ["Mathematics", "Physics", "Data Science", "Economics"];

export function HeroSection() {
  return (
    <section className="pt-[70px] bg-[linear-gradient(155deg,var(--color-violet-50)_0%,#fff_55%)] min-h-[88vh] flex items-center overflow-hidden relative">
      {/* Decorative gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_10%,rgba(124,58,237,.07),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_5%_85%,rgba(249,115,22,.05),transparent)]" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 w-full relative z-[1]">
        <div className="grid grid-cols-2 gap-14 items-center py-16 pb-20">
          <div>
            <div className="inline-flex items-center gap-2 mb-[22px] bg-accent-light border-[1.5px] border-orange-200 rounded-full py-[5px] px-4 pl-1.5 text-[.78rem] font-semibold text-accent">
              <span className="bg-accent text-white text-[.68rem] font-bold px-2.5 py-0.5 rounded-full">
                NEW
              </span>
              Cohort programs now live
            </div>

            <h1 className="text-[clamp(2.2rem,3.8vw,3.5rem)] font-extrabold text-neutral-900 leading-[1.12] tracking-[-0.035em] mb-[18px]">
              Learn Skills That
              <br />
              Actually <span className="text-primary">Get You Hired</span>
            </h1>

            <p className="text-base text-neutral-500 leading-[1.7] mb-7 max-w-[460px]">
              NuDesk connects students with rigorously vetted expert tutors.
              Courses, live sessions, and study guides &mdash; all in one
              focused workspace.
            </p>

            <div className="flex items-center bg-white border-2 border-neutral-200 rounded-2xl py-1.5 pr-1.5 pl-[18px] shadow-xl mb-4 max-w-[500px] focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(124,58,237,.12),var(--shadow-xl)] transition-all">
              <Search className="w-[18px] h-[18px] text-neutral-400 shrink-0 mr-1" />
              <input
                type="text"
                placeholder="Search for courses, subjects, tutors..."
                className="flex-1 border-none outline-none text-[.9rem] bg-transparent text-neutral-900 placeholder:text-neutral-400"
              />
              <Button size="sm">Search</Button>
            </div>

            <div className="text-[.78rem] text-neutral-500 flex items-center gap-2 flex-wrap">
              <span className="font-medium">Popular:</span>
              {popularTags.map((tag) => (
                <Link
                  key={tag}
                  href="/courses"
                  className="px-3 py-[3px] rounded-full bg-white border-[1.5px] border-neutral-200 text-neutral-700 text-xs font-medium hover:border-primary hover:text-primary hover:bg-primary-light transition-all"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <HeroCard />
        </div>
      </div>
    </section>
  );
}

export function StatsBar() {
  const stats = [
    { value: "12K+", label: "Active Students" },
    { value: "840+", label: "Expert Tutors" },
    { value: "3,200+", label: "Courses & Guides" },
    { value: "60+", label: "Subjects" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="border-t-[1.5px] border-neutral-200 bg-white">
      <div className="max-w-[1200px] mx-auto flex items-stretch">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex-1 py-6 px-5 text-center ${
              i < stats.length - 1 ? "border-r-[1.5px] border-neutral-200" : ""
            }`}
          >
            <div className="text-[1.85rem] font-extrabold text-neutral-900 tracking-[-0.03em] leading-none">
              {s.value}
            </div>
            <div className="text-[.78rem] text-neutral-500 mt-1 font-medium">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
