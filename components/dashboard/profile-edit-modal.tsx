"use client";

import { useEffect, useState } from "react";
import { Modal, ModalHead, ModalBody, ModalFoot } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import type { Profile } from "@/lib/types";

interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileEditModal({ open, onClose }: ProfileEditModalProps) {
  const { tokens, profile, fetchProfile, refreshUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Populate form when modal opens or profile changes
  useEffect(() => {
    if (open && profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setBio(profile.bio || "");
      setPhone(profile.phone || "");
      setError("");
      setSuccess(false);
    }
  }, [open, profile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!tokens) return;
    setSaving(true);
    setError("");
    setSuccess(false);

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
      await refreshUser();
      setSuccess(true);
      setTimeout(() => onClose(), 600);
    } catch (err) {
      if (err instanceof ApiError) {
        const detail = err.body.detail ?? Object.values(err.body).flat().join(", ");
        setError(typeof detail === "string" ? detail : "Failed to save profile.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHead title="Edit Profile" subtitle="Update your personal information" onClose={onClose} />
      <form onSubmit={handleSave}>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[.78rem] font-semibold text-neutral-700 mb-1.5">
                  First Name
                </label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className="block text-[.78rem] font-semibold text-neutral-700 mb-1.5">
                  Last Name
                </label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[.78rem] font-semibold text-neutral-700 mb-1.5">
                Bio
              </label>
              <textarea
                className="w-full px-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-[10px] text-sm bg-white text-neutral-900 outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-neutral-400 focus:border-primary focus:shadow-[0_0_0_3px_rgba(124,58,237,.12)] resize-none h-20"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself…"
              />
            </div>
            <div>
              <label className="block text-[.78rem] font-semibold text-neutral-700 mb-1.5">
                Phone
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+27 XXX XXX XXXX"
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            {success && <p className="text-xs text-green-600">Profile saved!</p>}
          </div>
        </ModalBody>
        <ModalFoot>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={saving}>
            Save Changes
          </Button>
        </ModalFoot>
      </form>
    </Modal>
  );
}
