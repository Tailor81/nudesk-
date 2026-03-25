"use client";

import { Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function PendingApprovalPage() {
  const { logout, user } = useAuth();

  return (
    <div className="w-full max-w-[420px] text-center">
      <div className="w-16 h-16 bg-warning-light rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Clock className="w-8 h-8 text-warning" />
      </div>

      <h1 className="text-[1.75rem] font-extrabold tracking-tight mb-2">
        Application Under Review
      </h1>
      <p className="text-sm text-neutral-500 mb-2 leading-relaxed">
        Thanks for applying to become a tutor on NuDesk
        {user?.username ? `, ${user.username}` : ""}!
      </p>
      <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
        Your application is being reviewed by our team. This usually takes
        2-3 business days. You&apos;ll receive an email once a decision has been made.
      </p>

      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-8">
        <h3 className="text-sm font-semibold text-neutral-700 mb-2">
          What happens next?
        </h3>
        <ul className="text-sm text-neutral-500 text-left space-y-1.5">
          <li className="flex gap-2">
            <span className="text-primary font-bold">1.</span>
            Our admin team reviews your qualifications
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">2.</span>
            You&apos;ll get an email with the outcome
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">3.</span>
            Once approved, you can start creating courses
          </li>
        </ul>
      </div>

      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        icon={LogOut}
        onClick={() => logout()}
      >
        Sign Out
      </Button>
    </div>
  );
}
