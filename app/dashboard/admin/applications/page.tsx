"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal, ModalHead, ModalBody, ModalFoot } from "@/components/ui/modal";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import type { TutorApplication, PaginatedResponse } from "@/lib/types";

const avatarColors = [
  "bg-violet-600",
  "bg-green-600",
  "bg-orange-500",
  "bg-blue-600",
  "bg-amber-600",
];

const statusBadge: Record<string, "amber" | "green" | "red"> = {
  pending: "amber",
  approved: "green",
  rejected: "red",
};

function getInitials(a: TutorApplication) {
  if (a.first_name && a.last_name) return (a.first_name[0] + a.last_name[0]).toUpperCase();
  return a.username.slice(0, 2).toUpperCase();
}

function getDisplayName(a: TutorApplication) {
  if (a.first_name && a.last_name) return `${a.first_name} ${a.last_name}`;
  return a.username;
}

export default function AdminApplicationsPage() {
  const { tokens } = useAuth();
  const [applications, setApplications] = useState<TutorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pending" | "all">("pending");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Reject modal state
  const [rejectTarget, setRejectTarget] = useState<TutorApplication | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  const fetchApplications = useCallback(async () => {
    if (!tokens) return;
    setLoading(true);
    try {
      const endpoint =
        tab === "pending"
          ? "/admins/tutors/pending/"
          : "/admins/tutors/applications/";
      const data = await apiFetch<PaginatedResponse<TutorApplication>>(endpoint, {
        token: tokens.access,
      });
      setApplications(data.results);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [tokens, tab]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  async function handleApprove(app: TutorApplication) {
    if (!tokens) return;
    setActionLoading(app.id);
    try {
      await apiFetch(`/admins/tutors/${app.id}/approve/`, {
        method: "POST",
        token: tokens.access,
      });
      setApplications((prev) =>
        prev.map((x) => (x.id === app.id ? { ...x, status: "approved" } : x))
      );
    } catch (e) {
      alert(e instanceof ApiError ? (e.body.detail as string) : "Failed to approve");
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
    try {
      await apiFetch(`/admins/tutors/${rejectTarget.id}/reject/`, {
        method: "POST",
        token: tokens.access,
        body: JSON.stringify({ rejection_reason: rejectReason }),
      });
      setApplications((prev) =>
        prev.map((x) =>
          x.id === rejectTarget.id ? { ...x, status: "rejected", rejection_reason: rejectReason } : x
        )
      );
      setRejectTarget(null);
      setRejectReason("");
      setRejectError("");
    } catch (e) {
      setRejectError(e instanceof ApiError ? (e.body.detail as string) ?? "Failed" : "Failed to reject");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">Tutor Applications</h2>
        <div className="flex bg-neutral-100 rounded-xl p-0.5">
          <button
            onClick={() => setTab("pending")}
            className={`px-4 py-1.5 text-[.8rem] font-semibold rounded-lg transition-colors ${tab === "pending" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}
          >
            Pending
          </button>
          <button
            onClick={() => setTab("all")}
            className={`px-4 py-1.5 text-[.8rem] font-semibold rounded-lg transition-colors ${tab === "all" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}
          >
            All
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <svg className="animate-spin w-6 h-6 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <p className="text-sm text-neutral-400">
            {tab === "pending" ? "No pending applications." : "No applications found."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {applications.map((app, i) => (
            <div key={app.id} className="bg-white rounded-2xl border border-neutral-200 p-5">
              {/* Header */}
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full ${avatarColors[i % avatarColors.length]} text-white flex items-center justify-center text-sm font-bold shrink-0`}>
                    {getInitials(app)}
                  </div>
                  <div>
                    <div className="text-[.95rem] font-bold">{getDisplayName(app)}</div>
                    <div className="text-[.8rem] text-neutral-500">
                      {app.subject_area} · {app.qualifications}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="violet">{app.subject_area}</Badge>
                      <Badge variant="neutral">
                        {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Badge variant={statusBadge[app.status] ?? "neutral"}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </Badge>
              </div>

              {/* Statement */}
              <div className="my-3.5 p-3.5 bg-neutral-50 rounded-xl border-[1.5px] border-neutral-200">
                <p className="text-[.82rem] text-neutral-700 leading-[1.65]">
                  &ldquo;{app.statement}&rdquo;
                </p>
              </div>

              {/* Rejection reason if rejected */}
              {app.status === "rejected" && app.rejection_reason && (
                <div className="mb-3 p-3 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-xs font-semibold text-red-600 mb-0.5">Rejection Reason</p>
                  <p className="text-[.82rem] text-red-700">{app.rejection_reason}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {app.status === "pending" && (
                  <>
                    <Button
                      variant="success-ghost"
                      size="sm"
                      loading={actionLoading === app.id}
                      onClick={() => handleApprove(app)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger-ghost"
                      size="sm"
                      onClick={() => {
                        setRejectTarget(app);
                        setRejectReason("");
                        setRejectError("");
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {app.cv_url && (
                  <a
                    href={app.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto"
                  >
                    <Button variant="ghost" size="sm">View CV</Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} size="sm">
        {rejectTarget && (
          <>
            <ModalHead
              title="Reject Application"
              subtitle={`${getDisplayName(rejectTarget)} — ${rejectTarget.subject_area}`}
              onClose={() => setRejectTarget(null)}
            />
            <ModalBody>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Reason for Rejection
              </label>
              <textarea
                className="w-full h-28 p-3 text-sm border-[1.5px] border-neutral-200 rounded-xl bg-white resize-none focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                placeholder="Explain why this application is being rejected…"
                value={rejectReason}
                onChange={(e) => { setRejectReason(e.target.value); setRejectError(""); }}
              />
              {rejectError && (
                <p className="text-xs text-red-600 mt-1.5">{rejectError}</p>
              )}
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
                Reject Application
              </Button>
            </ModalFoot>
          </>
        )}
      </Modal>
    </div>
  );
}
