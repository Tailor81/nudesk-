import {
  PlayCircle,
  Flame,
  Award,
  Clock,
  CheckCircle2,
  Video,
  Download,
  Play,
} from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  {
    icon: PlayCircle,
    iconBg: "bg-violet-50 text-primary",
    value: "7",
    label: "Enrolled Courses",
    change: "↑ 2 this month",
    badge: "Active",
  },
  {
    icon: Flame,
    iconBg: "bg-orange-50 text-accent",
    value: "12 🔥",
    label: "Day Streak",
    change: "↑ Personal best",
  },
  {
    icon: Award,
    iconBg: "bg-green-50 text-success",
    value: "3",
    label: "Certificates Earned",
    change: "↑ 1 this month",
  },
  {
    icon: Clock,
    iconBg: "bg-amber-50 text-amber-600",
    value: "48h",
    label: "Study Hours",
    change: "↑ 8h this week",
  },
];

const continueLearning = [
  {
    emoji: "📐",
    title: "Advanced Calculus I",
    pct: 42,
    color: "violet" as const,
    gradient: "from-violet-50 to-violet-100",
    meta: "Module 5 of 12 · 42% complete",
    btnVariant: "primary" as const,
  },
  {
    emoji: "⚛️",
    title: "Quantum Physics Foundations",
    pct: 53,
    color: "orange" as const,
    gradient: "from-orange-50 to-orange-100",
    meta: "Module 8 of 15 · 53% complete",
    btnVariant: "accent" as const,
  },
  {
    emoji: "💻",
    title: "Data Structures & Algorithms",
    pct: 20,
    color: "green" as const,
    gradient: "from-green-50 to-emerald-100",
    meta: "Module 2 of 10 · 20% complete",
    btnVariant: "ghost-v" as const,
  },
];

const upcomingClasses = [
  {
    day: "Mon",
    date: "18",
    title: "Calculus Problem Clinic",
    meta: "Dr. Sarah Osei · 10:00 AM",
    colorBg: "bg-violet-50",
    colorBorder: "border-violet-100",
    colorText: "text-primary",
  },
  {
    day: "Wed",
    date: "20",
    title: "Quantum States Q&A",
    meta: "Prof. Kwame Asante · 2:00 PM",
    colorBg: "bg-orange-50",
    colorBorder: "border-orange-100",
    colorText: "text-orange-600",
  },
];

const activities = [
  {
    icon: CheckCircle2,
    iconBg: "bg-green-50 text-success",
    title: "Completed Module 4",
    meta: "Calculus I · 2h ago",
  },
  {
    icon: Video,
    iconBg: "bg-violet-50 text-primary",
    title: "Attended Live Session",
    meta: "Quantum Physics · Yesterday",
  },
  {
    icon: Download,
    iconBg: "bg-orange-50 text-accent",
    title: "Downloaded Study Guide",
    meta: "Organic Chemistry · 3 days ago",
  },
];

export default function StudentOverviewPage() {
  return (
    <div>
      {/* Greeting */}
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">
          Good morning, Amara 👋
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          You&apos;re on a 12-day learning streak. Keep it up!
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3.5 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-[22px]"
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg}`}
              >
                <s.icon className="w-4 h-4" />
              </div>
              {s.badge && <Badge variant="violet">{s.badge}</Badge>}
            </div>
            <div className="text-[1.5rem] font-extrabold text-neutral-900 tracking-tight">
              {s.value}
            </div>
            <div className="text-[.78rem] text-neutral-500 mt-0.5">
              {s.label}
            </div>
            <div className="text-[.72rem] text-success font-semibold mt-1.5">
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Continue Learning + Sidebar */}
      <div className="grid grid-cols-[1fr_300px] gap-4">
        {/* Continue Learning */}
        <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[.95rem] font-bold">Continue Learning</div>
            <Button variant="ghost-v" size="sm" href="/dashboard/student/courses">
              See all →
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {continueLearning.map((c) => (
              <div
                key={c.title}
                className="bg-neutral-50 border-[1.5px] border-neutral-200 rounded-xl px-4 py-3.5 flex items-center gap-3 hover:border-violet-200 hover:shadow-xl hover:-translate-y-[3px] transition-all cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-[10px] bg-gradient-to-br ${c.gradient} flex items-center justify-center text-[1.4rem] shrink-0`}
                >
                  {c.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold mb-1.5 truncate">
                    {c.title}
                  </div>
                  <ProgressBar value={c.pct} color={c.color} />
                  <div className="text-[.72rem] text-neutral-500 mt-1">
                    {c.meta}
                  </div>
                </div>
                <Button variant={c.btnVariant} size="sm">
                  <Play className="w-3 h-3" />
                  Resume
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3.5">
          {/* Upcoming Live Classes */}
          <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-5">
            <div className="text-[.9rem] font-bold mb-3.5">
              Upcoming Live Classes
            </div>
            <div className="flex flex-col gap-3">
              {upcomingClasses.map((cls) => (
                <div key={cls.title} className="flex items-start gap-3">
                  <div
                    className={`${cls.colorBg} border-[1.5px] ${cls.colorBorder} rounded-lg px-2.5 py-1.5 text-center shrink-0 min-w-[44px]`}
                  >
                    <div
                      className={`text-[.65rem] font-bold ${cls.colorText} uppercase`}
                    >
                      {cls.day}
                    </div>
                    <div
                      className={`text-[1.1rem] font-extrabold ${cls.colorText} leading-none`}
                    >
                      {cls.date}
                    </div>
                  </div>
                  <div>
                    <div className="text-[.82rem] font-semibold">
                      {cls.title}
                    </div>
                    <div className="text-[.73rem] text-neutral-500 mt-0.5">
                      {cls.meta}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-5">
            <div className="text-[.9rem] font-bold mb-3.5">Recent Activity</div>
            <div className="flex flex-col gap-2.5">
              {activities.map((a) => (
                <div key={a.title} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.iconBg}`}
                  >
                    <a.icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[.8rem] font-semibold">{a.title}</div>
                    <div className="text-[.72rem] text-neutral-500">
                      {a.meta}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
