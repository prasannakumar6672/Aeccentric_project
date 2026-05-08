import React, { useState } from "react";
import {
  SiReact, SiNextdotjs, SiNodedotjs, SiTypescript, SiPython,
  SiPostgresql, SiOpenai, SiLangchain, SiZapier, SiFigma,
  SiFramer, SiGoogleanalytics, SiGoogleads, SiHubspot, SiMeta,
  SiTailwindcss, SiDocker, SiGithub, SiRedis, SiMongodb, SiGraphql,
  SiVercel, SiSupabase, SiNotion, SiSlack, SiWebflow, SiSemrush,
  SiMailchimp, SiStripe, SiClaude, SiAutodesk, SiBlender,
} from "react-icons/si";
import {
  Bot, Code2, Palette, BarChart3, Layers,
  Printer, Box, Globe, Wrench, Spline, Zap, Image,
} from "lucide-react";

const SiSplineFallback = () => <Spline size={18} />;
const SiIllustrator = () => <Palette size={18} />;
const SiPhotoshop = () => <Image size={18} />;
const SiAwslambda = () => <Zap size={18} />;
const SiPrusa = () => <Printer size={18} />;
const SiUltimaker = () => <Box size={18} />;
const SiThingiverse = () => <Globe size={18} />;
const SiDassaultsystemes = () => <Wrench size={18} />;

const cards = [
  {
    title: "Development",
    icon: <Code2 size={24} />,
    featured: true,
    tools: [
      { name: "React", icon: <SiReact />, desc: "UI component library", color: "#61DAFB" },
      { name: "Next.js", icon: <SiNextdotjs />, desc: "Full-stack React framework", color: "#888888" },
      { name: "Node.js", icon: <SiNodedotjs />, desc: "Server-side JavaScript", color: "#339933" },
      { name: "TypeScript", icon: <SiTypescript />, desc: "Typed JavaScript at scale", color: "#3178C6" },
      { name: "Python", icon: <SiPython />, desc: "Data & backend scripting", color: "#3776AB" },
      { name: "PostgreSQL", icon: <SiPostgresql />, desc: "Relational database engine", color: "#4169E1" },
      { name: "Redis", icon: <SiRedis />, desc: "In-memory data cache", color: "#DC382D" },
      { name: "MongoDB", icon: <SiMongodb />, desc: "NoSQL document database", color: "#47A248" },
      { name: "GraphQL", icon: <SiGraphql />, desc: "Flexible API queries", color: "#E10098" },
      { name: "TailwindCSS", icon: <SiTailwindcss />, desc: "Utility-first CSS", color: "#06B6D4" },
      { name: "Docker", icon: <SiDocker />, desc: "Containerized deployments", color: "#2496ED" },
      { name: "Supabase", icon: <SiSupabase />, desc: "Open-source Firebase alt", color: "#3ECF8E" },
      { name: "Vercel", icon: <SiVercel />, desc: "Frontend cloud platform", color: "#888888" },
      { name: "GitHub", icon: <SiGithub />, desc: "Version control & CI/CD", color: "#888888" },
    ],
  },
  {
    title: "AI & Automation",
    icon: <Bot size={22} />,
    tools: [
      { name: "OpenAI", icon: <SiOpenai />, desc: "GPT-4 & vision APIs", color: "#10a37f" },
      { name: "LangChain", icon: <SiLangchain />, desc: "LLM orchestration", color: "#1C7A5E" },
      { name: "Zapier", icon: <SiZapier />, desc: "No-code automation", color: "#FF4A00" },
      { name: "Claude", icon: <SiClaude />, desc: "Anthropic AI assistant", color: "#D97757" },
      { name: "Notion AI", icon: <SiNotion />, desc: "AI knowledge base", color: "#888888" },
      { name: "Slack AI", icon: <SiSlack />, desc: "Team communication + AI", color: "#7C3AED" },
    ],
  },
  {
    title: "Design & Creative",
    icon: <Palette size={22} />,
    tools: [
      { name: "Figma", icon: <SiFigma />, desc: "Collaborative UI design", color: "#F24E1E" },
      { name: "Framer", icon: <SiFramer />, desc: "Interactive web prototyping", color: "#0055FF" },
      { name: "Spline", icon: <SiSplineFallback />, desc: "3D design for the web", color: "#0D6EFD" },
      { name: "Webflow", icon: <SiWebflow />, desc: "No-code web builder", color: "#4353FF" },
      { name: "Illustrator", icon: <SiIllustrator />, desc: "Vector graphics editing", color: "#FF9A00" },
      { name: "Photoshop", icon: <SiPhotoshop />, desc: "Image editing & compositing", color: "#31A8FF" },
    ],
  },
  {
    title: "3D Printing",
    icon: <Layers size={22} />,
    tools: [
      { name: "Fusion 360", icon: <SiAutodesk />, desc: "CAD/CAM modeling suite", color: "#FF6600" },
      { name: "Blender", icon: <SiBlender />, desc: "Open-source 3D creation", color: "#E87D0D" },
      { name: "PrusaSlicer", icon: <SiPrusa />, desc: "FDM print slicing tool", color: "#FF7F00" },
      { name: "Cura", icon: <SiUltimaker />, desc: "Universal slicer software", color: "#0079BB" },
      { name: "Thingiverse", icon: <SiThingiverse />, desc: "3D model sharing platform", color: "#248BFB" },
      { name: "SolidWorks", icon: <SiDassaultsystemes />, desc: "Professional CAD design", color: "#DA1F26" },
    ],
  },
  {
    title: "Growth & Analytics",
    icon: <BarChart3 size={22} />,
    tools: [
      { name: "GA4", icon: <SiGoogleanalytics />, desc: "Web & app analytics", color: "#E37400" },
      { name: "Google Ads", icon: <SiGoogleads />, desc: "Search & display campaigns", color: "#4285F4" },
      { name: "HubSpot", icon: <SiHubspot />, desc: "CRM & inbound marketing", color: "#FF7A59" },
      { name: "Meta Ads", icon: <SiMeta />, desc: "Social paid advertising", color: "#0082FB" },
      { name: "SEMrush", icon: <SiSemrush />, desc: "SEO & competitor analysis", color: "#FF642D" },
      { name: "Mailchimp", icon: <SiMailchimp />, desc: "Email marketing automation", color: "#FFD700" },
      { name: "Stripe", icon: <SiStripe />, desc: "Payment infrastructure", color: "#635BFF" },
      { name: "AWS Lambda", icon: <SiAwslambda />, desc: "Serverless compute functions", color: "#FF9900" },
    ],
  },
];

/* ── Featured Card ── */
const FeaturedCard = ({ card }) => {
  const [cardHovered, setCardHovered] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-[38px] border border-gray-200 bg-white p-10 min-h-[580px] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(15,23,42,0.08)] cursor-default"
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
    >
      <div className="absolute top-[-120px] right-[-100px] w-[300px] h-[300px] rounded-full bg-blue-100 blur-[100px] opacity-60 group-hover:scale-125 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 w-full h-[180px] bg-gradient-to-t from-[#2563EB]/5 to-transparent" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="w-16 h-16 rounded-2xl border border-gray-200 flex items-center justify-center text-[#111827] bg-white shadow-sm">
          <Code2 size={30} />
        </div>
        <div className="mt-8">
          <span className="uppercase tracking-[0.25em] text-[11px] font-black text-[#2563EB]">
            Featured Stack
          </span>
          <h3 className="mt-3 text-[42px] leading-[1] font-black tracking-[-0.05em] text-[#111827]">
            Development
          </h3>
          <p className="mt-4 text-[16px] leading-[1.8] text-gray-500 max-w-[420px]">
            Full-stack engineering with modern frameworks, databases,
            cloud infrastructure, and scalable deployment pipelines.
          </p>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-x-2 gap-y-2 pt-8">
          {card.tools.map((tool, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all duration-200">
              <span
                className="text-[18px] flex-shrink-0 transition-all duration-300"
                style={{ color: cardHovered ? tool.color : "rgba(0,0,0,0.22)" }}
              >
                {tool.icon}
              </span>
              <div className="flex flex-col min-w-0">
                <span
                  className="text-[12px] font-bold leading-tight truncate transition-all duration-300"
                  style={{ color: cardHovered ? "#111827" : "rgba(0,0,0,0.4)" }}
                >
                  {tool.name}
                </span>
                <span
                  className="text-[10px] leading-tight truncate transition-all duration-300"
                  style={{ color: cardHovered ? "rgba(0,0,0,0.38)" : "rgba(0,0,0,0.18)" }}
                >
                  {tool.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Regular Card ── */
const RegularCard = ({ card }) => {
  const [cardHovered, setCardHovered] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-[34px] border border-gray-200 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(15,23,42,0.07)] cursor-default"
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.06),transparent_60%)]" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-[#111827]">
            {card.icon}
          </div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-black">Stack</span>
        </div>

        <h3 className="text-[26px] leading-[1.05] tracking-[-0.04em] font-black text-[#111827] mb-5">
          {card.title}
        </h3>

        <div className="grid grid-cols-2 gap-x-2 gap-y-2 mt-auto">
          {card.tools.map((tool, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all duration-200">
              <span
                className="text-[17px] flex-shrink-0 transition-all duration-300"
                style={{ color: cardHovered ? tool.color : "rgba(0,0,0,0.22)" }}
              >
                {tool.icon}
              </span>
              <div className="flex flex-col min-w-0">
                <span
                  className="text-[12px] font-bold leading-tight truncate transition-all duration-300"
                  style={{ color: cardHovered ? "#111827" : "rgba(0,0,0,0.4)" }}
                >
                  {tool.name}
                </span>
                <span
                  className="text-[10px] leading-tight truncate transition-all duration-300"
                  style={{ color: cardHovered ? "rgba(0,0,0,0.38)" : "rgba(0,0,0,0.18)" }}
                >
                  {tool.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Main Section ── */
const Tools = () => (
  <section className="relative w-full bg-white pt-32 pb-20 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.06),transparent_40%)] pointer-events-none" />

    <div className="w-full px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10">

      {/* Header */}
      <div className="flex flex-col items-center text-center max-w-[1500px] mx-auto mb-24">
        <div className="inline-flex items-center gap-3 border border-gray-200 rounded-full px-5 py-2 mb-8 bg-white">
          <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
          <span className="uppercase tracking-[0.25em] text-[11px] font-black text-[#111827]">
            Our Tool Stack
          </span>
        </div>
        <h2 className="text-[44px] sm:text-[58px] lg:text-[68px] font-black leading-[0.95] tracking-[-0.05em] text-[#0F172A] mb-8">
          Technology <br /> We Specialize In.
        </h2>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        <div className="lg:col-span-5">
          <FeaturedCard card={cards[0]} />
        </div>
        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-7">
          {cards.slice(1).map((card, i) => (
            <RegularCard key={i} card={card} />
          ))}
        </div>
      </div>

    </div>
  </section>
);

export default Tools;