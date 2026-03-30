"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  BookOpen,
  Clock,
  PlayCircle,
  FileText,
  Video,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import type { CourseDetail, PaginatedResponse, Enrollment } from "@/lib/types";

const contentIcon: Record<string, React.ElementType> = {
  video: Video,
  reading: FileText,
  quiz: BookOpen,
};

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { user, tokens } = useAuth();
  const toast = useToast();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch<CourseDetail>(`/courses/${slug}/`);
        setCourse(data);
      } catch {
        toast.error("Course not found.");
        router.push("/courses");
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Check if student is already enrolled
  useEffect(() => {
    if (!tokens?.access || !user || user.role !== "student") return;
    apiFetch<PaginatedResponse<Enrollment>>("/students/enrollments/", {
      token: tokens.access,
    })
      .then((d) => {
        const match = d.results.find((e) => e.course_slug === slug);
        if (match) setEnrollmentId(match.id);
      })
      .catch(() => {});
  }, [tokens, user, slug]);

  async function handleEnroll() {
    if (!user) {
      router.push(`/auth/signin?next=/courses/${slug}`);
      return;
    }
    if (user.role !== "student") {
      toast.error("Only students can enroll in courses.");
      return;
    }
    if (!course) return;
    setEnrolling(true);
    try {
      if (course.is_free) {
        const enrollment = await apiFetch<Enrollment>("/students/enroll/", {
          token: tokens!.access,
          method: "POST",
          body: JSON.stringify({ course_slug: slug }),
        });
        setEnrollmentId(enrollment.id);
        toast.success("Enrolled successfully!");
      } else {
        const res = await apiFetch<{ checkout_url: string }>(
          "/payments/checkout/",
          {
            token: tokens!.access,
            method: "POST",
            body: JSON.stringify({
              content_type: "course",
              slug,
            }),
          }
        );
        if (res.checkout_url) {
          window.location.href = res.checkout_url;
        } else {
          toast.success("Payment initiated.");
        }
      }
    } catch (err) {
      if (err instanceof ApiError) {
        const msg = typeof err.body?.detail === "string" ? err.body.detail : "Enrollment failed.";
        toast.error(msg);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-center py-20">
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
      </section>
    );
  }

  if (!course) return null;

  const sortedModules = [...(course.modules || [])].sort(
    (a, b) => a.order - b.order
  );
  const avgRating = course.average_rating ?? 0;
  const totalDuration = sortedModules.reduce(
    (sum, m) => sum + (m.duration_minutes || 0),
    0
  );

  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Back */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          All Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Left — content */}
          <div>
            {/* Cover */}
            {course.cover_image && (
              <div className="rounded-2xl overflow-hidden mb-6 border border-neutral-200">
                <img
                  src={course.cover_image}
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}

            <Badge variant="violet" className="mb-3">
              {course.category_name}
            </Badge>
            <h1 className="text-[2rem] font-extrabold tracking-tight leading-tight mb-2">
              {course.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-neutral-500 mb-5 flex-wrap">
              <span>By {course.tutor_name}</span>
              {avgRating > 0 && (
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  {avgRating.toFixed(1)} ({course.review_count})
                </span>
              )}
              <span>{course.module_count} modules</span>
              {totalDuration > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {totalDuration} min
                </span>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none text-neutral-600 mb-10 whitespace-pre-line">
              {course.description}
            </div>

            {/* Modules */}
            <h2 className="text-lg font-extrabold mb-4">
              Course Content ({sortedModules.length} modules)
            </h2>
            <div className="flex flex-col gap-2 mb-10">
              {sortedModules.map((m, i) => {
                const Icon =
                  contentIcon[m.content_type] || BookOpen;
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 bg-white border-[1.5px] border-neutral-200 rounded-xl px-4 py-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">
                        {i + 1}. {m.title}
                      </div>
                      {m.duration_minutes && (
                        <div className="text-[.75rem] text-neutral-400">
                          {m.duration_minutes} min
                        </div>
                      )}
                    </div>
                    {!enrollmentId && (
                      <Lock className="w-3.5 h-3.5 text-neutral-300" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Reviews */}
            {course.reviews && course.reviews.length > 0 && (
              <>
                <h2 className="text-lg font-extrabold mb-4">
                  Reviews ({course.reviews.length})
                </h2>
                <div className="flex flex-col gap-3">
                  {course.reviews.map((r) => (
                    <div
                      key={r.id}
                      className="bg-white border-[1.5px] border-neutral-200 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[.65rem] font-bold">
                          {r.student_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <span className="text-sm font-semibold">
                          {r.student_name}
                        </span>
                        <span className="flex items-center gap-0.5 text-[.78rem] text-amber-500 font-bold ml-auto">
                          <Star className="w-3 h-3 fill-amber-500" />
                          {r.rating}
                        </span>
                      </div>
                      {r.comment && (
                        <p className="text-sm text-neutral-600">{r.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right — sidebar */}
          <div className="lg:sticky lg:top-[90px] self-start">
            <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-6">
              <div className="text-3xl font-extrabold mb-1">
                {course.is_free ? (
                  "Free"
                ) : (
                  <>P{course.price}</>
                )}
              </div>
              <p className="text-sm text-neutral-400 mb-5">One-time payment</p>

              {enrollmentId ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  href={`/dashboard/student/courses/${slug}`}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={enrolling}
                  onClick={handleEnroll}
                >
                  {course.is_free ? "Enroll Free" : `Enroll — P${course.price}`}
                </Button>
              )}

              <div className="border-t border-neutral-200 mt-5 pt-5 flex flex-col gap-3 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-neutral-400" />
                  {course.module_count} modules
                </div>
                {totalDuration > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    {totalDuration} minutes of content
                  </div>
                )}
                {avgRating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    {avgRating.toFixed(1)} average rating
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
