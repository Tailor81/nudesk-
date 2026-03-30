"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { apiFetch, ApiError } from "@/lib/api";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-[400px] py-20 text-center text-sm text-neutral-400">Loading...</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== passwordConfirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!token) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }
    setLoading(true);
    try {
      await apiFetch("/users/reset-password/", {
        method: "POST",
        body: JSON.stringify({ token, password, password_confirm: passwordConfirm }),
      });
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        const detail = err.body?.detail;
        toast.error(typeof detail === "string" ? detail : "Reset failed. The link may have expired.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-[400px]">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-[1.75rem] font-extrabold tracking-tight mb-1.5">
          Invalid reset link
        </h1>
        <p className="text-sm text-neutral-500 mb-7">
          This password reset link is invalid or missing the token. Please request a new one.
        </p>
        <Button variant="primary" size="md" className="w-full" href="/auth/forgot-password">
          Request New Link
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-[400px]">
        <div className="text-4xl mb-4">✅</div>
        <h1 className="text-[1.75rem] font-extrabold tracking-tight mb-1.5">
          Password reset!
        </h1>
        <p className="text-sm text-neutral-500 mb-7">
          Your password has been updated. You can now sign in with your new password.
        </p>
        <Button variant="primary" size="md" className="w-full" href="/auth/signin">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px]">
      <h1 className="text-[1.75rem] font-extrabold tracking-tight mb-1.5">
        Reset your password
      </h1>
      <p className="text-sm text-neutral-500 mb-7">
        Choose a new password for your account.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-[.78rem] font-semibold text-neutral-700 mb-1.5">
            New password
          </label>
          <div className="relative">
            <Input
              type={showPw ? "text" : "password"}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[.78rem] font-semibold text-neutral-700 mb-1.5">
            Confirm new password
          </label>
          <Input
            type={showPw ? "text" : "password"}
            placeholder="Repeat your password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <Button variant="primary" size="md" className="w-full" loading={loading}>
          Reset Password
        </Button>
      </form>

      <p className="text-sm text-neutral-500 mt-6 text-center">
        <Link href="/auth/signin" className="text-primary font-semibold hover:underline">
          &larr; Back to Sign In
        </Link>
      </p>
    </div>
  );
}
