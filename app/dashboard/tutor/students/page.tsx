"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Clock,
  Search,
  Star,
  UserMinus,
  X,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal, ModalHead, ModalBody } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { TutorStudent, TutorStudentDetail } from "@/lib/types";

const AVATAR_COLORS: Array<"violet" | "orange" | "green" | "yellow" | "blue"> =
  ["violet", "orange", "green", "yellow", "blue"];

function avatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function initials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function TutorStudentsPage() {
  const { tokens } = useAuth();
  const toast = useToast();

  const [students, setStudents] = useState<TutorStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // detail drawer
  const [selected, setSelected] = useState<TutorStudentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // unenroll confirm modal
  const [unenrollTarget, setUnenrollTarget] = useState<{
    studentId: number;
    courseSlug: string;
    courseTitle: string;
    studentName: string;
  } | null>(null);
  const [unenrolling, setUnenrolling] = useState(false);

  const fetchStudents = useCallback(
    async (q = "") => {
      if (!tokens) return;
      setLoading(true);
      try {
        const params = q ? `?search=${encodeURIComponent(q)}` : "";
        const data = await apiFetch<TutorStudent[]>(`/tutors/students/${params}`, {
          token: tokens.access,
        });
        setStudents(data);
      } catch {
        toast.error("Failed to load students.");
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tokens]
  );

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchStudents(search), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function openDetail(studentId: number) {
    if (!tokens) return;
    setDetailLoading(true);
    setSelected(null);
    try {
      const data = await apiFetch<TutorStudentDetail>(
        `/tutors/students/${studentId}/`,
        { token: tokens.access }
      );
      setSelected(data);
    } catch {
      toast.error("Failed to load student details.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function confirmUnenroll() {
    if (!tokens || !unenrollTarget) return;
    setUnenrolling(true);
    try {
      await apiFetch(
        `/tutors/students/${unenrollTarget.studentId}/unenroll/${unenrollTarget.courseSlug}/`,
        { method: "DELETE", token: tokens.access }
      );
      toast.success(
        `${unenrollTarget.studentName} removed from "${unenrollTarget.courseTitle}".`
      );
      setUnenrollTarget(null);
      // Remove from list + close detail panel if that was the only course
      setStudents((prev) =>
        prev.filter(
          (s) =>
            !(
              s.student_id === unenrollTarget.studentId &&
              s.course_slug === unenrollTarget.courseSlug
            )
        )
      );
      if (selected && selected.student_id === unenrollTarget.studentId) {
        const remaining = selected.courses.filter(
          (c) => c.course_slug !== unenrollTarget.courseSlug
        );
        if (remaining.length === 0) {
          setSelected(null);
        } else {
          setSelected({ ...selected, courses: remaining });
        }
      }
    } catch (e) {
      toast.error(
        e instanceof ApiError
          ? String((e.body as Record<string, string>).detail ?? "Failed.")
          : "Failed to remove student."
      );
    } finally {
      setUnenrolling(false);
    }
  }

  // unique students for the summary row
  const uniqueStudentCount = useMemo(
    () => new Set(students.map((s) => s.student_id)).size,
    [students]
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">My Students</h2>
          {!loading && (
            <p className="text-[.8rem] text-neutral-500 mt-0.5">
              {uniqueStudentCount} student{uniqueStudentCount !== 1 ? "s" : ""} ·{" "}
              {students.length} enrollment{students.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-5 items-start">
        {/* Main table */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {/* Search */}
          <div className="px-4 py-3.5 border-b-[1.5px] border-neutral-200">
            <div className="relative max-w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                className="w-full h-[34px] pl-[34px] pr-3 text-[.82rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 placeholder:text-neutral-400"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <svg
                className="animate-spin w-6 h-6 text-violet-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-neutral-400">
                {search ? "No students match your search." : "No students enrolled yet."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Student</th>
                  <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Course</th>
                  <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Progress</th>
                  <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Enrolled</th>
                  <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Rating</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr
                    key={`${s.student_id}-${s.course_slug}`}
                    className={`border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 transition-colors cursor-pointer ${
                      selected?.student_id === s.student_id ? "bg-violet-50/60" : ""
                    }`}
                    onClick={() => openDetail(s.student_id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          initials={initials(s.student_name)}
                          size="sm"
                          color={avatarColor(s.student_id + i)}
                        />
                        <div>
                          <div className="text-[.875rem] font-semibold">{s.student_name}</div>
                          <div className="text-[.72rem] text-neutral-500">{s.student_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[.82rem] text-neutral-700 max-w-[180px]">
                      <span className="line-clamp-1">{s.course_title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-[110px]">
                        <ProgressBar
                          value={s.progress_percentage}
                          color={s.progress_percentage >= 90 ? "orange" : "violet"}
                          className="mb-1 h-[5px]"
                        />
                        <span className="text-[.72rem] text-neutral-500">{s.progress_percentage}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[.82rem] text-neutral-500 whitespace-nowrap">
                      {formatDate(s.enrolled_at, { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      {s.rating != null ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-[.82rem] font-semibold text-amber-600">{s.rating}</span>
                        </div>
                      ) : (
                        <span className="text-[.78rem] text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight className="w-4 h-4 text-neutral-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail side panel */}
        {(detailLoading || selected) && (
          <div className="w-[340px] shrink-0 bg-white rounded-2xl border border-neutral-200 overflow-hidden sticky top-6">
            {/* Panel header */}
            <div className="px-4 py-3.5 border-b border-neutral-200 flex items-center justify-between">
              <span className="text-[.875rem] font-bold">Student Detail</span>
              <button
                onClick={() => setSelected(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center py-12">
                <svg
                  className="animate-spin w-5 h-5 text-violet-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
              </div>
            ) : selected ? (
              <div className="p-4 flex flex-col gap-4 max-h-[calc(100vh-180px)] overflow-y-auto">
                {/* Student identity */}
                <div className="flex items-center gap-3">
                  <Avatar
                    initials={initials(selected.student_name)}
                    size="md"
                    color={avatarColor(selected.student_id)}
                  />
                  <div>
                    <div className="font-bold text-[.9rem]">{selected.student_name}</div>
                    <div className="text-[.75rem] text-neutral-500">{selected.student_email}</div>
                  </div>
                </div>

                <div className="h-px bg-neutral-100" />

                {/* Per-course breakdown */}
                {selected.courses.map((course) => (
                  <div key={course.course_slug} className="flex flex-col gap-2">
                    {/* Course header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-[.82rem] font-bold line-clamp-2">{course.course_title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          {course.completed_at ? (
                            <Badge variant="green">Completed</Badge>
                          ) : (
                            <Badge variant="violet">{course.progress_percentage}% done</Badge>
                          )}
                          <span className="text-[.7rem] text-neutral-400">
                            Enrolled {formatDate(course.enrolled_at, { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setUnenrollTarget({
                            studentId: selected.student_id,
                            courseSlug: course.course_slug,
                            courseTitle: course.course_title,
                            studentName: selected.student_name,
                          })
                        }
                        title="Remove from course"
                        className="shrink-0 p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Progress bar */}
                    <ProgressBar
                      value={course.progress_percentage}
                      color={course.progress_percentage >= 90 ? "orange" : "violet"}
                      className="h-[5px]"
                    />

                    {/* Module list */}
                    {course.modules.length > 0 && (
                      <div className="mt-1 flex flex-col gap-1">
                        {course.modules.map((m) => (
                          <div
                            key={m.module_id}
                            className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-neutral-50"
                          >
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                m.is_completed
                                  ? "bg-green-100"
                                  : "bg-neutral-200"
                              }`}
                            >
                              {m.is_completed ? (
                                <Check className="w-2.5 h-2.5 text-green-600" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                              )}
                            </div>
                            <span
                              className={`text-[.75rem] flex-1 line-clamp-1 ${
                                m.is_completed ? "text-neutral-700" : "text-neutral-400"
                              }`}
                            >
                              {m.module_title}
                            </span>
                            {m.time_spent_minutes > 0 && (
                              <span className="text-[.68rem] text-neutral-400 flex items-center gap-0.5 shrink-0">
                                <Clock className="w-2.5 h-2.5" />
                                {m.time_spent_minutes}m
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {selected.courses.indexOf(course) < selected.courses.length - 1 && (
                      <div className="h-px bg-neutral-100 mt-1" />
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Unenroll confirm modal */}
      <Modal open={!!unenrollTarget} onClose={() => setUnenrollTarget(null)} size="sm">
        <ModalHead
          title="Remove Student"
          subtitle="This will delete their enrollment and all progress data."
          onClose={() => setUnenrollTarget(null)}
        />
        <ModalBody>
          {unenrollTarget && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-neutral-600">
                Are you sure you want to remove{" "}
                <span className="font-semibold">{unenrollTarget.studentName}</span> from{" "}
                <span className="font-semibold">&ldquo;{unenrollTarget.courseTitle}&rdquo;</span>?
                Their progress and any module completions will be permanently deleted.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={unenrolling}
                  onClick={() => setUnenrollTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  loading={unenrolling}
                  onClick={confirmUnenroll}
                >
                  Remove Student
                </Button>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}

