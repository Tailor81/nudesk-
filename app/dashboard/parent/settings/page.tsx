"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import type { Profile } from "@/lib/types";

export default function ParentSettingsPage() {
  const { user, tokens, fetchProfile } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");

  const [notifications, setNotifications] = useState({
    childActivity: true,
    paymentReceipts: true,
    newCourses: false,
    weeklyReport: true,
  });

  const loadProfile = useCallback(async () => {
    if (!tokens) return;
    setLoading(true);
    try {
      const p = await apiFetch<Profile>("/users/profile/setup/", {
        token: tokens.access,
      });
      setFirstName(p.first_name);
      setLastName(p.last_name);
      setBio(p.bio || "");
      setPhone(p.phone || "");
    } catch {
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [tokens, toast]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!tokens) return;
    setSaving(true);
    try {
      await apiFetch<Profile>("/users/profile/setup/", {
        method: "PATCH",
        token: tokens.access,
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          bio,
          phone,
        }),
      });
      await fetchProfile();
      toast.success("Profile updated.");
    } catch (err) {
      if (err instanceof ApiError) {
        const detail =
          err.body.detail ?? Object.values(err.body).flat().join(", ");
        toast.error(typeof detail === "string" ? detail : "Failed to save.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">
          Account Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        {/* Left column */}
        <div className="flex flex-col gap-3.5">
          {/* Profile form */}
          <form
            onSubmit={handleSave}
            className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-6"
          >
            <div className="text-[.9rem] font-bold mb-5">
              Profile Information
            </div>
            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[.8rem] font-semibold text-neutral-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-[10px] text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[.8rem] font-semibold text-neutral-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-[10px] text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[.8rem] font-semibold text-neutral-700 mb-1.5">
                  Email
                </label>
                <input
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-[10px] text-sm bg-neutral-50 text-neutral-500 cursor-not-allowed"
                  value={user?.email ?? ""}
                  disabled
                />
              </div>
              <div>
                <label className="block text-[.8rem] font-semibold text-neutral-700 mb-1.5">
                  Phone
                </label>
                <input
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-[10px] text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+27 XXX XXX XXXX"
                />
              </div>
              <div>
                <label className="block text-[.8rem] font-semibold text-neutral-700 mb-1.5">
                  Bio
                </label>
                <textarea
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-[10px] text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-y min-h-[88px] leading-[1.6]"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <Button type="submit" variant="primary" loading={saving}>
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3.5">
          {/* Notifications */}
          <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-6">
            <div className="text-[.9rem] font-bold mb-4">Notifications</div>
            <div className="flex flex-col gap-3.5">
              {(
                [
                  {
                    label: "Child activity updates",
                    key: "childActivity" as const,
                  },
                  {
                    label: "Payment receipts",
                    key: "paymentReceipts" as const,
                  },
                  {
                    label: "New course recommendations",
                    key: "newCourses" as const,
                  },
                  {
                    label: "Weekly progress report",
                    key: "weeklyReport" as const,
                  },
                ] as const
              ).map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <span className="text-[.85rem]">{item.label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifications[item.key]}
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key],
                      }))
                    }
                    className={`relative w-10 h-[22px] rounded-full transition-colors ${
                      notifications[item.key]
                        ? "bg-primary"
                        : "bg-neutral-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full transition-transform ${
                        notifications[item.key]
                          ? "translate-x-[18px]"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Account info */}
          <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-6">
            <div className="text-[.9rem] font-bold mb-4">Account</div>
            <div className="space-y-3 text-sm text-neutral-600">
              <div className="flex justify-between">
                <span className="text-neutral-500">Role</span>
                <span className="font-semibold text-neutral-800 capitalize">
                  {user?.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Account status</span>
                <span
                  className={`font-semibold ${
                    user?.is_approved ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {user?.is_approved ? "Active" : "Pending approval"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
