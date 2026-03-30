"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal, ModalHead, ModalBody, ModalFoot } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { BookOpen, Calendar, Clock, FileText, Users, Video } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import type { PendingCourse, PendingStudyGuide, PendingLiveClass, PaginatedResponse } from "@/lib/types";

type Tab = "courses" | "guides" | "live";

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
  const [liveSessions, setLiveSessions] = useState<PendingLiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Preview modal
  const [previewCourse, setPreviewCourse] = useState<PendingCourse | null>(null);

  // Reject modal
  const [rejectTarget, setRejectTarget] = useState<{ id: string; title: string; type: Tab } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  const fetchContent = useCallback(async () => {
    if (!tokens) return;
    setLoading(true);
    try {
      const [c, g, l] = await Promise.all([
        apiFetch<PaginatedResponse<PendingCourse>>("/admins/content/courses/", { token: tokens.access }),
        apiFetch<PaginatedResponse<PendingStudyGuide>>("/admins/content/study-guides/", { token: tokens.access }),
        apiFetch<PaginatedResponse<PendingLiveClass>>("/admins/content/live-classes/", { token: tokens.access }),
      ]);
      setCourses(c.results);
      setGuides(g.results);
      setLiveSessions(l.results);
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

  async function handleApprove(id: string, type: Tab) {
    if (!tokens) return;
    setActionLoading(id);
    const endpoint =
      type === "courses"
        ? `/admins/content/courses/${id}/review/`
        : type === "guides"
        ? `/admins/content/study-guides/${id}/review/`
        : `/admins/content/live-classes/${id}/review/`;
    try {
      await apiFetch(endpoint, {
        method: "POST",
        token: tokens.access,
        body: JSON.stringify({ action: "approve" }),
      });
      const label = type === "courses" ? "Course" : type === "guides" ? "Study guide" : "Live session";
      toast.success(`${label} approved!`);
      if (type === "courses") setCourses((prev) => prev.filter((c) => c.slug !== id));
      else if (type === "guides") setGuides((prev) => prev.filter((g) => g.slug !== id));
      else setLiveSessions((prev) => prev.filter((l) => String(l.id) !== id));
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
    setActionLoading(rejectTarget.id);
    const endpoint =
      rejectTarget.type === "courses"
        ? `/admins/content/courses/${rejectTarget.id}/review/`
        : rejectTarget.type === "guides"
        ? `/admins/content/study-guides/${rejectTarget.id}/review/`
        : `/admins/content/live-classes/${rejectTarget.id}/review/`;
    try {
      await apiFetch(endpoint, {
        method: "POST",
        token: tokens.access,
        body: JSON.stringify({ action: "reject", rejection_reason: rejectReason }),
      });
      const label = rejectTarget.type === "courses" ? "Course" : rejectTarget.type === "guides" ? "Study guide" : "Live session";
      toast.success(`${label} rejected.`);
      if (rejectTarget.type === "courses") setCourses((prev) => prev.filter((c) => c.slug !== rejectTarget.id));
      else if (rejectTarget.type === "guides") setGuides((prev) => prev.filter((g) => g.slug !== rejectTarget.id));
      else setLiveSessions((prev) => prev.filter((l) => String(l.id) !== rejectTarget.id));
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
        <button
          onClick={() => setTab("live")}
          className={`px-4 py-2.5 text-[.85rem] font-semibold border-b-2 transition-colors -mb-px ${
            tab === "live"
              ? "border-violet-600 text-violet-600"
              : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Live Sessions {liveSessions.length > 0 && <span className="ml-1 text-[.72rem] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-bold">{liveSessions.length}</span>}
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
                        <td className="px-4 py-3 text-[.82rem] font-semibold">{c.is_free ? "Free" : `P${c.price}`}</td>
                        <td className="px-4 py-3 text-[.78rem] text-neutral-500">
                          {new Date(c.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setPreviewCourse(c)}
                            >
                              Preview
                            </Button>
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
                                setRejectTarget({ id: c.slug, title: c.title, type: "courses" });
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
                        <td className="px-4 py-3 text-[.82rem] font-semibold">{g.is_free ? "Free" : `P${g.price}`}</td>
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
                                setRejectTarget({ id: g.slug, title: g.title, type: "guides" });
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

          {/* Live Sessions Table */}
          {tab === "live" && (
            liveSessions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                <p className="text-sm text-neutral-400">No pending live sessions.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Session</th>
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Tutor</th>
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Category</th>
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Date &amp; Time</th>
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Capacity</th>
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Price</th>
                      <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Submitted</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveSessions.map((l, i) => (
                      <tr key={l.id} className="border-b border-neutral-100 last:border-b-0">
                        <td className="px-4 py-3 text-[.875rem] font-semibold">{l.title}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full ${avatarColors[i % avatarColors.length]} text-white flex items-center justify-center text-[.6rem] font-bold shrink-0`}>
                              {initials(l.tutor_name)}
                            </div>
                            <span className="text-[.82rem]">{l.tutor_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><Badge variant="violet">{l.category_name}</Badge></td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-[.82rem] font-medium flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-neutral-400" />
                              {new Date(l.scheduled_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            <span className="text-[.75rem] text-neutral-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {l.start_time.slice(0, 5)} – {l.end_time.slice(0, 5)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-[.82rem]">
                            <Users className="w-3.5 h-3.5 text-neutral-400" />
                            {l.max_capacity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[.82rem] font-semibold">{l.is_free ? "Free" : `P${l.price}`}</td>
                        <td className="px-4 py-3 text-[.78rem] text-neutral-500">
                          {new Date(l.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Button
                              variant="success-ghost"
                              size="sm"
                              loading={actionLoading === String(l.id)}
                              onClick={() => handleApprove(String(l.id), "live")}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger-ghost"
                              size="sm"
                              onClick={() => {
                                setRejectTarget({ id: String(l.id), title: l.title, type: "live" });
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

      {/* Course Preview Modal */}
      <Modal open={!!previewCourse} onClose={() => setPreviewCourse(null)} size="lg">
        {previewCourse && (
          <>
            <ModalHead
              title={previewCourse.title}
              subtitle={`${previewCourse.tutor_name} · ${previewCourse.category_name} · ${previewCourse.is_free ? "Free" : `P${previewCourse.price}`}`}
              onClose={() => setPreviewCourse(null)}
            />
            <ModalBody>
              {previewCourse.description && (
                <p className="text-sm text-neutral-600 mb-4 whitespace-pre-line">{previewCourse.description}</p>
              )}
              <h4 className="text-sm font-bold text-neutral-700 mb-2">
                Modules ({previewCourse.modules.length})
              </h4>
              {previewCourse.modules.length === 0 ? (
                <p className="text-sm text-neutral-400">No modules.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {[...previewCourse.modules]
                    .sort((a, b) => a.order - b.order)
                    .map((mod, i) => {
                      const TypeIcon =
                        mod.content_type === "video"
                          ? Video
                          : mod.content_type === "document"
                          ? FileText
                          : BookOpen;
                      const hasContent = !!(mod.content_url || mod.file);
                      return (
                        <div
                          key={mod.id}
                          className="flex items-start gap-3 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3"
                        >
                          <span className="text-xs font-bold text-neutral-400 mt-0.5 w-5 shrink-0">{i + 1}.</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold">{mod.title}</div>
                            <div className="flex items-center gap-2 text-[.72rem] text-neutral-400 mt-0.5 flex-wrap">
                              <TypeIcon className="w-3 h-3" />
                              <span className="capitalize">{mod.content_type}</span>
                              {mod.duration_minutes != null && mod.duration_minutes > 0 && (
                                <span>· {mod.duration_minutes} min</span>
                              )}
                              {hasContent ? (
                                <span className="text-green-600 font-semibold">Content attached</span>
                              ) : (
                                <span className="text-amber-500 font-semibold">No content yet</span>
                              )}
                            </div>
                            {mod.description && (
                              <p className="text-[.75rem] text-neutral-500 mt-1 line-clamp-2">{mod.description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </ModalBody>
            <ModalFoot>
              <div className="flex items-center justify-between w-full">
                <Button variant="secondary" size="sm" onClick={() => setPreviewCourse(null)}>Close</Button>
                <div className="flex gap-2">
                  <Button
                    variant="success-ghost"
                    size="sm"
                    loading={actionLoading === previewCourse.slug}
                  onClick={() => { handleApprove(previewCourse.slug, "courses"); setPreviewCourse(null); }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger-ghost"
                    size="sm"
                    onClick={() => {
                      setRejectTarget({ id: previewCourse.slug, title: previewCourse.title, type: "courses" });
                      setRejectReason("");
                      setRejectError("");
                      setPreviewCourse(null);
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </ModalFoot>
          </>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} size="sm">
        {rejectTarget && (
          <>
            <ModalHead
              title={`Reject ${rejectTarget.type === "courses" ? "Course" : rejectTarget.type === "guides" ? "Study Guide" : "Live Session"}`}
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
                loading={actionLoading === rejectTarget.id}
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
