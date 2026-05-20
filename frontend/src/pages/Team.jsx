import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Code2, Cpu, Shield, ArrowRight } from 'lucide-react';

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
  
  /* DEPARTMENTS */
  .dep-row { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 32px; }
  .dep-tag { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 100px; border: 1px solid var(--border); background: var(--bg-card); font-size: 12px; font-weight: 600; color: var(--text); }
  .dep-dot { width: 6px; height: 6px; border-radius: 50%; }
  .dep-count { font-size: 10px; font-weight: 700; color: var(--text-hint); background: var(--bg-sec); padding: 2px 6px; border-radius: 100px; }

  /* SECTION */
  .section { padding: 80px 0 0; }
  
  /* GRID */
  .t-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  @media (max-width: 860px) { .t-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 520px) { .t-grid { grid-template-columns: 1fr; } }
  
  .t-card { padding: 26px 22px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-card); display: flex; flex-direction: column; transition: border-color .2s, box-shadow .2s; }
  .t-card:hover { border-color: var(--border-h); box-shadow: 0 4px 20px rgba(139,92,246,0.06); }
  
  .t-avatar { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 16px; }
  
  .t-name { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 4px; text-align: left; }
  .t-role { font-size: 12px; font-weight: 600; color: var(--text-hint); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; text-align: left; }
  .t-bio { font-size: 13px; line-height: 1.75; color: var(--text-muted); flex: 1; font-weight: 400; text-align: left; }
  
  .t-tag { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 100px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; align-self: flex-start; }

  /* CULTURE */
  .culture-wrap { display: flex; gap: 48px; align-items: center; }
  @media (max-width: 760px) { .culture-wrap { flex-direction: column; } }
  .culture-content { flex: 1; text-align: left; }
  @media (max-width: 760px) { .culture-content { text-align: center; } }
  .culture-quote { flex: 1; background: var(--bg-sec); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 32px; position: relative; text-align: left; }
  .culture-quote::before { content: '"'; position: absolute; top: 10px; left: 20px; font-size: 80px; color: var(--border); font-family: serif; line-height: 1; opacity: 0.5; }
  .culture-text { font-size: 16px; line-height: 1.75; color: var(--text); font-weight: 500; position: relative; z-index: 1; margin-bottom: 16px; }
  .culture-author { font-size: 12px; font-weight: 700; color: var(--text); }
  .culture-title { font-size: 11px; color: var(--text-hint); text-transform: uppercase; }

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

const TEAM = [
  { name: 'Sravan Kumar K', role: 'Chief Executive Officer & Founder', specialization: 'Enterprise Architecture', icon: Users, color: '#2563EB', bio: 'Leads vision, scale, and enterprise strategy for AECCENTRIC global operations.' },
  { name: 'Balaji T', role: 'VP of Engineering', specialization: 'Cloud-Native & AI', icon: Code2, color: '#3B82F6', bio: 'Obsessed with high-availability microservices. Leads the core engineering pods delivering zero-downtime platforms.' },
  { name: 'Anudeep M', role: 'Head of Product Design', specialization: 'UX & Human-AI Interaction', icon: Users, color: '#1E40AF', bio: 'Ensures complex enterprise tools and AI copilots feel intuitive, fast, and delightful to end-users.' },
  { name: 'Prasanna Kumar', role: 'Full Stack Lead', specialization: 'Systems Architecture', icon: Code2, color: '#60A5FA', bio: 'Expert in building responsive, high-performance web applications and orchestrating robust digital ecosystems.' },
  { name: 'Harsha M', role: 'Head of AI & Machine Learning', specialization: 'Deep Learning & LLMs', icon: Cpu, color: '#1D4ED8', bio: 'Specializes in multi-modal architectures, custom RAG pipelines, and autonomous AI agent frameworks.' },
  { name: 'Naveen', role: 'Principal Software Engineer', specialization: 'DevSecOps & Cloud Infra', icon: Shield, color: '#2563EB', bio: 'Defends the perimeter and optimizes cloud scale. Ensures deployments are secure, fast, and highly reliable.' },
  { name: 'Srikanth', role: 'Head of Industrial Tech', specialization: 'IoT & Embedded Systems', icon: Cpu, color: '#3B82F6', bio: 'Bridges the physical and digital. Leads our industrial automation, IoT integration, and rapid prototyping capabilities.' },
];

const DEPARTMENTS = [
  { name: 'AI Research Lab', count: 12, color: '#1D4ED8' },
  { name: 'Core Engineering', count: 24, color: '#3B82F6' },
  { name: 'Industrial Systems', count: 8, color: '#60A5FA' },
  { name: 'Security & Ops', count: 6, color: '#2563EB' },
];

const Team = () => {
  const [mounted, setMounted] = useState(false);
  const [teamRef, teamV] = useReveal();
  const [cultureRef, cultureV] = useReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
    setMounted(true);
  }, []);

  return (
    <div className="page">
      <style>{css}</style>
      
      {/* HERO */}
      <section className="hero">
        <div className="hero-eye"><Users size={10} /> Our Team</div>
        <h1 className="hero-title">
          Built by engineers.<br />
          <span className="accent">Run by engineers.</span>
        </h1>
        <p className="hero-desc">
          We are a collective of researchers, systems architects, and industrial designers who share a singular obsession: building technology that actually works in production.
        </p>

        {/* Departments */}
        <div className="dep-row">
          {DEPARTMENTS.map((d, i) => (
            <div key={i} className="dep-tag">
              <div className="dep-dot" style={{ background: d.color }} />
              <span>{d.name}</span>
              <span className="dep-count">{d.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM GRID */}
      <section ref={teamRef} className="section">
        <div className="t-grid">
          {TEAM.map((member, i) => {
            const Icon = member.icon;
            const initials = member.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').substring(0, 2);
            
            return (
              <div key={i} className="t-card reveal" style={{ 
                opacity: teamV ? 1 : 0, 
                transform: teamV ? 'translateY(0)' : 'translateY(24px)', 
                transition: "opacity 0.5s " + (i * 0.1) + "s ease, transform 0.5s " + (i * 0.1) + "s ease" 
              }}>
                <div className="t-avatar" style={{ background: "linear-gradient(135deg, " + member.color + ", " + member.color + "80)" }}>
                  {initials}
                </div>
                
                <div className="t-tag" style={{ background: member.color + "15", color: member.color }}>
                  <Icon size={10} /> {member.specialization}
                </div>

                <h3 className="t-name">{member.name}</h3>
                <div className="t-role">{member.role}</div>
                <p className="t-bio">{member.bio}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CULTURE */}
      <section ref={cultureRef} className="section">
        <div className="culture-wrap reveal" style={{ 
          opacity: cultureV ? 1 : 0, 
          transform: cultureV ? 'translateY(0)' : 'translateY(24px)', 
          transition: "opacity 0.5s ease, transform 0.5s ease" 
        }}>
          
          <div className="culture-content">
            <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#10B981', marginBottom: '12px' }}>Engineering Culture</div>
            <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: '800', lineHeight: '1.12', letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '12px' }}>
              No bureaucracy.<br />Just deep work.
            </h2>
            <div className="space-y-6 text-[15px] text-[var(--text-muted)] leading-relaxed">
              <p>
                We operate like an elite strike team. We abhor endless meetings, bloated project management overhead, and architectural astronauts who don't write code.
              </p>
              <p>
                Our culture is optimized for deep, uninterrupted engineering work. Every team member, from the CEO down, commits code or directly impacts the production environment.
              </p>
            </div>
          </div>

          <div className="culture-quote">
            <p className="culture-text">
              "We don't hire 'resources' to bill hours. We hire obsessive engineers who treat every client's codebase as if it were their own startup's core product."
            </p>
            <div className="culture-author">Sravan Kumar K</div>
            <div className="culture-title">CEO & Founder</div>
          </div>

        </div>
      </section>

      {/* CAREERS CTA */}
      <section className="section">
        <div className="cta-wrap">
          <h2 className="cta-title">Think you belong here?</h2>
          <p className="cta-sub">We are always looking for exceptional engineers. If you are obsessed with AI, systems architecture, or hardware-software integration, we want to talk.</p>
          <Link to="/contact" className="cta-btn">View Open Roles <ArrowRight size={14} /></Link>
        </div>
      </section>

    </div>
  );
};

export default Team;
