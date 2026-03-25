"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ShieldCheck, GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function PasswordInput({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder="Min. 8 characters"
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

export default function SignUpPage() {
  const [tab, setTab] = useState<"student" | "tutor">("student");
  const [loading, setLoading] = useState(false);

  // shared fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // tutor-only fields
  const [subject, setSubject] = useState("");
  const [qualification, setQualification] = useState("");
  const [introduction, setIntroduction] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: integrate with backend register API
    setLoading(false);
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
      </div>

      {tab === "tutor" && (
        <div className="mb-4">
          <Badge variant="violet">
            <ShieldCheck className="w-3 h-3 inline mr-1" />
            Manually reviewed &middot; 2-3 business days
          </Badge>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <Label>First Name</Label>
            <Input
              placeholder={tab === "tutor" ? "Dr. Sarah" : "Amara"}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input
              placeholder={tab === "tutor" ? "Osei" : "Kofi"}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label>Email address</Label>
          <Input
            type="email"
            placeholder={
              tab === "tutor" ? "you@university.edu" : "you@example.com"
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
                placeholder="Your experience and qualifications..."
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
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

        <Button
          type="submit"
          variant={tab === "tutor" ? "accent" : "primary"}
          size="lg"
          className="w-full"
          loading={loading}
        >
          {tab === "tutor" ? "Submit Application" : "Create Student Account"}
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
