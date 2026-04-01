"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  UserPlus,
  Users,
  ChevronRight,
  Check,
  X,
  Trash2,
  Clock,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { parentApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { ChildSummary, ParentChildLink } from "@/lib/types";

type Tab = "active" | "pending";

export default function ParentChildrenPage() {
  const { tokens } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("active");

  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [links, setLinks] = useState<ParentChildLink[]>([]);
  const [loading, setLoading] = useState(true);

  // Link request form
  const [childEmail, setChildEmail] = useState("");
  const [requesting, setRequesting] = useState(false);

  // Action loading states
  const [actionId, setActionId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!tokens) return;
    setLoading(true);
    try {
      const [c, l] = await Promise.all([
        parentApi.getChildren(tokens.access),
        parentApi.getLinks(tokens.access),
      ]);
      setChildren(c);
      setLinks(l.results ?? []);
    } catch {
      toast.error("Failed to load children.");
    } finally {
      setLoading(false);
    }
  }, [tokens, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const pendingLinks = links.filter(
    (l) =>
      l.status === "pending_parent_approval" ||
      l.status === "pending_child_approval"
  );

  async function handleRequestLink(e: React.FormEvent) {
    e.preventDefault();
    if (!tokens || !childEmail.trim()) return;
    setRequesting(true);
    try {
      const result = await parentApi.requestLink(tokens.access, childEmail.trim());
      const res = result as { type?: string; message?: string };
      if (res.type === "invite") {
        toast.success(res.message ?? "Invite sent! They will be linked once they register.");
      } else {
        toast.success("Link request sent. The child will need to accept it.");
      }
      setChildEmail("");
      load();
    } catch {
      toast.error("Failed to send request. Check the email and try again.");
    } finally {
      setRequesting(false);
    }
  }

  async function handleAccept(linkId: number) {
    if (!tokens) return;
    setActionId(linkId);
    try {
      await parentApi.acceptLink(tokens.access, linkId);
      toast.success("Link accepted.");
      load();
    } catch {
      toast.error("Failed to accept link.");
    } finally {
      setActionId(null);
    }
  }

  async function handleDecline(linkId: number) {
    if (!tokens) return;
    setActionId(linkId);
    try {
      await parentApi.declineLink(tokens.access, linkId);
      toast.success("Link declined.");
      load();
    } catch {
      toast.error("Failed to decline link.");
    } finally {
      setActionId(null);
    }
  }

  async function handleCancel(linkId: number) {
    if (!tokens) return;
    setActionId(linkId);
    try {
      await parentApi.cancelLink(tokens.access, linkId);
      toast.success("Request cancelled.");
      load();
    } catch {
      toast.error("Failed to cancel request.");
    } finally {
      setActionId(null);
    }
  }

  async function handleRemove(linkId: number) {
    if (!tokens) return;
    if (!confirm("Remove this child link? This cannot be undone.")) return;
    setActionId(linkId);
    try {
      await parentApi.removeLink(tokens.access, linkId);
      toast.success("Link removed.");
      load();
    } catch {
      toast.error("Failed to remove link.");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">
          Children
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your linked children and link requests.
        </p>
      </div>

      {/* Link request form */}
      <div className="bg-white border-[1.5px] border-neutral-200 rounded-[20px] p-5">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-4 h-4 text-orange-500" />
          <span className="font-bold text-[.9rem]">Link a Child</span>
        </div>
        <form
          onSubmit={handleRequestLink}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            placeholder="Enter child's account email..."
            value={childEmail}
            onChange={(e) => setChildEmail(e.target.value)}
            required
            className="flex-1 px-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-[10px] text-sm bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200/60"
          />
          <Button
            type="submit"
            variant="primary"
            loading={requesting}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            Send Request
          </Button>
        </form>
      </div>

      {/* Tabs */}
      <div className="bg-white border-[1.5px] border-neutral-200 rounded-[20px] overflow-hidden">
        <div className="flex border-b border-neutral-200">
          {([
            { id: "active" as Tab, label: `Active (${children.length})` },
            {
              id: "pending" as Tab,
              label: `Pending (${pendingLinks.length})`,
            },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-[.85rem] font-semibold border-b-2 transition-colors -mb-px ${
                tab === t.id
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : tab === "active" ? (
            children.length === 0 ? (
              <div className="text-center py-10">
                <Users className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">
                  No active linked children yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {children.map((child) => {
                  const activeLink = links.find(
                    (l) => l.child.id === child.child_id && l.status === "active"
                  );
                  return (
                    <div
                      key={child.child_id}
                      className="border border-neutral-100 rounded-2xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {child.first_name[0]}
                          {child.last_name[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-neutral-900 text-sm truncate">
                            {child.first_name} {child.last_name}
                          </p>
                          <p className="text-xs text-neutral-400 truncate">
                            {child.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-xs text-neutral-500">
                          <span>Avg. progress</span>
                          <span className="font-semibold text-neutral-700">
                            {Math.round(child.avg_progress ?? 0)}%
                          </span>
                        </div>
                        <ProgressBar
                          value={child.avg_progress ?? 0}
                          color="orange"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
                        <span>
                          <b className="text-neutral-700">
                            {child.enrolled_courses}
                          </b>{" "}
                          courses
                        </span>
                        <span>·</span>
                        <span>
                          <b className="text-neutral-700">
                            {child.completed_courses}
                          </b>{" "}
                          completed
                        </span>
                        <span>·</span>
                        <span>
                          <b className="text-neutral-700">
                            {child.certificates_earned}
                          </b>{" "}
                          certs
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/parent/children/${child.child_id}`}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-orange-50 text-orange-700 rounded-[10px] text-xs font-semibold hover:bg-orange-100 transition-colors"
                        >
                          View details <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                        {activeLink && (
                          <button
                            onClick={() => handleRemove(activeLink.id)}
                            disabled={actionId === activeLink.id}
                            title="Remove link"
                            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-[10px] transition-colors"
                          >
                            {actionId === activeLink.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : pendingLinks.length === 0 ? (
            <div className="text-center py-10">
              <Clock className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">
                No pending link requests.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingLinks.map((link) => {
                const name =
                  link.child.first_name && link.child.last_name
                    ? `${link.child.first_name} ${link.child.last_name}`
                    : link.child.email;
                const isWaitingOnMe =
                  link.status === "pending_parent_approval";

                return (
                  <div
                    key={link.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 border border-neutral-100 rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {link.child.email[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-neutral-900 truncate">
                          {name}
                        </p>
                        <p className="text-xs text-neutral-400 truncate">
                          {link.child.email}
                        </p>
                      </div>
                      <span
                        className={`ml-auto text-[.7rem] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          isWaitingOnMe
                            ? "bg-orange-50 text-orange-600"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {isWaitingOnMe ? "Awaiting your approval" : "Waiting on child"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isWaitingOnMe ? (
                        <>
                          <button
                            onClick={() => handleAccept(link.id)}
                            disabled={actionId === link.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors"
                          >
                            {actionId === link.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            Accept
                          </button>
                          <button
                            onClick={() => handleDecline(link.id)}
                            disabled={actionId === link.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Decline
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleCancel(link.id)}
                          disabled={actionId === link.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-lg text-xs font-semibold hover:bg-neutral-200 transition-colors"
                        >
                          {actionId === link.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <X className="w-3.5 h-3.5" />
                          )}
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
