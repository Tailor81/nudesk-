"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { apiFetch, ApiError } from "@/lib/api";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [resending, setResending] = useState(false);
  const toast = useToast();

  async function handleResend() {
    if (!email) {
      toast.error("No email address provided.");
      return;
    }

    setResending(true);
    try {
      await apiFetch<{ detail: string }>("/users/resend-verification/", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      toast.success("Verification email sent! Check your inbox.");
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        toast.warning("Please wait before requesting another email.");
      } else {
        toast.error("Could not resend. Please try again later.");
      }
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="w-full max-w-[420px] text-center">
      <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Mail className="w-8 h-8 text-primary" />
      </div>

      <h1 className="text-[1.75rem] font-extrabold tracking-tight mb-2">
        Check your email
      </h1>
      <p className="text-sm text-neutral-500 mb-2 leading-relaxed">
        We sent a verification link to
      </p>
      {email && (
        <p className="text-sm font-semibold text-neutral-800 mb-6">{email}</p>
      )}

      <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
        Click the link in the email to verify your account.
        <br />
        You won&apos;t be able to sign in until your email is verified.
      </p>

      <div className="flex flex-col gap-3">
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          icon={RefreshCw}
          loading={resending}
          onClick={handleResend}
        >
          Resend verification email
        </Button>

        <Link href="/auth/signin">
          <Button variant="primary" size="lg" className="w-full">
            Go to Sign In
          </Button>
        </Link>
      </div>

      <p className="text-xs text-neutral-400 mt-6">
        Didn&apos;t receive it? Check your spam folder or try resending.
      </p>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense>
      <CheckEmailContent />
    </Suspense>
  );
}
