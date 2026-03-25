import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const stats = [
  { icon: "💰", label: "GMV This Month", value: "$142K", change: "↑ 18% MoM", color: "bg-violet-50" },
  { icon: "👥", label: "Active Students", value: "12,840", change: "↑ 420 this month", color: "bg-orange-50" },
  { icon: "⭐", label: "Active Tutors", value: "840", change: "↑ 12 approved", color: "bg-green-50" },
  { icon: "▶️", label: "Published Courses", value: "3,248", change: "↑ 47 this month", color: "bg-amber-50" },
];

const revenueData = [
  { month: "Jun", amount: "$98K", height: "52%" },
  { month: "Jul", amount: "$108K", height: "58%" },
  { month: "Aug", amount: "$102K", height: "55%" },
  { month: "Sep", amount: "$116K", height: "62%" },
  { month: "Oct", amount: "$121K", height: "65%" },
  { month: "Nov", amount: "$142K", height: "76%", highlight: true },
];

const actions = [
  { icon: "📋", title: "Tutor Applications", desc: "4 awaiting review", badge: "4", badgeColor: "red" as const, href: "/dashboard/admin/applications" },
  { icon: "📚", title: "Content Reviews", desc: "7 courses pending approval", badge: "7", badgeColor: "orange" as const, href: "/dashboard/admin/content" },
  { icon: "🚩", title: "Flagged Content", desc: "2 reports to review", badge: "2", badgeColor: "red" as const, href: "/dashboard/admin/users" },
  { icon: "✅", title: "Payouts Processed", desc: "All Nov payouts sent", badge: null, badgeColor: "green" as const, href: null },
];

export default function AdminOverviewPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">Platform Overview</h2>
        <p className="text-[.875rem] text-neutral-500 mt-1">November 2025 · Real-time data</p>
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

      {/* Revenue chart + Pending actions */}
      <div className="grid grid-cols-[1fr_320px] gap-4">
        {/* Revenue */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[.9rem] font-bold">Platform Revenue (GMV)</div>
            <Badge variant="violet">+18% MoM</Badge>
          </div>
          <div className="flex items-end gap-3 h-[150px]">
            {revenueData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="text-[.65rem] font-semibold text-neutral-500"
                  style={d.highlight ? { color: "var(--color-violet-600)", fontWeight: 700 } : undefined}
                >
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
                <div
                  className="text-[.7rem] font-medium text-neutral-500"
                  style={d.highlight ? { color: "var(--color-violet-600)", fontWeight: 700 } : undefined}
                >
                  {d.month}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4">
          <div className="text-[.9rem] font-bold mb-3.5">Pending Actions</div>
          <div className="flex flex-col gap-2.5">
            {actions.map((a) => {
              const inner = (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-base shrink-0">
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[.82rem] font-semibold">{a.title}</div>
                    <div className="text-[.73rem] text-neutral-500">{a.desc}</div>
                  </div>
                  {a.badge && <Badge variant={a.badgeColor}>{a.badge}</Badge>}
                </div>
              );
              return a.href ? (
                <Link key={a.title} href={a.href} className="no-underline text-inherit">
                  {inner}
                </Link>
              ) : (
                <div key={a.title}>{inner}</div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
