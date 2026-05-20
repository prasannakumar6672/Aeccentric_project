import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Target, Zap, Shield, ArrowRight, Activity, Users, MapPin, CheckCircle } from 'lucide-react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:         #FFFFFF;
    --bg-card:    #FFFFFF;
    --bg-sec:     #F8F9FB;
    --border:     #E4E7EE;
    --border-h:   #BFDBFE;
    --text:       #0D1117;
    --text-muted: #5A6272;
    --text-hint:  #9BA3B4;
    --accent:     #2563EB;
    --accent-lt:  #EFF6FF;
    --r-sm:       10px;
    --r-md:       16px;
    --r-lg:       24px;
    --f: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--f); -webkit-font-smoothing: antialiased; }
  .page { max-width: 1120px; margin: 0 auto; padding: 0 32px 120px; }

  /* HERO */
  .hero { padding: 120px 0 64px; text-align: center; border-bottom: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; }
  .hero-eye { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-lt); border: 1px solid var(--border-h); border-radius: 100px; padding: 5px 12px; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 22px; }
  .hero-title { font-size: clamp(36px, 4.8vw, 58px); font-weight: 800; line-height: 1.06; letter-spacing: -0.035em; color: var(--text); margin-bottom: 18px; }
  .hero-title .accent { color: var(--accent); }
  .hero-desc { font-size: 16px; line-height: 1.78; color: var(--text-muted); max-width: 560px; margin: 0 auto 32px; font-weight: 400; }
  
  /* STATS */
  .stats-row { display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; padding-top: 32px; border-top: 1px solid var(--border); width: 100%; }
  .stat-cell { text-align: center; }
  .stat-val { font-size: 32px; font-weight: 800; color: var(--accent); margin-bottom: 4px; }
  .stat-lbl { font-size: 12px; font-weight: 600; color: var(--text-hint); text-transform: uppercase; letter-spacing: 0.05em; }

  /* SECTION */
  .section { padding: 80px 0 0; }
  .sec-eye { font-size: 10px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
  .sec-title { font-size: clamp(26px, 3.2vw, 40px); font-weight: 800; line-height: 1.12; letter-spacing: -0.03em; color: var(--text); margin-bottom: 12px; }
  .sec-sub { font-size: 15px; line-height: 1.75; color: var(--text-muted); max-width: 500px; margin-bottom: 44px; font-weight: 400; }

  /* MISSION */
  .mission-wrap { display: flex; gap: 48px; align-items: center; }
  @media (max-width: 760px) { .mission-wrap { flex-direction: column; } }
  .mission-content { flex: 1; text-align: left; }
  @media (max-width: 760px) { .mission-content { text-align: center; } }
  .mission-visual { width: 40%; flex-shrink: 0; height: 300px; background: var(--bg-sec); border: 1px solid var(--border); border-radius: var(--r-lg); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  @media (max-width: 760px) { .mission-visual { width: 100%; } }

  /* VALUES */
  .val-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
  @media (max-width: 640px) { .val-grid { grid-template-columns: 1fr; } }
  .val-card { padding: 26px 22px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-card); display: flex; flex-direction: column; transition: border-color .2s, box-shadow .2s; }
  .val-card:hover { border-color: var(--border-h); box-shadow: 0 4px 20px rgba(37,99,235,0.06); }
  .val-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; background: var(--accent-lt); color: var(--accent); }
  .val-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 8px; text-align: left; }
  .val-desc { font-size: 13.5px; line-height: 1.75; color: var(--text-muted); font-weight: 400; text-align: left; }

  /* TIMELINE */
  .timeline { position: relative; padding: 32px 0; max-width: 600px; margin: 0 auto; }
  .timeline::before { content: ''; position: absolute; top: 0; bottom: 0; left: 15px; width: 2px; background: var(--border); }
  .timeline-item { position: relative; padding-left: 48px; margin-bottom: 32px; text-align: left; }
  .timeline-dot { position: absolute; top: 4px; left: 10px; width: 12px; height: 12px; border-radius: 50%; background: var(--accent); border: 2px solid #fff; }
  .timeline-year { font-size: 12px; font-weight: 700; color: var(--accent); margin-bottom: 4px; }
  .timeline-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .timeline-desc { font-size: 13.5px; line-height: 1.75; color: var(--text-muted); font-weight: 400; }

  /* CTA */
  .cta-wrap { border-radius: var(--r-lg); padding: 48px 52px; border: 1.5px solid var(--border); background: var(--bg-sec); text-align: center; margin-top: 80px; width: 100%; }
  @media (max-width: 640px) { .cta-wrap { padding: 32px 24px; } }
  .cta-title { font-size: clamp(24px, 3vw, 36px); font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 12px; }
  .cta-sub { font-size: 15px; color: var(--text-muted); font-weight: 400; max-width: 500px; margin: 0 auto 32px; }
  .cta-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--accent); color: #fff; border: none; border-radius: 100px; padding: 14px 28px; font-family: var(--f); font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: opacity .15s, transform .15s; text-decoration: none; }
  .cta-btn:hover { opacity: 0.87; transform: translateY(-1px); }

  /* REVEAL */
  .reveal { opacity: 0; transform: translateY(22px); transition: opacity .5s ease, transform .5s ease; }
  .reveal.in { opacity: 1; transform: translateY(0); }
`;

const useReveal = (threshold = 0.1) => {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, v];
};

const STATS = [
  { value: '2019', label: 'Founded', color: '#2563EB' },
  { value: '500+', label: 'Deployments', color: '#1D4ED8' },
  { value: '15+', label: 'Countries', color: '#3B82F6' },
  { value: '45+', label: 'Engineers', color: '#60A5FA' },
];

const VALUES = [
  { icon: Target, title: 'Extreme Ownership', desc: 'We don\'t just write code; we own the outcome. If a system fails in production, it\'s our problem to fix, regardless of the SLA.', color: '#2563EB' },
  { icon: Zap, title: 'Velocity with Quality', desc: 'Speed without stability is a liability. We move fast by enforcing rigorous automated testing, CI/CD, and immutable infrastructure.', color: '#3B82F6' },
  { icon: Shield, title: 'Security by Design', desc: 'Security isn\'t an afterthought. Every architecture we design assumes zero-trust and undergoes continuous vulnerability scanning.', color: '#60A5FA' },
  { icon: Activity, title: 'Data-Driven Decisions', desc: 'We don\'t guess. Every architectural choice, AI model selection, and UX iteration is backed by empirical data and telemetry.', color: '#1D4ED8' },
];

const TIMELINE = [
  { year: '2019', title: 'Inception', desc: 'AECCENTRIC founded in Hyderabad as a specialized boutique web development agency.' },
  { year: '2021', title: 'Cloud Native', desc: 'Expanded into DevOps and Cloud architecture, delivering enterprise-scale SaaS platforms.' },
  { year: '2023', title: 'The AI Pivot', desc: 'Integrated LLMs and autonomous agents into our core offering, launching AI Services.' },
  { year: '2025', title: 'Global Scale', desc: 'Now serving clients across 15+ countries with advanced AI-powered manufacturing and digital transformation solutions.' },
];

const Company = () => {
  const [mounted, setMounted] = useState(false);
  const [statsRef, statsV] = useReveal();
  const [missionRef, missionV] = useReveal();
  const [valuesRef, valuesV] = useReveal();
  const [timelineRef, timelineV] = useReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
    setMounted(true);
  }, []);

  return (
    <div className="page">
      <style>{css}</style>
      
      {/* HERO */}
      <section className="hero">
        <div className="hero-eye"><Globe size={10} /> Our Company</div>
        <h1 className="hero-title">
          Engineering the<br />
          <span className="accent">future of industry.</span>
        </h1>
        <p className="hero-desc">
          We are a deep-tech engineering firm specializing in AI, cloud-native architecture, and autonomous manufacturing systems. We don't just build software; we build competitive advantages.
        </p>

        {/* Quick Stats Row */}
        <div className="stats-row" ref={statsRef}>
          {STATS.map((s, i) => (
            <div key={i} className="stat-cell">
              <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section ref={missionRef} className="section">
        <div className="mission-wrap reveal" style={{ opacity: missionV ? 1 : 0, transform: missionV ? 'translateY(0)' : 'translateY(24px)', transition: "opacity 0.5s ease, transform 0.5s ease" }}>
          
          {/* Left */}
          <div className="mission-content">
            <div className="sec-eye">The Mission</div>
            <h2 className="sec-title">
              Bridging the gap between bleeding-edge AI and enterprise reality.
            </h2>
            <div className="space-y-6 text-[15px] text-[var(--text-muted)] leading-relaxed">
              <p>
                Most enterprises are stuck. They know they need AI and automation to survive the next decade, but their legacy systems are brittle, and off-the-shelf SaaS solutions don't fit their unique operational workflows.
              </p>
              <p>
                AECCENTRIC was built to solve this exact problem. We act as an elite strike team for digital transformation â€” coming in, diagnosing the architectural bottlenecks, and deploying custom, production-grade systems that actually work in the real world.
              </p>
            </div>
          </div>

          {/* Right: Abstract Visual */}
          <div className="mission-visual">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center shadow-xl z-10">
              <span className="text-white font-black text-xl">AE</span>
            </div>
          </div>

        </div>
      </section>

      {/* CORE VALUES */}
      <section ref={valuesRef} className="section">
        <div className="sec-eye">Core Principles</div>
        <h2 className="sec-title">How we operate.</h2>
        <p className="sec-sub">We don't guess. Every architectural choice, AI model selection, and UX iteration is backed by empirical data and telemetry.</p>

        <div className="val-grid">
          {VALUES.map((val, i) => {
            const Icon = val.icon;
            return (
              <div key={i} className="val-card reveal" style={{ 
                opacity: valuesV ? 1 : 0, 
                transform: valuesV ? 'translateY(0)' : 'translateY(24px)', 
                transition: "opacity 0.5s " + (i * 0.1) + "s ease, transform 0.5s " + (i * 0.1) + "s ease" 
              }}>
                <div className="val-icon">
                  <Icon size={20} />
                </div>
                <h3 className="val-title">{val.title}</h3>
                <p className="val-desc">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TIMELINE */}
      <section ref={timelineRef} className="section">
        <div className="sec-eye">Our Journey</div>
        <h2 className="sec-title">Relentless iteration.</h2>
        <p className="sec-sub">From a small agency to a global deep-tech firm.</p>

        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <div key={i} className="timeline-item reveal" style={{ 
              opacity: timelineV ? 1 : 0, 
              transform: timelineV ? 'translateY(0)' : 'translateY(24px)', 
              transition: "opacity 0.5s " + (i * 0.1) + "s ease, transform 0.5s " + (i * 0.1) + "s ease" 
            }}>
              <div className="timeline-dot" />
              <div className="timeline-year">{item.year}</div>
              <div className="timeline-title">{item.title}</div>
              <div className="timeline-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GLOBAL PRESENCE CTA */}
      <section className="section">
        <div className="cta-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] mb-4">
            <MapPin size={12} className="text-[#2563EB]" />
            <span className="text-[11px] font-black uppercase tracking-wider text-[#2563EB]">HQ: Hyderabad, India</span>
          </div>
          <h2 className="cta-title">Ready to engineer your next phase of growth?</h2>
          <p className="cta-sub">We specialize in the complex, the broken, and the "impossible". Let's talk about your systems architecture.</p>
          <Link to="/contact" className="cta-btn">Contact Our Team <ArrowRight size={14} /></Link>
        </div>
      </section>

    </div>
  );
};

export default Company;
