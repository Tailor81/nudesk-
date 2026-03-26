"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal, ModalHead, ModalBody, ModalFoot } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import type { PendingCourse, PendingStudyGuide, PaginatedResponse } from "@/lib/types";

type Tab = "courses" | "guides";

const avatarColors = [
  "bg-violet-600",
  "bg-green-600",
  "bg-orange-500",
  "bg-blue-600",
  "bg-amber-600",
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function AdminContentPage() {
  const { tokens } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("courses");

  const [courses, setCourses] = useState<PendingCourse[]>([]);
  const [guides, setGuides] = useState<PendingStudyGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Reject modal
  const [rejectTarget, setRejectTarget] = useState<{ slug: string; title: string; type: Tab } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  const fetchContent = useCallback(async () => {
    if (!tokens) return;
    setLoading(true);
    try {
      const [c, g] = await Promise.all([
        apiFetch<PaginatedResponse<PendingCourse>>("/admins/content/courses/", { token: tokens.access }),
        apiFetch<PaginatedResponse<PendingStudyGuide>>("/admins/content/study-guides/", { token: tokens.access }),
      ]);
      setCourses(c.results);
      setGuides(g.results);
    } catch {
      toast.error("Failed to load pending content.");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  async function handleApprove(slug: string, type: Tab) {
    if (!tokens) return;
    setActionLoading(slug);
    const endpoint =
      type === "courses"
        ? `/admins/content/courses/${slug}/review/`
        : `/admins/content/study-guides/${slug}/review/`;
    try {
      await apiFetch(endpoint, {
        method: "POST",
        token: tokens.access,
        body: JSON.stringify({ action: "approve" }),
      });
      toast.success(`${type === "courses" ? "Course" : "Study guide"} approved!`);
      if (type === "courses") setCourses((prev) => prev.filter((c) => c.slug !== slug));
      else setGuides((prev) => prev.filter((g) => g.slug !== slug));
    } catch (e) {
      toast.error(
        e instanceof ApiError ? String((e.body as Record<string, string>).detail ?? "Failed") : "Action failed."
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject() {
    if (!tokens || !rejectTarget) return;
    if (!rejectReason.trim()) {
      setRejectError("A reason is required when rejecting.");
      return;
    }
    setActionLoading(rejectTarget.slug);
    const endpoint =
      rejectTarget.type === "courses"
        ? `/admins/content/courses/${rejectTarget.slug}/review/`
        : `/admins/content/study-guides/${rejectTarget.slug}/review/`;
    try {
      await apiFetch(endpoint, {
        method: "POST",
        token: tokens.access,
        body: JSON.stringify({ action: "reject", rejection_reason: rejectReason }),
      });
      toast.success(`${rejectTarget.type === "courses" ? "Course" : "Study guide"} rejected.`);
      if (rejectTarget.type === "courses") setCourses((prev) => prev.filter((c) => c.slug !== rejectTarget.slug));
      else setGuides((prev) => prev.filter((g) => g.slug !== rejectTarget.slug));
      setRejectTarget(null);
      setRejectReason("");
      setRejectError("");
    } catch (e) {
      setRejectError(
        e instanceof ApiError ? String((e.body as Record<string, string>).detail ?? "Failed") : "Action failed."
      );
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">Content Review</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-neutral-200 mb-4">
        <button
          onClick={() => setTab("courses")}
          className={`px-4 py-2.5 text-[.85rem] font-semibold border-b-2 transition-colors -mb-px ${
            tab === "courses"
              ? "border-violet-600 text-violet-600"
              : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Courses {courses.length > 0 && <span className="ml-1 text-[.72rem] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-bold">{courses.length}</span>}
        </button>
        <button
          onClick={() => setTab("guides")}
          className={`px-4 py-2.5 text-[.85rem] font-semibold border-b-2 transition-colors -mb-px ${
            tab === "guides"
              ? "border-violet-600 text-violet-600"
              : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Study Guides {guides.length > 0 && <span className="ml-1 text-[.72rem] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-bold">{guides.length}</span>}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <svg className="animate-spin w-6 h-6 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
        </div>
      ) : (
        <>
          {/* Courses Table */}
          {tab === "courses" && (
            courses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                <p className="text-sm text-neutral-400">No pending courses.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Course</th>
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Tutor</th>
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Category</th>
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Modules</th>
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Price</th>
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Submitted</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c, i) => (
                      <tr key={c.id} className="border-b border-neutral-100 last:border-b-0">
                        <td className="px-4 py-3 text-[.875rem] font-semibold">{c.title}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full ${avatarColors[i % avatarColors.length]} text-white flex items-center justify-center text-[.6rem] font-bold shrink-0`}>
                              {initials(c.tutor_name)}
                            </div>
                            <span className="text-[.82rem]">{c.tutor_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><Badge variant="violet">{c.category_name}</Badge></td>
                        <td className="px-4 py-3 text-[.82rem]">{c.module_count} modules</td>
                        <td className="px-4 py-3 text-[.82rem] font-semibold">{c.is_free ? "Free" : `$${c.price}`}</td>
                        <td className="px-4 py-3 text-[.78rem] text-neutral-500">
                          {new Date(c.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Button
                              variant="success-ghost"
                              size="sm"
                              loading={actionLoading === c.slug}
                              onClick={() => handleApprove(c.slug, "courses")}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger-ghost"
                              size="sm"
                              onClick={() => {
                                setRejectTarget({ slug: c.slug, title: c.title, type: "courses" });
                                setRejectReason("");
                                setRejectError("");
                              }}
                            >
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* Study Guides Table */}
          {tab === "guides" && (
            guides.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                <p className="text-sm text-neutral-400">No pending study guides.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Study Guide</th>
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Tutor</th>
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Category</th>
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Pages</th>
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Price</th>
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Submitted</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {guides.map((g, i) => (
                      <tr key={g.id} className="border-b border-neutral-100 last:border-b-0">
                        <td className="px-4 py-3 text-[.875rem] font-semibold">{g.title}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full ${avatarColors[i % avatarColors.length]} text-white flex items-center justify-center text-[.6rem] font-bold shrink-0`}>
                              {initials(g.tutor_name)}
                            </div>
                            <span className="text-[.82rem]">{g.tutor_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><Badge variant="violet">{g.category_name}</Badge></td>
                        <td className="px-4 py-3 text-[.82rem]">{g.page_count} pages</td>
                        <td className="px-4 py-3 text-[.82rem] font-semibold">{g.is_free ? "Free" : `$${g.price}`}</td>
                        <td className="px-4 py-3 text-[.78rem] text-neutral-500">
                          {new Date(g.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Button
                              variant="success-ghost"
                              size="sm"
                              loading={actionLoading === g.slug}
                              onClick={() => handleApprove(g.slug, "guides")}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger-ghost"
                              size="sm"
                              onClick={() => {
                                setRejectTarget({ slug: g.slug, title: g.title, type: "guides" });
                                setRejectReason("");
                                setRejectError("");
                              }}
                            >
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </>
      )}

      {/* Reject Modal */}
      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} size="sm">
        {rejectTarget && (
          <>
            <ModalHead
              title={`Reject ${rejectTarget.type === "courses" ? "Course" : "Study Guide"}`}
              subtitle={rejectTarget.title}
              onClose={() => setRejectTarget(null)}
            />
            <ModalBody>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Reason for Rejection
              </label>
              <textarea
                className="w-full h-28 p-3 text-sm border-[1.5px] border-neutral-200 rounded-xl bg-white resize-none focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                placeholder="Explain why this content is being rejected…"
                value={rejectReason}
                onChange={(e) => { setRejectReason(e.target.value); setRejectError(""); }}
              />
              {rejectError && <p className="text-xs text-red-500 mt-1.5">{rejectError}</p>}
            </ModalBody>
            <ModalFoot>
              <Button variant="secondary" size="sm" onClick={() => setRejectTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={actionLoading === rejectTarget.slug}
                onClick={handleReject}
              >
                Reject
              </Button>
            </ModalFoot>
          </>
        )}
      </Modal>
    </div>
  );
}
