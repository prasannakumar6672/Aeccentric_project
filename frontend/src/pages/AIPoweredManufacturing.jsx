import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ServiceLayout from "../layouts/ServiceLayout";
import dtImg from "../assets/services/ai_automation.png";
import {
  Factory, Eye, Network, Activity, LineChart,
  Workflow, Server, ArrowRight, ChevronDown,
  Star, Clock, TrendingUp, Phone, Zap, Sparkles,
} from "lucide-react";

/* â”€â”€â”€ CSS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:         #FFFFFF;
    --bg-card:    #FFFFFF;
    --bg-sec:     #F8F9FB;
    --border:     #E4E7EE;
    --border-h:   #67E8F9;
    --text:       #0D1117;
    --text-muted: #5A6272;
    --text-hint:  #9BA3B4;
    --accent:     #06B6D4;
    --accent-lt:  #ECFEFF;
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

  .hero-eye { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-lt); border: 1px solid #A5F3FC; border-radius: 100px; padding: 5px 12px; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 22px; }
  .hero-title { font-size: clamp(36px, 4.8vw, 58px); font-weight: 800; line-height: 1.06; letter-spacing: -0.035em; color: var(--text); margin-bottom: 18px; }
  .hero-title .accent { color: var(--accent); }
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
  .svc-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(6,182,212,0.07); }
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
  .proc-arrow { display: none; position: absolute; top: 50%; right: -10px; transform: translateY(-50%); z-index: 10; color: #A5F3FC; }
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

  /* PROOF */
  .proof-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  @media (max-width: 720px) { .proof-grid { grid-template-columns: 1fr; } }
  .proof-card { padding: 28px 24px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-card); display: flex; align-items: flex-start; gap: 16px; transition: border-color .2s, box-shadow .2s; }
  .proof-card:hover { border-color: var(--border-h); box-shadow: 0 4px 20px rgba(6,182,212,0.06); }
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
  .faq-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 22px; text-align: left; background: transparent; border: none; cursor: pointer; font-family: var(--f); }
  .faq-q { font-size: 14px; font-weight: 600; color: var(--text); line-height: 1.5; }
  .faq-chev { flex-shrink: 0; color: var(--accent); transition: transform .3s; }
  .faq-chev.open { transform: rotate(180deg); }
  .faq-body { overflow: hidden; transition: max-height .35s ease, opacity .3s; }
  .faq-body.open { max-height: 260px; opacity: 1; }
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
  { value: "42%", label: "Defect Reduction", sub: "via real-time computer vision" },
  { value: "30%", label: "Higher OEE", sub: "Overall Equipment Effectiveness" },
  { value: "24/7", label: "Autonomous QA", sub: "zero operator fatigue" },
  { value: "80%", label: "Less Downtime", sub: "via predictive maintenance" },
];

const SERVICES = [
  { icon: Eye, title: "Computer Vision QA", desc: "Deploy edge-AI cameras to inspect parts at high speed. Detect micro-defects, surface anomalies, and assembly errors in milliseconds, entirely eliminating manual QA bottlenecks.", color: "#1E40AF", tags: ["YOLO", "OpenCV", "Edge AI"] },
  { icon: Activity, title: "Predictive Maintenance", desc: "Stop fixing machines after they break. We use IoT vibration and acoustic sensors coupled with ML to predict spindle and bearing failures weeks before they happen.", color: "#3B82F6", tags: ["IoT Sensors", "Time-Series ML", "Anomaly Detection"] },
  { icon: Network, title: "Digital Twin Simulation", desc: "Create a physics-accurate virtual replica of your factory floor. Simulate layout changes, optimize routing, and test new schedules without disrupting real operations.", color: "#2563EB", tags: ["Omniverse", "ROS2", "Simulation"] },
  { icon: Workflow, title: "Autonomous Robotics", desc: "Integrate intelligent robotic arms and AMRs that use reinforcement learning to adapt to dynamic environments â€” not just follow hardcoded paths.", color: "#60A5FA", tags: ["Cobots", "AMRs", "Reinforcement Learning"] },
  { icon: LineChart, title: "Yield Optimization", desc: "Process massive telemetry data from PLCs and CNC machines. Our AI identifies hidden correlations between machine parameters and final part quality to optimize yield.", color: "#1D4ED8", tags: ["Data Mining", "Process Optimization"] },
  { icon: Server, title: "Legacy PLC Integration", desc: "Extract data from decades-old machinery. We build custom hardware bridges to pull telemetry from legacy PLCs into modern cloud or on-premise data lakes.", color: "#2563EB", tags: ["OPC UA", "MQTT", "Edge Computing"] },
];

const PROCESS = [
  { n: "01", title: "Data Acquisition", desc: "We install edge devices and integrate with existing PLCs to stream telemetry, vibration, and visual data from your shop floor.", color: "#1E40AF" },
  { n: "02", title: "Model Training", desc: "We train custom neural networks specifically for your parts and processes, handling variations in lighting, material, and speed.", color: "#3B82F6" },
  { n: "03", title: "Edge Deployment", desc: "Models are compiled with TensorRT and deployed directly to industrial PCs on the factory floor for ultra-low latency inference.", color: "#2563EB" },
  { n: "04", title: "ERP/MES Sync", desc: "Insights don't live in a vacuum. We push defect logs and OEE metrics directly back into your existing SAP or custom MES software.", color: "#60A5FA" },
];

const TECH = [
  { cat: "Edge Hardware", items: ["NVIDIA Jetson", "Raspberry Pi Industrial", "Siemens IPC", "Basler Cameras"], color: "#1E40AF" },
  { cat: "AI / Vision", items: ["PyTorch", "TensorRT", "YOLOv9", "OpenCV", "DeepStream"], color: "#3B82F6" },
  { cat: "Protocols", items: ["OPC UA", "MQTT", "Modbus", "EtherCAT", "Profinet"], color: "#2563EB" },
  { cat: "Cloud & Data", items: ["AWS IoT Core", "InfluxDB", "Grafana", "Kafka", "Kubernetes Edge"], color: "#60A5FA" },
];

const PROOF = [
  { icon: Factory, value: "150+", label: "Machines Connected", sub: "across global facilities" },
  { icon: Eye, value: "50M+", label: "Parts Inspected", sub: "by CV models annually" },
  { icon: Activity, value: "99.5%", label: "Prediction Accuracy", sub: "on spindle failure models" },
];

const FAQS = [
  { q: "Do we need an internet connection for the AI to work?", a: "No. Manufacturing environments often have unreliable internet or strict air-gapped security requirements. We deploy 'Edge AI' â€” the models run entirely locally on industrial PCs attached to the machine, requiring zero cloud connectivity for inference." },
  { q: "How much training data do you need for Computer Vision?", a: "Less than you think. While more is better, we use techniques like synthetic data generation and transfer learning to train highly accurate models with as few as 100 images of defective parts." },
  { q: "Can you integrate with our 20-year-old machines?", a: "Yes. Even if a machine has no modern digital interface, we can retro-fit it with external IoT sensors (vibration, acoustic, optical) or use a camera to physically read analogue dials and light-towers to digitize its state." },
  { q: "Who retains the intellectual property of the custom trained AI models?", a: "You do. We build the architecture, but the specific weights of the neural network trained on your proprietary parts and processes belong entirely to you." },
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
const AIPoweredManufacturing = () => {
  const [svcRef, svcV] = useReveal();
  const [procRef, procV] = useReveal();
  const [techRef, techV] = useReveal();
  const [proofRef, proofV] = useReveal();
  const [faqRef, faqV] = useReveal();

  return (
    <ServiceLayout
      title="AI-Powered Manufacturing"
      subtitle="Industry 4.0"
      description="We bring Silicon Valley AI to the factory floor. Transform dumb machines into intelligent, self-monitoring assets that optimize yield, predict failures, and eliminate manual QA."
      accent="#06B6D4"
      image={dtImg}
      points={["Real-Time Computer Vision QA", "IoT Predictive Maintenance", "Digital Twin Factory Simulation", "Yield & Process Optimization", "Legacy PLC Data Extraction", "Edge AI Deployment"]}
      hideHero={true}
    >
      <style>{css}</style>
      <div className="page">

        {/* NAV */}


        {/* HERO */}
        <section className="hero">
          <div>
            <div className="hero-eye"><Sparkles size={10} /> Industry 4.0</div>
            <h1 className="hero-title">
              AI-Powered<br />
              <span className="accent">Manufacturing</span><br />
              Intelligence.
            </h1>
            <p className="hero-desc">
              We bring Silicon Valley AI to the factory floor. Transform dumb machines into
              intelligent, self-monitoring assets that optimize yield, predict failures, and
              eliminate manual QA.
            </p>
            <div className="hero-btns">
              <Link to="/consultation" className="btn-primary" style={{ textDecoration: 'none' }}>Start a Project <ArrowRight size={14} /></Link>
            </div>
            <div className="hero-trust">
              <div className="hero-trust-dots">
                {[["#06B6D4", "MF"], ["#F59E0B", "KL"], ["#8B5CF6", "AO"], ["#10B981", "PR"]].map(([bg, ini], i) => (
                  <div key={i} className="trust-dot" style={{ background: bg }}>{ini}</div>
                ))}
              </div>
              <div className="hero-trust-text">Trusted by <strong>150+ factories</strong> across 12 countries</div>
            </div>
          </div>
          <div className="hero-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=900&q=80&auto=format&fit=crop"
              alt="AI-powered manufacturing floor"
            />
            <div className="img-tag">ðŸ­ Industry 4.0</div>
            <div className="img-badge">
              <div className="img-badge-dot" />
              <div>
                <div className="img-badge-title">Vision AI Active</div>
                <div className="img-badge-sub">42% fewer defects Â· Real-time</div>
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
          <div className="sec-eye">Core Solutions</div>
          <h2 className="sec-title">Six Manufacturing AI Capabilities.</h2>
          <p className="sec-sub">Bridging the gap between software algorithms and physical steel â€” from QA to digital twins.</p>
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
          <div className="sec-eye">Deployment Architecture</div>
          <h2 className="sec-title">From data to edge. Secure and latency-free.</h2>
          <p className="sec-sub">A proven 4-phase deployment model from sensor install to MES integration â€” without disrupting production.</p>
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
              <div className="sec-eye">Industrial Stack</div>
              <h2 className="sec-title" style={{ marginBottom: 10 }}>Hardware Meets Software.</h2>
              <p style={{ fontSize: 15, lineHeight: 1.72, color: "var(--text-muted)", maxWidth: 440, fontWeight: 400 }}>
                We bridge the IT/OT divide. Our stack is hardened for factory environments, utilizing edge hardware to ensure zero latency inference.
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
          <p className="sec-sub">Documented outcomes across 150+ connected machines and factory deployments.</p>
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
              <div className="book-title">Ready to digitize your factory floor?</div>
              <div className="book-sub">30-minute call. We'll map your machines and estimate yield improvement â€” no commitment.</div>
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
    </ServiceLayout>
  );
};

export default AIPoweredManufacturing;