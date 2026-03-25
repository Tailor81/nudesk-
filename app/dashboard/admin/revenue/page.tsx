import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: "💰", label: "GMV Nov", value: "$142K", change: "↑ 18%", color: "bg-violet-50" },
  { icon: "💸", label: "Platform Commission (10%)", value: "$14.2K", change: "↑ 18%", color: "bg-orange-50" },
  { icon: "📈", label: "YTD GMV", value: "$1.24M", change: "↑ 31% YoY", color: "bg-green-50" },
  { icon: "👤", label: "Avg Revenue / User", value: "$11.05", change: "↑ 5%", color: "bg-amber-50" },
];

const months = [
  { period: "November 2025", gmv: "$142,400", platform: "$14,240", payouts: "$128,160", students: "+420", growth: "↑ 18%", highlight: true },
  { period: "October 2025", gmv: "$120,700", platform: "$12,070", payouts: "$108,630", students: "+380", growth: "↑ 8%", highlight: false },
  { period: "September 2025", gmv: "$111,800", platform: "$11,180", payouts: "$100,620", students: "+310", growth: "↑ 14%", highlight: false },
  { period: "August 2025", gmv: "$97,900", platform: "$9,790", payouts: "$88,110", students: "+290", growth: "↑ 7%", highlight: false },
];

export default function AdminRevenuePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">Revenue</h2>
        <Button variant="secondary" size="sm">Export</Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3.5 mb-5">
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

      {/* Revenue Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-4 py-4 border-b-[1.5px] border-neutral-200 text-[.875rem] font-bold">
          Monthly Revenue Breakdown
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Month</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">GMV</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Platform (10%)</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Tutor Payouts</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">New Students</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Growth</th>
            </tr>
          </thead>
          <tbody>
            {months.map((m) => (
              <tr key={m.period} className="border-b border-neutral-100 last:border-b-0">
                <td className="px-4 py-3 text-[.875rem] font-semibold">{m.period}</td>
                <td className={`px-4 py-3 text-[.875rem] font-bold ${m.highlight ? "text-violet-600" : ""}`}>{m.gmv}</td>
                <td className="px-4 py-3 text-[.875rem]">{m.platform}</td>
                <td className="px-4 py-3 text-[.875rem]">{m.payouts}</td>
                <td className="px-4 py-3 text-[.875rem]">{m.students}</td>
                <td className="px-4 py-3">
                  <span className="text-[.72rem] font-semibold text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                    {m.growth}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
