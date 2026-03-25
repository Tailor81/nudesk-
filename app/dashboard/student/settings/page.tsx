"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function StudentSettingsPage() {
  const [notifications, setNotifications] = useState({
    liveReminders: true,
    newCourse: true,
    weeklyReport: false,
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">
          Account Settings
        </h2>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-4">
        {/* Left column */}
        <div className="flex flex-col gap-3.5">
          {/* Profile */}
          <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-6">
            <div className="text-[.9rem] font-bold mb-5">
              Profile Information
            </div>
            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[.8rem] font-semibold text-neutral-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-[10px] text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    defaultValue="Amara"
                  />
                </div>
                <div>
                  <label className="block text-[.8rem] font-semibold text-neutral-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-[10px] text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    defaultValue="Kofi"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[.8rem] font-semibold text-neutral-700 mb-1.5">
                  Email
                </label>
                <input
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-[10px] text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  defaultValue="amara@example.com"
                />
              </div>
              <div>
                <label className="block text-[.8rem] font-semibold text-neutral-700 mb-1.5">
                  Bio
                </label>
                <textarea
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-[10px] text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-y min-h-[88px] leading-[1.6]"
                  rows={3}
                  defaultValue="Computer Science student passionate about mathematics and algorithms."
                />
              </div>
              <div>
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-6">
            <div className="text-[.9rem] font-bold mb-5">Change Password</div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-[.8rem] font-semibold text-neutral-700 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-[10px] text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-[.8rem] font-semibold text-neutral-700 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-[10px] text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <Button variant="secondary">Update Password</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3.5">
          {/* Current Plan */}
          <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-6">
            <div className="text-[.9rem] font-bold mb-1">Current Plan</div>
            <div className="text-[.8rem] text-neutral-500 mb-4">
              NuDesk Plus
            </div>
            <div className="bg-gradient-to-br from-violet-600 to-violet-900 rounded-xl p-4 text-white mb-3.5">
              <div className="text-[.7rem] font-bold opacity-60 uppercase tracking-[0.08em] mb-1">
                Plus Plan
              </div>
              <div className="text-2xl font-extrabold">
                $19
                <span className="text-sm opacity-60">/mo</span>
              </div>
              <div className="text-[.78rem] opacity-60 mt-1">
                Renews Jan 15, 2026
              </div>
            </div>
            <Button variant="outline-v" className="w-full">
              Upgrade to Pro
            </Button>
          </div>

          {/* Notifications */}
          <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-6">
            <div className="text-[.9rem] font-bold mb-4">Notifications</div>
            <div className="flex flex-col gap-3.5">
              {[
                {
                  label: "Live class reminders",
                  key: "liveReminders" as const,
                },
                {
                  label: "New course notifications",
                  key: "newCourse" as const,
                },
                {
                  label: "Weekly progress report",
                  key: "weeklyReport" as const,
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <span className="text-[.85rem]">{item.label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifications[item.key]}
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key],
                      }))
                    }
                    className={`relative w-10 h-[22px] rounded-full transition-colors ${
                      notifications[item.key]
                        ? "bg-primary"
                        : "bg-neutral-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full transition-transform ${
                        notifications[item.key]
                          ? "translate-x-[18px]"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
