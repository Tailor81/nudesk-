import { ProgressBar } from "@/components/ui/progress-bar";

const weekDays = [
  { day: "Mon", pct: 40 },
  { day: "Tue", pct: 70 },
  { day: "Wed", pct: 55 },
  { day: "Thu", pct: 90 },
  { day: "Fri", pct: 100 },
  { day: "Sat", pct: 30 },
  { day: "Sun", pct: 20 },
];

const courseProgress = [
  { title: "Advanced Calculus I", pct: 42, color: "violet" as const, pctColor: "text-primary" },
  { title: "Quantum Physics", pct: 53, color: "orange" as const, pctColor: "text-accent" },
  { title: "Organic Chemistry", pct: 100, color: "green" as const, pctColor: "text-success" },
  { title: "Data Structures", pct: 20, color: "violet" as const, pctColor: "text-neutral-500" },
];

export default function StudentProgressPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">
          My Progress
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Weekly Study Hours */}
        <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-6">
          <div className="text-[.9rem] font-bold mb-5">Weekly Study Hours</div>
          <div className="flex items-end gap-3 h-[120px]">
            {weekDays.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full relative" style={{ height: "100%" }}>
                  <div
                    className={`absolute bottom-0 w-full rounded-t-md ${
                      d.pct === 100
                        ? "bg-gradient-to-t from-violet-600 to-orange-400"
                        : "bg-gradient-to-t from-violet-600 to-violet-400"
                    }`}
                    style={{ height: `${d.pct}%` }}
                  />
                </div>
                <span className="text-[.72rem] text-neutral-500 font-medium">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Completion */}
        <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-6">
          <div className="text-[.9rem] font-bold mb-5">Course Completion</div>
          <div className="flex flex-col gap-3.5">
            {courseProgress.map((c) => (
              <div key={c.title}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[.82rem] font-semibold">{c.title}</span>
                  <span className={`text-[.78rem] font-bold ${c.pctColor}`}>
                    {c.pct}%
                  </span>
                </div>
                <ProgressBar value={c.pct} color={c.color} className="h-[7px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
