"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Tab = "courses" | "live" | "guides";

const courses = [
  { emoji: "📐", name: "Advanced Calculus I", modules: "12 modules", students: 148, rating: "4.9★", revenue: "$1,820", status: "Published", bg: "bg-violet-50" },
  { emoji: "🔢", name: "Linear Algebra", modules: "10 modules", students: 92, rating: "4.9★", revenue: "$980", status: "Published", bg: "bg-blue-50" },
  { emoji: "📊", name: "Probability & Stats", modules: "8 modules", students: 80, rating: "4.8★", revenue: "$720", status: "Published", bg: "bg-amber-50" },
  { emoji: "🧮", name: "Differential Equations", modules: "In progress", students: null, rating: null, revenue: null, status: "Draft", bg: "bg-neutral-100" },
];

const liveSessions = [
  { name: "Calculus Problem Clinic — W5", date: "Today · 10:00 AM", students: "63 registered", status: "live" },
  { name: "Integration Techniques — W6", date: "Mon Nov 18 · 10:00 AM", students: "48 registered", status: "scheduled" },
  { name: "Series & Sequences — W7", date: "Mon Nov 25 · 10:00 AM", students: "31 registered", status: "scheduled" },
];

const guides = [
  { name: "Calculus I — Complete Notes", pages: 42, downloads: 834, status: "Published" },
  { name: "Linear Algebra Quick Reference", pages: 28, downloads: 412, status: "Published" },
  { name: "Differential Equations Overview", pages: 15, downloads: null, status: "Draft" },
];

export default function TutorContentPage() {
  const [tab, setTab] = useState<Tab>("courses");

  const tabs: { id: Tab; label: string }[] = [
    { id: "courses", label: "Courses" },
    { id: "live", label: "Live Sessions" },
    { id: "guides", label: "Study Guides" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">My Content</h2>
        <div className="flex gap-2">
          <Button variant="outline-v" size="sm">Schedule Live</Button>
          <Button variant="primary" size="sm">+ New Course</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-neutral-200 mb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-[.85rem] font-semibold border-b-2 transition-colors -mb-px ${
              tab === t.id
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Courses Table */}
      {tab === "courses" && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Course</th>
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Students</th>
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Rating</th>
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Revenue</th>
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.name} className="border-b border-neutral-100 last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center text-base`}>{c.emoji}</div>
                      <div>
                        <div className="text-[.875rem] font-semibold">{c.name}</div>
                        <div className="text-[.75rem] text-neutral-500">{c.modules}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[.875rem] font-semibold">{c.students ?? <span className="text-neutral-400">—</span>}</td>
                  <td className="px-4 py-3">
                    {c.rating ? (
                      <span className="text-amber-500 font-bold">{c.rating}</span>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {c.revenue ? (
                      <span className="font-semibold">{c.revenue}<span className="text-[.72rem] text-neutral-500">/mo</span></span>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={c.status === "Published" ? "green" : "neutral"}>{c.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Live Sessions Table */}
      {tab === "live" && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Session</th>
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Date</th>
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Students</th>
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {liveSessions.map((s) => (
                <tr key={s.name} className="border-b border-neutral-100 last:border-b-0">
                  <td className="px-4 py-3 text-[.875rem] font-semibold">{s.name}</td>
                  <td className="px-4 py-3 text-[.82rem]">{s.date}</td>
                  <td className="px-4 py-3 text-[.82rem]">{s.students}</td>
                  <td className="px-4 py-3">
                    {s.status === "live" ? (
                      <Badge variant="red">
                        <span className="inline-block w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse mr-1" />
                        Live Now
                      </Badge>
                    ) : (
                      <Badge variant="violet">Scheduled</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {s.status === "live" ? (
                      <Button variant="primary" size="sm">Start</Button>
                    ) : (
                      <Button variant="ghost" size="sm">Edit</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Guides Table */}
      {tab === "guides" && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Guide</th>
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Pages</th>
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Downloads</th>
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {guides.map((g) => (
                <tr key={g.name} className="border-b border-neutral-100 last:border-b-0">
                  <td className="px-4 py-3 text-[.875rem] font-semibold">{g.name}</td>
                  <td className="px-4 py-3 text-[.82rem]">{g.pages}</td>
                  <td className="px-4 py-3 text-[.82rem] font-semibold">{g.downloads ?? <span className="text-neutral-400">—</span>}</td>
                  <td className="px-4 py-3">
                    <Badge variant={g.status === "Published" ? "green" : "neutral"}>{g.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
