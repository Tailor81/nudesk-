import { Button } from "@/components/ui/button";

export default function TutorSettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">Settings</h2>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-4">
        {/* Left column */}
        <div className="flex flex-col gap-3.5">
          {/* Profile */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="text-[.9rem] font-bold mb-5">Tutor Profile</div>
            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[.72rem] font-bold uppercase tracking-[0.07em] text-neutral-500 mb-1.5">
                    First Name
                  </label>
                  <input
                    className="w-full h-10 px-3 text-[.875rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                    defaultValue="Sarah"
                  />
                </div>
                <div>
                  <label className="block text-[.72rem] font-bold uppercase tracking-[0.07em] text-neutral-500 mb-1.5">
                    Last Name
                  </label>
                  <input
                    className="w-full h-10 px-3 text-[.875rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                    defaultValue="Osei"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[.72rem] font-bold uppercase tracking-[0.07em] text-neutral-500 mb-1.5">
                  Professional Title
                </label>
                <input
                  className="w-full h-10 px-3 text-[.875rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                  defaultValue="Dr. · Stanford PhD, Mathematics"
                />
              </div>
              <div>
                <label className="block text-[.72rem] font-bold uppercase tracking-[0.07em] text-neutral-500 mb-1.5">
                  Bio
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2.5 text-[.875rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 resize-none"
                  defaultValue="PhD in Applied Mathematics from Stanford. Specialising in calculus, linear algebra, and differential equations with 8 years of teaching experience."
                />
              </div>
              <div>
                <label className="block text-[.72rem] font-bold uppercase tracking-[0.07em] text-neutral-500 mb-1.5">
                  Subject Expertise
                </label>
                <input
                  className="w-full h-10 px-3 text-[.875rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                  defaultValue="Mathematics, Statistics, Linear Algebra"
                />
              </div>
              <Button variant="primary">Save Changes</Button>
            </div>
          </div>

          {/* Payout Settings */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="text-[.9rem] font-bold mb-5">Payout Settings</div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-[.72rem] font-bold uppercase tracking-[0.07em] text-neutral-500 mb-1.5">
                  Bank Account (IBAN)
                </label>
                <input
                  className="w-full h-10 px-3 text-[.875rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                  defaultValue="GB82 WEST 1234 5698 7654 32"
                />
              </div>
              <div>
                <label className="block text-[.72rem] font-bold uppercase tracking-[0.07em] text-neutral-500 mb-1.5">
                  Payout Frequency
                </label>
                <select className="w-full h-10 px-3 text-[.875rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10">
                  <option>Monthly (1st)</option>
                  <option>Bi-weekly</option>
                </select>
              </div>
              <Button variant="secondary">Update Bank Details</Button>
            </div>
          </div>
        </div>

        {/* Right column — Plan */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 h-fit">
          <div className="text-[.9rem] font-bold mb-1">Current Plan</div>
          <div className="text-[.8rem] text-neutral-500 mb-4">Tutor Pro</div>

          {/* Plan gradient card */}
          <div
            className="rounded-xl p-4 text-white mb-3.5"
            style={{ background: "linear-gradient(135deg, var(--color-orange-500), var(--color-orange-600))" }}
          >
            <div className="text-[.7rem] font-bold opacity-60 uppercase tracking-[0.08em] mb-1">
              Pro Plan
            </div>
            <div className="text-[1.5rem] font-extrabold">
              90% <span className="text-[.875rem] opacity-60">revenue share</span>
            </div>
            <div className="text-[.78rem] opacity-60 mt-1">+ $29/mo · Renews Dec 1</div>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-2.5">
            {["Featured placement in search", "Bi-weekly payouts", "Dedicated growth support"].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-green-600)" strokeWidth={2.5} width={14} height={14}>
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-[.82rem]">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
