"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import type { Profile, ProfileSetupPayload } from "@/lib/types";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[.78rem] font-semibold text-neutral-700 mb-1.5">
      {children}
    </label>
  );
}

export default function ProfileSetupPage() {
  const { user, tokens, refreshUser } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!tokens?.access) {
      toast.error("You must be signed in to complete your profile.");
      router.push("/auth/signin");
      return;
    }

    setLoading(true);
    try {
      const payload: ProfileSetupPayload = {
        first_name: firstName,
        last_name: lastName,
      };
      if (bio.trim()) payload.bio = bio.trim();
      if (phone.trim()) payload.phone = phone.trim();

      await apiFetch<Profile>("/users/profile/setup/", {
        method: "PATCH",
        body: JSON.stringify(payload),
        token: tokens.access,
      });

      await refreshUser();

      toast.success("Profile completed!");

      // Redirect based on role
      if (user?.role === "tutor" && !user.is_approved) {
        router.push("/auth/pending-approval");
      } else {
        router.push(`/dashboard/${user?.role ?? "student"}`);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        const detail = err.body.detail ?? err.body.first_name ?? err.body.last_name;
        const msg = Array.isArray(detail) ? detail[0] : detail;
        toast.error(typeof msg === "string" ? msg : "Failed to save profile.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mb-6">
        <User className="w-7 h-7 text-primary" />
      </div>

      <h1 className="text-[1.75rem] font-extrabold tracking-tight mb-1.5">
        Complete your profile
      </h1>
      <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
        {user?.role === "tutor"
          ? "Fill in your details so students can learn more about you."
          : "Tell us a bit about yourself to get started."}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <Label>First Name</Label>
            <Input
              placeholder="Amara"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input
              placeholder="Kofi"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label>Bio</Label>
          <textarea
            className="w-full px-3 py-2.5 text-sm rounded-xl border-[1.5px] border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
            rows={3}
            placeholder={
              user?.role === "tutor"
                ? "Tell students about your teaching philosophy and experience..."
                : "A brief intro about yourself and your learning goals..."
            }
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <p className="text-xs text-neutral-400 mt-1">Optional</p>
        </div>

        <div>
          <Label>Phone Number</Label>
          <Input
            type="tel"
            placeholder="+233 XXX XXX XXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <p className="text-xs text-neutral-400 mt-1">Optional</p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          loading={loading}
        >
          {user?.role === "tutor" ? "Complete Profile & Submit" : "Complete Profile"}
        </Button>
      </form>
    </div>
  );
}
