"use client";

import { useEffect, useState, useCallback, useRef, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  BookOpen,
  Video,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import type {
  EnrollmentDetail,
  ModuleProgress,
  CourseDetail,
  CourseModule,
  PaginatedResponse,
  Enrollment,
} from "@/lib/types";

const typeIcon: Record<string, React.ElementType> = {
  video: Video,
  reading: FileText,
  document: FileText,
  quiz: BookOpen,
};

export default function CoursePlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <AuthGuard allowedRoles={["student"]}>
      <PlayerInner slug={slug} />
    </AuthGuard>
  );
}

function PlayerInner({ slug }: { slug: string }) {
  const { tokens } = useAuth();
  const toast = useToast();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentDetail | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    if (!tokens?.access) return;
    setLoading(true);
    try {
      // Get course detail
      const courseData = await apiFetch<CourseDetail>(`/courses/${slug}/`);
      setCourse(courseData);

      // Find enrollment for this course
      const enrollments = await apiFetch<PaginatedResponse<Enrollment>>(
        "/students/enrollments/",
        { token: tokens.access }
      );
      const match = enrollments.results.find((e) => e.course_slug === slug);
      if (!match) {
        toast.error("You are not enrolled in this course.");
        return;
      }

      // Get enrollment detail with module progress
      const detail = await apiFetch<EnrollmentDetail>(
        `/students/enrollments/${match.id}/`,
        { token: tokens.access }
      );
      setEnrollment(detail);

      // Set active module: first incomplete, or first module
      const sorted = [...courseData.modules].sort(
        (a, b) => a.order - b.order
      );
      const progressMap = new Map(
        detail.module_progress.map((mp) => [mp.module, mp])
      );
      const firstIncomplete = sorted.find(
        (m) => !progressMap.get(m.id)?.is_completed
      );
      setActiveModuleId(firstIncomplete?.id ?? sorted[0]?.id ?? null);
    } catch {
      toast.error("Failed to load course.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Time heartbeat — sends 1 minute every 60s
  useEffect(() => {
    if (!enrollment || !activeModuleId || !tokens?.access) return;
    heartbeatRef.current = setInterval(async () => {
      try {
        await apiFetch(
          `/students/enrollments/${enrollment.id}/modules/${activeModuleId}/time/`,
          {
            token: tokens.access,
            method: "POST",
            body: JSON.stringify({ minutes: 1 }),
          }
        );
      } catch {
        /* silent */
      }
    }, 60_000);
    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [enrollment, activeModuleId, tokens]);

  // Access module when selected
  useEffect(() => {
    if (!enrollment || !activeModuleId || !tokens?.access) return;
    apiFetch(
      `/students/enrollments/${enrollment.id}/modules/${activeModuleId}/`,
      { token: tokens.access, method: "POST" }
    ).catch(() => {});
  }, [enrollment, activeModuleId, tokens]);

  async function handleComplete() {
    if (!enrollment || !activeModuleId || !tokens?.access) return;
    setCompleting(true);
    try {
      await apiFetch(
        `/students/enrollments/${enrollment.id}/modules/${activeModuleId}/complete/`,
        {
          token: tokens.access,
          method: "POST",
          body: JSON.stringify({ time_spent_minutes: 0 }),
        }
      );
      toast.success("Module completed!");
      await fetchData();
    } catch (err) {
      if (err instanceof ApiError) {
        const msg = typeof err.body?.detail === "string" ? err.body.detail : "Could not mark complete.";
        toast.error(msg);
      }
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
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
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-neutral-400 mb-4">
          Course not found or you are not enrolled.
        </p>
        <Button variant="primary" size="sm" href="/dashboard/student/courses">
          Back to Courses
        </Button>
      </div>
    );
  }

  const sortedModules = [...course.modules].sort(
    (a, b) => a.order - b.order
  );
  const progressMap = new Map(
    enrollment.module_progress.map((mp) => [mp.module, mp])
  );
  const activeModule = sortedModules.find((m) => m.id === activeModuleId);
  const activeProgress = activeModuleId
    ? progressMap.get(activeModuleId)
    : null;

  const completedCount = enrollment.module_progress.filter(
    (mp) => mp.is_completed
  ).length;
  const totalCount = sortedModules.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Link
          href="/dashboard/student/courses"
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">
            {course.title}
          </h2>
          <div className="text-[.78rem] text-neutral-500 mt-0.5">
            {completedCount}/{totalCount} modules complete · {progressPct}%
          </div>
        </div>
        <Badge variant={progressPct === 100 ? "green" : "violet"}>
          {progressPct === 100 ? "Completed" : `${progressPct}%`}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-neutral-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-violet-600 rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Sidebar — module list */}
        <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl overflow-hidden self-start lg:sticky lg:top-4">
          <div className="px-4 py-3 border-b border-neutral-200">
            <h3 className="text-sm font-bold">Course Content</h3>
          </div>
          <div className="flex flex-col">
            {sortedModules.map((m, i) => {
              const mp = progressMap.get(m.id);
              const isActive = m.id === activeModuleId;
              const done = mp?.is_completed;
              const Icon = typeIcon[m.content_type] || BookOpen;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModuleId(m.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-neutral-100 last:border-b-0 ${
                    isActive
                      ? "bg-violet-50 border-l-[3px] border-l-violet-600"
                      : "hover:bg-neutral-50"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-neutral-300 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`text-[.82rem] font-semibold truncate ${isActive ? "text-violet-700" : ""}`}>
                      {i + 1}. {m.title}
                    </div>
                    <div className="flex items-center gap-2 text-[.7rem] text-neutral-400 mt-0.5">
                      <Icon className="w-3 h-3" />
                      <span className="capitalize">{m.content_type}</span>
                      {m.duration_minutes != null && m.duration_minutes > 0 && (
                        <>
                          <span>·</span>
                          <span>{m.duration_minutes} min</span>
                        </>
                      )}
                    </div>
                  </div>
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main content area */}
        <div>
          {activeModule ? (
            <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl overflow-hidden">
              {/* Video player */}
              {activeModule.content_type === "video" &&
                activeModule.content_url && (
                  <div className="aspect-video bg-black">
                    {/youtube\.com\/watch|youtu\.be\/|youtube\.com\/embed/.test(activeModule.content_url) ? (
                      <iframe
                        key={activeModule.id}
                        src={`https://www.youtube.com/embed/${new URL(activeModule.content_url.replace("youtu.be/", "youtube.com/watch?v=")).searchParams.get("v") ?? activeModule.content_url.split("/").pop()}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    ) : (
                      <video
                        key={activeModule.id}
                        src={activeModule.content_url}
                        controls
                        className="w-full h-full"
                      />
                    )}
                  </div>
                )}

              {/* Module header */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="violet" className="capitalize">
                    {activeModule.content_type}
                  </Badge>
                  {activeModule.duration_minutes != null && activeModule.duration_minutes > 0 && (
                    <span className="flex items-center gap-1 text-[.78rem] text-neutral-400">
                      <Clock className="w-3 h-3" />
                      {activeModule.duration_minutes} min
                    </span>
                  )}
                  {activeProgress?.time_spent_minutes != null &&
                    activeProgress.time_spent_minutes > 0 && (
                      <span className="text-[.78rem] text-neutral-400">
                        · {activeProgress.time_spent_minutes} min spent
                      </span>
                    )}
                </div>
                <h3 className="text-xl font-extrabold mb-3">
                  {activeModule.title}
                </h3>

                {/* Reading / description */}
                {activeModule.description && (
                  <div className="prose prose-sm max-w-none text-neutral-600 whitespace-pre-line mb-6">
                    {activeModule.description}
                  </div>
                )}

                {/* File link (reading type) */}
                {activeModule.content_type === "reading" &&
                  activeModule.content_url && (
                    <a
                      href={activeModule.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:underline mb-6"
                    >
                      <FileText className="w-4 h-4" />
                      Open reading material
                    </a>
                  )}

                {/* Document download */}
                {activeModule.content_type === "document" && (activeModule.file || activeModule.content_url) && (
                  <a
                    href={activeModule.file || activeModule.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-50 border border-violet-200 text-sm font-semibold text-violet-700 hover:bg-violet-100 transition-colors mb-6"
                  >
                    <FileText className="w-4 h-4" />
                    Download Document
                  </a>
                )}

                {/* Generic file (non-document content type with a file attached) */}
                {activeModule.content_type !== "document" && activeModule.file && (
                  <a
                    href={activeModule.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:underline mb-6"
                  >
                    <FileText className="w-4 h-4" />
                    Download file
                  </a>
                )}

                {/* Complete button */}
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 mt-4">
                  {activeProgress?.is_completed ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      loading={completing}
                      onClick={handleComplete}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Mark as Complete
                    </Button>
                  )}

                  {/* Next module button */}
                  {(() => {
                    const currentIdx = sortedModules.findIndex(
                      (m) => m.id === activeModuleId
                    );
                    const nextModule = sortedModules[currentIdx + 1];
                    if (!nextModule) return null;
                    return (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          setActiveModuleId(nextModule.id)
                        }
                      >
                        Next: {nextModule.title}
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-12 text-center">
              <PlayCircle className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm text-neutral-400">
                Select a module from the sidebar to begin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
