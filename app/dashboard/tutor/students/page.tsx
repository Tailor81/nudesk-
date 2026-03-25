import { Search } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";

const students = [
  { initials: "AK", name: "Amara Kofi", email: "amara@example.com", course: "Advanced Calculus I", progress: 42, enrolled: "Oct 12", rating: "5★", color: "bg-violet-600" },
  { initials: "ZM", name: "Zanele Mokoena", email: "zanele@example.com", course: "Linear Algebra", progress: 78, enrolled: "Sep 28", rating: "5★", color: "bg-green-600" },
  { initials: "OM", name: "Olumide Martins", email: "olumide@example.com", course: "Probability & Stats", progress: 90, enrolled: "Nov 1", rating: "4★", color: "bg-orange-500" },
  { initials: "KA", name: "Kwabena Appiah", email: "kwabena@example.com", course: "Advanced Calculus I", progress: 15, enrolled: "Nov 8", rating: null, color: "bg-amber-500" },
];

export default function TutorStudentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">My Students</h2>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {/* Search bar */}
        <div className="px-4 py-3.5 border-b-[1.5px] border-neutral-200">
          <div className="relative max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              className="w-full h-[34px] pl-[34px] pr-3 text-[.82rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
              placeholder="Search students…"
            />
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Student</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Course</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Progress</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Enrolled</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Rating Given</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.name} className="border-b border-neutral-100 last:border-b-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${s.color} text-white flex items-center justify-center text-[.65rem] font-bold shrink-0`}>
                      {s.initials}
                    </div>
                    <div>
                      <div className="text-[.875rem] font-semibold">{s.name}</div>
                      <div className="text-[.72rem] text-neutral-500">{s.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[.82rem]">{s.course}</td>
                <td className="px-4 py-3">
                  <div className="w-[120px]">
                    <ProgressBar value={s.progress} color={s.progress >= 90 ? "orange" : "violet"} className="mb-1 h-[5px]" />
                    <span className="text-[.72rem] text-neutral-500">{s.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[.82rem] text-neutral-500">{s.enrolled}</td>
                <td className="px-4 py-3">
                  {s.rating ? (
                    <span className="text-amber-500 font-bold text-[.875rem]">{s.rating}</span>
                  ) : (
                    <span className="text-neutral-500 text-[.82rem]">No rating yet</span>
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
