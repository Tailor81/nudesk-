import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: "📈", label: "This Month", value: "$4,820", change: "↑ 11%", color: "bg-orange-50" },
  { icon: "💵", label: "Year to Date", value: "$42,180", change: "↑ 28% YoY", color: "bg-green-50" },
  { icon: "👛", label: "Pending Payout", value: "$3,856", change: "Dec 1 payout", pending: true, color: "bg-violet-50" },
];

const payouts = [
  { period: "November 2025", gross: "$5,356", fee: "$536", share: "$4,820", status: "Pending" },
  { period: "October 2025", gross: "$4,778", fee: "$478", share: "$4,300", status: "Paid" },
  { period: "September 2025", gross: "$4,222", fee: "$422", share: "$3,800", status: "Paid" },
  { period: "August 2025", gross: "$4,000", fee: "$400", share: "$3,600", status: "Paid" },
];

export default function TutorEarningsPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">Earnings</h2>
        <Button variant="secondary" size="sm">Export</Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3.5 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-neutral-200 p-4">
            <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center text-base mb-2`}>
              {s.icon}
            </div>
            <div className="text-[1.35rem] font-extrabold tracking-tight">{s.value}</div>
            <div className="text-[.75rem] text-neutral-500 mb-1">{s.label}</div>
            <div
              className={`text-[.72rem] font-semibold rounded-full px-2 py-0.5 w-fit ${
                s.pending
                  ? "text-neutral-500 bg-neutral-100"
                  : "text-green-600 bg-green-50"
              }`}
            >
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-4 py-4 border-b-[1.5px] border-neutral-200 text-[.875rem] font-bold">
          Payout History
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Period</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Gross Revenue</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Platform Fee</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Your Share (90%)</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.period} className="border-b border-neutral-100 last:border-b-0">
                <td className="px-4 py-3 text-[.875rem]">{p.period}</td>
                <td className="px-4 py-3 text-[.875rem]">{p.gross}</td>
                <td className="px-4 py-3 text-[.875rem]">{p.fee}</td>
                <td className="px-4 py-3 text-[.875rem] font-bold">{p.share}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.status === "Paid" ? "green" : "violet"}>{p.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
