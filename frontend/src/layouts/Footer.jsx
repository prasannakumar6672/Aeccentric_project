import React from "react";
import { FaXTwitter, FaLinkedin, FaYoutube, FaInstagram, FaFacebook } from "react-icons/fa6";
import { Link } from "react-router-dom";

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
        <div style={{
          display: 'grid', gridTemplateColumns: '4fr 8fr', gap: '5rem',
          paddingBottom: '4rem', borderBottom: '1px solid rgba(255,255,255,0.07)',
        }} className="footer-top-grid">

          {/* Left — Branding */}
          <div className="footer-brand-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.5rem' }}>
              <div style={{ width: '44px', height: '44px', flexShrink: 0 }}>
                <img src="/logo.png" alt="AECCENTRIC" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <h2 style={{ color: '#ffffff', fontWeight: 900, fontSize: '18px', letterSpacing: '-0.02em' }}>
                  AECCENTRIC
                </h2>
                <p style={{ fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                  AI Services & Solutions
                </p>
              </div>
            </div>

            <p className="footer-brand-desc" style={{ fontSize: '15px', lineHeight: 1.9, color: 'rgba(255,255,255,0.38)', maxWidth: '340px' }}>
              We offer AI Services and Solutions, IT Services, Product development, and 3D Printing to transform your business.
            </p>

            {/* Socials */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'rgba(255,255,255,0.45)',
                    transition: 'all 0.3s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right — Links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }} className="footer-links-grid">
            {navColumns.map((col, ci) => (
              <div key={ci}>
                <h4 style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#ffffff', marginBottom: '1.5rem' }}>
                  {col.heading}
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {col.links.map((link, li) => (
                    <li key={li}>
                      <a
                        href={link.href}
                        style={{ fontSize: '14px', color: 'rgba(255,255,255,0.38)', textDecoration: 'none', display: 'inline-block', transition: 'all 0.25s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateX(3px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.75rem 0 2rem', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {["Privacy Policy", "Terms & Conditions"].map((item, i) => (
              <a key={i} href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.22)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.22)'}>
                {item}
              </a>
            ))}
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.02em' }}>
            © 2026 AECCENTRIC. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        .footer-inner-container {
          padding: 5rem 2rem 0;
        }
        .footer-top-grid { grid-template-columns: 4fr 8fr; }
        .footer-links-grid { grid-template-columns: repeat(3,1fr); }
        
        @media(max-width:1024px){
          .footer-inner-container {
            padding: 4rem 2rem 0 !important;
          }
          .footer-top-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 3rem 2rem !important;
          }
          .footer-brand-col {
            grid-column: span 1 !important;
          }
          .footer-links-grid {
            grid-column: span 3 !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 2rem 1.5rem !important;
          }
        }
        
        @media(max-width:768px){
          .footer-inner-container {
            padding: 3rem 1.25rem 0 !important;
          }
          .footer-top-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .footer-brand-col {
            grid-column: span 1 !important;
          }
          .footer-brand-desc {
            font-size: 14px !important;
            max-width: 100% !important;
          }
          .footer-links-grid {
            grid-column: span 1 !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2.5rem 1.5rem !important;
          }
        }
      `}</style>
    </footer>
  );
}