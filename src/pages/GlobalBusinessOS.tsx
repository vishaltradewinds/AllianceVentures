import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, Compass, Globe2, ShieldCheck, Workflow } from 'lucide-react';

type Intake = {
  company: string;
  activity: string;
  objective: string;
  budget: string;
  timeline: string;
  preferredMarkets: string;
  facilityNeeds: string;
  constraints: string;
};

const initialIntake: Intake = {
  company: '',
  activity: '',
  objective: 'Compare lawful ways to enter an overseas market',
  budget: '',
  timeline: '6–12 months',
  preferredMarkets: '',
  facilityNeeds: '',
  constraints: '',
};

export default function GlobalBusinessOS() {
  const [intake, setIntake] = useState<Intake>(initialIntake);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const update = (field: keyof Intake, value: string) => {
    setIntake((current) => ({ ...current, [field]: value }));
    setSubmitted(false);
    setErrors([]);
  };

  const completeness = useMemo(() => {
    const required = [intake.company.trim(), intake.activity.trim(), intake.budget.trim()];
    return Math.round((required.filter(Boolean).length / required.length) * 100);
  }, [intake.company, intake.activity, intake.budget]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const missing: string[] = [];
    if (!intake.company.trim()) missing.push('Company or project name');
    if (!intake.activity.trim()) missing.push('Business activity');
    if (!intake.budget.trim()) missing.push('Investment budget range');
    setErrors(missing);
    if (missing.length === 0) setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#070a0f] text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft size={16} /> AllianceVentures
        </Link>

        <header className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-medium tracking-wide text-cyan-200">
              <Globe2 size={14} /> SHAKTI STANDARDS · GLOBAL-FIRST
            </div>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Establish overseas with <span className="text-cyan-300">evidence, not guesswork.</span>
            </h1>
            <p className="mt-5 max-w-2xl leading-7 text-slate-400">
              Start with your business requirements. The intended workflow compares lawful entry routes, locations,
              establishment costs and growth conditions before recommending a path.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-200"><ShieldCheck size={22} /></div>
              <div>
                <p className="font-medium">Evidence-gated by design</p>
                <p className="mt-1 text-sm text-slate-400">Legal eligibility is a hard gate, not a score.</p>
              </div>
            </div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${completeness}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>Required intake fields</span><span>{completeness}%</span>
            </div>
          </div>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-8">
            <div className="mb-7 flex items-start gap-3">
              <div className="rounded-xl bg-white/5 p-3 text-cyan-200"><Building2 size={22} /></div>
              <div>
                <h2 className="text-xl font-semibold">Business discovery intake</h2>
                <p className="mt-1 text-sm text-slate-400">Tell us what you need to establish. Do not share confidential identity or banking data in this prototype.</p>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium text-slate-200">Company / project name <span className="text-cyan-300">*</span></span>
                  <input value={intake.company} onChange={(e) => update('company', e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b111a] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60" placeholder="Company or project" />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-200">Investment budget range <span className="text-cyan-300">*</span></span>
                  <input value={intake.budget} onChange={(e) => update('budget', e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b111a] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60" placeholder="e.g. INR 2–5 crore" />
                </label>
              </div>

              <label className="block text-sm">
                <span className="font-medium text-slate-200">Business activity / industry <span className="text-cyan-300">*</span></span>
                <textarea value={intake.activity} onChange={(e) => update('activity', e.target.value)} rows={3} className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#0b111a] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60" placeholder="What will the business make, sell, or deliver? Include key inputs, customers and operating needs." />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium text-slate-200">Primary objective</span>
                  <select value={intake.objective} onChange={(e) => update('objective', e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b111a] px-4 py-3 text-white outline-none focus:border-cyan-300/60">
                    <option>Compare lawful ways to enter an overseas market</option>
                    <option>Set up manufacturing or processing</option>
                    <option>Open sales, distribution or a regional office</option>
                    <option>Secure land, a facility or industrial premises</option>
                    <option>Acquire or partner with an existing business</option>
                    <option>Source resources or establish a supply chain</option>
                    <option>Evaluate whether overseas expansion is worthwhile</option>
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-200">Target start timeline</span>
                  <select value={intake.timeline} onChange={(e) => update('timeline', e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b111a] px-4 py-3 text-white outline-none focus:border-cyan-300/60">
                    <option>0–3 months</option><option>3–6 months</option><option>6–12 months</option><option>12–24 months</option><option>Exploratory / not decided</option>
                  </select>
                </label>
              </div>

              <label className="block text-sm">
                <span className="font-medium text-slate-200">Preferred countries or markets (optional)</span>
                <input value={intake.preferredMarkets} onChange={(e) => update('preferredMarkets', e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b111a] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60" placeholder="Leave blank to discover options globally" />
              </label>

              <label className="block text-sm">
                <span className="font-medium text-slate-200">Land, facilities and infrastructure needs (optional)</span>
                <textarea value={intake.facilityNeeds} onChange={(e) => update('facilityNeeds', e.target.value)} rows={2} className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#0b111a] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60" placeholder="Land size, lease or purchase preference, power, water, logistics, workforce, certifications…" />
              </label>

              <label className="block text-sm">
                <span className="font-medium text-slate-200">Constraints or must-haves (optional)</span>
                <textarea value={intake.constraints} onChange={(e) => update('constraints', e.target.value)} rows={2} className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#0b111a] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60" placeholder="Risk tolerance, export markets, ownership constraints, funding, sustainability or local-partner needs…" />
              </label>

              {errors.length > 0 && <div role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/5 p-4 text-sm text-rose-200">Please complete: {errors.join(', ')}.</div>}

              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-200 sm:w-auto">
                Create intake brief <ArrowRight size={17} />
              </button>
            </form>

            {submitted && (
              <section aria-live="polite" className="mt-8 rounded-2xl border border-emerald-300/25 bg-emerald-300/5 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={22} />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-emerald-100">Intake brief created in this session</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-300">This prototype has validated the required fields and assembled a local summary. It has not sent or saved data to a server and has not performed legal research, country ranking, or eligibility assessment.</p>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <div><dt className="text-slate-500">Company / project</dt><dd className="mt-1 break-words text-slate-100">{intake.company}</dd></div>
                      <div><dt className="text-slate-500">Budget range</dt><dd className="mt-1 text-slate-100">{intake.budget}</dd></div>
                      <div><dt className="text-slate-500">Activity</dt><dd className="mt-1 whitespace-pre-wrap text-slate-100">{intake.activity}</dd></div>
                      <div><dt className="text-slate-500">Objective / timeline</dt><dd className="mt-1 text-slate-100">{intake.objective} · {intake.timeline}</dd></div>
                      <div><dt className="text-slate-500">Target markets</dt><dd className="mt-1 text-slate-100">{intake.preferredMarkets || 'Global discovery requested'}</dd></div>
                      <div><dt className="text-slate-500">Facilities / constraints</dt><dd className="mt-1 whitespace-pre-wrap text-slate-100">{[intake.facilityNeeds, intake.constraints].filter(Boolean).join('\n\n') || 'Not specified yet'}</dd></div>
                    </dl>
                    <div className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-xs leading-5 text-amber-100/90">
                      Next required stage: evidence-backed discovery and jurisdiction-specific legal qualification. No location is marked eligible until applicable rules and sources are reviewed.
                    </div>
                  </div>
                </div>
              </section>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <Compass className="text-cyan-200" size={22} />
              <h3 className="mt-3 font-semibold">Discover the right route</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">The full system should compare exporting, distribution, local partnership, contract manufacturing, leasing, acquisition and new establishment where relevant.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <ShieldCheck className="text-cyan-200" size={22} />
              <h3 className="mt-3 font-semibold">Hard legal gates</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">Strong projected returns can never compensate for a prohibited activity or unresolved mandatory approval.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <Workflow className="text-cyan-200" size={22} />
              <h3 className="mt-3 font-semibold">Execution, not just a report</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">The intended workflow tracks professional review, documents, authorities, costs, milestones and operational readiness.</p>
            </div>
            <p className="px-1 text-xs leading-5 text-slate-500">Prototype status: intake-only. No legal advice, jurisdiction ranking, incorporation, property verification, or approval workflow is active yet.</p>
          </aside>
        </div>

        <footer className="mt-12 border-t border-white/10 py-6 text-xs text-slate-500">
          Global Business Establishment & Growth OS · Shakti Standards · Evidence before execution
        </footer>
      </div>
    </main>
  );
}
