"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-[1.5px] border-neutral-200 rounded-2xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-neutral-900">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-40" : "max-h-0"
        }`}
      >
        <div className="px-5 pb-4 text-sm text-neutral-500 leading-relaxed">
          {a}
        </div>
      </div>
    </div>
  );
}
