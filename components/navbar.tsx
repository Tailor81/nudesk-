"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/study-guides", label: "Study Guides" },
  { href: "/live-sessions", label: "Live Sessions" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 h-[70px] z-[200] bg-white/92 backdrop-blur-[16px] backdrop-saturate-[180%] border-b border-black/7 flex items-center transition-shadow duration-200">
      <div className="max-w-[1200px] mx-auto px-6 w-full flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium px-3.5 py-[7px] rounded-lg transition-colors",
                pathname === link.href
                  ? "text-primary font-semibold"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Button variant="primary" size="md" href={`/dashboard/${user.role}`}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="md" href="/auth/signin">
                Sign In
              </Button>
              <Button variant="primary" size="md" href="/auth/signup">
                Get Started Free
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
