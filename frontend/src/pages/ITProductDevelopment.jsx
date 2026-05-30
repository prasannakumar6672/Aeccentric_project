import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import {
  Smartphone, Globe, Server, Shield, RefreshCw,
  ArrowRight, ChevronDown, Code2, Cloud, Activity,
  Star, Clock, TrendingUp, Phone, Zap, Sparkles,
} from "lucide-react";

/* â”€â”€â”€ CSS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* NAV */
.nexus-service-page .nav { display: flex; align-items: center; justify-content: space-between; padding: 22px 0; border-bottom: 1px solid var(--border); }
.nexus-service-page .nav-logo { display: flex; align-items: center; gap: 9px; }
.nexus-service-page .nav-logo-icon { width: 34px; height: 34px; border-radius: 9px; background: var(--accent); display: flex; align-items: center; justify-content: center; }
.nexus-service-page .nav-logo-name { font-size: 16px; font-weight: 700; color: var(--text); letter-spacing: -0.02em; }
.nexus-service-page .nav-links { display: flex; gap: 28px; }
.nexus-service-page .nav-link { font-size: 14px; color: var(--text-muted); text-decoration: none; font-weight: 450; transition: color .15s; }
.nexus-service-page .nav-link:hover { color: var(--text); }
.nexus-service-page .nav-cta { background: var(--accent); color: #fff; border: none; border-radius: 100px; padding: 9px 20px; font-family: var(--f); font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity .15s; }
.nexus-service-page .nav-cta:hover { opacity: 0.85; }
  @media (max-width: 700px) { .nav-links { display: none; } }

  /* HERO */
.nexus-service-page .hero { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; padding: 72px 0 64px; border-bottom: 1px solid var(--border); }
  @media (max-width: 760px) { .hero { grid-template-columns: 1fr; padding: 48px 0 40px; gap: 40px; } }

.nexus-service-page .hero-eye { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-lt); border: 1px solid #DDD6FE; border-radius: 100px; padding: 5px 12px; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 22px; }
.nexus-service-page .hero-title { font-size: clamp(36px, 4.8vw, 58px); font-weight: 800; line-height: 1.06; letter-spacing: -0.035em; color: var(--text); margin-bottom: 18px; }
.nexus-service-page .hero-title .accent { color: var(--accent); }
.nexus-service-page .hero-desc { font-size: 16px; line-height: 1.78; color: var(--text-muted); max-width: 440px; margin-bottom: 32px; font-weight: 400; }
.nexus-service-page .hero-btns { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 36px; }

.nexus-service-page .btn-primary { display: inline-flex; align-items: center; gap: 7px; background: var(--accent); color: #fff; border: none; border-radius: 100px; padding: 13px 26px; font-family: var(--f); font-size: 14px; font-weight: 600; cursor: pointer; transition: opacity .15s, transform .15s; }
.nexus-service-page .btn-primary:hover { opacity: 0.87; transform: translateY(-1px); }

.nexus-service-page .hero-trust { display: flex; align-items: center; gap: 10px; }
.nexus-service-page .hero-trust-dots { display: flex; }
.nexus-service-page .trust-dot { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #fff; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-left: -7px; color: #fff; }
.nexus-service-page .trust-dot:first-child { margin-left: 0; }
.nexus-service-page .hero-trust-text { font-size: 13px; color: var(--text-muted); }
.nexus-service-page .hero-trust-text strong { color: var(--text); font-weight: 600; }

  /* HERO IMAGE */
.nexus-service-page .hero-img-wrap { position: relative; border-radius: var(--r-lg); overflow: hidden; aspect-ratio: 4/3; box-shadow: 0 20px 60px rgba(0,0,0,0.11); }
.nexus-service-page .hero-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
.nexus-service-page .img-badge { position: absolute; bottom: 20px; left: 20px; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.7); border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.09); }
.nexus-service-page .img-badge-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; flex-shrink: 0; box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
.nexus-service-page .img-badge-title { font-size: 12px; font-weight: 600; color: var(--text); }
.nexus-service-page .img-badge-sub { font-size: 11px; color: var(--text-muted); }
.nexus-service-page .img-tag { position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border-radius: 10px; padding: 7px 12px; font-size: 12px; font-weight: 700; color: var(--accent); box-shadow: 0 4px 14px rgba(0,0,0,0.07); }

  /* STATS */
.nexus-service-page .stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: var(--r-md); overflow: hidden; margin: 48px 0 0; }
  @media (max-width: 700px) { .stats-row { grid-template-columns: repeat(2,1fr); } }
.nexus-service-page .stat-cell { background: var(--bg-sec); padding: 26px 22px; transition: background .2s; cursor: default; }
.nexus-service-page .stat-cell:hover { background: var(--accent-lt); }
.nexus-service-page .stat-val { font-size: 38px; font-weight: 800; line-height: 1; color: var(--accent); letter-spacing: -0.04em; margin-bottom: 5px; }
.nexus-service-page .stat-label { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
.nexus-service-page .stat-sub { font-size: 11px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-hint); }

  /* SECTION */
.nexus-service-page .section { padding: 80px 0 0; }
.nexus-service-page .sec-eye { font-size: 10px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
.nexus-service-page .sec-title { font-size: clamp(26px, 3.2vw, 40px); font-weight: 800; line-height: 1.12; letter-spacing: -0.03em; color: var(--text); margin-bottom: 12px; }
.nexus-service-page .sec-sub { font-size: 15px; line-height: 1.75; color: var(--text-muted); max-width: 500px; margin-bottom: 44px; font-weight: 400; }

  /* SERVICES */
.nexus-service-page .svc-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  @media (max-width: 860px) { .svc-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 520px) { .svc-grid { grid-template-columns: 1fr; } }
.nexus-service-page .svc-card { padding: 26px 22px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-card); display: flex; flex-direction: column; transition: border-color .2s, box-shadow .2s, transform .2s; }
.nexus-service-page .svc-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(139,92,246,0.07); }
.nexus-service-page .svc-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; transition: transform .2s; }
.nexus-service-page .svc-card:hover .svc-icon { transform: scale(1.07); }
.nexus-service-page .svc-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 8px; line-height: 1.3; }
.nexus-service-page .svc-desc { font-size: 13px; line-height: 1.78; color: var(--text-muted); flex: 1; margin-bottom: 18px; font-weight: 400; }
.nexus-service-page .svc-tags { display: flex; flex-wrap: wrap; gap: 5px; padding-top: 14px; border-top: 1px solid var(--border); }
.nexus-service-page .svc-tag { padding: 3px 9px; border-radius: 100px; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }

  /* PROCESS */
.nexus-service-page .proc-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; position: relative; }
  @media (max-width: 860px) { .proc-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px) { .proc-grid { grid-template-columns: 1fr; } }
.nexus-service-page .proc-card { padding: 26px 22px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-card); position: relative; overflow: hidden; transition: border-color .2s, transform .2s; }
.nexus-service-page .proc-card:hover { transform: translateY(-2px); }
.nexus-service-page .proc-num-bg { position: absolute; top: 4px; right: 10px; font-size: 72px; font-weight: 800; line-height: 1; opacity: 0.03; user-select: none; pointer-events: none; transition: opacity .25s; }
.nexus-service-page .proc-card:hover .proc-num-bg { opacity: 0.06; }
.nexus-service-page .proc-badge { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; margin-bottom: 16px; }
.nexus-service-page .proc-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
.nexus-service-page .proc-desc { font-size: 13px; line-height: 1.75; color: var(--text-muted); font-weight: 400; }
.nexus-service-page .proc-arrow { display: none; position: absolute; top: 50%; right: -10px; transform: translateY(-50%); z-index: 10; color: #C4B5FD; }
  @media (min-width: 860px) { .proc-arrow { display: block; } }

  /* TECH */
.nexus-service-page .tech-wrap { background: var(--bg-sec); border: 1.5px solid var(--border); border-radius: var(--r-lg); padding: 48px; }
  @media (max-width: 640px) { .tech-wrap { padding: 32px 20px; } }
.nexus-service-page .tech-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
  @media (max-width: 860px) { .tech-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px) { .tech-grid { grid-template-columns: 1fr; } }
.nexus-service-page .tech-card { padding: 16px 14px; border-radius: var(--r-sm); background: #fff; border: 1px solid var(--border); }
.nexus-service-page .tech-cat { display: flex; align-items: center; gap: 7px; margin-bottom: 12px; }
.nexus-service-page .tech-dot { width: 6px; height: 6px; border-radius: 50%; }
.nexus-service-page .tech-cat-lbl { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; }
.nexus-service-page .tech-pills { display: flex; flex-wrap: wrap; gap: 5px; }
.nexus-service-page .tech-pill { padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 450; color: var(--text-muted); }

  /* PROOF */
.nexus-service-page .proof-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  @media (max-width: 720px) { .proof-grid { grid-template-columns: 1fr; } }
.nexus-service-page .proof-card { padding: 28px 24px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-card); display: flex; align-items: flex-start; gap: 16px; transition: border-color .2s, box-shadow .2s; }
.nexus-service-page .proof-card:hover { border-color: var(--border-h); box-shadow: 0 4px 20px rgba(139,92,246,0.06); }
.nexus-service-page .proof-icon { width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: var(--accent-lt); color: var(--accent); }
.nexus-service-page .proof-val { font-size: 28px; font-weight: 800; color: var(--text); letter-spacing: -0.03em; line-height: 1; margin-bottom: 5px; }
.nexus-service-page .proof-label { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
.nexus-service-page .proof-sub { font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: var(--text-hint); }

  /* BOOK A CALL */
.nexus-service-page .book-wrap { border-radius: var(--r-lg); padding: 48px 52px; border: 1.5px solid var(--border); background: var(--bg-sec); display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
  @media (max-width: 640px) { .book-wrap { padding: 32px 24px; } }
.nexus-service-page .book-title { font-size: clamp(20px, 2.5vw, 28px); font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 6px; }
.nexus-service-page .book-sub { font-size: 14px; color: var(--text-muted); font-weight: 400; }
.nexus-service-page .book-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--accent); color: #fff; border: none; border-radius: 100px; padding: 14px 28px; font-family: var(--f); font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: opacity .15s, transform .15s; flex-shrink: 0; }
.nexus-service-page .book-btn:hover { opacity: 0.87; transform: translateY(-1px); }

  /* FAQ */
.nexus-service-page .faq-list { display: flex; flex-direction: column; gap: 8px; max-width: 680px; }
.nexus-service-page .faq-item { border: 1.5px solid var(--border); border-radius: var(--r-sm); overflow: hidden; transition: border-color .2s; }
.nexus-service-page .faq-item.open { border-color: var(--accent); background: var(--accent-lt); }
.nexus-service-page .faq-item:not(.open):hover { border-color: var(--border-h); }
.nexus-service-page .faq-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 22px; text-align: left; background: transparent; border: none; cursor: pointer; font-family: var(--f); }
.nexus-service-page .faq-q { font-size: 14px; font-weight: 600; color: var(--text); line-height: 1.5; }
.nexus-service-page .faq-chev { flex-shrink: 0; color: var(--accent); transition: transform .3s; }
.nexus-service-page .faq-chev.open { transform: rotate(180deg); }
  .faq-
.nexus-service-page .faq-body.open { max-height: 260px; opacity: 1; }
.nexus-service-page .faq-body.closed { max-height: 0; opacity: 0; }
.nexus-service-page .faq-a { padding: 0 22px 18px; font-size: 13.5px; line-height: 1.82; color: var(--text-muted); font-weight: 400; }

  /* FOOTER CTA */
.nexus-service-page .footer-cta { margin-top: 80px; padding: 48px; border-radius: var(--r-lg); background: var(--bg-sec); border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
  @media (max-width: 640px) { .footer-cta { padding: 32px 24px; } }
.nexus-service-page .footer-cta-title { font-size: clamp(20px, 2.5vw, 28px); font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 6px; }
.nexus-service-page .footer-cta-sub { font-size: 14px; color: var(--text-muted); font-weight: 400; }

  /* REVEAL */
.nexus-service-page .reveal { opacity: 0; transform: translateY(22px); transition: opacity .5s ease, transform .5s ease; }
.nexus-service-page .reveal.in { opacity: 1; transform: translateY(0); }
`;

/* â”€â”€ hooks â”€â”€ */
const useReveal = () => {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.06 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, v];
};

const Counter = ({ end }) => {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const num = parseInt(end.replace(/\D/g, ""), 10);
        if (isNaN(num)) return;
        let c = 0; const step = Math.max(1, Math.ceil(num / 50));
        const id = setInterval(() => { c = Math.min(c + step, num); setN(c); if (c >= num) clearInterval(id); }, 28);
      }
    }, { threshold: 0.5 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [end]);
  return <span ref={ref}>{n}{end.replace(/[\d]/g, "")}</span>;
};

/* â”€â”€ data â”€â”€ */
const STATS = [
  { value: "300+", label: "Apps Deployed", sub: "across web & mobile" },
  { value: "99.9%", label: "Uptime SLA", sub: "production guarantee" },
  { value: "40%", label: "Faster Delivery", sub: "vs traditional teams" },
  { value: "0", label: "Security Breaches", sub: "zero-breach track record" },
];

const SERVICES = [
  { icon: Globe, title: "Web Application Engineering", desc: "Enterprise-grade React and Next.js applications engineered for scalability, accessibility, and exceptional performance.", color: "#2563EB", tags: ["React", "Next.js", "TypeScript", "Vite"] },
  { icon: Smartphone, title: "Mobile App Development", desc: "Native-feeling cross-platform applications with smooth experiences and modern mobile architecture.", color: "#7C3AED", tags: ["React Native", "Expo", "iOS", "Android"] },
  { icon: Server, title: "Backend Infrastructure", desc: "Scalable APIs, event-driven systems, and high-throughput microservice architecture.", color: "#059669", tags: ["Node.js", "FastAPI", "GraphQL", "Redis"] },
  { icon: Cloud, title: "Cloud Native Systems", desc: "Kubernetes orchestration, IaC deployment, and enterprise-grade cloud scalability.", color: "#2563EB", tags: ["AWS", "GCP", "Kubernetes", "Terraform"] },
  { icon: Shield, title: "DevSecOps & CI/CD", desc: "Security-first deployment pipelines with automated testing and continuous delivery.", color: "#D97706", tags: ["GitHub Actions", "Docker", "SonarQube", "OWASP"] },
  { icon: RefreshCw, title: "Legacy Modernization", desc: "Modernizing monolithic applications into scalable cloud-native ecosystems.", color: "#0891B2", tags: ["Strangler Fig", "API Gateway", "Microservices"] },
];

const PROCESS = [
  { n: "01", title: "Architecture Planning", desc: "We design scalable system architecture and infrastructure topology before development begins.", color: "#2563EB" },
  { n: "02", title: "Engineering Sprint", desc: "Dedicated agile sprints with continuous delivery pipelines and rapid iteration cycles.", color: "#7C3AED" },
  { n: "03", title: "Quality Assurance", desc: "Rigorous automated and manual testing across all critical user journeys.", color: "#059669" },
  { n: "04", title: "Scale & Support", desc: "Monitoring, optimization, security hardening, and post-launch reliability engineering.", color: "#D97706" },
];

const TECH = [
  { cat: "Frontend", items: ["React", "Next.js", "TypeScript", "Vite", "Svelte", "Vue 3"], color: "#2563EB" },
  { cat: "Backend", items: ["Node.js", "FastAPI", "Django", "Go", "GraphQL", "tRPC"], color: "#7C3AED" },
  { cat: "Cloud & Infra", items: ["AWS", "GCP", "Kubernetes", "Terraform", "Docker", "Ansible"], color: "#2563EB" },
  { cat: "DevOps & QA", items: ["GitHub Actions", "Datadog", "SonarQube", "k6", "Playwright", "Sentry"], color: "#059669" },
];

const PROOF = [
  { icon: Star, value: "4.9/5", label: "Client Satisfaction", sub: "across 300+ projects" },
  { icon: Clock, value: "6 wks", label: "Avg. Time to MVP", sub: "from brief to live system" },
  { icon: TrendingUp, value: "40%", label: "Faster Delivery", sub: "vs. traditional teams" },
];

const FAQS = [
  { q: "Do you provide full-stack teams?", a: "Yes. We provide dedicated cross-functional squads including frontend, backend, DevOps, QA, and technical leadership â€” all under a single engagement." },
  { q: "Who owns the source code?", a: "You retain complete ownership of the source code, infrastructure, documentation, and intellectual property from day one." },
  { q: "Do you offer post-launch support?", a: "Yes. We provide SLA-backed support, monitoring, maintenance, updates, and ongoing engineering assistance after every launch." },
  { q: "Can you work with our existing tech stack?", a: "Absolutely. We integrate with your existing stack as a capability layer â€” APIs, databases, and cloud â€” without rip-and-replace. We pick the right tool for the job." },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <button className="faq-btn" onClick={() => setOpen(o => !o)}>
        <span className="faq-q">{q}</span>
        <ChevronDown size={17} className={`faq-chev${open ? " open" : ""}`} />
      </button>
      <div className={`faq-body${open ? " open" : " closed"}`}>
        <p className="faq-a">{a}</p>
      </div>
    </div>
  );
};

/* â”€â”€ page â”€â”€ */
const ITProductDevelopment = () => {
  const [svcRef, svcV] = useReveal();
  const [procRef, procV] = useReveal();
  const [techRef, techV] = useReveal();
  const [proofRef, proofV] = useReveal();
  const [faqRef, faqV] = useReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="nexus-service-page">
      <style>{css}</style>
      <div className="page">

        {/* ── NAV ── */}
        <nav className="nav">
          <div className="nav-logo">
            <div className="nav-logo-icon"><Zap size={17} color="#fff" /></div>
            <span className="nav-logo-name">NexusAI</span>
          </div>
          <div className="nav-links">
            {["Services", "Technology", "Pricing", "About"].map(l => (
              <a key={l} href="#" className="nav-link">{l}</a>
            ))}
          </div>
          <button className="nav-cta">Get Started</button>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div>
            <div className="hero-eye"><Sparkles size={10} /> Digital Engineering</div>
            <h1 className="hero-title">
              Products Built to<br />
              <span className="accent">Scale, Perform</span><br />
              &amp; Last.
            </h1>
            <p className="hero-desc">
              We build scalable digital products, enterprise systems, cloud-native
              platforms, and intelligent software experiences â€” from MVP to production.
            </p>
            <div className="hero-btns">
              <Link to="/consultation" className="btn-primary" style={{ textDecoration: 'none' }}>Start a Project <ArrowRight size={14} /></Link>
            </div>
            <div className="hero-trust">
              <div className="hero-trust-dots">
                {[["#2563EB", "JK"], ["#059669", "MS"], ["#D97706", "TR"], ["#2563EB", "AN"]].map(([bg, ini], i) => (
                  <div key={i} className="trust-dot" style={{ background: bg }}>{ini}</div>
                ))}
              </div>
              <div className="hero-trust-text">Trusted by <strong>300+ product teams</strong> worldwide</div>
            </div>
          </div>
          <div className="hero-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=80&auto=format&fit=crop"
              alt="Full-stack software development"
            />
            <div className="img-tag">âš¡ Full-Stack</div>
            <div className="img-badge">
              <div className="img-badge-dot" />
              <div>
                <div className="img-badge-title">CI/CD Active</div>
                <div className="img-badge-sub">99.9% uptime Â· Auto-deploy</div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="stats-row">
          {STATS.map((s, i) => (
            <div key={i} className="stat-cell">
              <div className="stat-val"><Counter end={s.value} /></div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* SERVICES */}
        <section className="section" ref={svcRef}>
          <div className="sec-eye">Core Capabilities</div>
          <h2 className="sec-title">Six Engineering Disciplines.</h2>
          <p className="sec-sub">From frontend to cloud infrastructure â€” we cover every layer of your digital product stack.</p>
          <div className={`svc-grid reveal${svcV ? " in" : ""}`}>
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div key={i} className="svc-card"
                  style={{ transitionDelay: `${i * 50}ms` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = svc.color + "55"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  <div className="svc-icon" style={{ background: svc.color + "14", color: svc.color }}><Icon size={19} /></div>
                  <h3 className="svc-title">{svc.title}</h3>
                  <p className="svc-desc">{svc.desc}</p>
                  <div className="svc-tags">
                    {svc.tags.map((t, j) => (
                      <span key={j} className="svc-tag" style={{ background: svc.color + "12", color: svc.color }}>{t}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PROCESS */}
        <section className="section" ref={procRef}>
          <div className="sec-eye">Delivery Workflow</div>
          <h2 className="sec-title">Idea to production in weeks.</h2>
          <p className="sec-sub">A repeatable, low-risk path from brief to live product â€” with working software before any big commitment.</p>
          <div className={`proc-grid reveal${procV ? " in" : ""}`}>
            {PROCESS.map((p, i) => (
              <div key={i} className="proc-card"
                style={{ transitionDelay: `${i * 80}ms` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + "66"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <div className="proc-num-bg" style={{ color: p.color }}>{p.n}</div>
                <div className="proc-badge" style={{ background: p.color + "14", color: p.color }}>{p.n}</div>
                <h3 className="proc-title">{p.title}</h3>
                <p className="proc-desc">{p.desc}</p>
                {i < PROCESS.length - 1 && <div className="proc-arrow"><ArrowRight size={14} /></div>}
              </div>
            ))}
          </div>
        </section>

        {/* TECH */}
        <section className="section" ref={techRef}>
          <div className={`tech-wrap reveal${techV ? " in" : ""}`}>
            <div style={{ marginBottom: 40 }}>
              <div className="sec-eye">Technology</div>
              <h2 className="sec-title" style={{ marginBottom: 10 }}>The Engineering Stack We Use.</h2>
              <p style={{ fontSize: 15, lineHeight: 1.72, color: "var(--text-muted)", maxWidth: 440, fontWeight: 400 }}>
                Stack-agnostic and pragmatic. We pick the right tool for your use case â€” not the one we're affiliated with.
              </p>
            </div>
            <div className="tech-grid">
              {TECH.map((layer, i) => (
                <div key={i} className="tech-card">
                  <div className="tech-cat">
                    <div className="tech-dot" style={{ background: layer.color }} />
                    <span className="tech-cat-lbl" style={{ color: layer.color }}>{layer.cat}</span>
                  </div>
                  <div className="tech-pills">
                    {layer.items.map((item, j) => (
                      <span key={j} className="tech-pill" style={{ background: layer.color + "0E" }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROOF */}
        <section className="section" ref={proofRef}>
          <div className="sec-eye">Results</div>
          <h2 className="sec-title">Numbers That Speak.</h2>
          <p className="sec-sub">Documented outcomes across 300+ client deployments.</p>
          <div className={`proof-grid reveal${proofV ? " in" : ""}`}>
            {PROOF.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} className="proof-card">
                  <div className="proof-icon"><Icon size={18} /></div>
                  <div>
                    <div className="proof-val">{m.value}</div>
                    <div className="proof-label">{m.label}</div>
                    <div className="proof-sub">{m.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* BOOK A CALL */}
        <section className="section">
          <div className="book-wrap">
            <div>
              <div className="book-title">Ready to start building?</div>
              <div className="book-sub">30-minute call. We'll scope your product and outline the architecture â€” no commitment.</div>
            </div>
            <button className="book-btn" onClick={() => window.location.href = "/contact"}>
              <Phone size={15} /> Book a Call
            </button>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" ref={faqRef}>
          <div className={`reveal${faqV ? " in" : ""}`}>
            <div className="sec-eye">FAQ</div>
            <h2 className="sec-title" style={{ marginBottom: 36 }}>Common Questions.</h2>
            <div className="faq-list">
              {FAQS.map((f, i) => <FAQItem key={i} {...f} />)}
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}

      </div>
    </div>
  );
};

export default ITProductDevelopment;