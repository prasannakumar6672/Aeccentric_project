import React, { useRef } from "react";
import { Code2, Bot, Palette, BarChart3, Printer, ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import fullStackImg from "../assets/services/full_stack.png";
import aiImg from "../assets/services/ai_automation.png";
import brandingImg from "../assets/services/branding.png";
import growthImg from "../assets/services/growth.png";
import printingImg from "../assets/services/3d_printing.png";

const services = [
  {
    id: "01", title: "AI Services & Automation", icon: Bot,
    description: "AEccentric provides AI-powered business solutions including automation, AI chatbots, voice agents, AI content systems, AI workflows, AI-powered websites, generative design, and AI consulting for startups, SMBs, and enterprises.",
    points: ["AI Chatbots & Voice Agents", "AI Workflows & Automation", "AI-Powered Websites", "Generative Design & Consulting"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    accent: "#2563EB",
    link: "/services/ai-services-and-automation",
  },
  {
    id: "02", title: "IT & Product Development", icon: Code2,
    description: "AEccentric develops modern digital products including web apps, mobile apps, SaaS platforms, admin portals, AI-native applications, automation systems, and enterprise software.",
    points: ["Web & Mobile Apps", "SaaS Platforms & Admin Portals", "AI-Native Applications", "Enterprise Software"],
    image: fullStackImg,
    accent: "#1D4ED8",
    link: "/services/it-product-development",
  },
  {
    id: "03", title: "3D Printing & Engineering Solutions", icon: Printer,
    description: "AEccentric provides advanced 3D printing, rapid prototyping, CAD engineering, AI-assisted manufacturing, and generative design services.",
    points: ["Advanced 3D Printing", "Rapid Prototyping", "CAD Engineering", "AI-Assisted Manufacturing"],
    image: printingImg,
    accent: "#3B82F6",
    link: "/services/3d-printing-and-engineering-solutions",
  },
  {
    id: "04", title: "Digital Transformation Services", icon: Palette,
    description: "Transform your traditional business processes into scalable digital ecosystems. We help modernize legacy systems and integrate modern cloud infrastructure.",
    points: ["Legacy Modernization", "Cloud Integration", "Process Digitization", "Scalable Infrastructure"],
    image: brandingImg,
    accent: "#60A5FA",
    link: "/services/digital-transformation-services",
  },
  {
    id: "05", title: "AI-Powered Manufacturing", icon: BarChart3,
    description: "Leveraging intelligent systems to optimize manufacturing workflows, quality control, and business operations for enhanced efficiency.",
    points: ["Workflow Optimization", "Quality Control", "Operational Efficiency", "Predictive Analytics"],
    image: growthImg,
    accent: "#2563EB",
    link: "/services/ai-powered-manufacturing",
  },
];

const ServiceCard = ({ service, index }) => {
  const Icon = service.icon;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="svc-card-sticky-wrapper" style={{ position: 'sticky', top: 0, zIndex: index + 1, height: '100vh' }}>
      <div style={{
        width: '100%', height: '100%', display: 'grid',
        gridTemplateColumns: '1fr 1fr', background: 'var(--bg)', transition: 'background 0.4s',
      }} className="svc-grid">

        {/* Image side */}
        <div style={{ position: 'relative', overflow: 'hidden' }} className="svc-img-col">
          <motion.img
            initial={{ scale: 1.08 }} whileInView={{ scale: 1 }}
            transition={{ duration: 1.4, ease: [0.33, 1, 0.68, 1] }}
            src={service.image} alt={service.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.05) 100%)' }} />
          <div className="svc-badge-wrap" style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
            <motion.div
              initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                display: 'inline-flex', alignItems: 'center', padding: '8px 18px',
                borderRadius: '999px', background: 'rgba(0,0,0,0.25)',
                backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <span style={{ fontSize: '11px', letterSpacing: '0.2em', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>
                Service {service.id}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Content side */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(2rem,5vw,5rem)', overflow: 'hidden' }} className="svc-content-col">
          <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${service.accent}20 0%, transparent 70%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ maxWidth: '540px', position: 'relative', zIndex: 1 }}
          >
            {/* Icon */}
            <div className="svc-card-icon" style={{
              width: '60px', height: '60px', borderRadius: '18px', marginBottom: '2rem',
              background: 'var(--bg-card)', border: `1px solid ${service.accent}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <Icon style={{ width: '26px', height: '26px', color: service.accent }} strokeWidth={2} />
            </div>

            {/* Title */}
            <h3 className="svc-card-title" style={{ fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: '1rem' }}>
              {service.title}
            </h3>

            {/* Description */}
            <p className="svc-card-desc" style={{ fontSize: 'clamp(14px,1.2vw,17px)', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: '460px', marginBottom: '2rem' }}>
              {service.description}
            </p>

            {/* Points */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2.5rem' }} className="svc-points-grid">
              {service.points.map((p, i) => (
                <div key={i} className="svc-point-item" style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 16px', borderRadius: '14px',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s',
                }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0, background: service.accent }} />
                  <span className="svc-point-text" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>{p}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="svc-card-cta-wrap" style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', justifyContent: 'center' }}>
              <Link to={service.link} style={{
                display: 'inline-flex', alignItems: 'center', gap: '20px',
                padding: '14px 28px', borderRadius: '999px',
                background: 'var(--text)', color: 'var(--bg)',
                border: 'none', cursor: 'pointer', fontWeight: 700,
                fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase',
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: 'var(--shadow-md)', textDecoration: 'none'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              >
                Explore Service
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(128,128,128,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowUpRight style={{ width: '15px', height: '15px' }} />
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default function Services() {
  return (
    <section className="services-section" style={{ width: '100%', background: 'var(--bg)', transition: 'background 0.4s' }}>
      {/* Header */}
      <div className="services-section-header" style={{ textAlign: 'center', padding: '5rem 1.5rem 4rem' }}>
        <div className="pill-badge" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
          <span className="pill-dot" />
          Capabilities
        </div>
        <h2 className="services-section-title" style={{ fontSize: 'clamp(40px,6vw,80px)', fontWeight: 900, letterSpacing: '-0.05em', color: 'var(--text)', lineHeight: 0.95, marginBottom: '1.25rem' }}>
          Our Services.
        </h2>
        <p className="services-section-desc" style={{ fontSize: 'clamp(16px,1.5vw,20px)', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
          Engineering, AI automation, branding & scalable digital systems — built for modern growth.
        </p>
      </div>

      {/* Sticky cards */}
      <div className="svc-cards-container" style={{ width: '100%' }}>
        {services.map((s, i) => <ServiceCard key={i} service={s} index={i} />)}
      </div>

      <style>{`
        .svc-grid { grid-template-columns: 1fr 1fr; }
        .svc-img-col { height: 100vh; }
        .svc-points-grid { grid-template-columns: 1fr 1fr; }
        
        @media(max-width:1024px){
          .services-section-header {
            padding: 4rem 1.5rem 2.5rem !important;
          }
          .services-section-title {
            font-size: clamp(2.2rem, 5vw, 3.5rem) !important;
          }
          .services-section-desc {
            font-size: 16px !important;
          }
          .svc-card-sticky-wrapper {
            position: relative !important;
            height: auto !important;
            top: auto !important;
            z-index: 1 !important;
            margin-bottom: 2rem !important;
            padding: 0 1.5rem !important;
          }
          .svc-grid {
            grid-template-columns: 1fr !important;
            border: 1px solid var(--border) !important;
            border-radius: var(--radius-xl) !important;
            overflow: hidden !important;
            background: var(--bg-card) !important;
            height: auto !important;
            box-shadow: var(--shadow-md) !important;
          }
          .svc-img-col {
            height: 320px !important;
          }
          .svc-badge-wrap {
            top: 1.25rem !important;
            left: 1.25rem !important;
          }
          .svc-content-col {
            padding: 2.25rem 1.75rem !important;
          }
          .svc-card-icon {
            width: 50px !important;
            height: 50px !important;
            border-radius: 14px !important;
            margin-bottom: 1.5rem !important;
          }
          .svc-card-icon svg {
            width: 22px !important;
            height: 22px !important;
          }
          .svc-card-title {
            font-size: clamp(22px, 3.5vw, 32px) !important;
            margin-bottom: 0.75rem !important;
          }
          .svc-card-desc {
            font-size: 14px !important;
            margin-bottom: 1.5rem !important;
            line-height: 1.7 !important;
          }
          .svc-points-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
            margin-bottom: 2rem !important;
          }
          .svc-point-item {
            padding: 8px 12px !important;
            border-radius: 10px !important;
          }
          .svc-point-text {
            font-size: 12px !important;
          }
          .svc-card-cta-wrap {
            padding-top: 1.5rem !important;
          }
        }
        
        @media(max-width:560px){
          .svc-card-sticky-wrapper {
            padding: 0 1.25rem !important;
          }
          .svc-img-col {
            height: 220px !important;
          }
          .svc-content-col {
            padding: 1.75rem 1.25rem !important;
          }
          .svc-points-grid {
            grid-template-columns: 1fr !important;
            gap: 0.6rem !important;
          }
        }
      `}</style>
    </section>
  );
}