import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, BarChart2, Shield, Factory, Cpu, LayoutDashboard, ChevronRight } from 'lucide-react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  

  
  html.dark .nexus-service-page,
  [data-theme="dark"] .nexus-service-page {
    --bg:         #030712;
    --bg-card:    #0D1526;
    --bg-sec:     #070D1A;
    --border:     rgba(255, 255, 255, 0.08);
    --border-h:   color-mix(in srgb, var(--accent) 35%, transparent);
    --text:       #F1F5F9;
    --text-muted: #94A3B8;
    --text-hint:  #64748B;
    --accent-lt:  color-mix(in srgb, var(--accent) 12%, transparent);
  }

  .nexus-service-page {
    background: var(--bg);
    color: var(--text);
    font-family: var(--f, 'Inter', sans-serif);
    -webkit-font-smoothing: antialiased;
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

  
.nexus-service-page .page { max-width: 1120px; margin: 0 auto; padding: 0 32px 120px; }

  /* HERO */
.nexus-service-page .hero { padding: 120px 0 64px; text-align: center; border-bottom: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; }
.nexus-service-page .hero-eye { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-lt); border: 1px solid var(--border-h); border-radius: 100px; padding: 5px 12px; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 22px; }
.nexus-service-page .hero-title { font-size: clamp(36px, 4.8vw, 58px); font-weight: 800; line-height: 1.06; letter-spacing: -0.035em; color: var(--text); margin-bottom: 18px; }
.nexus-service-page .hero-title .accent { color: var(--accent); }
.nexus-service-page .hero-desc { font-size: 16px; line-height: 1.78; color: var(--text-muted); max-width: 560px; margin: 0 auto 32px; font-weight: 400; }
  
  /* SECTION */
.nexus-service-page .section { padding: 48px 0; }
  
  /* CASE STUDIES */
.nexus-service-page .cs-item { display: flex; gap: 48px; align-items: center; padding: 48px 0; border-bottom: 1px solid var(--border); }
  @media (max-width: 860px) { .cs-item { flex-direction: column; text-align: center; } }
.nexus-service-page .cs-item:nth-child(even) { flex-direction: row-reverse; }
  @media (max-width: 860px) { .cs-item:nth-child(even) { flex-direction: column; } }
  
.nexus-service-page .cs-img-wrap { width: 45%; flex-shrink: 0; position: relative; border-radius: var(--r-lg); overflow: hidden; border: 1px solid var(--border); aspect-ratio: 4/3; }
  @media (max-width: 860px) { .cs-img-wrap { width: 100%; } }
.nexus-service-page .cs-img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
.nexus-service-page .cs-item:hover .cs-img { transform: scale(1.03); }
  
.nexus-service-page .cs-content { width: 55%; display: flex; flex-direction: column; align-items: flex-start; }
  @media (max-width: 860px) { .cs-content { width: 100%; align-items: center; } }
  
.nexus-service-page .cs-tag { display: inline-flex; align-items: center; gap: 5px; padding: 4px: 10px; border-radius: 100px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
.nexus-service-page .cs-title { font-size: clamp(24px, 2.5vw, 32px); font-weight: 800; color: var(--text); line-height: 1.2; margin-bottom: 16px; letter-spacing: -0.02em; text-align: left; }
  @media (max-width: 860px) { .cs-title { text-align: center; } }
.nexus-service-page .cs-desc { font-size: 14px; line-height: 1.75; color: var(--text-muted); margin-bottom: 24px; text-align: left; }
  @media (max-width: 860px) { .cs-desc { text-align: center; } }
  
.nexus-service-page .cs-results { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; padding-top: 16px; border-top: 1px solid var(--border); width: 100%; }
  @media (max-width: 480px) { .cs-results { grid-template-columns: 1fr; } }
.nexus-service-page .cs-res-item { display: flex; flex-direction: column; text-align: left; }
  @media (max-width: 860px) { .cs-res-item { text-align: center; } }
.nexus-service-page .cs-res-val { font-size: 16px; font-weight: 700; color: var(--text); }
.nexus-service-page .cs-res-lbl { font-size: 12px; color: var(--text-muted); }
  
  /* CTA */
.nexus-service-page .cta-wrap { border-radius: var(--r-lg); padding: 48px 52px; border: 1.5px solid var(--border); background: var(--bg-sec); text-align: center; margin-top: 80px; width: 100%; }
  @media (max-width: 640px) { .cta-wrap { padding: 32px 24px; } }
.nexus-service-page .cta-title { font-size: clamp(24px, 3vw, 36px); font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 12px; }
.nexus-service-page .cta-sub { font-size: 15px; color: var(--text-muted); font-weight: 400; max-width: 500px; margin: 0 auto 32px; }
.nexus-service-page .cta-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--accent); color: #fff; border: none; border-radius: 100px; padding: 14px 28px; font-family: var(--f); font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: opacity .15s, transform .15s; text-decoration: none; }
.nexus-service-page .cta-btn:hover { opacity: 0.87; transform: translateY(-1px); }

  /* REVEAL */
.nexus-service-page .reveal { opacity: 0; transform: translateY(22px); transition: opacity .5s ease, transform .5s ease; }
.nexus-service-page .reveal.in { opacity: 1; transform: translateY(0); }
`;

const useReveal = (threshold = 0.08) => {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, v];
};

const CASE_STUDIES = [
  {
    title: 'Autonomous Defect Detection for Precision Manufacturing',
    client: 'PrecisionTek Industries',
    industry: 'Manufacturing',
    challenge: 'A 72-hour manual QA cycle was bottlenecking production of aerospace components, leading to a 4% defect slip rate.',
    solution: 'Deployed a custom computer vision model (YOLOv9) on edge devices directly at the assembly line, integrated with their legacy ERP via a custom bridge.',
    results: ['72hr â†’ Real-time QA', '0.01% Defect Slip Rate', 'â‚¹1.2Cr Annual Savings'],
    icon: Factory,
    color: '#2563EB',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop',
  },
  {
    title: 'Zero-Downtime Microservices Migration',
    client: 'SkyCommerce Ltd',
    industry: 'E-Commerce',
    challenge: 'A 12-year-old monolithic architecture was crashing under Black Friday loads, preventing scaling and halting feature development.',
    solution: 'Strangler fig pattern migration to a Kubernetes-orchestrated microservices architecture in AWS, with a custom event-driven data sync layer.',
    results: ['99.999% Uptime', '3x Faster Page Loads', 'Deployment time: Weeks â†’ Hours'],
    icon: LayoutDashboard,
    color: '#1D4ED8',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop',
  },
  {
    title: 'RAG-Powered Financial Analyst Copilot',
    client: 'FinBridge India',
    industry: 'Financial Services',
    challenge: 'Analysts spent 60% of their time manually extracting covenants from 500+ page PDF credit agreements.',
    solution: 'Built a secure, on-prem RAG pipeline using Llama 3 and Qdrant vector database, wrapping it in a React-based copilot interface.',
    results: ['14 hrs/week saved per analyst', '99.4% Extraction Accuracy', 'Zero Data Leakage'],
    icon: BarChart2,
    color: '#3B82F6',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2000&auto=format&fit=crop',
  },
  {
    title: 'DfAM Optimization for Aerospace Components',
    client: 'Aero Systems Pvt Ltd',
    industry: 'Aerospace',
    challenge: 'Traditional milling of titanium drone brackets was too heavy and resulted in 80% material waste.',
    solution: 'Applied topological optimization algorithms and transitioned to SLM (Selective Laser Melting) 3D printing.',
    results: ['42% Weight Reduction', 'â‚¹8L Cost Avoidance', 'Consolidated 5 parts into 1'],
    icon: Cpu,
    color: '#60A5FA',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2000&auto=format&fit=crop',
  },
];

const CaseStudies = () => {
  const [mounted, setMounted] = useState(false);
  const [cardsRef, cardsV] = useReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
    setMounted(true);
  }, []);

  return (
    <div className="nexus-service-page">
      <div className="page">
      <style>{css}</style>
      
      {/* HERO */}
      <section className="hero">
        <div className="hero-eye"><BookOpen size={10} /> Case Studies</div>
        <h1 className="hero-title">
          Engineering<br />
          <span className="accent">in action.</span>
        </h1>
        <p className="hero-desc">
          We don't just talk about theoretical architecture. Here is how we've solved complex, multi-million dollar engineering problems for global enterprises.
        </p>
      </section>

      {/* CASE STUDIES LIST */}
      <section ref={cardsRef} className="section">
        <div className="space-y-16">
          {CASE_STUDIES.map((study, i) => {
            const Icon = study.icon;
            return (
              <div key={i} className="cs-item reveal" style={{ 
                opacity: cardsV ? 1 : 0, 
                transform: cardsV ? 'translateY(0)' : 'translateY(24px)', 
                transition: "opacity 0.5s " + (i * 0.1) + "s ease, transform 0.5s " + (i * 0.1) + "s ease" 
              }}>
                
                {/* Visual Half */}
                <div className="cs-img-wrap">
                  <img src={study.image} alt={study.title} className="cs-img" />
                  <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(0,0,0,0.6)', padding: '8px 12px', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                    {study.client}
                  </div>
                </div>

                {/* Content Half */}
                <div className="cs-content">
                  <div className="cs-tag" style={{ background: study.color + "14", color: study.color }}>
                    <Icon size={12} /> {study.industry}
                  </div>

                  <h2 className="cs-title">
                    {study.title}
                  </h2>

                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text)', textTransform: 'uppercase', marginBottom: 4 }}>The Challenge</h4>
                    <p className="cs-desc">{study.challenge}</p>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text)', textTransform: 'uppercase', marginBottom: 4 }}>The Solution</h4>
                    <p className="cs-desc">{study.solution}</p>
                  </div>

                  {/* Results Grid */}
                  <div className="cs-results">
                    {study.results.map((res, j) => (
                      <div key={j} className="cs-res-item">
                        <div className="cs-res-val">{res.split(' ')[0]}</div>
                        <div className="cs-res-lbl">{res.split(' ').slice(1).join(' ')}</div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="cta-wrap">
          <h2 className="cta-title">Ready to solve your toughest engineering challenge?</h2>
          <p className="cta-sub">We specialize in the complex, the broken, and the "impossible". Let's talk about your systems architecture.</p>
          <Link to="/contact" className="cta-btn">Start a Conversation <ArrowRight size={14} /></Link>
        </div>
      </section>

    </div>
    </div>
  );
};

export default CaseStudies;
