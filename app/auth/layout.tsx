import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { Check } from "lucide-react";
import Link from "next/link";

const benefits = [
  "3,200+ courses from vetted experts",
  "Live sessions with real-time Q&A",
  "Certificates you can share anywhere",
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="min-h-screen grid grid-cols-[1fr_1fr]">
        {/* Left panel */}
        <div className="relative bg-gradient-to-br from-violet-700 via-violet-600 to-violet-800 flex flex-col justify-between p-10 min-h-screen overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.08)_0%,transparent_60%)]" />

        <div className="relative z-10">
          <div className="mb-12">
            <Logo variant="dark" />
          </div>
          <h2 className="text-[2rem] font-extrabold text-white leading-tight tracking-tight mb-3">
            Welcome back
            <br />
            to NuDesk
          </h2>
          <p className="text-white/60 leading-relaxed mb-10">
            Continue your learning journey with expert tutors.
          </p>
          <div className="flex flex-col gap-3">
            {benefits.map((b) => (
              <div key={b} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-green-400" strokeWidth={3} />
                </div>
                <p className="text-sm text-white/65">{b}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Demo shortcuts */}
        <div className="relative z-10 bg-white/8 border border-white/12 rounded-2xl p-4">
          <p className="text-[.75rem] text-white/50 font-semibold text-center uppercase tracking-wider mb-2.5">
            Demo Dashboards
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {(["Student", "Tutor", "Admin"] as const).map((role) => (
              <Link
                key={role}
                href={`/dashboard/${role.toLowerCase()}`}
                className="text-sm font-medium text-white bg-white/12 border border-white/15 rounded-lg py-1.5 text-center hover:bg-white/18 transition-colors"
              >
                {role}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel – form side */}
      <div className="flex items-center justify-center p-10 min-h-[calc(100vh-70px)]">
        {children}
      </div>
    </div>
    </>
  );
}
