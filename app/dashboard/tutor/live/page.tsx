import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const sessions = [
  { name: "Calculus Clinic W5", date: "Today · 10:00 AM", registered: 63, status: "live" as const },
  { name: "Integration Techniques W6", date: "Nov 18 · 10:00 AM", registered: 48, status: "scheduled" as const },
  { name: "Series & Sequences W7", date: "Nov 25 · 10:00 AM", registered: 31, status: "scheduled" as const },
];

export default function TutorLivePage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">Live Classes</h2>
        <Button variant="primary" size="sm">+ Schedule New</Button>
      </div>

      {/* Live Now Banner */}
      <div
        className="rounded-2xl p-6 mb-5 flex items-center justify-between flex-wrap gap-4"
        style={{ background: "linear-gradient(135deg, var(--color-violet-600), var(--color-violet-900))" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-[.7rem] font-bold text-red-300 bg-red-500/20 border border-red-500/30 rounded-full px-2.5 py-0.5">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
              LIVE NOW
            </span>
          </div>
          <div className="text-base font-bold text-white mb-1">Calculus Problem Clinic — Week 5</div>
          <div className="text-[.82rem] text-white/60">63 students attending · Started 8 min ago</div>
        </div>
        <Button variant="accent" size="lg">Manage Session</Button>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Session</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Date & Time</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Registered</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.name} className="border-b border-neutral-100 last:border-b-0">
                <td className="px-4 py-3 text-[.875rem] font-semibold">{s.name}</td>
                <td className="px-4 py-3 text-[.82rem]">{s.date}</td>
                <td className="px-4 py-3 text-[.82rem]">{s.registered}</td>
                <td className="px-4 py-3">
                  {s.status === "live" ? (
                    <Badge variant="red">
                      <span className="inline-block w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse mr-1" />
                      Live
                    </Badge>
                  ) : (
                    <Badge variant="violet">Scheduled</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  {s.status === "live" ? (
                    <Button variant="primary" size="sm">Manage</Button>
                  ) : (
                    <Button variant="secondary" size="sm">Edit</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
