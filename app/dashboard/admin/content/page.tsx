import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const courses = [
  { name: "Differential Equations I", tutor: "Dr. Sarah Osei", tutorInitials: "SO", tutorColor: "bg-violet-600", category: "Mathematics", categoryColor: "violet" as const, modules: "9 modules", submitted: "Nov 12" },
  { name: "Electromagnetism Fundamentals", tutor: "Prof. Kwame Asante", tutorInitials: "KA", tutorColor: "bg-orange-500", category: "Physics", categoryColor: "orange" as const, modules: "11 modules", submitted: "Nov 11" },
  { name: "Inorganic Chemistry II", tutor: "Dr. Ama Mensah", tutorInitials: "AM", tutorColor: "bg-green-600", category: "Chemistry", categoryColor: "green" as const, modules: "7 modules", submitted: "Nov 10" },
  { name: "Microeconomics Advanced", tutor: "Prof. Abena Wiredu", tutorInitials: "AW", tutorColor: "bg-amber-500", category: "Economics", categoryColor: "green" as const, modules: "8 modules", submitted: "Nov 9" },
];

export default function AdminContentPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">Content Review</h2>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Course</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Tutor</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Category</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Modules</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Submitted</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.name} className="border-b border-neutral-100 last:border-b-0">
                <td className="px-4 py-3 text-[.875rem] font-semibold">{c.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full ${c.tutorColor} text-white flex items-center justify-center text-[.6rem] font-bold shrink-0`}>
                      {c.tutorInitials}
                    </div>
                    <span className="text-[.82rem]">{c.tutor}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant={c.categoryColor}>{c.category}</Badge></td>
                <td className="px-4 py-3 text-[.82rem]">{c.modules}</td>
                <td className="px-4 py-3 text-[.78rem] text-neutral-500">{c.submitted}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button variant="success-ghost" size="sm">Approve</Button>
                    <Button variant="danger-ghost" size="sm">Reject</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
