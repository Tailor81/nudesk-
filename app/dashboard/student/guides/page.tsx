import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const guides = [
  {
    emoji: "📐",
    iconBg: "bg-violet-50",
    title: "Calculus I — Complete Notes",
    description: "Limits, derivatives, integration techniques",
    author: "Dr. Sarah Osei · 42 pages",
  },
  {
    emoji: "⚛️",
    iconBg: "bg-orange-50",
    title: "Quantum Mechanics Reference",
    description: "Wave functions, operators, Schrödinger equation",
    author: "Prof. Kwame Asante · 38 pages",
  },
  {
    emoji: "🧪",
    iconBg: "bg-green-50",
    title: "Organic Chemistry Mechanisms",
    description: "Substitution, elimination, addition reactions",
    author: "Dr. Ama Mensah · 56 pages",
  },
];

export default function StudentGuidesPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">
          Study Guides
        </h2>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {guides.map((g) => (
          <div
            key={g.title}
            className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-5 hover:border-violet-200 hover:shadow-xl hover:-translate-y-[3px] transition-all cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-[10px] ${g.iconBg} flex items-center justify-center text-[1.2rem] mb-3.5`}
            >
              {g.emoji}
            </div>
            <div className="text-[.9rem] font-bold mb-1">{g.title}</div>
            <div className="text-[.8rem] text-neutral-500 mb-3">
              {g.description}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">{g.author}</span>
              <div className="flex gap-2">
                <Button variant="ghost-v" size="sm">
                  Read
                </Button>
                <Button variant="outline-v" size="sm">
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
