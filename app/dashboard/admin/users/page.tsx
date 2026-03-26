"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal, ModalHead, ModalBody, ModalFoot } from "@/components/ui/modal";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import type { AdminUser, PaginatedResponse } from "@/lib/types";

const roleColors: Record<string, "violet" | "orange"> = {
  student: "violet",
  tutor: "orange",
};

const avatarColors = [
  "bg-violet-600",
  "bg-orange-500",
  "bg-green-600",
  "bg-blue-600",
  "bg-amber-600",
  "bg-red-500",
];

function getInitials(u: AdminUser) {
  if (u.first_name && u.last_name) return (u.first_name[0] + u.last_name[0]).toUpperCase();
  return u.username.slice(0, 2).toUpperCase();
}

function getDisplayName(u: AdminUser) {
  if (u.first_name && u.last_name) return `${u.first_name} ${u.last_name}`;
  return u.username;
}

export default function AdminUsersPage() {
  const { tokens } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selected, setSelected] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!tokens) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      if (statusFilter) params.set("status", statusFilter);
      const qs = params.toString();
      const data = await apiFetch<PaginatedResponse<AdminUser>>(
        `/admins/users/${qs ? `?${qs}` : ""}`,
        { token: tokens.access }
      );
      setUsers(data.results);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [tokens, search, roleFilter, statusFilter]);

  useEffect(() => {
    const id = setTimeout(fetchUsers, 300);
    return () => clearTimeout(id);
  }, [fetchUsers]);

  async function handleSuspend(u: AdminUser) {
    if (!tokens) return;
    setActionLoading(u.id);
    try {
      await apiFetch(`/admins/users/${u.id}/suspend/`, {
        method: "POST",
        token: tokens.access,
      });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, is_active: false } : x)));
      if (selected?.id === u.id) setSelected({ ...selected, is_active: false });
    } catch (e) {
      alert(e instanceof ApiError ? (e.body.detail as string) : "Failed to suspend user");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReinstate(u: AdminUser) {
    if (!tokens) return;
    setActionLoading(u.id);
    try {
      await apiFetch(`/admins/users/${u.id}/reinstate/`, {
        method: "POST",
        token: tokens.access,
      });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, is_active: true } : x)));
      if (selected?.id === u.id) setSelected({ ...selected, is_active: true });
    } catch (e) {
      alert(e instanceof ApiError ? (e.body.detail as string) : "Failed to reinstate user");
    } finally {
      setActionLoading(null);
    }
  }

  function handleExport() {
    if (!tokens) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins/users/export/`, {
      headers: { Authorization: `Bearer ${tokens.access}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "users_export.csv";
        link.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => alert("Export failed"));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">Users</h2>
        <Button variant="secondary" size="sm" icon={Download} onClick={handleExport}>
          Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {/* Filters */}
        <div className="px-4 py-3.5 border-b-[1.5px] border-neutral-200 flex gap-2.5 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              className="w-full h-[34px] pl-[34px] pr-3 text-[.82rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="h-[34px] px-3 text-[.82rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 w-[140px]"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="tutor">Tutors</option>
          </select>
          <select
            className="h-[34px] px-3 text-[.82rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 w-[140px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin w-6 h-6 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-sm text-neutral-400">No users found.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">User</th>
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Role</th>
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Joined</th>
                <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className="border-b border-neutral-100 last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${avatarColors[i % avatarColors.length]} text-white flex items-center justify-center text-[.65rem] font-bold shrink-0`}>
                        {getInitials(u)}
                      </div>
                      <div>
                        <div className="text-[.875rem] font-semibold">{getDisplayName(u)}</div>
                        <div className="text-[.72rem] text-neutral-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={roleColors[u.role] ?? "neutral"}>
                      {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[.82rem] text-neutral-500">
                    {new Date(u.date_joined).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={u.is_active ? "green" : "red"}>
                      {u.is_active ? "Active" : "Suspended"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(u)}>View</Button>
                      {u.is_active ? (
                        <Button
                          variant="danger-ghost"
                          size="sm"
                          loading={actionLoading === u.id}
                          onClick={() => handleSuspend(u)}
                        >
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          variant="success-ghost"
                          size="sm"
                          loading={actionLoading === u.id}
                          onClick={() => handleReinstate(u)}
                        >
                          Reinstate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* User Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} size="sm">
        {selected && (
          <>
            <ModalHead title={getDisplayName(selected)} subtitle={selected.email} onClose={() => setSelected(null)} />
            <ModalBody>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-neutral-400 mb-0.5">Username</div>
                  <div className="font-medium">{selected.username}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-400 mb-0.5">Role</div>
                  <Badge variant={roleColors[selected.role] ?? "neutral"}>
                    {selected.role.charAt(0).toUpperCase() + selected.role.slice(1)}
                  </Badge>
                </div>
                <div>
                  <div className="text-xs text-neutral-400 mb-0.5">Email Verified</div>
                  <Badge variant={selected.is_email_verified ? "green" : "amber"}>
                    {selected.is_email_verified ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <div className="text-xs text-neutral-400 mb-0.5">Profile Complete</div>
                  <Badge variant={selected.is_profile_complete ? "green" : "amber"}>
                    {selected.is_profile_complete ? "Yes" : "No"}
                  </Badge>
                </div>
                {selected.role === "tutor" && (
                  <div>
                    <div className="text-xs text-neutral-400 mb-0.5">Approved</div>
                    <Badge variant={selected.is_approved ? "green" : "amber"}>
                      {selected.is_approved ? "Yes" : "No"}
                    </Badge>
                  </div>
                )}
                <div>
                  <div className="text-xs text-neutral-400 mb-0.5">Status</div>
                  <Badge variant={selected.is_active ? "green" : "red"}>
                    {selected.is_active ? "Active" : "Suspended"}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-neutral-400 mb-0.5">Joined</div>
                  <div className="font-medium">
                    {new Date(selected.date_joined).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFoot>
              {selected.is_active ? (
                <Button variant="danger-ghost" size="sm" loading={actionLoading === selected.id} onClick={() => handleSuspend(selected)}>
                  Suspend
                </Button>
              ) : (
                <Button variant="success-ghost" size="sm" loading={actionLoading === selected.id} onClick={() => handleReinstate(selected)}>
                  Reinstate
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={() => setSelected(null)}>
                Close
              </Button>
            </ModalFoot>
          </>
        )}
      </Modal>
    </div>
  );
}
