import { Badge } from "@/components/ui/badge";

const stats = [
  { icon: "💰", label: "Monthly Earnings", value: "$4,820", change: "↑ $480 vs last month", color: "bg-orange-50" },
  { icon: "👥", label: "Active Students", value: "320", change: "↑ 24 new this month", color: "bg-violet-50" },
  { icon: "▶️", label: "Published Courses", value: "18", change: "↑ 2 this month", color: "bg-green-50" },
  { icon: "⭐", label: "Avg Rating", value: "4.9", change: "↑ 0.1 this month", color: "bg-amber-50" },
];

const revenueData = [
  { month: "Jun", amount: "$3.8K", height: "55%" },
  { month: "Jul", amount: "$4.1K", height: "60%" },
  { month: "Aug", amount: "$3.6K", height: "50%" },
  { month: "Sep", amount: "$4.4K", height: "65%" },
  { month: "Oct", amount: "$4.3K", height: "63%" },
  { month: "Nov", amount: "$4.8K", height: "70%", highlight: true },
];

const topCourses = [
  { emoji: "📐", name: "Advanced Calculus I", info: "148 students · $1,820/mo", rating: "4.9★", bg: "bg-violet-50" },
  { emoji: "🔢", name: "Linear Algebra", info: "92 students · $980/mo", rating: "4.9★", bg: "bg-blue-50" },
  { emoji: "📊", name: "Probability & Stats", info: "80 students · $720/mo", rating: "4.8★", bg: "bg-orange-50" },
];

const reviews = [
  { initials: "AK", name: "Amara K.", text: '"Best calculus course I\'ve ever taken"', rating: "5★", color: "bg-violet-600" },
  { initials: "ZM", name: "Zanele M.", text: '"Finally understood integration!"', rating: "5★", color: "bg-green-600" },
];

export default function TutorOverviewPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">
          Welcome back, Dr. Osei 👋
        </h2>
        <p className="text-[.875rem] text-neutral-500 mt-1">
          Here&apos;s how your content is performing this month.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3.5 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-neutral-200 p-4">
            <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center text-base mb-2`}>
              {s.icon}
            </div>
            <div className="text-[1.35rem] font-extrabold tracking-tight">{s.value}</div>
            <div className="text-[.75rem] text-neutral-500 mb-1">{s.label}</div>
            <div className="text-[.72rem] font-semibold text-green-600 bg-green-50 rounded-full px-2 py-0.5 w-fit">
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart + sidebar */}
      <div className="grid grid-cols-[1fr_320px] gap-4">
        {/* Revenue */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[.9rem] font-bold">Monthly Revenue</div>
            <Badge variant="violet">+11% YoY</Badge>
          </div>
          <div className="flex items-end gap-3 h-[140px]">
            {revenueData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[.65rem] font-semibold text-neutral-500" style={d.highlight ? { color: "var(--color-violet-600)", fontWeight: 700 } : undefined}>
                  {d.amount}
                </div>
                <div
                  className="w-full rounded-lg"
                  style={{
                    height: d.height,
                    background: d.highlight
                      ? "linear-gradient(to top, var(--color-violet-600), var(--color-violet-400))"
                      : "var(--color-violet-100)",
                  }}
                />
                <div className="text-[.7rem] font-medium text-neutral-500" style={d.highlight ? { color: "var(--color-violet-600)", fontWeight: 700 } : undefined}>
                  {d.month}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3.5">
          {/* Top Performing */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-4">
            <div className="text-[.9rem] font-bold mb-3.5">Top Performing</div>
            <div className="flex flex-col gap-2.5">
              {topCourses.map((c) => (
                <div key={c.name} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center text-base shrink-0`}>
                    {c.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[.8rem] font-semibold truncate">{c.name}</div>
                    <div className="text-[.72rem] text-neutral-500">{c.info}</div>
                  </div>
                  <Badge variant={c.bg === "bg-orange-50" ? "orange" : "violet"}>{c.rating}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-4">
            <div className="text-[.9rem] font-bold mb-3.5">Recent Reviews</div>
            <div className="flex flex-col">
              {reviews.map((r, i) => (
                <div
                  key={r.name}
                  className={`flex items-center gap-2.5 py-2.5 ${i < reviews.length - 1 ? "border-b border-neutral-200" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full ${r.color} text-white flex items-center justify-center text-[.65rem] font-bold shrink-0`}>
                    {r.initials}
                  </div>
                  <div className="flex-1">
                    <div className="text-[.8rem] font-semibold">{r.name}</div>
                    <div className="text-[.75rem] text-neutral-500">{r.text}</div>
                  </div>
                  <div className="text-[.78rem] text-amber-500 font-bold">{r.rating}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
