"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import type { LoginUser, AuthTokens } from "@/lib/types";

export default function AdminLoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { setAuth } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Use the hidden admin login endpoint
      const data = await apiFetch<{
        access: string;
        refresh: string;
        user: LoginUser;
      }>("/users/login/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.user.role !== "admin") {
        toast.error("Admin access only.");
        setLoading(false);
        return;
      }

      const tokens: AuthTokens = {
        access: data.access,
        refresh: data.refresh,
      };

      setAuth(data.user, tokens);
      toast.success("Welcome back, Admin.");
      router.push("/dashboard/admin");
    } catch (err) {
      if (err instanceof ApiError) {
        const detail =
          err.body.detail ??
          (Array.isArray(err.body.non_field_errors)
            ? err.body.non_field_errors[0]
            : null);
        toast.error(
          typeof detail === "string" ? detail : "Invalid credentials."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              NuDesk Admin
            </h1>
            <p className="text-xs text-white/40">Platform management console</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <h2 className="text-lg font-bold mb-1">Admin Sign In</h2>
          <p className="text-sm text-neutral-500 mb-5">
            Restricted to authorized administrators only.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[.78rem] font-semibold text-neutral-700 mb-1.5">
                Email address
              </label>
              <Input
                type="email"
                placeholder="admin@nudesk.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[.78rem] font-semibold text-neutral-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
            >
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-xs text-white/25 text-center mt-6">
          This login is restricted to NuDesk administrators.
        </p>
      </div>
    </div>
  );
}
