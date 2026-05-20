import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Quote,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Rajesh Mehta",
    company: "Mehta Engineering Solutions",
    role: "VP of Engineering",
    industry: "Advanced Manufacturing",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    quote: "AEccentric completely transformed our rapid prototyping workflow. Their advanced 3D printing and CAD engineering solutions reduced our design-to-production cycle from months to just a few days. The precision is unmatched.",
  },
  {
    name: "Suresh Patel",
    company: "Patel Digital Networks",
    role: "Director of Operations",
    industry: "AI & Automation",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    quote: "Implementing AEccentric's custom AI voice agents and automated workflow pipelines was a game-changer for our customer operations. Our response times dropped by 80% while scaling customer satisfaction.",
  },
  {
    name: "Priya Sharma",
    company: "Sharma Pharma Tech",
    role: "Head of Digital Product",
    industry: "IT & Product Development",
    image: "https://images.unsplash.com/photo-1494790108755-2616b332c3e4?w=80&h=80&fit=crop&crop=face",
    quote: "We partnered with AEccentric to build our flagship enterprise SaaS platform. Their full-stack development team delivered a high-performance, secure, and beautiful interface that has completely blown away our clients.",
  },
  {
    name: "Anil Gupta",
    company: "Northern AgriTech Corp",
    role: "CTO & Co-Founder",
    industry: "Digital Transformation",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    quote: "AEccentric guided us through a complex legacy modernization and digital transformation process. Their team integrated modern cloud infrastructure seamlessly, reducing our server latency and saving us lakhs annually.",
  },
];

const STATS = [
  {
    value: "500+",
    label: "Enterprise Clients",
  },
  {
    value: "97%",
    label: "Client Retention",
  },
  {
    value: "4.9★",
    label: "Average Rating",
  },
  {
    value: "15+",
    label: "Countries Served",
  },
];

const BRANDS = [
  "Microsoft",
  "AWS",
  "Google",
  "Oracle",
  "NVIDIA",
  "IBM",
];

const Testimonials = () => {
  const [active, setActive] = useState(0);

  const current = TESTIMONIALS[active];

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) =>
        prev === TESTIMONIALS.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setActive((prev) =>
      prev === TESTIMONIALS.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setActive((prev) =>
      prev === 0 ? TESTIMONIALS.length - 1 : prev - 1
    );
  };

  return (
    <section className="relative overflow-hidden bg-[#F5F7FB] py-28">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-500/5 blur-[120px]" />

      {/* GRID BG */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      <div className="relative z-10 max-w-[1380px] mx-auto px-6 lg:px-10">

        {/* HERO */}
        <div className="text-center max-w-5xl mx-auto mb-24">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB] mb-8">
            <Sparkles size={14} />
            <span className="uppercase tracking-[0.28em] text-xs font-black">
              Client Stories
            </span>
          </div>

          <h1 className="text-[clamp(46px,7vw,92px)] leading-[0.95] tracking-[-0.05em] font-black text-[#0B132B]">
            Trusted by Tech
            <br />
            Leaders &
            <br />
            <span className="text-[#3B82F6]">
              Innovators
            </span>
          </h1>

          <p className="mt-8 text-[#64748B] text-[18px] leading-[1.9] max-w-3xl mx-auto">
            Helping businesses scale through custom product development, advanced engineering, and intelligent AI-powered workflows.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-24">

          {STATS.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[28px] border border-[#E5EAF3] p-8 text-center shadow-[0_10px_40px_rgba(15,23,42,0.04)] hover:-translate-y-2 transition-all duration-500"
            >
              <div className="text-[44px] leading-none font-black text-[#2563EB] mb-3">
                {item.value}
              </div>

              <div className="text-[#64748B] font-semibold">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* TESTIMONIAL SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 items-center">

          {/* LEFT SIDEBAR */}
          <div className="flex flex-col gap-5">

            {TESTIMONIALS.map((item, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`group flex items-center gap-4 rounded-[24px] p-5 transition-all duration-300 text-left border ${active === index
                  ? "bg-white border-[#BFDBFE] shadow-[0_12px_40px_rgba(37,99,235,0.08)] scale-[1.02]"
                  : "border-transparent hover:bg-white/70"
                  }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className={`w-16 h-16 rounded-full object-cover transition-all duration-300 ${active === index
                    ? "ring-2 ring-[#2563EB]"
                    : ""
                    }`}
                />

                <div>
                  <div className="text-[22px] font-bold text-[#0B132B] leading-none mb-2">
                    {item.name}
                  </div>

                  <div className="text-[15px] text-[#7B8794]">
                    {item.company}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* RIGHT CARD */}
          <div className="relative bg-white rounded-[40px] border border-[#E6EAF2] p-8 md:p-14 min-h-[470px] shadow-[0_20px_70px_rgba(15,23,42,0.05)] overflow-hidden">

            {/* CARD GLOW */}
            <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-blue-500/5 rounded-full blur-[80px]" />

            {/* QUOTE ICON */}
            <Quote
              size={80}
              className="text-[#DBEAFE] mb-8"
              strokeWidth={1.4}
            />

            {/* TEXT */}
            <div
              key={active}
              className="animate-[fadeIn_.4s_ease]"
            >
              <p className="text-[clamp(22px,2vw,36px)] leading-[1.7] text-[#334155] max-w-5xl mb-16 font-medium">
                {current.quote}
              </p>

              {/* FOOTER */}
              <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8">

                {/* PROFILE */}
                <div className="flex items-center gap-5">

                  <img
                    src={current.image}
                    alt={current.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />

                  <div>
                    <div className="text-[30px] font-black text-[#0B132B] mb-2">
                      {current.name}
                    </div>

                    <div className="text-[#64748B] text-lg">
                      {current.role} · {current.company}
                    </div>

                    <div className="flex gap-1 mt-5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          fill="#FBBF24"
                          color="#FBBF24"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* INDUSTRY */}
                <div className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-sm whitespace-nowrap">
                  {current.industry}
                </div>
              </div>
            </div>

            {/* BOTTOM NAV */}
            <div className="flex items-center justify-between mt-14">

              {/* ARROWS */}
              <div className="flex items-center gap-3">

                <button
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full border border-[#E2E8F0] bg-white flex items-center justify-center hover:bg-[#EFF6FF] transition-all"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full border border-[#E2E8F0] bg-white flex items-center justify-center hover:bg-[#EFF6FF] transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* DOTS */}
              <div className="flex items-center gap-3">

                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`transition-all duration-300 rounded-full ${active === i
                      ? "w-10 h-3 bg-[#2563EB]"
                      : "w-3 h-3 bg-[#CBD5E1]"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BRANDS */}
        <div className="mt-28">

          <p className="text-center text-[#94A3B8] uppercase tracking-[0.3em] text-xs font-bold mb-10">
            Trusted Technology Ecosystem
          </p>

          <div className="flex flex-wrap justify-center gap-4">

            {BRANDS.map((brand, index) => (
              <div
                key={index}
                className="px-6 py-3 rounded-full border border-[#E2E8F0] bg-white text-[#334155] font-semibold shadow-sm hover:-translate-y-1 transition-all duration-300"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 bg-white border border-[#E6EAF2] rounded-[40px] p-12 md:p-20 text-center shadow-[0_20px_60px_rgba(15,23,42,0.05)]">

          <h2 className="text-[clamp(34px,4vw,56px)] font-black leading-tight tracking-[-0.04em] text-[#0B132B] mb-6">
            Ready to become our next success story?
          </h2>

          <p className="text-[#64748B] text-lg leading-[1.9] max-w-3xl mx-auto mb-10">
            Let’s discuss your product, engineering,
            automation pipeline, or digital transformation
            goals.
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[#2563EB] text-white font-black text-[15px] hover:scale-[1.03] transition-all duration-300 shadow-[0_20px_40px_rgba(37,99,235,0.25)]"
          >
            Start Your Project
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* ANIMATION */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0px);
            }
          }
        `}
      </style>
    </section>
  );
};

export default Testimonials;