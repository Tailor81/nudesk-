import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <div className="bg-neutral-900 py-20 text-center">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="inline-flex items-center gap-1.5 bg-primary-light text-primary border-[1.5px] border-primary-muted text-[.72rem] font-bold px-3.5 py-1 rounded-full uppercase tracking-[0.07em] mb-5 justify-center">
          Get Started Today
        </div>
        <h2 className="text-[2.6rem] font-extrabold text-white text-center mb-3.5 tracking-[-0.03em]">
          Start Learning for Free
        </h2>
        <p className="text-neutral-400 text-center text-[1.05rem] mb-9 max-w-[480px] mx-auto">
          Join 12,000+ students who are already building skills with NuDesk&apos;s
          expert tutors.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button variant="primary" size="xl" href="/auth/signup">
            Create Free Account
          </Button>
          <Button
            variant="ghost"
            size="xl"
            className="border-neutral-700 text-neutral-200 hover:bg-neutral-800"
            href="/auth/signup?role=tutor"
          >
            Apply as a Tutor
          </Button>
        </div>
      </div>
    </div>
  );
}
