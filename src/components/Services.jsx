import React from "react";
import {
  Code2,
  Bot,
  Palette,
  BarChart3,
  Printer,
  ArrowUpRight,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import fullStackImg from "../assets/services/full_stack.png";
import aiImg from "../assets/services/ai_automation.png";
import brandingImg from "../assets/services/branding.png";
import growthImg from "../assets/services/growth.png";
import printingImg from "../assets/services/3d_printing.png";

const services = [
  {
    id: "01",
    title: "Next-Gen Web Engineering",
    icon: Code2,
    description:
      "We engineer high-performance digital ecosystems that merge speed with scalability. Our platforms are built on cinematic interactivity and enterprise-grade architecture.",
    points: [
      "Architecture for Scale",
      "Cinema-Grade Interaction",
      "Edge-Computing Priority",
      "Cloud-Native Infrastructure",
    ],
    image: fullStackImg,
    bg: "#ffffff",
    accent: "#2F5BFF",
  },
  {
    id: "02",
    title: "AI-Powered Orchestration",
    icon: Bot,
    description:
      "Deploy intelligent agents that think, learn, and execute. We automate the friction out of your business with custom LLM integrations and autonomous workflows.",
    points: [
      "Autonomous Agents",
      "LLM Fine-Tuning",
      "Cognitive Automation",
      "Predictive Analytics",
    ],
    image: aiImg,
    bg: "#f8fafc",
    accent: "#7C3AED",
  },
  {
    id: "03",
    title: "Brand Identity & Experience",
    icon: Palette,
    description:
      "We craft visual narratives that command attention. From high-end identity systems to immersive UI design, we turn brands into digital landmarks.",
    points: [
      "Visual DNA Systems",
      "Immersive UI/UX",
      "Motion Design Artistry",
      "High-Conversion Flow",
    ],
    image: brandingImg,
    bg: "#ffffff",
    accent: "#EC4899",
  },
  {
    id: "04",
    title: "Scalable Growth Systems",
    icon: BarChart3,
    description:
      "Growth isn't luck; it's engineering. We deploy data-driven acquisition engines and performance-focused content systems designed for rapid scaling.",
    points: [
      "Acquisition Engineering",
      "Retention Algorithms",
      "Content Velocity",
      "Revenue Optimization",
    ],
    image: growthImg,
    bg: "#f8fafc",
    accent: "#F59E0B",
  },
  {
    id: "05",
    title: "Precision 3D Fabrication",
    icon: Printer,
    description:
      "Transforming digital concepts into physical reality. Our high-precision 3D printing solutions provide industrial-grade prototyping and custom manufacturing at scale.",
    points: [
      "Rapid Prototyping",
      "Industrial Components",
      "Bespoke Manufacturing",
      "Material Innovation",
    ],
    image: printingImg,
    bg: "#ffffff",
    accent: "#10B981",
  },
];

const ServiceCard = ({ service, index }) => {
  const Icon = service.icon;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: index + 1,
        height: "100vh",
      }}
    >
      <div
        className="w-full h-full grid grid-cols-1 lg:grid-cols-2"
        style={{ backgroundColor: service.bg }}
      >
        {/* LEFT — Image with reveal animation */}
        <div className="relative overflow-hidden group h-[45vh] lg:h-full">
          <motion.img
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          <div className="absolute top-10 left-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
            >
              <span className="text-[12px] tracking-[0.3em] font-black uppercase text-white">
                Service {service.id}
              </span>
            </motion.div>
          </div>
        </div>

        {/* RIGHT — Content with balanced horizontal spacing */}
        <div className="flex flex-col justify-center items-center px-10 sm:px-16 lg:px-20 py-10 lg:py-0">
          <motion.div
            className="w-full max-w-[620px]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* icon */}
            <div 
              className="w-16 h-16 rounded-[22px] border border-[#E5E7EB] flex items-center justify-center mb-10 shadow-sm"
              style={{ borderColor: `${service.accent}20` }}
            >
              <Icon className="w-7 h-7" style={{ color: service.accent }} strokeWidth={2} />
            </div>

            {/* title */}
            <h3 className="text-[42px] sm:text-[54px] lg:text-[62px] font-black leading-[0.95] tracking-[-0.05em] text-[#111827] mb-8">
              {service.title}
            </h3>

            {/* description */}
            <p className="text-[17px] sm:text-[19px] text-[#6B7280] leading-relaxed font-medium max-w-[550px] mb-10">
              {service.description}
            </p>

            {/* bullet points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 mb-12">
              {service.points.map((point, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                  className="flex items-center gap-4"
                >
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: service.accent }} />
                  <span className="text-[14px] font-bold text-[#111827] tracking-tight">{point}</span>
                </motion.div>
              ))}
            </div>

            {/* footer */}
            <div className="flex items-center justify-center border-t border-[#F1F5F9] pt-10">
              <button className="group flex items-center gap-4 text-[#111827]">
                <span className="text-[13px] font-black tracking-[0.2em] uppercase">
                  Explore Service
                </span>
                <div 
                  className="w-12 h-12 rounded-full border border-[#E5E7EB] flex items-center justify-center transition-all duration-500 group-hover:text-white"
                  style={{ '--hover-bg': service.accent }}
                >
                  <ArrowUpRight className="w-5 h-5 transition-transform duration-500 group-hover:rotate-45" />
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  return (
    <section className="w-full bg-white">

      {/* ── Centered Header ───────────────────────────────────────────────────── */}
      <div className="w-full text-center py-32 px-6">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#E5E7EB] bg-white shadow-sm mb-10">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2F5BFF]" />
          <span className="text-[12px] tracking-[0.2em] font-black uppercase text-[#111827]">
            Capabilities
          </span>
        </div>
        
        <h2 className="text-[52px] sm:text-[72px] lg:text-[84px] font-black text-[#111827] leading-[0.95] tracking-[-0.05em] mb-10">
          Our Services.
        </h2>
        
        <p className="text-[18px] sm:text-[21px] text-[#6B7280] font-medium mx-auto leading-relaxed">
          Engineering, AI automation, branding &amp; scalable digital systems — built for modern growth.
        </p>
      </div>

      <div className="w-full">
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} index={index} />
        ))}
      </div>

      <style>{`
        .group:hover div[style*="--hover-bg"] {
          background-color: var(--hover-bg);
          border-color: var(--hover-bg);
        }
      `}</style>
    </section>
  );
};

export default Services;