import React, { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceLayout = ({ title, subtitle, description, points, image, accent, children, hideHero = false }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Create a slightly lighter/more saturated version of accent for gradient
  const accentGlow = `${accent}30`;
  const accentMid = `${accent}18`;

  return (
    <div className="min-h-screen bg-[var(--bg)] transition-colors duration-500">
      <main>

        {/* ═══════════════════════════════════════════════════════
            CINEMATIC HERO
        ═══════════════════════════════════════════════════════ */}
        {!hideHero && (
        <section className="relative overflow-hidden pt-36 pb-20" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>

          {/* Animated grid background */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
              opacity: 0.35,
            }}
          />

          {/* Large radial accent glow behind content */}
          <div className="absolute pointer-events-none"
            style={{
              top: '-10%', right: '-5%',
              width: '65vw', height: '65vw',
              background: `radial-gradient(circle, ${accentGlow} 0%, ${accentMid} 30%, transparent 70%)`,
              borderRadius: '50%',
            }}
          />

          {/* Bottom left secondary glow */}
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
            style={{ background: `radial-gradient(circle, ${accent}0A 0%, transparent 70%)` }}
          />

          <div className="relative z-10 max-w-[1320px] mx-auto px-6 sm:px-10 w-full">

            {/* Breadcrumb */}
            <div
              className="flex items-center gap-2 mb-12 text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(10px)', transition: 'all 0.4s ease' }}
            >
              <Link to="/" className="flex items-center gap-1.5 text-[var(--text-subtle)] hover:text-[var(--accent)] transition-colors">
                <ArrowLeft size={11} /> Home
              </Link>
              <ChevronRight size={11} className="text-[var(--border)]" />
              <span className="text-[var(--text-subtle)]">Services</span>
              <ChevronRight size={11} className="text-[var(--border)]" />
              <span style={{ color: accent }}>{subtitle}</span>
            </div>

            {/* Hero grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_540px] gap-16 xl:gap-20 items-center">

              {/* LEFT: all text */}
              <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(30px)', transition: 'all 0.65s cubic-bezier(0.16,1,0.3,1) 0.05s' }}>

                {/* Category pill */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-7 border"
                  style={{ background: `${accent}10`, borderColor: `${accent}25`, color: accent }}
                >
                  <Zap size={12} fill={accent} />
                  <span className="text-[11px] font-black uppercase tracking-[0.22em]">{subtitle}</span>
                </div>

                {/* Giant headline */}
                <h1
                  className="font-black tracking-[-0.04em] text-[var(--text)] leading-[0.92] mb-7"
                  style={{ fontSize: 'clamp(52px, 6vw, 90px)' }}
                >
                  {title.split(' ').map((word, i, arr) => (
                    <span key={i}>
                      {i === arr.length - 1 ? (
                        <span style={{
                          background: `linear-gradient(135deg, ${accent} 0%, ${accent}aa 100%)`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}>{word}</span>
                      ) : `${word} `}
                    </span>
                  ))}.
                </h1>

                {/* Description */}
                <p className="text-[var(--text-muted)] leading-[1.75] mb-10 max-w-[560px]"
                  style={{ fontSize: 'clamp(16px, 1.4vw, 19px)' }}
                >
                  {description}
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2.5 mb-10">
                  {points.map((point, i) => (
                    <div key={i}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border text-[13px] font-semibold text-[var(--text)] transition-all duration-200 hover:border-[var(--accent)] cursor-default"
                      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                      {point}
                    </div>
                  ))}
                </div>

                {/* CTA row */}

              </div>

              {/* RIGHT: visual panel */}
              {image ? (
                <div
                  className="relative hidden lg:block"
                  style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px) scale(0.98)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s' }}
                >
                  {/* Accent glow behind card */}
                  <div className="absolute -inset-8 rounded-[60px] blur-[60px] pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${accent}35 0%, transparent 70%)` }} />

                  {/* Tilted card effect */}
                  <div className="relative" style={{ transform: 'perspective(800px) rotateY(-4deg) rotateX(2deg)', transition: 'transform 0.5s ease' }}>
                    <div className="relative rounded-[32px] overflow-hidden shadow-2xl border"
                      style={{ borderColor: `${accent}25` }}>
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover aspect-[4/5]"
                        style={{ transform: 'scale(1.02)' }}
                      />
                      {/* Color overlay for depth */}
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: `linear-gradient(135deg, ${accent}15 0%, transparent 60%)` }} />
                    </div>

                    {/* Floating stat badges on the image */}
                    <div className="absolute -left-8 top-10 px-4 py-3 rounded-2xl border backdrop-blur-lg shadow-xl"
                      style={{ background: 'var(--bg-card)', borderColor: `${accent}30` }}>
                      <div className="text-[22px] font-black leading-none mb-0.5" style={{ color: accent }}>500+</div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-subtle)]">Projects Done</div>
                    </div>

                    <div className="absolute -right-6 bottom-16 px-4 py-3 rounded-2xl border backdrop-blur-lg shadow-xl"
                      style={{ background: 'var(--bg-card)', borderColor: `${accent}30` }}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <div className="text-[10px] font-black uppercase tracking-[0.15em] text-green-500">Live Support</div>
                      </div>
                      <div className="text-[13px] font-semibold text-[var(--text)]">24/7 availability</div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Abstract data-viz placeholder when no image */
                <div
                  className="relative hidden lg:flex items-center justify-center"
                  style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s', height: '480px' }}
                >
                  {/* Concentric rings */}
                  {[480, 360, 260, 180, 110].map((size, i) => (
                    <div key={i} className="absolute rounded-full border"
                      style={{
                        width: size, height: size,
                        borderColor: `${accent}${Math.max(8, 30 - i * 5).toString(16).padStart(2, '0')}`,
                        animation: `spin ${12 + i * 4}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                      }}
                    />
                  ))}
                  <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
                    style={{ background: `${accent}15`, border: `2px solid ${accent}30` }}>
                    <span className="text-3xl font-black" style={{ color: accent }}>AE</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        )}

        {/* ═══════════════════════════════════════════════════════
            CONTENT
        ═══════════════════════════════════════════════════════ */}
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 pt-12 pb-24 space-y-0">
          {children}
        </div>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ServiceLayout;
