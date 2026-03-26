"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalHead, ModalBody, ModalFoot } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { Check, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import type { TutorCourse, Category, PaginatedResponse } from "@/lib/types";

type Tab = "courses" | "live" | "guides";

const statusBadge: Record<string, "green" | "amber" | "neutral" | "red" | "violet"> = {
  published: "green",
  pending_review: "amber",
  draft: "neutral",
  rejected: "red",
};

const statusLabel: Record<string, string> = {
  published: "Published",
  pending_review: "Pending Review",
  draft: "Draft",
  rejected: "Rejected",
};

export default function TutorContentPage() {
  const { tokens } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("courses");

  // Courses state
  const [courses, setCourses] = useState<TutorCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState<string | null>(null);

  // Create course modal
  const [createOpen, setCreateOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wizardStep, setWizardStep] = useState(1);
  const [moduleInputs, setModuleInputs] = useState([""]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    is_free: true,
    price: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const tabs: { id: Tab; label: string }[] = [
    { id: "courses", label: "Courses" },
    { id: "live", label: "Live Sessions" },
    { id: "guides", label: "Study Guides" },
  ];

  const fetchCourses = useCallback(async () => {
    if (!tokens) return;
    setLoading(true);
    try {
      const data = await apiFetch<PaginatedResponse<TutorCourse>>("/courses/my-courses/", {
        token: tokens.access,
      });
      setCourses(data.results);
    } catch {
      toast.error("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Fetch categories when modal opens
  useEffect(() => {
    if (!createOpen) return;
    apiFetch<PaginatedResponse<Category>>("/courses/categories/")
      .then((d) => setCategories(d.results))
      .catch(() => {});
  }, [createOpen]);

  const stepLabels = ["Course Details", "Add Modules", "Set Pricing", "Review & Submit"];

  function closeWizard() {
    setWizardStep(1);
    setModuleInputs([""]);
    setForm({ title: "", description: "", category: "", is_free: true, price: "" });
    setFormErrors({});
    setCreateOpen(false);
  }

  function validateStep(step: number): boolean {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (!form.title.trim()) errors.title = "Title is required.";
      if (!form.description.trim()) errors.description = "Description is required.";
      if (!form.category) errors.category = "Category is required.";
    } else if (step === 2) {
      if (!moduleInputs.some((t) => t.trim())) errors.modules = "Add at least one module.";
    } else if (step === 3) {
      if (!form.is_free && (!form.price || Number(form.price) <= 0))
        errors.price = "Price must be greater than 0.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleWizardNext() {
    if (!validateStep(wizardStep)) return;
    if (wizardStep < 4) {
      setWizardStep(wizardStep + 1);
      return;
    }
    await saveCourse(true);
  }

  async function saveCourse(submit: boolean) {
    if (!tokens) return;
    setSaving(true);
    try {
      const course = await apiFetch<TutorCourse>("/courses/my-courses/", {
        method: "POST",
        token: tokens.access,
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: Number(form.category),
          is_free: form.is_free,
          price: form.is_free ? "0.00" : form.price,
        }),
      });
      const validModules = moduleInputs.filter((t) => t.trim());
      for (let i = 0; i < validModules.length; i++) {
        await apiFetch(`/courses/my-courses/${course.slug}/modules/`, {
          method: "POST",
          token: tokens.access,
          body: JSON.stringify({
            title: validModules[i].trim(),
            content_type: "video",
            order: i + 1,
          }),
        });
      }
      if (submit) {
        await apiFetch(`/courses/my-courses/${course.slug}/submit/`, {
          method: "POST",
          token: tokens.access,
        });
        toast.success("Course submitted for review!");
      } else {
        toast.success("Course saved as draft!");
      }
      closeWizard();
      fetchCourses();
    } catch (e) {
      if (e instanceof ApiError) {
        const body = e.body as Record<string, string[] | string>;
        const firstKey = Object.keys(body)[0];
        const msg = Array.isArray(body[firstKey]) ? body[firstKey][0] : String(body[firstKey] ?? "Something went wrong.");
        toast.error(msg);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(slug: string) {
    if (!tokens) return;
    setSubmitLoading(slug);
    try {
      await apiFetch(`/courses/my-courses/${slug}/submit/`, {
        method: "POST",
        token: tokens.access,
      });
      toast.success("Course submitted for review!");
      setCourses((prev) =>
        prev.map((c) => (c.slug === slug ? { ...c, status: "pending_review" } : c))
      );
    } catch (e) {
      toast.error(
        e instanceof ApiError ? String((e.body as Record<string, string>).detail ?? "Failed") : "Failed to submit."
      );
    } finally {
      setSubmitLoading(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">My Content</h2>
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
            + New Course
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-neutral-200 mb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-[.85rem] font-semibold border-b-2 transition-colors -mb-px ${
              tab === t.id
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Courses Tab */}
      {tab === "courses" && (
        loading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin w-6 h-6 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <p className="text-sm text-neutral-400">No courses yet. Create your first course!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Course</th>
                  <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Category</th>
                  <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Modules</th>
                  <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Price</th>
                  <th className="px-4 py-3 text-[.72rem] font-bold uppercase tracking-wider text-neutral-500">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id} className="border-b border-neutral-100 last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="text-[.875rem] font-semibold">{c.title}</div>
                      {c.average_rating != null && (
                        <span className="text-[.75rem] text-amber-500 font-bold">{c.average_rating.toFixed(1)}★</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="violet">{c.category_name}</Badge>
                    </td>
                    <td className="px-4 py-3 text-[.82rem]">{c.module_count} modules</td>
                    <td className="px-4 py-3 text-[.82rem] font-semibold">
                      {c.is_free ? "Free" : `$${c.price}`}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadge[c.status] ?? "neutral"}>
                        {statusLabel[c.status] ?? c.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {(c.status === "draft" || c.status === "rejected") && (
                          <Button
                            variant="primary"
                            size="sm"
                            loading={submitLoading === c.slug}
                            onClick={() => handleSubmit(c.slug)}
                          >
                            Submit
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Live Sessions Tab  — placeholder */}
      {tab === "live" && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <p className="text-sm text-neutral-400">Live sessions coming soon.</p>
        </div>
      )}

      {/* Guides Tab — placeholder */}
      {tab === "guides" && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <p className="text-sm text-neutral-400">Study guides coming soon.</p>
        </div>
      )}

      {/* Create Course Wizard */}
      <Modal open={createOpen} onClose={closeWizard} size="lg">
        <ModalHead
          title="Create New Course"
          subtitle={`Step ${wizardStep} of 4 — ${stepLabels[wizardStep - 1]}`}
          onClose={closeWizard}
        />
        <ModalBody>
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-6 px-2">
            {(["Details", "Modules", "Pricing", "Publish"] as const).map((label, i) => {
              const num = i + 1;
              const done = wizardStep > num;
              const active = wizardStep === num;
              return (
                <Fragment key={label}>
                  {i > 0 && (
                    <div className={`flex-1 h-0.5 mx-1 rounded ${done ? "bg-violet-600" : "bg-neutral-200"}`} />
                  )}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      done || active ? "bg-violet-600 text-white" : "bg-neutral-100 text-neutral-400"
                    }`}>
                      {done ? <Check className="w-3.5 h-3.5" /> : num}
                    </div>
                    <span className={`text-[.7rem] font-semibold ${
                      done || active ? "text-violet-600" : "text-neutral-400"
                    }`}>{label}</span>
                  </div>
                </Fragment>
              );
            })}
          </div>

          {/* Step 1: Details */}
          {wizardStep === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Course Title</label>
                <Input
                  placeholder="e.g. Introduction to Linear Algebra"
                  value={form.title}
                  error={!!formErrors.title}
                  onChange={(e) => { setForm({ ...form, title: e.target.value }); setFormErrors((p) => ({ ...p, title: "" })); }}
                />
                {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
                <select
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-[10px] text-sm bg-white text-neutral-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                  value={form.category}
                  onChange={(e) => { setForm({ ...form, category: e.target.value }); setFormErrors((p) => ({ ...p, category: "" })); }}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {formErrors.category && <p className="text-xs text-red-500 mt-1">{formErrors.category}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                <textarea
                  className="w-full h-24 p-3 text-sm border-[1.5px] border-neutral-200 rounded-xl bg-white resize-none focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                  placeholder="What will students learn from this course?"
                  value={form.description}
                  onChange={(e) => { setForm({ ...form, description: e.target.value }); setFormErrors((p) => ({ ...p, description: "" })); }}
                />
                {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Modules */}
          {wizardStep === 2 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-neutral-500 mb-1">Add modules for your course. You can upload content after publishing.</p>
              {formErrors.modules && <p className="text-xs text-red-500">{formErrors.modules}</p>}
              {moduleInputs.map((title, i) => (
                <div key={i} className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2">
                  <span className="text-xs font-bold text-neutral-400 shrink-0 w-5">{i + 1}.</span>
                  <input
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
                    placeholder={`Module ${i + 1} title\u2026`}
                    value={title}
                    onChange={(e) => {
                      const next = [...moduleInputs];
                      next[i] = e.target.value;
                      setModuleInputs(next);
                      setFormErrors((p) => ({ ...p, modules: "" }));
                    }}
                  />
                  {moduleInputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setModuleInputs(moduleInputs.filter((_, j) => j !== i))}
                      className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setModuleInputs([...moduleInputs, ""])}
                className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-700 self-start mt-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Module
              </button>
            </div>
          )}

          {/* Step 3: Pricing */}
          {wizardStep === 3 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_free}
                    onChange={(e) => setForm({ ...form, is_free: e.target.checked, price: e.target.checked ? "" : form.price })}
                    className="w-4 h-4 rounded border-neutral-300 text-violet-600 focus:ring-violet-500"
                  />
                  Free course
                </label>
              </div>
              {!form.is_free && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Price (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-400">$</span>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="49.00"
                        value={form.price}
                        onChange={(e) => { setForm({ ...form, price: e.target.value }); setFormErrors((p) => ({ ...p, price: "" })); }}
                        className="w-full pl-8 pr-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-[10px] text-sm bg-white text-neutral-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                      />
                    </div>
                    {formErrors.price && <p className="text-xs text-red-500 mt-1">{formErrors.price}</p>}
                  </div>
                  {form.price && Number(form.price) > 0 && (
                    <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                      <p className="text-sm font-semibold text-neutral-700 mb-1">Your estimated share (90%)</p>
                      <p className="text-2xl font-extrabold text-violet-600">
                        ${(Number(form.price) * 0.9).toFixed(2)}{" "}
                        <span className="text-sm font-medium text-neutral-500">per sale</span>
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {wizardStep === 4 && (
            <div className="text-center py-5">
              <div className="text-5xl mb-4">🚀</div>
              <h4 className="text-lg font-bold mb-2">Ready to Submit?</h4>
              <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
                Your course will be reviewed by our team within 24 hours. You&apos;ll be notified once it&apos;s live.
              </p>
              <div className="inline-block text-left bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-sm">Course details filled in</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-sm">{moduleInputs.filter((t) => t.trim()).length} module(s) created</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-sm">Pricing — {form.is_free ? "Free" : `$${form.price}`}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFoot>
          <div className="flex items-center justify-between w-full">
            <div>
              {wizardStep > 1 && (
                <Button variant="secondary" size="sm" onClick={() => { setWizardStep(wizardStep - 1); setFormErrors({}); }}>
                  ← Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {wizardStep === 4 && (
                <Button variant="secondary" size="sm" disabled={saving} onClick={() => saveCourse(false)}>
                  Save as Draft
                </Button>
              )}
              <Button variant="primary" size="sm" loading={saving} onClick={handleWizardNext}>
                {wizardStep === 4 ? "🚀 Submit for Review" : "Continue →"}
              </Button>
            </div>
          </div>
        </ModalFoot>
      </Modal>
    </div>
  );
}
