import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const users = [
  { initials: "AK", name: "Amara Kofi", email: "amara@example.com", role: "Student", roleColor: "violet" as const, plan: "Plus · $19/mo", joined: "Oct 12, 2025", status: "Active", statusColor: "green" as const, color: "bg-violet-600" },
  { initials: "SO", name: "Dr. Sarah Osei", email: "sarah@university.edu", role: "Tutor", roleColor: "orange" as const, plan: "Pro · 90% rev share", joined: "Mar 5, 2024", status: "Active", statusColor: "green" as const, color: "bg-orange-500" },
  { initials: "ZM", name: "Zanele Mokoena", email: "zanele@example.com", role: "Student", roleColor: "violet" as const, plan: "Free", joined: "Nov 3, 2025", status: "Active", statusColor: "green" as const, color: "bg-green-600" },
  { initials: "BK", name: "Bola Kusi", email: "bola@example.com", role: "Student", roleColor: "violet" as const, plan: "Plus · $19/mo", joined: "Aug 22, 2025", status: "Suspended", statusColor: "red" as const, color: "bg-red-200 text-red-700 border-2 border-red-300" },
];

export default function AdminUsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">Users</h2>
        <Button variant="secondary" size="sm">Export CSV</Button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {/* Filters */}
        <div className="px-4 py-3.5 border-b-[1.5px] border-neutral-200 flex gap-2.5 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              className="w-full h-[34px] pl-[34px] pr-3 text-[.82rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
              placeholder="Search users…"
            />
          </div>
          <select className="h-[34px] px-3 text-[.82rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 w-[140px]">
            <option>All Roles</option>
            <option>Students</option>
            <option>Tutors</option>
          </select>
          <select className="h-[34px] px-3 text-[.82rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 w-[140px]">
            <option>All Status</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>
        </div>

        {/* Table */}
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">User</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Role</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Plan / Tier</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Joined</th>
              <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-b border-neutral-100 last:border-b-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${u.color} text-white flex items-center justify-center text-[.65rem] font-bold shrink-0`}>
                      {u.initials}
                    </div>
                    <div>
                      <div className="text-[.875rem] font-semibold">{u.name}</div>
                      <div className="text-[.72rem] text-neutral-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant={u.roleColor}>{u.role}</Badge></td>
                <td className="px-4 py-3 text-[.82rem]">{u.plan}</td>
                <td className="px-4 py-3 text-[.82rem] text-neutral-500">{u.joined}</td>
                <td className="px-4 py-3"><Badge variant={u.statusColor}>{u.status}</Badge></td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
