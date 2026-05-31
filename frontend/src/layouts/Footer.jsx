import React, { useState } from "react";
import { FaInstagram, FaFacebook } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const navColumns = [
  {
    heading: "Services",
    links: [
      { label: "AI Automation Systems",    href: "/services/ai-orchestration" },
      { label: "Full-Stack Development",   href: "/services/web-engineering" },
      { label: "Growth Marketing",         href: "/services/growth-systems" },
      { label: "Brand Identity Design",    href: "/services/brand-identity" },
      { label: "3D Printing & Prototyping",href: "/services/3d-fabrication" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us",   href: "#" },
      { label: "Careers",    href: "#" },
      { label: "Blog",       href: "#" },
      { label: "Resources",  href: "#" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "admin@aeccentric.com", href: "mailto:admin@aeccentric.com" },
      { label: "+91 8498871442",       href: "tel:+918498871442" },
      { label: "Hyderabad, India",     href: "#" },
    ],
  },
];

const socials = [
  { icon: <FaInstagram size={14} />, href: "https://www.instagram.com/aeccentric_aisolutions/", label: "Instagram" },
  { icon: <FaFacebook size={14} />,  href: "https://www.facebook.com/aeccentric/",              label: "Facebook"  },
];

/** Accordion column — collapses on mobile */
function FooterColumn({ col }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="footer-col">
      {/* Heading — acts as accordion toggle on mobile */}
      <button
        className="footer-col-heading"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>{col.heading}</span>
        <ChevronDown
          className="footer-col-chevron"
          style={{
            width: 16, height: 16,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
            color: 'rgba(255,255,255,0.4)',
          }}
        />
      </button>

      <div className="footer-col-links" style={{ maxHeight: open ? '400px' : undefined }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {col.links.map((link, li) => (
            <li key={li}>
              <a
                href={link.href}
                className="footer-link"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{
      position: 'relative', width: '100%', overflow: 'hidden',
      background: 'linear-gradient(to bottom, #020617 0%, #050816 60%, #02040B 100%)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Top glow */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)',
        filter: 'blur(100px)', pointerEvents: 'none',
      }} />

      <div className="footer-inner-container" style={{ position: 'relative', zIndex: 10, maxWidth: '1350px', margin: '0 auto' }}>

        {/* Top grid */}
        <div className="footer-top-grid">

          {/* Left — Branding */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                <img src="/logo.png" alt="AECCENTRIC" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <h2 style={{ color: '#ffffff', fontWeight: 900, fontSize: '17px', letterSpacing: '-0.02em' }}>
                  AECCENTRIC
                </h2>
                <p style={{ fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                  AI Services & Solutions
                </p>
              </div>
            </div>

            <p style={{ fontSize: '14px', lineHeight: 1.85, color: 'rgba(255,255,255,0.38)', maxWidth: '320px' }}>
              We offer AI Services and Solutions, IT Services, Product development, and 3D Printing to transform your business.
            </p>

            {/* Socials */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'rgba(255,255,255,0.45)',
                    transition: 'all 0.3s', textDecoration: 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right — Link Columns */}
          <div className="footer-links-grid">
            {navColumns.map((col, ci) => (
              <FooterColumn key={ci} col={col} />
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.5rem 0 1.75rem', flexWrap: 'wrap', gap: '0.75rem',
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {["Privacy Policy", "Terms & Conditions"].map((item, i) => (
              <a key={i} href="#" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.22)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.22)'}>
                {item}
              </a>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.02em' }}>
            © 2026 AECCENTRIC. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        /* ── Desktop layout ─────────────────────────────────────── */
        .footer-inner-container { padding: 4.5rem 2rem 0; }
        .footer-top-grid {
          display: grid;
          grid-template-columns: 4fr 8fr;
          gap: 5rem;
          padding-bottom: 3.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .footer-col-heading {
          background: none;
          border: none;
          padding: 0;
          width: 100%;
          text-align: left;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #ffffff;
          margin-bottom: 1.25rem;
          cursor: default;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-col-chevron { display: none !important; }
        .footer-col-links { display: block; overflow: visible; }
        .footer-link {
          font-size: 14px;
          color: rgba(255,255,255,0.38);
          text-decoration: none;
          display: inline-block;
          transition: all 0.25s;
        }
        .footer-link:hover {
          color: #fff;
          transform: translateX(3px);
        }

        /* ── Mobile: Accordion ───────────────────────────────────── */
        @media (max-width: 768px) {
          .footer-inner-container { padding: 2.5rem 1.25rem 0 !important; }
          .footer-top-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            padding-bottom: 0 !important;
            border-bottom: none !important;
          }
          .footer-links-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            border-top: 1px solid rgba(255,255,255,0.08);
            margin-top: 0.5rem;
          }
          .footer-col {
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .footer-col-heading {
            cursor: pointer;
            padding: 14px 0;
            margin-bottom: 0;
            font-size: 11px;
            letter-spacing: 0.22em;
          }
          .footer-col-chevron { display: block !important; }
          .footer-col-links {
            overflow: hidden;
            max-height: 0;
            transition: max-height 0.4s cubic-bezier(0.16,1,0.3,1), padding 0.3s;
            padding: 0 0 0;
          }
          .footer-col-links[style*="max-height: 400px"],
          .footer-col-links[style*="max-height:400px"] {
            padding-bottom: 14px;
          }
        }
      `}</style>
    </footer>
  );
}