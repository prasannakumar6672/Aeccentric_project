import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, ArrowRight, Download, PlayCircle, BookOpen, ChevronRight, FileText, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  
  /* SEARCH */
  .search-wrap { max-width: 560px; width: 100%; position: relative; margin-bottom: 48px; }
  .search-input { width: 100%; padding: 14px 16px 14px 44px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-card); font-family: var(--f); font-size: 14px; outline: none; transition: border-color .2s, box-shadow .2s; }
  .search-input:focus { border-color: var(--accent); box-shadow: 0 4px 16px rgba(16,185,129,0.06); }
  .search-icon { position: absolute; top: 50%; left: 16px; transform: translateY(-50%); color: var(--text-hint); }

  /* FILTERS */
  .filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 32px; justify-content: center; }
  .filter-btn { padding: 6px 16px; border-radius: 100px; border: 1px solid var(--border); background: var(--bg-card); font-size: 13px; font-weight: 600; color: var(--text-muted); cursor: pointer; transition: all .2s; }
  .filter-btn:hover { border-color: var(--border-h); color: var(--text); }
  .filter-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }

  /* SECTION */
  .section { padding: 48px 0; }
  
  /* GRID */
  .r-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  @media (max-width: 860px) { .r-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 520px) { .r-grid { grid-template-columns: 1fr; } }
  
  .r-card { padding: 26px 22px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-card); display: flex; flex-direction: column; transition: border-color .2s, box-shadow .2s, transform .2s; text-decoration: none; }
  .r-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(16,185,129,0.07); border-color: var(--border-h); }
  .r-tag { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; align-self: flex-start; }
  .r-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 8px; line-height: 1.3; }
  .r-desc { font-size: 13px; line-height: 1.75; color: var(--text-muted); flex: 1; margin-bottom: 18px; font-weight: 400; }
  .r-meta { display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--border); font-size: 11px; color: var(--text-hint); font-weight: 600; }

  /* NEWSLETTER */
  .nl-wrap { border-radius: var(--r-lg); padding: 48px 52px; border: 1.5px solid var(--border); background: var(--bg-sec); text-align: center; margin-top: 80px; width: 100%; }
  @media (max-width: 640px) { .nl-wrap { padding: 32px 24px; } }
  .nl-title { font-size: clamp(24px, 3vw, 36px); font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 12px; }
  .nl-sub { font-size: 15px; color: var(--text-muted); font-weight: 400; max-width: 500px; margin: 0 auto 32px; }
  .nl-form { display: flex; gap: 10px; max-width: 400px; margin: 0 auto; }
  @media (max-width: 480px) { .nl-form { flex-direction: column; } }
  .nl-input { flex: 1; padding: 12px 16px; border-radius: 100px; border: 1.5px solid var(--border); outline: none; font-family: var(--f); font-size: 14px; }
  .nl-input:focus { border-color: var(--accent); }
  .nl-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: var(--accent); color: #fff; border: none; border-radius: 100px; padding: 12px 24px; font-family: var(--f); font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: opacity .15s, transform .15s; }
  .nl-btn:hover { opacity: 0.87; transform: translateY(-1px); }

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

const CATEGORIES = ['All', 'Whitepapers', 'Engineering Blogs', 'Webinars', 'Case Studies'];

const RESOURCES = [
  {
    title: 'The Enterprise Guide to LLM Deployment',
    desc: 'A comprehensive architecture guide for deploying large language models securely within a corporate perimeter, including VPC setup and RAG pipeline optimization.',
    type: 'Whitepaper',
    icon: FileText,
    color: '#2563EB',
    readTime: '15 min read',
    date: 'Oct 2025',
    link: '#',
  },
  {
    title: 'Optimizing React Native for 120Hz Displays',
    desc: 'Deep-dive into the Hermes engine, Reanimated 3, and native UI threads to achieve buttery smooth 120fps animations on modern mobile devices.',
    type: 'Engineering Blog',
    icon: Code,
    color: '#1D4ED8',
    readTime: '8 min read',
    date: 'Sep 2025',
    link: '#',
  },
  {
    title: 'DfAM: Designing for Additive Manufacturing',
    desc: 'Watch our lead mechanical engineers break down the topological optimization process for aerospace-grade titanium parts.',
    type: 'Webinar',
    icon: PlayCircle,
    color: '#3B82F6',
    readTime: '45 min watch',
    date: 'Aug 2025',
    link: '#',
  },
  {
    title: 'Migrating from Legacy Monolith to Microservices',
    desc: 'A step-by-step technical blueprint of how we migrated a 15-year-old healthcare monolith to a scalable Kubernetes cluster with zero downtime.',
    type: 'Whitepaper',
    icon: FileText,
    color: '#60A5FA',
    readTime: '20 min read',
    date: 'Jul 2025',
    link: '#',
  },
  {
    title: 'Building Autonomous AI Agents with LangGraph',
    desc: 'A practical tutorial on implementing multi-actor workflows, state management, and human-in-the-loop approvals using LangChain and LangGraph.',
    type: 'Engineering Blog',
    icon: Code,
    color: '#2563EB',
    readTime: '12 min read',
    date: 'Jun 2025',
    link: '#',
  },
  {
    title: 'Computer Vision in Quality Control',
    desc: 'How we deployed YOLOv9 on edge devices to reduce manufacturing defect rates by 42% on a high-speed production line.',
    type: 'Case Studies',
    icon: BookOpen,
    color: '#1E40AF',
    readTime: '10 min read',
    date: 'May 2025',
    link: '#',
  },
];

const Resources = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const [gridRef, gridV] = useReveal();
  const [newsRef, newsV] = useReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
    setMounted(true);
  }, []);

  const filteredResources = RESOURCES.filter(r => {
    const matchCat = activeFilter === 'All' || r.type === activeFilter;
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page">
      <style>{css}</style>
      
      {/* HERO */}
      <section className="hero">
        <div className="hero-eye"><BookOpen size={10} /> Knowledge Hub</div>
        <h1 className="hero-title">
          Deep technical insights.<br />
          <span className="accent">Zero marketing fluff.</span>
        </h1>
        <p className="hero-desc">
          Explore our library of engineering blogs, architectural whitepapers, and technical case studies written directly by the engineers building the systems.
        </p>

        {/* Search Bar */}
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search articles, whitepapers, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filters */}
        <div className="filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={"filter-btn" + (activeFilter === cat ? " active" : "")}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* GRID */}
      <section ref={gridRef} className="section">
        <div className="r-grid reveal" style={{ 
          opacity: gridV ? 1 : 0, 
          transform: gridV ? 'translateY(0)' : 'translateY(24px)', 
          transition: "opacity 0.5s ease, transform 0.5s ease" 
        }}>
          {filteredResources.length > 0 ? (
            filteredResources.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link to={item.link} key={i} className="r-card">
                  <div className="r-tag" style={{ background: item.color + "14", color: item.color }}>
                    <Icon size={12} /> {item.type}
                  </div>
                  <h3 className="r-title">{item.title}</h3>
                  <p className="r-desc">{item.desc}</p>
                  <div className="r-meta">
                    <span>{item.date}</span>
                    <span>{item.readTime}</span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>No resources found matching "{searchQuery}".</p>
            </div>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section ref={newsRef} className="section">
        <div className="nl-wrap reveal" style={{ 
          opacity: newsV ? 1 : 0, 
          transform: newsV ? 'translateY(0)' : 'translateY(24px)', 
          transition: "opacity 0.5s ease, transform 0.5s ease" 
        }}>
          <h2 className="nl-title">The AECCENTRIC Engineering Brief.</h2>
          <p className="nl-sub">Join 15,000+ engineers, CTOs, and tech leaders who receive our bi-weekly deep-dives into systems architecture, applied AI, and industrial tech.</p>
          
          <form className="nl-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="name@company.com"
              required
              className="nl-input"
            />
            <button type="submit" className="nl-btn">
              Subscribe <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Resources;
