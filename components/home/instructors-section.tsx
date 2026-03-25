import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";

const instructors = [
  { initials: "SO", name: "Dr. Sarah Osei", field: "Mathematics - Stanford PhD", students: 148, courses: 18, rating: 5, color: "violet" as const },
  { initials: "KA", name: "Prof. Kwame Asante", field: "Physics - MIT PhD", students: 210, courses: 12, rating: 5, color: "orange" as const },
  { initials: "AM", name: "Dr. Ama Mensah", field: "Chemistry - UCT PhD", students: 96, courses: 8, rating: 5, color: "green" as const },
  { initials: "AW", name: "Prof. Abena Wiredu", field: "Economics - LSE MSc", students: 180, courses: 14, rating: 5, color: "yellow" as const },
  { initials: "NO", name: "Nadia Osei-Bonsu", field: "CS - CMU MSc", students: 320, courses: 6, rating: 4, color: "violet" as const },
];

export function InstructorsSection() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-[520px] mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-primary-light text-primary border-[1.5px] border-primary-muted text-[.72rem] font-bold px-3.5 py-1 rounded-full uppercase tracking-[0.07em] mb-3.5">
            Expert Tutors
          </div>
          <h2 className="text-[2.1rem] font-extrabold text-neutral-900 leading-[1.2] tracking-[-0.03em]">
            Meet Your Instructors
          </h2>
          <p className="text-base text-neutral-500 mx-auto leading-[1.65] mt-3.5">
            Every tutor on NuDesk is PhD-qualified or professionally certified,
            with proven teaching track records.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {instructors.map((inst) => (
            <div
              key={inst.name}
              className="bg-white border-[1.5px] border-neutral-200 rounded-[20px] p-5 text-center cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-[3px]"
            >
              <Avatar
                initials={inst.initials}
                size="xl"
                color={inst.color}
                className="mx-auto mb-3"
              />
              <div className="text-[.9rem] font-bold mb-0.5">{inst.name}</div>
              <div className="text-[.78rem] text-neutral-500 mb-2">
                {inst.field}
              </div>
              <div className="flex justify-center mb-1.5">
                <StarRating rating={inst.rating} />
              </div>
              <div className="text-xs text-neutral-500">
                {inst.students} students &middot; {inst.courses} courses
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline-v" size="lg" href="/how-it-works">
            Become a Tutor
          </Button>
        </div>
      </div>
    </section>
  );
}
