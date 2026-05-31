import React, { useState, useEffect, useRef } from 'react'

const TESTIMONIALS = [
  {
    quote: "AEccentric completely transformed our rapid prototyping workflow. Their advanced 3D printing and CAD engineering solutions reduced our design-to-production cycle from months to just a few days. The precision is unmatched.",
    name: "Rajesh Mehta",
    role: "VP of Engineering",
    company: "Mehta Engineering Solutions",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    tag: "Advanced Manufacturing",
  },
  {
    quote: "Implementing AEccentric's custom AI voice agents and automated workflow pipelines was a game-changer for our customer operations. Our response times dropped by 80% while scaling customer satisfaction.",
    name: "Suresh Patel",
    role: "Director of Operations",
    company: "Patel Digital Networks",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    tag: "AI & Automation",
  },
  {
    quote: "We partnered with AEccentric to build our flagship enterprise SaaS platform. Their full-stack development team delivered a high-performance, secure, and beautiful interface that has completely blown away our clients.",
    name: "Priya Sharma",
    role: "Head of Digital Product",
    company: "Sharma Pharma Tech",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c3e4?w=80&h=80&fit=crop&crop=face",
    tag: "IT & Product Development",
  },
  {
    quote: "AEccentric guided us through a complex legacy modernization and digital transformation process. Their team integrated modern cloud infrastructure seamlessly, reducing our server latency and saving us lakhs annually.",
    name: "Anil Gupta",
    role: "CTO & Co-Founder",
    company: "Northern AgriTech Corp",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    tag: "Digital Transformation",
  },
]

const css = `
.testi { background: var(--bg-secondary); }
.testi__header { text-align: center; max-width: 560px; margin: 0 auto 3.5rem; }
.testi__title { font-family: 'Sora', sans-serif; font-size: clamp(2rem, 3.5vw, 2.875rem); font-weight: 800; letter-spacing: -0.04em; line-height: 1.15; color: var(--text); margin-bottom: 1rem; }

.testi__layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 2.5rem;
  align-items: start;
}

/* Tabs */
.testi__tabs { display: flex; flex-direction: column; gap: 0.5rem; }
.testi__tab {
  display: flex; align-items: center; gap: 0.875rem;
  padding: 0.875rem 1rem;
  border: 1.5px solid transparent;
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: all 0.22s ease;
}
.testi__tab:hover { background: var(--bg-card); border-color: var(--border); }
.testi__tab--active { background: var(--bg-card); border-color: var(--accent); box-shadow: 0 4px 16px var(--accent-glow); }
.testi__tab-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; flex-shrink: 0; border: 2px solid var(--border); }
.testi__tab--active .testi__tab-avatar { border-color: var(--accent); }
.testi__tab-name { font-size: 0.85rem; font-weight: 700; color: var(--text); }
.testi__tab-company { font-size: 0.72rem; color: var(--text-muted); margin-top: 0.15rem; }

/* Main quote */
.testi__main {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 2.5rem;
  position: relative;
  box-shadow: var(--shadow-md);
  animation: quoteFadeIn 0.35s ease both;
}
@keyframes quoteFadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }

.testi__quote-mark {
  font-family: 'Sora', serif;
  font-size: 5rem;
  font-weight: 900;
  color: var(--border-strong);
  opacity: 0.25;
  line-height: 1;
  position: absolute;
  top: 1rem; left: 1.75rem;
  pointer-events: none;
}
.testi__quote {
  font-size: 1.0625rem;
  line-height: 1.75;
  color: var(--text-muted);
  font-style: normal;
  font-weight: 400;
  margin-bottom: 1.75rem;
  position: relative;
  z-index: 1;
  padding-top: 1.5rem;
}
.testi__meta { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.testi__avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border); }
.testi__name { font-size: 0.9375rem; font-weight: 700; color: var(--text); }
.testi__role { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem; }
.testi__company-tag { margin-left: auto; padding: 0.3rem 0.875rem; background: var(--accent-light); color: var(--accent); border-radius: 99px; font-size: 0.72rem; font-weight: 600; }
.testi__stars { color: #FBBF24; font-size: 1rem; letter-spacing: 2px; margin-top: 1rem; }

/* Dots */
.testi__dots { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
.testi__dot { width: 8px; height: 8px; border-radius: 99px; background: #CBD5E1; border: none; cursor: pointer; transition: all 0.25s ease; }
.testi__dot--active { width: 24px; background: #2563EB; }

/* Scroll Reveal */
.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.in { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: 0.15s; }
.reveal-delay-2 { transition-delay: 0.30s; }

@media (max-width: 1024px) { .testi__layout { grid-template-columns: 1fr; } .testi__tabs { flex-direction: row; overflow-x: auto; padding-bottom: 0.5rem; } .testi__tab { flex-shrink: 0; } }
@media (max-width: 640px) { .testi__main { padding: 1.5rem; } .testi__quote { font-size: 0.95rem; } }
`

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true)
    }, { threshold: 0.05 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  
  // Safe boundary check and fallback to prevent runtime crashes
  const t = (TESTIMONIALS && TESTIMONIALS.length > 0) 
    ? (TESTIMONIALS[active] || TESTIMONIALS[0]) 
    : null

  if (!t) return null

  return (
    <>
      <style>{css}</style>
      <section ref={ref} className="testi section" style={{ width: '100%', padding: '6rem 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
          <div className="testi__header">
            <p className={`section-label reveal${visible ? ' in' : ''}`}>Client Stories</p>
            <h2 className={`testi__title reveal reveal-delay-1${visible ? ' in' : ''}`}>
              Trusted by Tech Leaders<br />
              <span className="gradient-text">& Innovators</span>
            </h2>
          </div>

          <div className={`testi__layout reveal reveal-delay-2${visible ? ' in' : ''}`}>
            {/* Sidebar tabs */}
            <div className="testi__tabs">
              {TESTIMONIALS.map((item, i) => (
                <button
                  key={i}
                  className={`testi__tab ${active === i ? 'testi__tab--active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <img src={item.avatar} alt={item.name} className="testi__tab-avatar" />
                  <div>
                    <div className="testi__tab-name">{item.name}</div>
                    <div className="testi__tab-company">{item.company}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Main quote */}
            <div className="testi__main" key={active}>
              <div className="testi__quote-mark">"</div>
              <blockquote className="testi__quote">{t.quote}</blockquote>
              <div className="testi__meta">
                <img src={t.avatar} alt={t.name} className="testi__avatar" />
                <div>
                  <div className="testi__name">{t.name}</div>
                  <div className="testi__role">{t.role} · {t.company}</div>
                </div>
                <div className="testi__company-tag">{t.tag}</div>
              </div>
              <div className="testi__stars">★★★★★</div>
            </div>
          </div>

          {/* Dots */}
          <div className={`testi__dots reveal${visible ? ' in' : ''}`}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                className={`testi__dot ${active === i ? 'testi__dot--active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
