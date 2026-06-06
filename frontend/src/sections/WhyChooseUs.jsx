import React, { useRef } from 'react';
import { ShieldCheck, Zap, TrendingUp, Users } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

const points = [
  { icon: ShieldCheck, title: "Security & Trust",    description: "Enterprise-grade security protocols for all AI integrations and data handling systems." },
  { icon: Zap,         title: "Extreme Speed",       description: "Our high-performance systems are engineered for sub-second responses and lightning-fast execution." },
  { icon: TrendingUp,  title: "ROI Focused",         description: "We don't just build systems; we engineer revenue multipliers that impact your bottom line." },
  { icon: Users,       title: "Expert Partners",     description: "Consider us an extension of your team, providing 24/7 technical oversight and growth strategy." },
];

const containerV = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const itemV = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ position: 'relative', width: '100%', background: 'var(--bg)', padding: '6rem 0', transition: 'background 0.4s', overflow: 'hidden' }}>

      {/* Background grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
        backgroundSize: '60px 60px', opacity: 0.4,
      }} />
      <div style={{ position: 'absolute', top: '30%', left: '0', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--accent-light)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>

        {/* Top badge + heading centered */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="pill-badge" style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
            <span className="pill-dot" />
            The Aeccentric Advantage
          </div>
          <h2 style={{ fontSize: 'clamp(32px,4.5vw,64px)', fontWeight: 900, letterSpacing: '-0.05em', color: 'var(--text)', lineHeight: 1, maxWidth: '800px', margin: '0 auto 1rem' }}>
            Why Global Leaders <br />Choose Our Systems.
          </h2>
          <p style={{ fontSize: 'clamp(15px,1.3vw,18px)', color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.8 }}>
            We combine deep technical expertise with a clinical focus on business growth to deliver systems that traditional agencies simply can't build.
          </p>
        </div>

        {/* Cards grid */}
        <motion.div
          ref={ref}
          variants={containerV}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}
          className="why-grid"
        >
          {points.map((point, i) => (
            <motion.div
              key={i}
              variants={itemV}
              className="why-card"
              style={{
                position: 'relative', overflow: 'hidden', borderRadius: '28px',
                border: '1px solid var(--border)', background: 'var(--bg-card)',
                padding: '2rem 1.75rem', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: 'var(--shadow-card)', cursor: 'default',
              }}
              whileHover={{ y: -8, boxShadow: '0 24px 60px rgba(37,99,235,0.12)', borderColor: 'var(--accent)' }}
            >
              {/* Hover glow */}
              <motion.div
                initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.4 }}
                style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top left, var(--accent-light), transparent 70%)', borderRadius: '28px' }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  className="why-icon"
                  style={{
                    width: '52px', height: '52px', borderRadius: '16px',
                    border: '1px solid var(--border)', background: 'var(--bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.5rem', transition: 'all 0.4s', color: 'var(--text-muted)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <point.icon style={{ width: '22px', height: '22px' }} strokeWidth={2.5} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
                  {point.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                  {point.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA row */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <Link to="/about/company" className="cta-btn" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            DISCOVER OUR EDGE
            <div className="cta-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </Link>
        </div>
      </div>

      <style>{`
        .why-grid { grid-template-columns: repeat(4,1fr); }
        @media(max-width:1024px){
          .why-grid {
            grid-template-columns: repeat(2,1fr) !important;
            gap: 1rem !important;
          }
          .why-card {
            padding: 1.5rem 1.25rem !important;
            border-radius: 20px !important;
          }
        }
        @media(max-width:520px){
          .why-grid {
            grid-template-columns: repeat(2,1fr) !important;
            gap: 0.75rem !important;
          }
          .why-card {
            padding: 1.25rem 1rem !important;
            border-radius: 16px !important;
          }
          .why-icon {
            width: 42px !important;
            height: 42px !important;
            border-radius: 12px !important;
            margin-bottom: 1rem !important;
          }
          .why-icon svg {
            width: 18px !important;
            height: 18px !important;
          }
          .why-card h3 {
            font-size: 15px !important;
            margin-bottom: 0.4rem !important;
          }
          .why-card p {
            font-size: 12px !important;
            line-height: 1.6 !important;
          }
        }
        .why-card:hover .why-icon { background: var(--accent) !important; color: #fff !important; border-color: var(--accent) !important; }
      `}</style>
    </section>
  );
}
