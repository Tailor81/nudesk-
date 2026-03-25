import Link from "next/link";
import { Logo } from "@/components/logo";

const platformLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
];

const accountLinks = [
  { href: "/auth/signup", label: "Sign Up" },
  { href: "/auth/signin", label: "Sign In" },
  { href: "/auth/signup?role=tutor", label: "Become a Tutor" },
];

const dashboardLinks = [
  { href: "/dashboard/student", label: "Student" },
  { href: "/dashboard/tutor", label: "Tutor" },
  { href: "/dashboard/admin", label: "Admin" },
];

export function Footer() {
  return (
    <footer className="pt-14 pb-8 bg-neutral-900 border-t border-neutral-800">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
          <div>
            <Logo variant="light" className="mb-3.5" />
            <p className="text-sm text-neutral-500 leading-relaxed max-w-[240px]">
              The professional marketplace for expert tutoring. Learn from the
              best.
            </p>
          </div>

          <div>
            <div className="text-[.72rem] font-bold text-neutral-600 uppercase tracking-wider mb-3.5">
              Platform
            </div>
            <div className="flex flex-col gap-2.5">
              {platformLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-neutral-500 hover:text-neutral-200 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[.72rem] font-bold text-neutral-600 uppercase tracking-wider mb-3.5">
              Account
            </div>
            <div className="flex flex-col gap-2.5">
              {accountLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-neutral-500 hover:text-neutral-200 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[.72rem] font-bold text-neutral-600 uppercase tracking-wider mb-3.5">
              Dashboards
            </div>
            <div className="flex flex-col gap-2.5">
              {dashboardLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-neutral-800 mb-5" />
        <div className="flex justify-between items-center flex-wrap gap-3">
          <p className="text-[.78rem] text-neutral-600">
            &copy; {new Date().getFullYear()} NuDesk. All rights reserved.
          </p>
          <p className="text-[.78rem] text-neutral-600">
            Inspired by SkillBridge. Built with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
