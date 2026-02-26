import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Leaf, Briefcase, Stethoscope } from 'lucide-react';
import Home from './pages/Home';
import VerticalPage from './pages/Vertical';

const verticalsData = {
  rupaykg: {
    name: "RupayKg",
    tagline: "Waste to wealth. Empowering communities.",
    description: "A \"waste-to-wealth\" ecosystem that uses technology to transform waste collection, recycling engagement, and economic incentives for citizens, businesses, and partners.",
    themeColor: "emerald",
    themeColorClass: "text-emerald-400",
    icon: Leaf,
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    externalLink: "https://www.rupaykg.com",
    features: [
      { title: "Circular Economy", desc: "Incentivizing recycling and proper waste disposal." },
      { title: "Carbon Credits", desc: "Tracking and monetizing carbon offsets for businesses." },
      { title: "Community Impact", desc: "Empowering local waste workers and citizens." },
      { title: "EPR Compliance", desc: "Helping brands meet Extended Producer Responsibility goals." }
    ]
  },
  vyaparkendra: {
    name: "VyaparKendra",
    tagline: "Digital commerce. Unified business services.",
    description: "A digital ecosystem designed to unify business services, commerce facilitation, and stakeholder engagement across national and state-level frameworks.",
    themeColor: "blue",
    themeColorClass: "text-blue-400",
    icon: Briefcase,
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-financial-trading-chart-and-graphs-3976-large.mp4",
    externalLink: "https://www.vyaparkendra.com",
    features: [
      { title: "B2B Marketplace", desc: "Connecting MSMEs with buyers and suppliers." },
      { title: "Credit API", desc: "Facilitating access to working capital and financial services." },
      { title: "Compliance Tools", desc: "Simplifying regulatory and tax compliance for businesses." },
      { title: "SaaS Solutions", desc: "Providing digital tools for inventory, invoicing, and operations." }
    ]
  },
  ayushkendra: {
    name: "AyushKendra",
    tagline: "Healthcare innovation. Accessible wellness.",
    description: "A focused venture in the medical devices and health-tech space with its own identity and domain, bringing innovation to healthcare accessibility.",
    themeColor: "rose",
    themeColorClass: "text-rose-400",
    icon: Stethoscope,
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-medical-animation-of-a-dna-strand-491-large.mp4",
    externalLink: "https://www.ayushkendra.com",
    features: [
      { title: "Medical Devices", desc: "Innovating and distributing affordable healthcare equipment." },
      { title: "Health-Tech SaaS", desc: "Providing software solutions for clinics and hospitals." },
      { title: "Marketplace", desc: "Connecting patients with verified healthcare providers." },
      { title: "Wellness Programs", desc: "Promoting holistic health and preventive care." }
    ]
  }
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rupaykg" element={<VerticalPage data={verticalsData.rupaykg} />} />
        <Route path="/vyaparkendra" element={<VerticalPage data={verticalsData.vyaparkendra} />} />
        <Route path="/ayushkendra" element={<VerticalPage data={verticalsData.ayushkendra} />} />
      </Routes>
    </Router>
  );
}
