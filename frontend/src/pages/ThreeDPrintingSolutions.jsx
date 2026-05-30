import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import dtImg from "../assets/services/3d_printing.png";
import { PenTool, Printer, Layers, Settings, Shield, Box, ArrowRight, ChevronDown, Star, Clock, TrendingUp, Phone, Zap } from "lucide-react";
import "./ThreeDPrintingSolutions.css";

const useReveal = () => {
  const ref = useRef(null); const [v, setV] = useState(false);
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.06 }); if (ref.current) o.observe(ref.current); return () => o.disconnect(); }, []);
  return [ref, v];
};

const Counter = ({ end }) => {
  const [n, setN] = useState(0); const ref = useRef(null); const done = useRef(false);
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting && !done.current) { done.current = true; const num = parseInt(end.replace(/\D/g, ""), 10); if (isNaN(num)) return; let c = 0; const step = Math.max(1, Math.ceil(num / 50)); const id = setInterval(() => { c = Math.min(c + step, num); setN(c); if (c >= num) clearInterval(id); }, 28); } }, { threshold: 0.5 }); if (ref.current) o.observe(ref.current); return () => o.disconnect(); }, [end]);
  return <span ref={ref}>{n}{end.replace(/[\d]/g, "")}</span>;
};

const STATS = [
  { value: "45%", label: "Weight Reduction", sub: "via topological optimization" },
  { value: "24hr", label: "Rapid Prototyping", sub: "from CAD to physical part" },
  { value: "0.01mm", label: "Precision Tolerance", sub: "aerospace grade SLM" },
  { value: "60%", label: "Cost Avoidance", sub: "by eliminating tooling" },
];

const SERVICES = [
  { icon: PenTool, title: "DfAM Engineering", desc: "Design for Additive Manufacturing. We optimize your existing CAD models for 3D printing, focusing on weight reduction, structural integrity, and material efficiency.", color: "#1D4ED8", tags: ["Topological Optimization", "Generative Design"] },
  { icon: Printer, title: "Industrial SLM & DMLS", desc: "Metal 3D printing using Selective Laser Melting. We produce functional, high-strength parts in Titanium (Ti-6Al-4V), Aluminum, and Stainless Steel.", color: "#2563EB", tags: ["Metal Printing", "Titanium", "Inconel"] },
  { icon: Layers, title: "Polymer Prototyping", desc: "Rapid iteration using industrial-grade FDM and SLA technologies. Test form, fit, and function overnight before committing to expensive metal production.", color: "#3B82F6", tags: ["FDM", "SLA", "PEEK", "ULTEM"] },
  { icon: Settings, title: "Post-Processing & Finishing", desc: "Complete end-to-end service. Heat treatment, CNC machining for critical tolerances, surface bead blasting, and anodizing to meet production specs.", color: "#60A5FA", tags: ["CNC Machining", "Heat Treatment", "Anodizing"] },
  { icon: Shield, title: "Reverse Engineering", desc: "High-resolution 3D scanning of legacy parts that no longer have CAD data. We scan, optimize, and print replacements to keep old machinery running.", color: "#2563EB", tags: ["3D Scanning", "CAD Restoration", "Metrology"] },
  { icon: Box, title: "Jigs, Fixtures & Tooling", desc: "Custom manufacturing aids produced on-demand. Replace heavy, expensive machined fixtures with lightweight, ergonomically optimized 3D printed alternatives.", color: "#1E40AF", tags: ["Manufacturing Aids", "Custom Tooling"] },
];

const PROCESS = [
  { n: "01", title: "CAD Analysis", desc: "We review your 3D models for printability, identifying unsupported overhangs, thermal stress points, and optimal orientation.", color: "#1D4ED8" },
  { n: "02", title: "Optimization (DfAM)", desc: "We apply generative design algorithms to reduce weight and consolidate multiple components into a single printed assembly.", color: "#3B82F6" },
  { n: "03", title: "Production", desc: "Printing on industrial-grade SLM or FDM machines, monitored continuously for thermal consistency and laser accuracy.", color: "#2563EB" },
  { n: "04", title: "Post-Processing", desc: "Support removal, heat treatment to relieve internal stresses, and precision CNC machining for critical mating surfaces.", color: "#60A5FA" },
];

const TECH = [
  { cat: "Technologies", items: ["SLM (Metal)", "DMLS (Metal)", "FDM (Polymer)", "SLA (Resin)", "MJF (Powder)"], color: "#1D4ED8" },
  { cat: "Materials", items: ["Titanium (Ti64)", "Aluminum (AlSi10Mg)", "Stainless (316L)", "PEEK", "ULTEM 9085"], color: "#2563EB" },
  { cat: "Software", items: ["SolidWorks", "Fusion 360", "Magics", "Netfabb", "nTopology"], color: "#3B82F6" },
  { cat: "Post-Processing", items: ["5-Axis CNC", "Vacuum Heat Treatment", "Bead Blasting", "CMM Inspection"], color: "#60A5FA" },
];

const PROOF = [
  { icon: Layers, value: "50,000+", label: "Parts Printed", sub: "across polymers and metals" },
  { icon: Shield, value: "ISO 9001", label: "Quality Certified", sub: "rigorous metrology and QA" },
  { icon: TrendingUp, value: "99%", label: "First-Time Yield", sub: "due to advanced DfAM simulation" },
];

const FAQS = [
  { q: "Is 3D printing strong enough for end-use production parts?", a: "Absolutely. We use Selective Laser Melting (SLM) for metal parts. A 3D printed Titanium or Inconel part can achieve tensile strengths equivalent to or greater than traditional billets or castings, making them suitable for aerospace and automotive applications." },
  { q: "What is the maximum part size you can print?", a: "For metal (SLM), our maximum build volume is typically 400x400x400mm. For industrial polymers (FDM), we can print parts up to 900x600x900mm in a single piece. Larger assemblies can be designed with interlocking joints and bonded or welded post-print." },
  { q: "How does the cost compare to traditional CNC machining?", a: "It depends on complexity. For parts with complex internal channels or organic geometries, 3D printing is significantly more cost-effective because you only pay for the material you use." },
  { q: "Do you offer NDAs for proprietary designs?", a: "Yes. An NDA is signed before you upload any CAD files, and all data is handled via encrypted, ITAR-compliant servers." },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return <div className={"faq-item" + (open ? " open" : "")}>
    <button className="faq-btn" onClick={() => setOpen(!open)}>
      <span className="faq-q">{q}</span>
      <ChevronDown size={17} className={"faq-chev" + (open ? " open" : "")} />
    </button>
    <div className={"faq-body" + (open ? " open" : " closed")}><p className="faq-a">{a}</p></div>
  </div>;
};

export default function ThreeDPrintingSolutions() {
  const [svcRef, svcV] = useReveal(); const [procRef, procV] = useReveal();
  const [techRef, techV] = useReveal(); const [proofRef, proofV] = useReveal();
  const [faqRef, faqV] = useReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="nexus-service-page">
      <div className="page">

        {/* ── NAV ── */}


        {/* HERO */}
        <section className="hero">
          <div>
            <div className="hero-eye"><Printer size={10} /> Additive Manufacturing</div>
            <h1 className="hero-title">
              3D Printing &amp;<br />
              <span className="accent">Engineering</span><br />
              Solutions.
            </h1>
            <p className="hero-desc">
              We bridge the gap between digital design and physical reality. From rapid polymer prototyping to aerospace-grade titanium production parts, we engineer complex geometries that traditional manufacturing cannot achieve.
            </p>
            <div className="hero-btns">
              <Link to="/consultation" className="btn-primary" style={{ textDecoration: 'none' }}>Start a Project <ArrowRight size={14} /></Link>
            </div>
            <div className="hero-trust">
              <div className="hero-trust-dots">
                {[["#EC4899", "AM"], ["#DB2777", "SLM"], ["#BE185D", "FDM"], ["#9D174D", "SLA"]].map(([bg, ini], i) => (
                  <div key={i} className="trust-dot" style={{ background: bg }}>{ini}</div>
                ))}
              </div>
              <div className="hero-trust-text">Trusted by <strong>200+ engineering teams</strong> worldwide</div>
            </div>
          </div>
          <div className="hero-img-wrap">
            <img src={dtImg} alt="3D Printing" />
            <div className="img-tag">💎 Additive Mfg</div>
            <div className="img-badge">
              <div className="img-badge-dot" />
              <div>
                <div className="img-badge-title">Precision Printing</div>
                <div className="img-badge-sub">Aerospace Grade · 0.01mm tolerance</div>
              </div>
            </div>
          </div>
        </section>

        <div className="stats-row">
          {STATS.map((s, i) => (
            <div key={i} className="stat-cell">
              <div className="stat-val"><Counter end={s.value} /></div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        <section className="section" ref={svcRef}>
          <div className="sec-eye">Capabilities</div>
          <h2 className="sec-title">Six Additive Manufacturing Services.</h2>
          <p className="sec-sub">If you can imagine it, we can manufacture it â€” from overnight polymer prototypes to production titanium parts.</p>
          <div className={"svc-grid reveal" + (svcV ? " in" : "")}>
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon; return (
                <div key={i} className="svc-card" style={{ transitionDelay: (i * 50) + "ms" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = svc.color + "55"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}>
                  <div className="svc-icon" style={{ background: svc.color + "14", color: svc.color }}><Icon size={19} /></div>
                  <h3 className="svc-title">{svc.title}</h3>
                  <p className="svc-desc">{svc.desc}</p>
                  <div className="svc-tags">{svc.tags.map((t, j) => <span key={j} className="svc-tag" style={{ background: svc.color + "12", color: svc.color }}>{t}</span>)}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="section" ref={procRef}>
          <div className="sec-eye">Manufacturing Workflow</div>
          <h2 className="sec-title">From CAD to part. Flawless execution.</h2>
          <p className="sec-sub">A proven 4-phase process from digital model to production-ready physical part â€” with no surprises.</p>
          <div className={"proc-grid reveal" + (procV ? " in" : "")}>
            {PROCESS.map((p, i) => (
              <div key={i} className="proc-card" style={{ transitionDelay: (i * 80) + "ms" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + "66"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}>
                <div className="proc-num-bg" style={{ color: p.color }}>{p.n}</div>
                <div className="proc-badge" style={{ background: p.color + "14", color: p.color }}>{p.n}</div>
                <h3 className="proc-title">{p.title}</h3>
                <p className="proc-desc">{p.desc}</p>
                {i < PROCESS.length - 1 && <div className="proc-arrow"><ArrowRight size={14} /></div>}
              </div>
            ))}
          </div>
        </section>

        <section className="section" ref={techRef}>
          <div className={"tech-wrap reveal" + (techV ? " in" : "")}>
            <div style={{ marginBottom: 40 }}>
              <div className="sec-eye">Industrial Hardware</div>
              <h2 className="sec-title" style={{ marginBottom: 10 }}>We Don't Use Toys.</h2>
              <p style={{ fontSize: 15, lineHeight: 1.72, color: "var(--text-muted)", maxWidth: 440, fontWeight: 400 }}>
                Our facility is equipped with industrial-grade laser powder bed fusion systems and engineering-grade polymer printers capable of aerospace tolerances.
              </p>
            </div>
            <div className="tech-grid">
              {TECH.map((layer, i) => (
                <div key={i} className="tech-card">
                  <div className="tech-cat"><div className="tech-dot" style={{ background: layer.color }} /><span className="tech-cat-lbl" style={{ color: layer.color }}>{layer.cat}</span></div>
                  <div className="tech-pills">{layer.items.map((item, j) => <span key={j} className="tech-pill" style={{ background: layer.color + "0E" }}>{item}</span>)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" ref={proofRef}>
          <div className="sec-eye">Results</div>
          <h2 className="sec-title">Numbers That Speak.</h2>
          <p className="sec-sub">Documented outcomes from 50,000+ printed parts across polymers and metals.</p>
          <div className={"proof-grid reveal" + (proofV ? " in" : "")}>
            {PROOF.map((m, i) => {
              const Icon = m.icon; return (
                <div key={i} className="proof-card" style={{ transitionDelay: (i * 80) + "ms" }}>
                  <div className="proof-icon"><Icon size={18} /></div>
                  <div><div className="proof-val">{m.value}</div><div className="proof-label">{m.label}</div><div className="proof-sub">{m.sub}</div></div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="section">
          <div className="book-wrap">
            <div>
              <div className="book-title">Ready to print your first part?</div>
              <div className="book-sub">30-minute call. Upload your CAD, we'll review for printability and give you a quote â€” no commitment.</div>
            </div>
            <Link to="/consultation" className="book-btn" style={{ textDecoration: 'none' }}><Phone size={15} /> Book a Call</Link>
          </div>
        </section>

        <section className="section" ref={faqRef} style={{ paddingBottom: 0 }}>
          <div className={"reveal" + (faqV ? " in" : "")}>
            <div className="sec-eye">FAQ</div>
            <h2 className="sec-title" style={{ marginBottom: 36 }}>Common Questions.</h2>
            <div className="faq-list">{FAQS.map((f, i) => <FAQItem key={i} {...f} />)}</div>
          </div>
        </section>

      </div>
    </div>
  );
}