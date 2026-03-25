import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const applications = [
  {
    initials: "KA",
    name: "Kwame Asante Jr.",
    subtitle: "Physics · MSc, University of Cape Town",
    badges: [{ label: "Physics", variant: "violet" as const }, { label: "Applied", variant: "neutral" as const }],
    statement:
      "\"I have 5 years of university lecturing in Quantum Mechanics and Classical Physics. I've developed a 12-week curriculum that takes students from basic kinematics to quantum states.\"",
    color: "bg-violet-600",
  },
  {
    initials: "ND",
    name: "Nkechi Diallo",
    subtitle: "Chemistry · PhD Candidate, UCT",
    badges: [{ label: "Chemistry", variant: "green" as const }, { label: "Applied", variant: "neutral" as const }],
    statement:
      "\"Currently completing my PhD in Organic Chemistry. I have tutored over 200 students through their undergraduate programmes in reaction mechanisms and spectroscopy.\"",
    color: "bg-green-600",
  },
  {
    initials: "OS",
    name: "Oluwaseun Sobande",
    subtitle: "Computer Science · BSc, Covenant University",
    badges: [{ label: "CS", variant: "blue" as const }, { label: "Applied", variant: "neutral" as const }],
    statement:
      "\"Software engineer with 4 years industry experience. I want to teach algorithms and data structures. Created a YouTube channel with 18K subscribers teaching programming.\"",
    color: "bg-orange-500",
  },
];

export default function AdminApplicationsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">Tutor Applications</h2>
      </div>

      <div className="flex flex-col gap-3.5">
        {applications.map((app) => (
          <div key={app.name} className="bg-white rounded-2xl border border-neutral-200 p-5">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full ${app.color} text-white flex items-center justify-center text-sm font-bold shrink-0`}>
                  {app.initials}
                </div>
                <div>
                  <div className="text-[.95rem] font-bold">{app.name}</div>
                  <div className="text-[.8rem] text-neutral-500">{app.subtitle}</div>
                  <div className="flex gap-2 mt-1">
                    {app.badges.map((b) => (
                      <Badge key={b.label} variant={b.variant}>{b.label}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Badge variant="amber">Pending Review</Badge>
            </div>

            {/* Statement */}
            <div className="my-3.5 p-3.5 bg-neutral-50 rounded-xl border-[1.5px] border-neutral-200">
              <p className="text-[.82rem] text-neutral-700 leading-[1.65]">{app.statement}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="success-ghost" size="sm">Approve</Button>
              <Button variant="danger-ghost" size="sm">Reject</Button>
              <Button variant="ghost" size="sm" className="ml-auto">View CV</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
