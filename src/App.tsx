import React from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  Leaf,
  Briefcase,
  Stethoscope,
  Target,
  Cpu,
  ShieldCheck,
  Rocket,
  TrendingUp,
  Layers,
  FileText,
  Smartphone,
  ChevronRight,
} from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-display font-bold text-xl tracking-tight">
            ALLIANCE<span className="text-white/50">VENTURES</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#identity" className="hover:text-white transition-colors">Identity</a>
            <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
            <a href="#principles" className="hover:text-white transition-colors">Principles</a>
            <a href="#backbone" className="hover:text-white transition-colors">Operations</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium tracking-wide uppercase mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Founder-Led Growth Engine
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[1.1] mb-8">
              Scalable impact.<br />
              <span className="text-white/40">Tech-enabled services.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed mb-12">
              The parent venture-holding entity behind a family of platform businesses focused on sustainable ecosystem value. We turn mission-driven ideas into operational and financially viable platforms.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#portfolio" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors">
                Explore Portfolio
              </a>
              <a href="#identity" className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-white/20 hover:bg-white/5 transition-colors">
                Our Identity
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Identity */}
      <section id="identity" className="py-24 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight mb-4">Core Identity</h2>
              <p className="text-white/60 leading-relaxed">
                We serve as the umbrella brand and operational nucleus for multiple standalone ventures, each with a distinct mission, market focus, and business model.
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: Globe, title: "Build & Scale", desc: "Technology-driven platforms designed for massive scale and impact." },
                { icon: Target, title: "Strategic Alignment", desc: "Aligning directions across portfolio companies for maximum synergy." },
                { icon: ShieldCheck, title: "Brand & Governance", desc: "Maintaining consistency, compliance, and trust across all ventures." },
                { icon: Rocket, title: "Operational Efficiency", desc: "Supporting go-to-market execution and streamlined operations." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                  <p className="text-white/60 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-24 px-6 border-t border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24">
            <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight mb-6">Portfolio & Focus Areas</h2>
            <p className="text-xl text-white/60 max-w-3xl leading-relaxed">
              Under ALLIANCEVENTURES, each venture operates autonomously but with centralized strategic guidance and resource alignment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* RupayKg */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-3xl bg-[#050505] border border-white/10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Leaf className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium uppercase tracking-wider mb-6">
                  Sustainability
                </div>
                <h3 className="font-display text-3xl font-medium mb-4">RupayKg</h3>
                <p className="text-white/60 leading-relaxed mb-8">
                  A "waste-to-wealth" ecosystem that uses technology to transform waste collection, recycling engagement, and economic incentives for citizens, businesses, and partners.
                </p>
                <div className="pt-6 border-t border-white/10">
                  <div className="text-sm font-medium text-white/40 uppercase tracking-wider mb-2">Focus</div>
                  <div className="text-sm text-white/80">Environmental impact, circular economy, community empowerment.</div>
                </div>
              </div>
            </motion.div>

            {/* VyaparKendra */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative p-8 rounded-3xl bg-[#050505] border border-white/10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Briefcase className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium uppercase tracking-wider mb-6">
                  Commerce
                </div>
                <h3 className="font-display text-3xl font-medium mb-4">VyaparKendra</h3>
                <p className="text-white/60 leading-relaxed mb-8">
                  A digital ecosystem designed to unify business services, commerce facilitation, and stakeholder engagement across national and state-level frameworks.
                </p>
                <div className="pt-6 border-t border-white/10">
                  <div className="text-sm font-medium text-white/40 uppercase tracking-wider mb-2">Focus</div>
                  <div className="text-sm text-white/80">Trade enablement, compliance, platformized service delivery.</div>
                </div>
              </div>
            </motion.div>

            {/* AyushKendra */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative p-8 rounded-3xl bg-[#050505] border border-white/10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Stethoscope className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-medium uppercase tracking-wider mb-6">
                  Health-Tech
                </div>
                <h3 className="font-display text-3xl font-medium mb-4">AyushKendra</h3>
                <p className="text-white/60 leading-relaxed mb-8">
                  A focused venture in the medical devices and health-tech space with its own identity and domain, bringing innovation to healthcare accessibility.
                </p>
                <div className="pt-6 border-t border-white/10">
                  <div className="text-sm font-medium text-white/40 uppercase tracking-wider mb-2">Focus</div>
                  <div className="text-sm text-white/80">Healthcare innovation, accessibility, device-centric solutions.</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Strategic Principles */}
      <section id="principles" className="py-24 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight mb-8">Strategic Principles</h2>
              <div className="space-y-8">
                {[
                  { title: "Mission Above All", desc: "Each venture drives measurable impact in its domain." },
                  { title: "Tech as an Enabler", desc: "Platforms leverage modern tech stacks (cloud deployment, AI services, web/mobile UIs)." },
                  { title: "Brand Discipline", desc: "Ventures maintain distinct identities but adhere to cohesive governance under the Alliance umbrella." },
                  { title: "Go-Live Operational Rigor", desc: "Predefined, battle-tested deployment & compliance checklists for production launches." },
                  { title: "Sustainable Growth Orientation", desc: "Focused on long-term value, policy alignment, and ecosystem partnerships." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">{item.title}</h4>
                      <p className="text-white/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[600px] rounded-3xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
              <TrendingUp className="w-48 h-48 text-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Operational Backbone */}
      <section id="backbone" className="py-24 px-6 border-t border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight mb-6">Operational Backbone</h2>
            <p className="text-xl text-white/60 leading-relaxed">
              Shared resources lower friction for new ventures under the Alliance umbrella while ensuring quality, security, and compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: Cpu, label: "Deployment Architectures", desc: "Cloud stacks, CI/CD pipelines" },
              { icon: FileText, label: "Patent & IP Artifacts", desc: "Drafted patent packages" },
              { icon: ShieldCheck, label: "Policy Frameworks", desc: "Government engagement" },
              { icon: Smartphone, label: "Mobile App Checklists", desc: "Launch readiness" },
              { icon: Layers, label: "Standardized Assets", desc: "Documentation & brand" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[#050505] border border-white/10 text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-white/80" />
                </div>
                <h4 className="font-medium text-sm mb-2">{item.label}</h4>
                <p className="text-xs text-white/50">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="font-display font-bold text-2xl tracking-tight mb-4">
            ALLIANCE<span className="text-white/50">VENTURES</span>
          </div>
          <p className="text-white/40 text-sm">
            Incubating, operating, and scaling technology platforms.
          </p>
        </div>
      </footer>
    </div>
  );
}
