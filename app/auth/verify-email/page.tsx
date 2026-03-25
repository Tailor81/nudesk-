"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch, ApiError } from "@/lib/api";

type Status = "loading" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>(token ? "loading" : "error");
  const [message, setMessage] = useState(token ? "" : "No verification token provided.");

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function verify() {
      try {
        const data = await apiFetch<{ detail: string }>(
          `/users/verify-email/?token=${encodeURIComponent(token!)}`,
        );
        if (!cancelled) {
          setStatus("success");
          setMessage(data.detail);
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          if (err instanceof ApiError) {
            const detail = err.body.detail;
            setMessage(
              typeof detail === "string" ? detail : "Verification failed."
            );
          } else {
            setMessage("Something went wrong. Please try again.");
          }
        }
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="w-full max-w-[420px] text-center">
      {status === "loading" && (
        <>
          <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
          </div>
          <h1 className="text-[1.75rem] font-extrabold tracking-tight mb-2">
            Verifying your email...
          </h1>
          <p className="text-sm text-neutral-500">Please wait a moment.</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-16 h-16 bg-success-light rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-[1.75rem] font-extrabold tracking-tight mb-2">
            Email verified!
          </h1>
          <p className="text-sm text-neutral-500 mb-8">{message}</p>
          <Link href="/auth/signin">
            <Button variant="primary" size="lg" className="w-full">
              Continue to Sign In
            </Button>
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-16 h-16 bg-error-light rounded-2xl flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-error" />
          </div>
          <h1 className="text-[1.75rem] font-extrabold tracking-tight mb-2">
            Verification failed
          </h1>
          <p className="text-sm text-neutral-500 mb-8">{message}</p>
          <div className="flex flex-col gap-3">
            <Link href="/auth/signin">
              <Button variant="primary" size="lg" className="w-full">
                Go to Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="secondary" size="lg" className="w-full">
                Create a new account
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
