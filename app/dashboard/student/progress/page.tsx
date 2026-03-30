"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import type { CourseProgress, StudentDashboard } from "@/lib/types";

const BAR_COLORS: ("violet" | "orange" | "green")[] = ["violet", "orange", "green"];
const PCT_COLORS = ["text-primary", "text-accent", "text-success", "text-neutral-500"];

export default function StudentProgressPage() {
  const { tokens } = useAuth();
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [dash, setDash] = useState<StudentDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!tokens) return;
    setLoading(true);
    try {
      const [p, d] = await Promise.all([
        apiFetch<CourseProgress[]>("/students/progress/", { token: tokens.access }),
        apiFetch<StudentDashboard>("/students/dashboard/", { token: tokens.access }),
      ]);
      setCourses(p);
      setDash(d);
    } finally {
      setLoading(false);
    }
  }, [tokens]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const completedCount = courses.filter((c) => c.is_complete).length;
  const totalHours = dash?.total_study_hours ?? 0;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">
          My Progress
        </h2>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
        <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-5 text-center">
          <div className="text-2xl font-extrabold text-primary">{courses.length}</div>
          <div className="text-[.78rem] text-neutral-500 mt-1">Courses In Progress</div>
        </div>
        <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-5 text-center">
          <div className="text-2xl font-extrabold text-success">{completedCount}</div>
          <div className="text-[.78rem] text-neutral-500 mt-1">Completed</div>
        </div>
        <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-5 text-center">
          <div className="text-2xl font-extrabold text-accent">{Math.round(totalHours)}h</div>
          <div className="text-[.78rem] text-neutral-500 mt-1">Total Study Hours</div>
        </div>
      </div>

      {/* Course Completion */}
      <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-6">
        <div className="text-[.9rem] font-bold mb-5">Course Completion</div>
        {courses.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-8">
            No enrolled courses yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3.5">
            {courses.map((c, i) => (
              <div key={c.course_id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[.82rem] font-semibold">{c.course_title}</span>
                  <span className={`text-[.78rem] font-bold ${c.is_complete ? "text-success" : PCT_COLORS[i % PCT_COLORS.length]}`}>
                    {c.progress_percentage}%
                  </span>
                </div>
                <ProgressBar
                  value={c.progress_percentage}
                  color={c.is_complete ? "green" : BAR_COLORS[i % BAR_COLORS.length]}
                  className="h-[7px]"
                />
                <div className="text-[.72rem] text-neutral-400 mt-1">
                  {c.completed_modules} of {c.module_count} modules · {c.tutor_name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
