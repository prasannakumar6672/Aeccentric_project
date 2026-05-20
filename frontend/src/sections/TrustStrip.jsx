import React, { useEffect, useState, useRef } from "react";
import { FaGoogle, FaAmazon, FaMeta, FaMicrosoft, FaApple, FaSpotify, FaStripe, FaSalesforce, FaUber } from "react-icons/fa6";

const logos = [
  { name: "Google", Icon: FaGoogle, color: "#4285F4" },
  { name: "Amazon", Icon: FaAmazon, color: "#FF9900" },
  { name: "Meta", Icon: FaMeta, color: "#0668E1" },
  { name: "Microsoft", Icon: FaMicrosoft, color: "#00A4EF" },
  { name: "Apple", Icon: FaApple, color: "#888888" },
  { name: "Spotify", Icon: FaSpotify, color: "#1DB954" },
  { name: "Stripe", Icon: FaStripe, color: "#635BFF" },
  { name: "Salesforce", Icon: FaSalesforce, color: "#00A1E0" },
  { name: "Uber", Icon: FaUber, color: "#000000" },
];

const allLogos = [...logos, ...logos];

const stats = [
  { value: "100+", label: "Projects Delivered" },
  { value: "50+", label: "Happy Clients" },
  { value: "6+", label: "Years Experience" },
  { value: "95%", label: "Client Satisfaction" },
];

export default function TrustStrip() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{
      width: '100%', background: 'var(--bg)', borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)', transition: 'all 0.4s',
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transitionProperty: 'opacity,transform,background,border-color', transitionDuration: '0.8s',
    }}>

      {/* Label */}
      <div style={{ textAlign: 'center', paddingTop: '3.5rem', paddingBottom: '1.5rem' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
          Trusted by modern global brands
        </span>
      </div>

      {/* Marquee */}
      <div style={{
        position: 'relative', height: '56px', overflow: 'hidden',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
      }}>
        {/* Grey layer */}
        <div className="ts-ticker" style={{ display: 'flex', alignItems: 'center', gap: '52px', width: 'max-content', height: '100%', paddingLeft: '26px' }}>
          {allLogos.map((logo, i) => {
            const Icon = logo.Icon;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '9px', flexShrink: 0 }}>
                <Icon style={{ width: 20, height: 20, color: 'var(--text-subtle)', opacity: 0.4 }} />
                <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-subtle)', opacity: 0.3, whiteSpace: 'nowrap' }}>{logo.name}</span>
              </div>
            );
          })}
        </div>
        {/* Colored center layer */}
        <div className="ts-ticker" style={{
          position: 'absolute', top: 0, left: 0, display: 'flex', alignItems: 'center',
          gap: '52px', width: 'max-content', height: '100%', paddingLeft: '26px', pointerEvents: 'none',
          WebkitMaskImage: 'linear-gradient(to right, transparent 38%, black 48%, black 52%, transparent 62%)',
          maskImage: 'linear-gradient(to right, transparent 38%, black 48%, black 52%, transparent 62%)',
        }}>
          {allLogos.map((logo, i) => {
            const Icon = logo.Icon;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '9px', flexShrink: 0 }}>
                <Icon style={{ width: 20, height: 20, color: logo.color }} />
                <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.04em', color: logo.color, whiteSpace: 'nowrap' }}>{logo.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2rem 1rem', maxWidth: '1200px', margin: '3rem auto 0',
        padding: '0 2rem 3.5rem', width: '100%',
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 900, letterSpacing: '-0.05em', color: 'var(--text)', lineHeight: 1, marginBottom: '0.4rem' }}>
              {visible ? s.value : '—'}
            </span>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .ts-ticker { animation: ts-tick 36s linear infinite; }
        @keyframes ts-tick { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @media(min-width:640px){
          [data-stats-grid] { grid-template-columns: repeat(4,1fr) !important; }
        }
      `}</style>
    </section>
  );
}