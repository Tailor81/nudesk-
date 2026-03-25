"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const admins = [
  { initials: "AD", name: "Platform Admin", email: "admin@nudesk.app", role: "Super Admin", roleColor: "neutral" as const, lastActive: "Now", color: "bg-neutral-800", canDelete: false },
  { initials: "MO", name: "Miriam Owusu", email: "miriam@nudesk.app", role: "Content Mod", roleColor: "violet" as const, lastActive: "2 hours ago", color: "bg-violet-600", canDelete: true },
];

export default function AdminSettingsPage() {
  const [registrations, setRegistrations] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">Platform Settings</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* General */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="text-[.9rem] font-bold mb-5">General</div>
          <div className="flex flex-col gap-3.5">
            <div>
              <label className="block text-[.72rem] font-bold uppercase tracking-[0.07em] text-neutral-500 mb-1.5">
                Platform Name
              </label>
              <input
                className="w-full h-10 px-3 text-[.875rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                defaultValue="NuDesk"
              />
            </div>
            <div>
              <label className="block text-[.72rem] font-bold uppercase tracking-[0.07em] text-neutral-500 mb-1.5">
                Support Email
              </label>
              <input
                className="w-full h-10 px-3 text-[.875rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                defaultValue="support@nudesk.app"
              />
            </div>

            {/* Toggle: New Registrations */}
            <div className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
              <div>
                <div className="text-[.875rem] font-semibold">New Registrations</div>
                <div className="text-[.75rem] text-neutral-500">Allow new users to sign up</div>
              </div>
              <button
                type="button"
                onClick={() => setRegistrations(!registrations)}
                className={`relative w-10 h-[22px] rounded-full transition-colors ${registrations ? "bg-violet-600" : "bg-neutral-300"}`}
              >
                <span
                  className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] bg-white rounded-full transition-transform ${registrations ? "translate-x-[18px]" : ""}`}
                />
              </button>
            </div>

            {/* Toggle: Maintenance */}
            <div className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
              <div>
                <div className="text-[.875rem] font-semibold">Maintenance Mode</div>
                <div className="text-[.75rem] text-neutral-500">Temporarily disable the platform</div>
              </div>
              <button
                type="button"
                onClick={() => setMaintenance(!maintenance)}
                className={`relative w-10 h-[22px] rounded-full transition-colors ${maintenance ? "bg-violet-600" : "bg-neutral-300"}`}
              >
                <span
                  className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] bg-white rounded-full transition-transform ${maintenance ? "translate-x-[18px]" : ""}`}
                />
              </button>
            </div>

            <Button variant="primary">Save Settings</Button>
          </div>
        </div>

        {/* Commission & Payments */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="text-[.9rem] font-bold mb-5">Commission &amp; Payments</div>
          <div className="flex flex-col gap-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[.72rem] font-bold uppercase tracking-[0.07em] text-neutral-500 mb-1.5">
                  Standard Rev Share (%)
                </label>
                <input
                  className="w-full h-10 px-3 text-[.875rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                  defaultValue="80"
                />
              </div>
              <div>
                <label className="block text-[.72rem] font-bold uppercase tracking-[0.07em] text-neutral-500 mb-1.5">
                  Pro Rev Share (%)
                </label>
                <input
                  className="w-full h-10 px-3 text-[.875rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                  defaultValue="90"
                />
              </div>
            </div>
            <div>
              <label className="block text-[.72rem] font-bold uppercase tracking-[0.07em] text-neutral-500 mb-1.5">
                Payout Day
              </label>
              <select className="w-full h-10 px-3 text-[.875rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10">
                <option>1st of month</option>
                <option>15th of month</option>
              </select>
            </div>

            {/* Commission highlight */}
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <div className="text-[.82rem] font-semibold mb-0.5">Current Commission Rate</div>
              <div className="text-[1.3rem] font-extrabold text-violet-600">
                10% <span className="text-[.8rem] font-medium text-neutral-500">of GMV</span>
              </div>
            </div>

            <Button variant="secondary">Update Settings</Button>
          </div>
        </div>

        {/* Admin Users — full width */}
        <div className="col-span-2 bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[.9rem] font-bold">Admin Users</div>
            <Button variant="outline-v" size="sm">Invite Admin</Button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Admin</th>
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Email</th>
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Role</th>
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Last Active</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.email} className="border-b border-neutral-100 last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${a.color} text-white flex items-center justify-center text-[.65rem] font-bold shrink-0`}>
                        {a.initials}
                      </div>
                      <div className="text-[.875rem] font-semibold">{a.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[.82rem]">{a.email}</td>
                  <td className="px-4 py-3"><Badge variant={a.roleColor}>{a.role}</Badge></td>
                  <td className="px-4 py-3 text-[.78rem] text-neutral-500">{a.lastActive}</td>
                  <td className="px-4 py-3">
                    {a.canDelete && <Button variant="danger-ghost" size="sm">Remove</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
