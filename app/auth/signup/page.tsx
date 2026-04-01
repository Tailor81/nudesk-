"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ShieldCheck, GraduationCap, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { apiFetch, ApiError } from "@/lib/api";
import type { RegisterPayload } from "@/lib/types";

function PasswordInput({
  value,
  onChange,
  id,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  id: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder ?? "Min. 8 characters"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        minLength={8}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[.78rem] font-semibold text-neutral-700 mb-1.5">
      {children}
    </label>
  );
}

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Economics",
  "Other",
];

const qualifications = [
  "Bachelor's Degree",
  "Master's Degree",
  "PhD / Doctorate",
  "Professional Certification",
];

function extractErrors(body: Record<string, unknown>): string {
  const messages: string[] = [];
  for (const [key, val] of Object.entries(body)) {
    if (Array.isArray(val)) {
      messages.push(...val.map((v) => String(v)));
    } else if (typeof val === "string") {
      messages.push(val);
    } else if (key === "detail" && typeof val === "string") {
      messages.push(val);
    }
  }
  return messages.length > 0 ? messages[0] : "Registration failed. Please try again.";
}

export default function SignUpPage() {
  const [tab, setTab] = useState<"student" | "tutor" | "parent">("student");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  // shared fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // tutor-only fields
  const [subject, setSubject] = useState("");
  const [qualification, setQualification] = useState("");
  const [statement, setStatement] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const payload: RegisterPayload = {
        email,
        username,
        password,
        password_confirm: passwordConfirm,
        role: tab,
      };

      if (tab === "tutor") {
        payload.subject_area = subject;
        payload.qualifications = qualification;
        payload.statement = statement;
      }

      await apiFetch("/users/register/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      router.push(`/auth/check-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(extractErrors(err.body));
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      <h1 className="text-[1.75rem] font-extrabold tracking-tight mb-1.5">
        Create Account
      </h1>
      <p className="text-sm text-neutral-500 mb-6">
        Already have an account?{" "}
        <Link
          href="/auth/signin"
          className="text-primary font-semibold hover:underline"
        >
          Sign in &rarr;
        </Link>
      </p>

      {/* Role tabs */}
      <div className="inline-flex bg-neutral-100 rounded-xl p-1 gap-1 mb-6">
        <button
          type="button"
          onClick={() => setTab("student")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "student"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Student
        </button>
        <button
          type="button"
          onClick={() => setTab("tutor")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "tutor"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Tutor
        </button>
        <button
          type="button"
          onClick={() => setTab("parent")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "parent"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          <Users className="w-4 h-4" />
          Parent
        </button>
      </div>

      {tab === "tutor" && (
        <div className="mb-4">
          <Badge variant="violet">
            <ShieldCheck className="w-3 h-3 inline mr-1" />
            Manually reviewed &middot; 2-3 business days
          </Badge>
        </div>
      )}

      {tab === "parent" && (
        <div className="mb-4">
          <Badge variant="orange">
            <Users className="w-3 h-3 inline mr-1" />
            Monitor &amp; support your child&apos;s learning
          </Badge>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div>
          <Label>Username</Label>
          <Input
            placeholder={tab === "tutor" ? "dr_sarah" : tab === "parent" ? "parent_name" : "amara_k"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Email address</Label>
          <Input
            type="email"
            placeholder={
              tab === "tutor" ? "you@university.edu" : tab === "parent" ? "parent@example.com" : "you@example.com"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {tab === "tutor" && (
          <>
            <div>
              <Label>Subject Expertise</Label>
              <select
                className="w-full h-10 px-3 text-sm rounded-xl border-[1.5px] border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              >
                <option value="">Select subject...</option>
                {subjects.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Highest Qualification</Label>
              <select
                className="w-full h-10 px-3 text-sm rounded-xl border-[1.5px] border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                required
              >
                <option value="">Select...</option>
                {qualifications.map((q) => (
                  <option key={q}>{q}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Brief Introduction</Label>
              <textarea
                className="w-full px-3 py-2.5 text-sm rounded-xl border-[1.5px] border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                rows={2}
                placeholder="Your teaching experience and motivation..."
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div>
          <Label>Password</Label>
          <PasswordInput
            id={tab === "tutor" ? "tu-pw" : "su-pw"}
            value={password}
            onChange={setPassword}
          />
        </div>

        <div>
          <Label>Confirm Password</Label>
          <PasswordInput
            id={tab === "tutor" ? "tu-pw-c" : "su-pw-c"}
            value={passwordConfirm}
            onChange={setPasswordConfirm}
            placeholder="Repeat your password"
          />
        </div>

        <Button
          type="submit"
          variant={tab === "tutor" ? "accent" : "primary"}
          size="lg"
          className="w-full"
          loading={loading}
        >
          {tab === "tutor"
            ? "Submit Application"
            : tab === "parent"
            ? "Create Parent Account"
            : "Create Student Account"}
        </Button>

        <p className="text-[.75rem] text-neutral-500 text-center">
          By registering you agree to our{" "}
          <a href="#" className="text-primary hover:underline">
            Terms
          </a>{" "}
          &amp;{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}
