import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Bot, Brain, BarChart2, Cpu, MessageSquare, Workflow,
  ArrowRight, ChevronDown, TrendingUp, Clock, Star, Sparkles, Zap, Phone
} from "lucide-react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:         #FFFFFF;
    --bg-card:    #FFFFFF;
    --bg-sec:     #F8F9FB;
    --border:     #E4E7EE;
    --border-h:   #BCC5FF;
    --text:       #0D1117;
    --text-muted: #5A6272;
    --text-hint:  #9BA3B4;
    --accent:     #3B5BFF;
    --accent-lt:  #EEF1FF;
    --r-sm:       10px;
    --r-md:       16px;
    --r-lg:       24px;
    --f: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--f); -webkit-font-smoothing: antialiased; }
  .page { max-width: 1120px; margin: 0 auto; padding: 0 32px 120px; }

  /* NAV */
  .nav { display: flex; align-items: center; justify-content: space-between; padding: 22px 0; border-bottom: 1px solid var(--border); }
  .nav-logo { display: flex; align-items: center; gap: 9px; }
  .nav-logo-icon { width: 34px; height: 34px; border-radius: 9px; background: var(--accent); display: flex; align-items: center; justify-content: center; }
  .nav-logo-name { font-size: 16px; font-weight: 700; color: var(--text); letter-spacing: -0.02em; }
  .nav-links { display: flex; gap: 28px; }
  .nav-link { font-size: 14px; color: var(--text-muted); text-decoration: none; font-weight: 450; transition: color .15s; }
  .nav-link:hover { color: var(--text); }
  .nav-cta { background: var(--accent); color: #fff; border: none; border-radius: 100px; padding: 9px 20px; font-family: var(--f); font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity .15s; }
  .nav-cta:hover { opacity: 0.85; }
  @media (max-width: 700px) { .nav-links { display: none; } }

  /* HERO */
  .hero { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; padding: 72px 0 64px; border-bottom: 1px solid var(--border); }
  @media (max-width: 760px) { .hero { grid-template-columns: 1fr; padding: 48px 0 40px; gap: 40px; } }

  .hero-eye { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-lt); border: 1px solid #D0D8FF; border-radius: 100px; padding: 5px 12px; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 22px; }
  .hero-title { font-size: clamp(36px, 4.8vw, 58px); font-weight: 800; line-height: 1.06; letter-spacing: -0.035em; color: var(--text); margin-bottom: 18px; }
  .hero-title .blue { color: var(--accent); }
  .hero-desc { font-size: 16px; line-height: 1.78; color: var(--text-muted); max-width: 440px; margin-bottom: 32px; font-weight: 400; }
  .hero-btns { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 36px; }

  .btn-primary { display: inline-flex; align-items: center; gap: 7px; background: var(--accent); color: #fff; border: none; border-radius: 100px; padding: 13px 26px; font-family: var(--f); font-size: 14px; font-weight: 600; cursor: pointer; transition: opacity .15s, transform .15s; }
  .btn-primary:hover { opacity: 0.87; transform: translateY(-1px); }

  .hero-trust { display: flex; align-items: center; gap: 10px; }
  .hero-trust-dots { display: flex; }
  .trust-dot { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #fff; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-left: -7px; color: #fff; }
  .trust-dot:first-child { margin-left: 0; }
  .hero-trust-text { font-size: 13px; color: var(--text-muted); }
  .hero-trust-text strong { color: var(--text); font-weight: 600; }

  /* HERO IMAGE */
  .hero-img-wrap { position: relative; border-radius: var(--r-lg); overflow: hidden; aspect-ratio: 4/3; box-shadow: 0 20px 60px rgba(0,0,0,0.11); }
  .hero-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .img-badge { position: absolute; bottom: 20px; left: 20px; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.7); border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.09); }
  .img-badge-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; flex-shrink: 0; box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
  .img-badge-title { font-size: 12px; font-weight: 600; color: var(--text); }
  .img-badge-sub { font-size: 11px; color: var(--text-muted); }
  .img-tag { position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border-radius: 10px; padding: 7px 12px; font-size: 12px; font-weight: 700; color: var(--accent); box-shadow: 0 4px 14px rgba(0,0,0,0.07); }

  /* STATS */
  .stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: var(--r-md); overflow: hidden; margin: 48px 0 0; }
  @media (max-width: 700px) { .stats-row { grid-template-columns: repeat(2,1fr); } }
  .stat-cell { background: var(--bg-sec); padding: 26px 22px; transition: background .2s; cursor: default; }
  .stat-cell:hover { background: var(--accent-lt); }
  .stat-val { font-size: 38px; font-weight: 800; line-height: 1; color: var(--accent); letter-spacing: -0.04em; margin-bottom: 5px; }
  .stat-label { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
  .stat-sub { font-size: 11px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-hint); }

  /* SECTION */
  .section { padding: 80px 0 0; }
  .sec-eye { font-size: 10px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
  .sec-title { font-size: clamp(26px, 3.2vw, 40px); font-weight: 800; line-height: 1.12; letter-spacing: -0.03em; color: var(--text); margin-bottom: 12px; }
  .sec-sub { font-size: 15px; line-height: 1.75; color: var(--text-muted); max-width: 500px; margin-bottom: 44px; font-weight: 400; }

  /* SERVICES */
  .svc-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  @media (max-width: 860px) { .svc-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 520px) { .svc-grid { grid-template-columns: 1fr; } }
  .svc-card { padding: 26px 22px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-card); display: flex; flex-direction: column; transition: border-color .2s, box-shadow .2s, transform .2s; }
  .svc-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(59,91,255,0.07); }
  .svc-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; transition: transform .2s; }
  .svc-card:hover .svc-icon { transform: scale(1.07); }
  .svc-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 8px; line-height: 1.3; }
  .svc-desc { font-size: 13px; line-height: 1.78; color: var(--text-muted); flex: 1; margin-bottom: 18px; font-weight: 400; }
  .svc-tags { display: flex; flex-wrap: wrap; gap: 5px; padding-top: 14px; border-top: 1px solid var(--border); }
  .svc-tag { padding: 3px 9px; border-radius: 100px; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }

  /* PROCESS */
  .proc-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; position: relative; }
  @media (max-width: 860px) { .proc-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px) { .proc-grid { grid-template-columns: 1fr; } }
  .proc-card { padding: 26px 22px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-card); position: relative; overflow: hidden; transition: border-color .2s, transform .2s; }
  .proc-card:hover { transform: translateY(-2px); }
  .proc-num-bg { position: absolute; top: 4px; right: 10px; font-size: 72px; font-weight: 800; line-height: 1; opacity: 0.03; user-select: none; pointer-events: none; transition: opacity .25s; }
  .proc-card:hover .proc-num-bg { opacity: 0.06; }
  .proc-badge { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; margin-bottom: 16px; }
  .proc-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
  .proc-desc { font-size: 13px; line-height: 1.75; color: var(--text-muted); font-weight: 400; }
  .proc-arrow { display: none; position: absolute; top: 50%; right: -10px; transform: translateY(-50%); z-index: 10; color: #C8D0FF; }
  @media (min-width: 860px) { .proc-arrow { display: block; } }

  /* TECH */
  .tech-wrap { background: var(--bg-sec); border: 1.5px solid var(--border); border-radius: var(--r-lg); padding: 48px; }
  @media (max-width: 640px) { .tech-wrap { padding: 32px 20px; } }
  .tech-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
  @media (max-width: 860px) { .tech-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px) { .tech-grid { grid-template-columns: 1fr; } }
  .tech-card { padding: 16px 14px; border-radius: var(--r-sm); background: #fff; border: 1px solid var(--border); }
  .tech-cat { display: flex; align-items: center; gap: 7px; margin-bottom: 12px; }
  .tech-dot { width: 6px; height: 6px; border-radius: 50%; }
  .tech-cat-lbl { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; }
  .tech-pills { display: flex; flex-wrap: wrap; gap: 5px; }
  .tech-pill { padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 450; color: var(--text-muted); }

  /* PROOF — plain white cards, no colored bg */
  .proof-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  @media (max-width: 720px) { .proof-grid { grid-template-columns: 1fr; } }
  .proof-card { padding: 28px 24px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-card); display: flex; align-items: flex-start; gap: 16px; transition: border-color .2s, box-shadow .2s; }
  .proof-card:hover { border-color: var(--border-h); box-shadow: 0 4px 20px rgba(59,91,255,0.06); }
  .proof-icon { width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: var(--accent-lt); color: var(--accent); }
  .proof-val { font-size: 28px; font-weight: 800; color: var(--text); letter-spacing: -0.03em; line-height: 1; margin-bottom: 5px; }
  .proof-label { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
  .proof-sub { font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: var(--text-hint); }

  /* BOOK A CALL */
  .book-wrap { border-radius: var(--r-lg); padding: 48px 52px; border: 1.5px solid var(--border); background: var(--bg-sec); display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
  @media (max-width: 640px) { .book-wrap { padding: 32px 24px; } }
  .book-title { font-size: clamp(20px, 2.5vw, 28px); font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 6px; }
  .book-sub { font-size: 14px; color: var(--text-muted); font-weight: 400; }
  .book-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--accent); color: #fff; border: none; border-radius: 100px; padding: 14px 28px; font-family: var(--f); font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: opacity .15s, transform .15s; flex-shrink: 0; }
  .book-btn:hover { opacity: 0.87; transform: translateY(-1px); }

  /* FAQ */
  .faq-list { display: flex; flex-direction: column; gap: 8px; max-width: 680px; }
  .faq-item { border: 1.5px solid var(--border); border-radius: var(--r-sm); overflow: hidden; transition: border-color .2s; }
  .faq-item.open { border-color: var(--accent); background: var(--accent-lt); }
  .faq-item:not(.open):hover { border-color: var(--border-h); }
  .faq-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 22px; text-align: left; background: transparent; border: none; cursor: pointer; }
  .faq-q { font-size: 14px; font-weight: 600; color: var(--text); line-height: 1.5; }
  .faq-chev { flex-shrink: 0; color: var(--accent); transition: transform .3s; }
  .faq-chev.open { transform: rotate(180deg); }
  .faq-body { overflow: hidden; transition: max-height .35s ease, opacity .3s; }
  .faq-body.open { max-height: 220px; opacity: 1; }
  .faq-body.closed { max-height: 0; opacity: 0; }
  .faq-a { padding: 0 22px 18px; font-size: 13.5px; line-height: 1.82; color: var(--text-muted); font-weight: 400; }

  /* FOOTER CTA */
  .footer-cta { margin-top: 80px; padding: 48px; border-radius: var(--r-lg); background: var(--bg-sec); border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
  @media (max-width: 640px) { .footer-cta { padding: 32px 24px; } }
  .footer-cta-title { font-size: clamp(20px, 2.5vw, 28px); font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 6px; }
  .footer-cta-sub { font-size: 14px; color: var(--text-muted); font-weight: 400; }

  /* REVEAL */
  .reveal { opacity: 0; transform: translateY(22px); transition: opacity .5s ease, transform .5s ease; }
  .reveal.in { opacity: 1; transform: translateY(0); }
`;

/* ── hooks ── */
const useReveal = () => {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } },
      { threshold: 0.06 }
    );
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
        let c = 0;
        const step = Math.max(1, Math.ceil(num / 50));
        const id = setInterval(() => {
          c = Math.min(c + step, num);
          setN(c);
          if (c >= num) clearInterval(id);
        }, 28);
      }
    }, { threshold: 0.5 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [end]);
  return <span ref={ref}>{n}{end.replace(/[\d]/g, "")}</span>;
};

/* ── data ── */
const STATS = [
  { value: "10×", label: "Faster Processing", sub: "vs manual workflows" },
  { value: "85%", label: "Cost Reduction", sub: "in repetitive ops" },
  { value: "24/7", label: "AI Availability", sub: "zero downtime" },
  { value: "500+", label: "Deployments", sub: "across 15+ industries" },
];

const SERVICES = [
  { icon: Brain, title: "Custom LLM Development", desc: "Fine-tune Llama 3, Mistral, or GPT-4o on your domain data. RAG pipelines, structured output, and multi-modal capabilities — production-ready in weeks.", color: "#3B5BFF", tags: ["LLaMA 3", "GPT-4o", "RAG", "Fine-tuning"] },
  { icon: Bot, title: "Autonomous AI Agents", desc: "Multi-step reasoning agents that browse the web, write code, call APIs, and make decisions — supervised or running 24/7 hands-off.", color: "#7C3AED", tags: ["LangGraph", "AutoGen", "CrewAI", "Tool Use"] },
  { icon: Workflow, title: "Process Automation", desc: "Replace brittle RPA bots with AI-native automation. Document parsing, data extraction, and classification — integrated with your ERP or CRM.", color: "#DB2777", tags: ["n8n", "Zapier", "MCP", "Document AI"] },
  { icon: MessageSquare, title: "AI Chatbots & Copilots", desc: "Customer-facing chatbots, internal knowledge assistants, and developer copilots embedded in your products with full audit trails.", color: "#059669", tags: ["Streaming", "Memory", "Guardrails", "Embed"] },
  { icon: BarChart2, title: "Predictive Analytics", desc: "ML pipelines for demand forecasting, churn prediction, anomaly detection, and pricing optimization with continuous retraining.", color: "#D97706", tags: ["XGBoost", "Prophet", "MLflow", "Evidently"] },
  { icon: Cpu, title: "Computer Vision", desc: "Object detection, OCR, defect inspection, and video analytics deployed on edge or cloud. Used in manufacturing, retail, and medical imaging.", color: "#0891B2", tags: ["YOLO v9", "SAM 2", "OpenCV", "Edge AI"] },
];

const PROCESS = [
  { n: "01", title: "Discovery Workshop", desc: "We map your workflows, identify automation ROI opportunities, and define the AI architecture in a structured 3-day workshop.", color: "#3B5BFF" },
  { n: "02", title: "Proof of Concept", desc: "2–4 week sprint delivering a working prototype on your real data — performance proven before any large commitment.", color: "#7C3AED" },
  { n: "03", title: "Production Build", desc: "Hardened for scale: error handling, observability, guardrails, cost controls, and CI/CD pipelines from day one.", color: "#059669" },
  { n: "04", title: "Monitor & Improve", desc: "Drift detection, A/B testing of model versions, and monthly reviews to continuously push performance forward.", color: "#D97706" },
];

const TECH = [
  { cat: "LLMs", items: ["GPT-4o", "Claude 3.5", "Gemini 1.5", "LLaMA 3", "Mistral", "DeepSeek"], color: "#3B5BFF" },
  { cat: "Frameworks", items: ["LangChain", "LangGraph", "LlamaIndex", "AutoGen", "CrewAI", "Haystack"], color: "#7C3AED" },
  { cat: "Infra", items: ["AWS SageMaker", "Azure OpenAI", "Vertex AI", "Modal", "Replicate", "Qdrant"], color: "#059669" },
  { cat: "MLOps", items: ["MLflow", "W&B", "Evidently", "DVC", "Airflow", "Prefect"], color: "#D97706" },
];

const FAQS = [
  { q: "Do you work with our existing systems, or do we need to replace them?", a: "We integrate with your existing stack. AI is added as a capability layer on top of your ERP, CRM, or databases — no rip-and-replace required. We use APIs, webhooks, and message queues to connect intelligently." },
  { q: "How long until we see ROI from an AI automation project?", a: "Most clients see measurable cost reduction within 6–10 weeks of deployment. Process automation projects often pay for themselves within the first quarter. We always start with a fast proof-of-concept to demonstrate value early." },
  { q: "How do you ensure AI outputs are accurate and safe?", a: "We implement guardrails, human-in-the-loop checkpoints, confidence thresholds, and full audit logging. For regulated industries we add explainability layers and compliance documentation." },
  { q: "Can you train models on our proprietary data without it leaving our systems?", a: "Yes — we offer on-premise fine-tuning and private cloud deployments where your data never leaves your infrastructure. We also use differential privacy and federated learning for sensitive datasets." },
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

/* ── page ── */
export default function AIServicesWhite() {
  const [svcRef, svcV] = useReveal();
  const [procRef, procV] = useReveal();
  const [techRef, techV] = useReveal();
  const [proofRef, proofV] = useReveal();
  const [faqRef, faqV] = useReveal();

  return (
    <>
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

        {/* ── HERO ── */}
        <section className="hero">
          {/* Left copy */}
          <div>
            <div className="hero-eye">
              <Sparkles size={10} /> AI &amp; Automation
            </div>
            <h1 className="hero-title">
              AI Systems That<br />
              <span className="blue">Automate, Predict</span><br />
              &amp; Scale.
            </h1>
            <p className="hero-desc">
              We engineer custom LLM agents, autonomous workflows, and predictive
              models that replace repetitive tasks, accelerate decisions, and deliver
              measurable ROI from day one.
            </p>
            <div className="hero-btns">
              <Link to="/consultation" className="btn-primary" style={{ textDecoration: 'none' }}>
                Start a Project <ArrowRight size={14} /></Link>
            </div>
            <div className="hero-trust">
              <div className="hero-trust-dots">
                {[["#3B5BFF", "AK"], ["#7C3AED", "SR"], ["#059669", "MJ"], ["#D97706", "PL"]].map(([bg, ini], i) => (
                  <div key={i} className="trust-dot" style={{ background: bg }}>{ini}</div>
                ))}
              </div>
              <div className="hero-trust-text">
                Trusted by <strong>500+ teams</strong> across 15 industries
              </div>
            </div>
          </div>

          {/* Right: realistic AI / laptop photo */}
          <div className="hero-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=80&auto=format&fit=crop"
              alt="AI assistant interface on laptop"
            />
            <div className="img-tag">🤖 AI-Powered</div>
            <div className="img-badge">
              <div className="img-badge-dot" />
              <div>
                <div className="img-badge-title">Models Running</div>
                <div className="img-badge-sub">24 / 7 · Zero downtime</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="stats-row">
          {STATS.map((s, i) => (
            <div key={i} className="stat-cell">
              <div className="stat-val"><Counter end={s.value} /></div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── SERVICES ── */}
        <section className="section" ref={svcRef}>
          <div className="sec-eye">What We Build</div>
          <h2 className="sec-title">Six AI Capabilities.</h2>
          <p className="sec-sub">
            Pick one, pick all — we scope to your needs and build exactly what
            moves the needle for your business.
          </p>
          <div className={`svc-grid reveal${svcV ? " in" : ""}`}>
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div
                  key={i} className="svc-card"
                  style={{ transitionDelay: `${i * 50}ms` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = svc.color + "55"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  <div className="svc-icon" style={{ background: svc.color + "14", color: svc.color }}>
                    <Icon size={19} />
                  </div>
                  <h3 className="svc-title">{svc.title}</h3>
                  <p className="svc-desc">{svc.desc}</p>
                  <div className="svc-tags">
                    {svc.tags.map((t, j) => (
                      <span key={j} className="svc-tag"
                        style={{ background: svc.color + "12", color: svc.color }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section className="section" ref={procRef}>
          <div className="sec-eye">How We Work</div>
          <h2 className="sec-title">Idea to production in weeks.</h2>
          <p className="sec-sub">
            A repeatable, low-risk path from brief to live AI — with a working
            prototype before any big commitment.
          </p>
          <div className={`proc-grid reveal${procV ? " in" : ""}`}>
            {PROCESS.map((p, i) => (
              <div
                key={i} className="proc-card"
                style={{ transitionDelay: `${i * 80}ms` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + "66"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <div className="proc-num-bg" style={{ color: p.color }}>{p.n}</div>
                <div className="proc-badge" style={{ background: p.color + "14", color: p.color }}>
                  {p.n}
                </div>
                <h3 className="proc-title">{p.title}</h3>
                <p className="proc-desc">{p.desc}</p>
                {i < PROCESS.length - 1 && (
                  <div className="proc-arrow"><ArrowRight size={14} /></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section className="section" ref={techRef}>
          <div className={`tech-wrap reveal${techV ? " in" : ""}`}>
            <div style={{ marginBottom: 40 }}>
              <div className="sec-eye">Technology</div>
              <h2 className="sec-title" style={{ marginBottom: 10 }}>The AI Stack We Use.</h2>
              <p style={{ fontSize: 15, lineHeight: 1.72, color: "var(--text-muted)", maxWidth: 440, fontWeight: 400 }}>
                Model-agnostic and infra-agnostic. We pick the right tool for your
                use case — not the one we're affiliated with.
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
                      <span key={j} className="tech-pill"
                        style={{ background: layer.color + "0E" }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROOF — plain white cards, no blue background ── */}
        <section className="section" ref={proofRef}>
          <div className="sec-eye">Results</div>
          <h2 className="sec-title">Numbers That Speak.</h2>
          <p className="sec-sub">Documented outcomes across 500+ client deployments.</p>
          <div className={`proof-grid reveal${proofV ? " in" : ""}`}>
            {[
              { icon: Star, value: "4.9/5", label: "Client Satisfaction", sub: "across 500+ projects" },
              { icon: Clock, value: "< 6 wks", label: "Time to Production", sub: "from brief to live AI" },
              { icon: TrendingUp, value: "340%", label: "Avg. Productivity Gain", sub: "documented across clients" },
            ].map((m, i) => {
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

        {/* ── BOOK A CALL — above FAQ ── */}
        <section className="section">
          <div className="book-wrap">
            <div>
              <div className="book-title">Ready to talk AI?</div>
              <div className="book-sub">
                30-minute call. We'll map your use case and estimate ROI — no commitment.
              </div>
            </div>
            <Link to="/consultation" className="book-btn" style={{ textDecoration: 'none' }}><Phone size={15} /> Book a Call</Link>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="section" ref={faqRef}>
          <div className={`reveal${faqV ? " in" : ""}`}>
            <div className="sec-eye">FAQ</div>
            <h2 className="sec-title" style={{ marginBottom: 36 }}>Common Questions.</h2>
            <div className="faq-list">
              {FAQS.map((f, i) => <FAQItem key={i} {...f} />)}
            </div>
          </div>
        </section>

        {/* ── FOOTER CTA ── */}


      </div>
    </>
  );
}