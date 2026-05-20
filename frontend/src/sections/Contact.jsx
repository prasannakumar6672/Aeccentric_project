import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section style={{
      position: 'relative', width: '100%',
      padding: '6rem 1.5rem 5rem',
      background: 'var(--bg)', overflow: 'hidden',
      transition: 'background 0.4s',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '500px',
        background: 'radial-gradient(ellipse, var(--accent-light) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(37,99,235,0.06) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
      >
        {/* Badge */}
        <div className="pill-badge" style={{ marginBottom: '1.5rem' }}>
          <span className="pill-dot" />
          Start Your Transformation
        </div>

        {/* Heading */}
        <h2 style={{
          maxWidth: '1000px', margin: '0 auto',
          fontSize: 'clamp(36px,6vw,80px)', fontWeight: 900,
          color: 'var(--text)', lineHeight: 0.98, letterSpacing: '-0.05em',
          marginBottom: '1.5rem',
        }}>
          Let's Build Intelligent <br className="hidden md:block" />
          Systems For Your Business
        </h2>

        {/* Subtext */}
        <p style={{
          maxWidth: '700px', fontSize: 'clamp(16px,1.4vw,20px)',
          color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '3rem',
        }}>
          Ready to systemize your success? Click below to book your free
          strategy consultation and explore AI automation solutions tailored
          for your business growth.
        </p>

        {/* CTA Button */}
        <Link
          to="/consultation"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
            background: 'var(--navy)', color: '#ffffff',
            padding: '0 2.5rem', height: '68px', borderRadius: '999px',
            fontWeight: 900, letterSpacing: '0.14em', fontSize: '14px',
            textDecoration: 'none', position: 'relative', overflow: 'hidden',
            boxShadow: '0 20px 50px var(--accent-glow)',
            transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 28px 60px var(--accent-glow)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 20px 50px var(--accent-glow)'; }}
        >
          {/* Gradient overlay on hover */}
          <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--accent), #1D4ED8)', opacity: 0, transition: 'opacity 0.4s', borderRadius: 'inherit' }} className="cta-gradient" />
          <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '14px' }}>
            BOOK A FREE STRATEGY CALL
            <span style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ChevronRight style={{ width: '16px', height: '16px' }} strokeWidth={2.5} />
            </span>
          </span>
        </Link>

        {/* Status hint */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2rem', opacity: 0.6 }}>
          <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#22C55E', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
            Limited consultation slots available
          </span>
        </div>
      </motion.div>

      <style>{`
        .cta-gradient { pointer-events: none; }
        a:hover .cta-gradient { opacity: 1 !important; }
      `}</style>
    </section>
  );
}