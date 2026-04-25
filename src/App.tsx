import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Leaf, Briefcase, Stethoscope, Code, Ship, Sprout } from 'lucide-react';
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
  },
  codesai1: {
    name: "CodesAI1",
    tagline: "Artificial intelligence. Code the future.",
    description: "A high-tech-led venture focusing on the development and scaling of AI-powered solutions to solve complex industrial and social problems.",
    themeColor: "indigo",
    themeColorClass: "text-indigo-400",
    icon: Code,
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-high-tech-digital-data-processing-screen-3183-large.mp4",
    externalLink: "https://www.codesai1.com",
    features: [
      { title: "Custom AI Engines", desc: "Developing proprietary LLMs and machine learning models." },
      { title: "Automation Hub", desc: "Streamlining enterprise workflows with cognitive automation." },
      { title: "Data Analytics", desc: "Turning big data into actionable strategic insights." },
      { title: "AI Consulting", desc: "Helping organizations navigate the AI revolution safely." }
    ]
  },
  containerbazaar: {
    name: "ContainerBazaar",
    tagline: "Logistics simplified. Container marketplace.",
    description: "An end-to-end digital marketplace for container trading, leasing, and logistics, streamlining global supply chain efficiencies.",
    themeColor: "orange",
    themeColorClass: "text-orange-400",
    icon: Ship,
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-commercial-port-at-sunset-1004-large.mp4",
    externalLink: "https://www.containerbazaar.in",
    features: [
      { title: "Global Trading", desc: "A unified platform for container buy/sell transactions." },
      { title: "Leasing Solutions", desc: "Flexible leasing options for shipping containers worldwide." },
      { title: "Smart Logistics", desc: "AI-driven route optimization and cargo tracking." },
      { title: "Escrow Services", desc: "Secure financial transactions for global trade." }
    ]
  },
  krishikendra: {
    name: "KrishiKendra",
    tagline: "Agri-tech revolution. Farming future.",
    description: "A digital ecosystem providing farmers with technology, market access, and data-driven insights to maximize agricultural output and sustainability.",
    themeColor: "lime",
    themeColorClass: "text-lime-400",
    icon: Sprout,
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-green-field-of-wheat-swaying-in-the-wind-3714-large.mp4",
    externalLink: "https://www.krishikendra.co.in",
    features: [
      { title: "Precision Farming", desc: "IoT and satellite data for optimal crop management." },
      { title: "Direct Market", desc: "Connecting farmers directly with markets for better pricing." },
      { title: "Agri-Finance", desc: "Providing credit and insurance tailored for farming." },
      { title: "Expert Hub", desc: "On-demand consults with agronomists and soil experts." }
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
        <Route path="/codesai1" element={<VerticalPage data={verticalsData.codesai1} />} />
        <Route path="/containerbazaar" element={<VerticalPage data={verticalsData.containerbazaar} />} />
        <Route path="/krishikendra" element={<VerticalPage data={verticalsData.krishikendra} />} />
      </Routes>
    </Router>
  );
}
