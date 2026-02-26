import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
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
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
} from 'lucide-react';

interface VerticalProps {
  name: string;
  tagline: string;
  description: string;
  themeColor: string;
  themeColorClass: string;
  icon: React.ElementType;
  videoSrc: string;
  externalLink: string;
  features: { title: string; desc: string }[];
}

export default function VerticalPage({ data }: { data: VerticalProps }) {
  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
            ALLIANCE<span className="text-white/50">VENTURES</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <Link to="/rupaykg" className="hover:text-white transition-colors">RupayKg</Link>
            <Link to="/vyaparkendra" className="hover:text-white transition-colors">VyaparKendra</Link>
            <Link to="/ayushkendra" className="hover:text-white transition-colors">AyushKendra</Link>
            <a href="/login" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">Investor Login</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-30 mix-blend-screen"
          >
            <source src={data.videoSrc} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/60 to-[#050505]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium tracking-wide uppercase mb-8 ${data.themeColorClass}`}>
              <Icon className="w-4 h-4" />
              {data.name}
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[1.1] mb-8">
              {data.tagline.split('. ')[0]}.<br />
              <span className="text-white/40">{data.tagline.split('. ')[1]}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed mb-12">
              {data.description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href={data.externalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors">
                Visit Website <ExternalLink className="w-4 h-4" />
              </a>
              <a href="#features" className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-white/20 hover:bg-white/5 transition-colors">
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight mb-4">Platform Overview</h2>
              <p className="text-white/60 leading-relaxed">
                Operating autonomously under the ALLIANCEVENTURES umbrella, {data.name} leverages shared operational resources while maintaining its distinct market focus.
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.features.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                    <div className={`w-3 h-3 rounded-full ${data.themeColorClass.replace('text-', 'bg-')}`} />
                  </div>
                  <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                  <p className="text-white/60 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="space-y-6">
              <Link to="/" className="font-display font-bold text-2xl tracking-tight block">
                ALLIANCE<span className="text-white/50">VENTURES</span>
              </Link>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                The founder-led, mission-aligned venture group that incubates, operates, and scales technology platforms addressing sustainability, commerce, and health-tech.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                  <Twitter className="w-4 h-4 text-white/60" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                  <Linkedin className="w-4 h-4 text-white/60" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                  <Github className="w-4 h-4 text-white/60" />
                </a>
              </div>
            </div>

            {/* Ventures Column */}
            <div>
              <h4 className="font-display font-medium text-white mb-6 uppercase tracking-wider text-xs">Portfolio</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li><Link to="/rupaykg" className="hover:text-white transition-colors">RupayKg</Link></li>
                <li><Link to="/vyaparkendra" className="hover:text-white transition-colors">VyaparKendra</Link></li>
                <li><Link to="/ayushkendra" className="hover:text-white transition-colors">AyushKendra</Link></li>
              </ul>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="font-display font-medium text-white mb-6 uppercase tracking-wider text-xs">Company</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li><Link to="/" className="hover:text-white transition-colors">Main Site</Link></li>
                <li><a href="/login" className="hover:text-white transition-colors">Investor Portal</a></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="font-display font-medium text-white mb-6 uppercase tracking-wider text-xs">Contact</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>info.allianceventures@gmail.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>+91 7610717111</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>INDIA</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-white/30 text-xs">
              © {new Date().getFullYear()} ALLIANCEVENTURES. All rights reserved.
            </p>
            <div className="flex items-center gap-8 text-xs text-white/30">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
