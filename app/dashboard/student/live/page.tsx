"use client";

import { useState } from "react";
import { Video, Play, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const upcoming = [
  {
    day: "MON",
    date: "18",
    title: "Calculus Problem Clinic",
    meta: "Dr. Sarah Osei · 10:00–11:00 AM · Max 80 students",
    colorBg: "bg-violet-50",
    colorBorder: "border-violet-100",
    colorText: "text-primary",
    btnVariant: "primary" as const,
    btnLabel: "Register",
  },
  {
    day: "WED",
    date: "20",
    title: "Quantum States & Wave Functions Q&A",
    meta: "Prof. Kwame Asante · 2:00–3:30 PM · Max 60 students",
    colorBg: "bg-orange-50",
    colorBorder: "border-orange-100",
    colorText: "text-orange-600",
    btnVariant: "accent" as const,
    btnLabel: "Register",
  },
  {
    day: "FRI",
    date: "22",
    title: "Organic Chemistry Mechanisms",
    meta: "Dr. Ama Mensah · 4:00–5:00 PM · Max 100 students",
    colorBg: "bg-green-50",
    colorBorder: "border-emerald-200",
    colorText: "text-green-700",
    btnVariant: "ghost-v" as const,
    btnLabel: "Remind Me",
  },
];

const recordings = [
  {
    title: "Integration Techniques Deep Dive",
    meta: "Dr. Sarah Osei · Nov 11 · 1h 12min",
  },
  {
    title: "Electron Orbitals & Bonding",
    meta: "Dr. Ama Mensah · Nov 8 · 58min",
  },
];

export default function StudentLivePage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">
          Live Classes
        </h2>
      </div>

      {/* Live Now Banner */}
      <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-[20px] p-6 mb-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-[52px] h-[52px] rounded-full bg-red-500/15 border-2 border-red-500/30 flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-red-500/15 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full text-[.7rem] font-bold">
                ● LIVE NOW
              </span>
            </div>
            <div className="text-base font-bold text-white mb-0.5">
              Calculus Problem Clinic — Week 5
            </div>
            <div className="text-[.82rem] text-neutral-400">
              Dr. Sarah Osei · 63 students attending
            </div>
          </div>
        </div>
        <Button variant="accent" size="lg">
          <Video className="w-4 h-4" />
          Join Now
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-neutral-200">
        <button
          className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
            tab === "upcoming"
              ? "border-primary text-primary"
              : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
          onClick={() => setTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
            tab === "past"
              ? "border-primary text-primary"
              : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
          onClick={() => setTab("past")}
        >
          Past Recordings
        </button>
      </div>

      {/* Upcoming */}
      {tab === "upcoming" && (
        <div className="flex flex-col gap-2.5">
          {upcoming.map((cls) => (
            <div
              key={cls.title}
              className="bg-white border-[1.5px] border-neutral-200 rounded-xl px-4 py-3.5 flex items-center gap-4"
            >
              <div
                className={`${cls.colorBg} border-[1.5px] ${cls.colorBorder} rounded-[10px] px-3.5 py-2.5 text-center shrink-0`}
              >
                <div
                  className={`text-[.65rem] font-bold ${cls.colorText} uppercase`}
                >
                  {cls.day}
                </div>
                <div
                  className={`text-[1.2rem] font-extrabold ${cls.colorText} leading-none`}
                >
                  {cls.date}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[.9rem] font-bold">{cls.title}</div>
                <div className="text-[.8rem] text-neutral-500 mt-0.5">
                  {cls.meta}
                </div>
              </div>
              <Button variant={cls.btnVariant} size="sm">
                {cls.btnLabel}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Past Recordings */}
      {tab === "past" && (
        <div className="flex flex-col gap-2.5">
          {recordings.map((rec) => (
            <div
              key={rec.title}
              className="bg-white border-[1.5px] border-neutral-200 rounded-xl px-4 py-3.5 flex items-center gap-4"
            >
              <div className="w-[60px] h-[44px] rounded-lg bg-neutral-200 flex items-center justify-center shrink-0">
                <PlayCircle className="w-6 h-6 text-neutral-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{rec.title}</div>
                <div className="text-[.78rem] text-neutral-500 mt-0.5">
                  {rec.meta}
                </div>
              </div>
              <Button variant="outline-v" size="sm">
                <Play className="w-3 h-3" />
                Watch
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
