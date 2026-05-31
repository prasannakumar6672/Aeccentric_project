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
    <section style={{ width: '100%', background: 'var(--bg-secondary)', padding: 'clamp(3.5rem,7vw,6rem) 0', transition: 'background 0.4s' }}>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem', position: 'relative', zIndex: 10 }}>
        <div style={{
          border: '1px solid var(--border)', borderRadius: 'clamp(20px,3vw,48px)', background: 'var(--bg)',
          boxShadow: 'var(--shadow-lg)', padding: 'clamp(1.5rem, 4vw, 5rem)',
          transition: 'all 0.4s',
        }}>

          {/* ── Top: Heading + Image ─────────────────────────────────── */}
          <div className="approach-top-grid">

            {/* Left */}
            <div>
              <div className="pill-badge" style={{ marginBottom: '1.25rem' }}>
                <span className="pill-dot" />
                Our Approach
              </div>

              <h2 style={{
                fontSize: 'clamp(26px, 3.5vw, 52px)', fontWeight: 900,
                letterSpacing: '-0.04em', color: 'var(--text)', lineHeight: 1.1, marginBottom: '1rem'
              }}>
                We Build <br />
                <span style={{ position: 'relative', display: 'inline-block', marginTop: '0.5rem' }}>
                  <span style={{ position: 'relative', zIndex: 10, color: '#fff', padding: '0 16px' }}>Intelligent Systems</span>
                  <span style={{ position: 'absolute', inset: 0, background: 'var(--accent)', borderRadius: '12px', transform: 'rotate(-1deg)', zIndex: 0 }} />
                </span>
                <br />For Modern Growth
              </h2>

              <p style={{
                fontSize: 'clamp(14px,1.3vw,16px)', lineHeight: 1.8, color: 'var(--text-muted)',
                marginTop: '0.875rem', marginBottom: '1.5rem', maxWidth: '460px'
              }}>
                Our process combines strategy, engineering, automation and performance optimization
                to create scalable digital systems that accelerate growth.
              </p>

              <Link to="/consultation" className="cta-btn" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                FREE CONSULTATION
                <div className="cta-arrow">
                  <ChevronRight style={{ width: '13px', height: '13px' }} strokeWidth={2.5} />
                </div>
              </Link>
            </div>

            {/* Right Image — hidden on mobile */}
            <div style={{ position: 'relative' }} className="approach-img-col">
              <div style={{ position: 'absolute', inset: 0, background: 'var(--accent-light)', filter: 'blur(60px)', borderRadius: '32px' }} />
              <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop"
                  alt="Team Meeting"
                  style={{ width: '100%', height: 'clamp(220px,30vw,380px)', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute', bottom: '16px', left: '16px',
                  background: 'var(--bg)', backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border)', borderRadius: '14px',
                  padding: '12px 18px', boxShadow: 'var(--shadow-md)',
                }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Workflow Efficiency
                  </p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text)', lineHeight: 1 }}>+240%</span>
                    <span style={{ paddingBottom: '3px', fontWeight: 700, color: 'var(--accent)', fontSize: '13px' }}>Growth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Phase Cards: Desktop Grid / Mobile Timeline ──────────── */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="approach-cards-grid"
            style={{ marginTop: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            {phases.map((item, i) => (
              <motion.div key={i} variants={cardVariants} className="phase-card-wrap">
                {/* Timeline node — visible only on mobile via CSS */}
                <div className="phase-timeline-node">
                  <div className="phase-node-dot"><span>{i + 1}</span></div>
                  {i < phases.length - 1 && <div className="phase-node-line" />}
                </div>

                {/* Card body */}
                <div className="phase-card-body">
                  {/* Desktop: hover gradient bg */}
                  <motion.div
                    className="phase-hover-bg"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="phase-badge">{item.phase}</div>
                    <h3 className="phase-title">{item.title}</h3>
                    <p className="phase-desc">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        /* ── Desktop Layout ─────────────────────────────────────── */
        .approach-top-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }
        .approach-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        .phase-card-wrap {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 0;
        }
        .phase-timeline-node { display: none; }
        .phase-card-body {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          padding: clamp(1.25rem, 2.5vw, 2.25rem);
          width: 100%;
          cursor: default;
          transition: border-color 0.4s, box-shadow 0.4s, background 0.4s;
        }
        .phase-card-body:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(37,99,235,0.15);
          border-color: var(--accent);
        }
        .phase-hover-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0038FF, #0029BB, #001A7A);
          border-radius: 24px;
          z-index: 0;
          pointer-events: none;
        }
        .phase-card-body:hover .phase-title { color: #ffffff !important; }
        .phase-card-body:hover .phase-desc  { color: rgba(255,255,255,0.8) !important; }
        .phase-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 14px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text);
          margin-bottom: 0.875rem;
        }
        .phase-title {
          font-size: clamp(18px, 2.2vw, 28px);
          font-weight: 900;
          letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: 0.625rem;
          line-height: 1.2;
          transition: color 0.4s;
        }
        .phase-desc {
          font-size: 14px;
          line-height: 1.75;
          color: var(--text-muted);
          transition: color 0.4s;
        }

        /* ── Mobile: Connected Timeline ─────────────────────────── */
        @media (max-width: 768px) {
          .approach-top-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
          .approach-img-col { display: none !important; }
          .approach-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
          .phase-card-wrap {
            flex-direction: row !important;
            align-items: flex-start !important;
          }
          .phase-timeline-node {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            flex-shrink: 0;
            width: 36px;
            margin-right: 12px;
            padding-top: 4px;
          }
          .phase-node-dot {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: var(--accent);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 0 0 4px var(--accent-light);
          }
          .phase-node-dot span {
            font-size: 12px;
            font-weight: 900;
            color: #fff;
          }
          .phase-node-line {
            width: 2px;
            flex: 1;
            min-height: 20px;
            margin-top: 6px;
            background: linear-gradient(to bottom, var(--accent), var(--accent-light));
            border-radius: 1px;
          }
          .phase-card-body {
            border-radius: 16px !important;
            padding: 14px 16px !important;
            margin-bottom: 12px;
            background: var(--bg-card) !important;
          }
          .phase-card-body:hover {
            transform: none !important;
            box-shadow: none !important;
          }
          .phase-hover-bg { display: none; }
          .phase-badge {
            padding: 3px 10px !important;
            font-size: 10px !important;
            margin-bottom: 6px !important;
          }
          .phase-title { font-size: 15px !important; margin-bottom: 4px !important; }
          .phase-desc { font-size: 13px !important; line-height: 1.65 !important; }
        }
      `}</style>
    </section>
  );
}