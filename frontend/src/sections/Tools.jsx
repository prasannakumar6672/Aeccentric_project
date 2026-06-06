import React, { useState } from "react";
import {
  SiReact, SiNextdotjs, SiNodedotjs, SiTypescript, SiPython,
  SiPostgresql, SiOpenai, SiLangchain, SiZapier, SiFigma,
  SiHubspot, SiTailwindcss, SiDocker, SiGithub, SiMongodb, SiGraphql,
  SiVercel, SiSupabase, SiNotion, SiSlack, SiStripe, SiClaude, SiAutodesk, SiBlender,
  SiGooglecloud, SiSalesforce, SiTensorflow, SiRaspberrypi, SiGoogleanalytics
} from "react-icons/si";
import { FaAws, FaMicrosoft } from "react-icons/fa";
import { Bot, Code2, Printer, Globe, Wrench, Box } from "lucide-react";
import { motion } from "framer-motion";

const SiPrusa = () => <Printer size={18} />;
const SiUltimaker = () => <Box size={18} />;
const SiThingiverse = () => <Globe size={18} />;
const SiDassaultsystemes = () => <Wrench size={18} />;

const cards = [
  {
    title: "IT & Product Development", icon: <Code2 size={22} />, featured: true,
    tools: [
      { name: "React",       icon: <SiReact />,       color: "#61DAFB" },
      { name: "Next.js",     icon: <SiNextdotjs />,   color: "#999" },
      { name: "Node.js",     icon: <SiNodedotjs />,   color: "#339933" },
      { name: "TypeScript",  icon: <SiTypescript />,  color: "#3178C6" },
      { name: "PostgreSQL",  icon: <SiPostgresql />,  color: "#4169E1" },
      { name: "MongoDB",     icon: <SiMongodb />,     color: "#47A248" },
      { name: "TailwindCSS", icon: <SiTailwindcss />, color: "#06B6D4" },
      { name: "Docker",      icon: <SiDocker />,      color: "#2496ED" },
      { name: "Supabase",    icon: <SiSupabase />,    color: "#3ECF8E" },
      { name: "Vercel",      icon: <SiVercel />,      color: "#888" },
      { name: "GitHub",      icon: <SiGithub />,      color: "#888" },
      { name: "GraphQL",     icon: <SiGraphql />,     color: "#E10098" },
    ],
  },
  {
    title: "AI Services & Automation", icon: <Bot size={20} />,
    tools: [
      { name: "OpenAI",    icon: <SiOpenai />,   color: "#10a37f" },
      { name: "LangChain", icon: <SiLangchain />, color: "#1C7A5E" },
      { name: "Claude",    icon: <SiClaude />,   color: "#D97757" },
      { name: "Zapier",    icon: <SiZapier />,   color: "#FF4A00" },
      { name: "Notion AI", icon: <SiNotion />,   color: "#888" },
      { name: "Slack AI",  icon: <SiSlack />,    color: "#4A154B" },
    ],
  },
  {
    title: "Digital Transformation", icon: <Globe size={20} />,
    tools: [
      { name: "AWS",          icon: <FaAws />,          color: "#FF9900" },
      { name: "Google Cloud", icon: <SiGooglecloud />,  color: "#4285F4" },
      { name: "Salesforce",   icon: <SiSalesforce />,   color: "#00A1E0" },
      { name: "Stripe",       icon: <SiStripe />,       color: "#635BFF" },
      { name: "HubSpot",      icon: <SiHubspot />,      color: "#FF7A59" },
      { name: "Figma",        icon: <SiFigma />,        color: "#F24E1E" },
    ],
  },
  {
    title: "3D Engineering Solutions", icon: <Printer size={20} />,
    tools: [
      { name: "Fusion 360",  icon: <SiAutodesk />,         color: "#0696D7" },
      { name: "Blender",     icon: <SiBlender />,          color: "#F5792A" },
      { name: "SolidWorks",  icon: <SiDassaultsystemes />, color: "#E32526" },
      { name: "PrusaSlicer", icon: <SiPrusa />,            color: "#FA6831" },
      { name: "Cura",        icon: <SiUltimaker />,        color: "#0055FF" },
      { name: "Thingiverse", icon: <SiThingiverse />,      color: "#248BFB" },
    ],
  },
  {
    title: "Smart Manufacturing", icon: <Wrench size={20} />,
    tools: [
      { name: "TensorFlow",     icon: <SiTensorflow />,     color: "#FF6F00" },
      { name: "Python",         icon: <SiPython />,         color: "#3776AB" },
      { name: "Raspberry Pi",   icon: <SiRaspberrypi />,    color: "#A22846" },
      { name: "Data Analytics", icon: <SiGoogleanalytics />, color: "#E37400" },
      { name: "Azure IoT",      icon: <FaMicrosoft />,      color: "#0089D6" },
      { name: "Docker Edge",    icon: <SiDocker />,         color: "#2496ED" },
    ],
  },
];

const cardVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

function FeaturedCard({ card }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: '36px', height: '100%',
        border: '1px solid var(--border)', background: 'var(--bg-card)',
        padding: '2.5rem', minHeight: '540px', display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-card)', transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '-120px', right: '-120px', width: '340px', height: '340px',
        borderRadius: '50%', background: 'rgba(37,99,235,0.10)', filter: 'blur(100px)',
        transform: hovered ? 'scale(1.3)' : 'scale(1)', transition: 'transform 0.8s',
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', boxShadow: 'var(--shadow-sm)' }}>
          {card.icon}
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--accent)' }}>Featured Stack</span>
          <h3 style={{ marginTop: '0.5rem', fontSize: 'clamp(22px,2.5vw,32px)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text)', lineHeight: 1.1 }}>{card.title}</h3>
          <p style={{ marginTop: '0.75rem', fontSize: '15px', lineHeight: 1.8, color: 'var(--text-muted)', maxWidth: '380px' }}>
            Enterprise-grade engineering with modern frameworks, robust databases, and scalable cloud infrastructure.
          </p>
        </div>
        <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', paddingTop: '1.75rem' }}>
          {card.tools.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px', borderRadius: '10px', transition: 'background 0.2s', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '18px', color: hovered ? t.color : 'var(--text-subtle)', transition: 'color 0.4s', flexShrink: 0 }}>{t.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: hovered ? 'var(--text)' : 'var(--text-muted)', transition: 'color 0.4s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function RegularCard({ card }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: '28px', minHeight: '320px',
        border: hovered ? '1px solid var(--accent)' : '1px solid var(--border)',
        background: 'var(--bg-card)', padding: '2rem',
        display: 'flex', flexDirection: 'column', height: '100%',
        boxShadow: hovered ? '0 24px 60px rgba(37,99,235,0.10)' : 'var(--shadow-card)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top right, var(--accent-light), transparent 70%)', opacity: hovered ? 1 : 0, transition: 'opacity 0.5s', borderRadius: '28px' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: hovered ? 'var(--accent)' : 'var(--text)', transition: 'all 0.4s', boxShadow: 'var(--shadow-sm)' }}>
          {card.icon}
        </div>
        <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: hovered ? 'var(--accent)' : 'var(--text-subtle)', transition: 'color 0.4s' }}>Stack</span>
      </div>

      <h3 style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(18px,2vw,24px)', fontWeight: 900, letterSpacing: '-0.03em', color: hovered ? 'var(--accent)' : 'var(--text)', marginBottom: '1.25rem', lineHeight: 1.15, transition: 'color 0.4s' }}>
        {card.title}
      </h3>

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
        {card.tools.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 6px', borderRadius: '8px', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: '16px', color: hovered ? t.color : 'var(--text-subtle)', transition: 'color 0.4s', flexShrink: 0 }}>{t.icon}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: hovered ? 'var(--text)' : 'var(--text-muted)', transition: 'color 0.4s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Tools() {
  return (
    <section style={{ position: 'relative', width: '100%', background: 'var(--bg-secondary)', padding: '6rem 0 5rem', overflow: 'hidden', transition: 'background 0.4s' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(circle, var(--accent-light) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="pill-badge" style={{ marginBottom: '1.25rem' }}>
            <span className="pill-dot" />
            Ecosystem & Tools
          </div>
          <h2 style={{ color: 'var(--text)' }}>
            <span style={{ display: 'block', fontSize: 'clamp(36px,5vw,68px)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1 }}>The Technology</span>
            <span style={{ display: 'block', fontSize: 'clamp(22px,3vw,40px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2, color: 'var(--text-muted)', marginTop: '4px' }}>We Specialize In.</span>
          </h2>
        </div>

        {/* Bento grid */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
          transition={{ staggerChildren: 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '1.5rem', alignItems: 'stretch' }}
          className="tools-grid"
        >
          <FeaturedCard card={cards[0]} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="tools-right-grid">
            {cards.slice(1).map((c, i) => <RegularCard key={i} card={c} />)}
          </div>
        </motion.div>
      </div>

      <style>{`
        .tools-grid { grid-template-columns: 5fr 7fr; }
        .tools-right-grid { grid-template-columns: 1fr 1fr; }
        
        @media(max-width:1024px){
          .tools-grid { grid-template-columns: 1fr !important; }
          .tools-right-grid { grid-template-columns: 1fr 1fr !important; }
        }
        
        @media(max-width:640px){
          .tools-grid {
            gap: 1rem !important;
          }
          /* Featured Card adjustments */
          .tools-grid > div:first-child {
            padding: 1.75rem 1.25rem !important;
            min-height: 400px !important;
            border-radius: 24px !important;
          }
          .tools-grid > div:first-child h3 {
            font-size: 22px !important;
          }
          .tools-grid > div:first-child p {
            font-size: 13.5px !important;
            line-height: 1.7 !important;
          }
          
          /* Regular Card adjustments */
          .tools-right-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
          }
          .tools-right-grid > div {
            padding: 1.25rem 1rem !important;
            min-height: 240px !important;
            border-radius: 20px !important;
          }
          .tools-right-grid h3 {
            font-size: 15px !important;
            margin-bottom: 0.75rem !important;
            line-height: 1.2 !important;
          }
        }
        
        @media(max-width:440px){
          .tools-right-grid {
            gap: 0.75rem !important;
          }
          .tools-right-grid > div {
            padding: 1rem 0.75rem !important;
            min-height: 220px !important;
            border-radius: 16px !important;
          }
          .tools-right-grid h3 {
            font-size: 14px !important;
          }
          .tools-right-grid span {
            font-size: 10px !important;
          }
        }
      `}</style>
    </section>
  );
}