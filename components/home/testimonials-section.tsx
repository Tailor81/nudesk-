import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";

const testimonials = [
  {
    quote:
      "NuDesk completely changed how I study. Dr. Osei's calculus course was the clearest teaching I've ever experienced -- I went from failing to top of my class.",
    name: "Amara Kofi",
    role: "Computer Science, Year 2",
    initials: "AK",
    color: "violet" as const,
  },
  {
    quote:
      "The study guides alone are worth it. Thoroughly written, exam-focused, exactly what you need. Combined with the live Q&A sessions -- incredible value.",
    name: "Zanele Mokoena",
    role: "Medicine, Year 3",
    initials: "ZM",
    color: "green" as const,
  },
  {
    quote:
      "As a tutor, NuDesk gave me real tools to build income from teaching. My first month I had 80 enrolled students -- the platform just works.",
    name: "Olumide Martins",
    role: "Tutor -- Physics",
    initials: "OM",
    color: "orange" as const,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-[500px] mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-primary-light text-primary border-[1.5px] border-primary-muted text-[.72rem] font-bold px-3.5 py-1 rounded-full uppercase tracking-[0.07em] mb-3.5">
            Reviews
          </div>
          <h2 className="text-[2.1rem] font-extrabold text-neutral-900 leading-[1.2] tracking-[-0.03em]">
            What Our Students Say
          </h2>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white border-[1.5px] border-neutral-200 rounded-[20px] p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-[3px]"
            >
              <div className="text-[2.5rem] text-primary leading-none mb-2.5 font-serif">
                &ldquo;
              </div>
              <p className="text-[.9rem] text-neutral-700 leading-[1.6] mb-5">
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <Avatar initials={t.initials} size="md" color={t.color} />
                <div>
                  <div className="text-sm font-bold">{t.name}</div>
                  <div className="text-xs text-neutral-500">{t.role}</div>
                </div>
                <div className="ml-auto">
                  <StarRating rating={5} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
