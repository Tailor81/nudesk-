import {
  PlaySquare,
  Radio,
  FileText,
  ShieldCheck,
  Star,
  BarChart3,
} from "lucide-react";

const features = [
  {
    Icon: PlaySquare,
    title: "On-Demand Courses",
    desc: "Video-based courses structured into modules with quizzes, certificates, and lifetime access.",
    bg: "bg-primary-light",
    color: "text-primary",
  },
  {
    Icon: Radio,
    title: "Live Classes",
    desc: "Join real-time sessions with expert tutors. Interactive Q&A, screen sharing, and live chat.",
    bg: "bg-accent-light",
    color: "text-accent",
  },
  {
    Icon: FileText,
    title: "Study Guides",
    desc: "Expert-written reference materials, worked examples, and notes you can download forever.",
    bg: "bg-success-light",
    color: "text-success",
  },
  {
    Icon: ShieldCheck,
    title: "Vetted Experts Only",
    desc: "Only 6% of applicants are approved. Every tutor is credential-verified and teaching-tested.",
    bg: "bg-blue-50",
    color: "text-blue-600",
  },
  {
    Icon: Star,
    title: "Verified Certificates",
    desc: "Earn shareable digital certificates on course completion. Add them to LinkedIn with one click.",
    bg: "bg-amber-50",
    color: "text-amber-600",
  },
  {
    Icon: BarChart3,
    title: "Progress Tracking",
    desc: "Visual dashboards showing your streaks, completion rates, scores, and feedback in one place.",
    bg: "bg-fuchsia-50",
    color: "text-purple-600",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-[520px] mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-primary-light text-primary border-[1.5px] border-primary-muted text-[.72rem] font-bold px-3.5 py-1 rounded-full uppercase tracking-[0.07em] mb-3.5">
            <Sparkle /> Platform
          </div>
          <h2 className="text-[2.6rem] font-extrabold text-neutral-900 leading-[1.2] tracking-[-0.03em]">
            Why Students Love NuDesk
          </h2>
          <p className="text-base text-neutral-500 mx-auto leading-[1.65] mt-3.5">
            Everything you need to go from confused to confident.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:border-violet-200 hover:shadow-xl hover:-translate-y-[3px]"
            >
              <div
                className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center mb-4 ${f.bg}`}
              >
                <f.Icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <div className="text-[.975rem] font-bold mb-2">{f.title}</div>
              <div className="text-sm text-neutral-500 leading-[1.6]">
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sparkle() {
  return (
    <svg
      className="w-3 h-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364" />
    </svg>
  );
}
