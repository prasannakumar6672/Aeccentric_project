import React, { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

const phases = [
  {
    phase: "Phase 1", title: "Discovery & Strategy",
    description: "We analyze your business operations, workflows and digital ecosystem to identify growth bottlenecks, automation opportunities and scalable system architecture.",
  },
  {
    phase: "Phase 2", title: "Systems Buildout",
    description: "Our team engineers scalable websites, AI automations, CRM systems and operational workflows tailored specifically for your business infrastructure.",
  },
  {
    phase: "Phase 3", title: "Implementation",
    description: "We integrate tools, deploy workflows, optimize performance and ensure every digital system functions seamlessly across your organization.",
  },
  {
    phase: "Phase 4", title: "Optimization & Growth",
    description: "We continuously monitor analytics, improve systems, optimize conversions and scale automation processes for long-term business growth.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Approach() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ width: '100%', background: 'var(--bg-secondary)', padding: '6rem 0', transition: 'background 0.4s' }}>

      {/* Glows */}
      <div style={{ position: 'absolute', top: '-100px', left: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'var(--accent-light)', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', right: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'rgba(168,85,247,0.06)', filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        <div className="approach-inner-box" style={{
          border: '1px solid var(--border)', borderRadius: '48px', background: 'var(--bg)',
          boxShadow: 'var(--shadow-lg)', padding: 'clamp(2rem, 5vw, 5rem)',
          transition: 'all 0.4s',
        }}>

          {/* Top — Heading + Image */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}
            className="approach-top-grid">

            {/* Left */}
            <div>
              <div className="pill-badge" style={{ marginBottom: '1.5rem' }}>
                <span className="pill-dot" />
                Our Approach
              </div>

              <h2 style={{ fontSize: 'clamp(32px, 3.5vw, 52px)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text)', lineHeight: 1.1, marginBottom: '1.25rem' }}>
                We Build <br />
                <span style={{ position: 'relative', display: 'inline-block', marginTop: '0.5rem' }}>
                  <span style={{ position: 'relative', zIndex: 10, color: '#fff', padding: '0 20px' }}>Intelligent Systems</span>
                  <span style={{ position: 'absolute', inset: 0, background: 'var(--accent)', borderRadius: '14px', transform: 'rotate(-1deg)', zIndex: 0 }} />
                </span>
                <br />For Modern Growth
              </h2>

              <p style={{ fontSize: 'clamp(15px,1.3vw,17px)', lineHeight: 1.85, color: 'var(--text-muted)', marginTop: '1rem', marginBottom: '1.75rem', maxWidth: '460px' }}>
                Our process combines strategy, engineering, automation and performance optimization to create scalable digital systems that accelerate growth and operational efficiency.
              </p>

              <Link to="/consultation" className="cta-btn" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                FREE CONSULTATION
                <div className="cta-arrow">
                  <ChevronRight style={{ width: '13px', height: '13px' }} strokeWidth={2.5} />
                </div>
              </Link>
            </div>

            {/* Right Image */}
            <div style={{ position: 'relative' }} className="approach-img-wrap">
              <div style={{ position: 'absolute', inset: 0, background: 'var(--accent-light)', filter: 'blur(60px)', borderRadius: '32px' }} />
              <div style={{ position: 'relative', borderRadius: '28px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop"
                  alt="Team Meeting"
                  style={{ width: '100%', height: 'clamp(280px,35vw,440px)', objectFit: 'cover', display: 'block' }}
                />
                {/* Overlay badge */}
                <div className="approach-img-badge" style={{
                  position: 'absolute', bottom: '20px', left: '20px',
                  background: 'var(--bg)', backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border)', borderRadius: '16px',
                  padding: '16px 22px', boxShadow: 'var(--shadow-md)',
                }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Workflow Efficiency
                  </p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginTop: '6px' }}>
                    <span style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text)', lineHeight: 1 }}>+240%</span>
                    <span style={{ paddingBottom: '4px', fontWeight: 700, color: 'var(--accent)' }}>Growth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase Cards */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '2.5rem' }}
            className="approach-cards-grid"
          >
            {phases.map((item, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className="phase-card-wrap"
                style={{
                  position: 'relative', overflow: 'hidden', borderRadius: '28px',
                  border: '1px solid var(--border)', background: 'var(--bg-card)',
                  padding: 'clamp(1.5rem,3vw,2.5rem)', minHeight: '220px',
                  cursor: 'default', transition: 'border-color 0.4s, box-shadow 0.4s, background 0.4s',
                }}
                whileHover={{ y: -6, boxShadow: '0 30px 70px rgba(37,99,235,0.18)', borderColor: 'var(--accent)' }}
              >
                {/* Hover gradient background */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0038FF, #0029BB, #001A7A)', borderRadius: '28px', zIndex: 0 }}
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', padding: '6px 16px', borderRadius: '999px',
                      border: '1px solid var(--border)', background: 'var(--bg)',
                      fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)',
                    }}>
                      {item.phase}
                    </span>
                  </div>
                  <h3 className="phase-title" style={{ fontSize: 'clamp(22px,2.5vw,32px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.2, transition: 'color 0.4s' }}>
                    {item.title}
                  </h3>
                  <p className="phase-desc" style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--text-muted)', transition: 'color 0.4s' }}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        .approach-top-grid { grid-template-columns: 1fr 1fr; }
        .approach-cards-grid { grid-template-columns: repeat(2, 1fr); }
        
        @media(max-width:1024px){
          .approach-inner-box {
            padding: 3rem 2rem !important;
            border-radius: 32px !important;
          }
          .approach-top-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .approach-img-wrap {
            max-width: 600px;
            margin: 0 auto;
            width: 100%;
          }
          .approach-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.25rem !important;
            margin-top: 2rem !important;
          }
          .phase-card-wrap {
            padding: 1.5rem !important;
            min-height: 180px !important;
            border-radius: 20px !important;
          }
          .phase-title {
            font-size: 20px !important;
          }
          .phase-desc {
            font-size: 13.5px !important;
            line-height: 1.65 !important;
          }
        }
        
        @media(max-width:560px){
          .approach-inner-box {
            padding: 2rem 1.25rem !important;
            border-radius: 24px !important;
          }
          .approach-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .phase-card-wrap {
            padding: 1.25rem !important;
            min-height: auto !important;
            border-radius: 16px !important;
          }
          .phase-title {
            font-size: 18px !important;
            margin-bottom: 0.5rem !important;
          }
          .phase-desc {
            font-size: 13px !important;
            line-height: 1.55 !important;
          }
          .approach-img-badge {
            bottom: 12px !important;
            left: 12px !important;
            padding: 10px 14px !important;
            border-radius: 12px !important;
          }
          .approach-img-badge p {
            font-size: 9px !important;
          }
          .approach-img-badge span:first-child {
            font-size: 22px !important;
          }
          .approach-img-badge span:last-child {
            font-size: 12px !important;
          }
        }
        .phase-card-wrap:hover .phase-title { color: #ffffff !important; }
        .phase-card-wrap:hover .phase-desc  { color: rgba(255,255,255,0.8) !important; }
      `}</style>
    </section>
  );
}