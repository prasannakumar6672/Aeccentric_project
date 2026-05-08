import React, { useEffect, useState, useRef } from "react";

import {
  FaGoogle,
  FaAmazon,
  FaMeta,
  FaMicrosoft,
  FaApple,
  FaSpotify,
  FaStripe,
  FaSalesforce,
  FaUber,
} from "react-icons/fa6";

const TrustStrip = () => {
  const [isVisible, setIsVisible] = useState(false);

  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  /* =========================================
     STATS
  ========================================= */

  const stats = [
    { value: "100+", label: "Projects Delivered" },
    { value: "50+", label: "Happy Clients" },
    { value: "3+", label: "Years Experience" },
    { value: "95%", label: "Client Satisfaction" },
  ];

  /* =========================================
     REAL COMPANY LOGOS
  ========================================= */

  const logos = [
    { name: "Google", Icon: FaGoogle, color: "#4285F4" },
    { name: "Amazon", Icon: FaAmazon, color: "#FF9900" },
    { name: "Meta", Icon: FaMeta, color: "#0668E1" },
    { name: "Microsoft", Icon: FaMicrosoft, color: "#00A4EF" },
    { name: "Apple", Icon: FaApple, color: "#111827" },
    { name: "Spotify", Icon: FaSpotify, color: "#1DB954" },
    { name: "Stripe", Icon: FaStripe, color: "#635BFF" },
    { name: "Salesforce", Icon: FaSalesforce, color: "#00A1E0" },
    { name: "Uber", Icon: FaUber, color: "#111827" },
  ];

  const allLogos = [...logos, ...logos]; // Standard 2-set for perfect loop

  return (
    <section
      ref={sectionRef}
      className={`w-full py-32 lg:py-44 bg-white transition-all duration-1000 ${isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-10"
        }`}
    >
      <div className="max-w-full overflow-hidden">

        {/* =========================================
            TOP LABEL
        ========================================= */}

        <div className="text-center mb-16 px-6">
          <span className="text-[12px] sm:text-[13px] font-black tracking-[0.28em] text-[#64748b] uppercase">
            Trusted by modern global brands
          </span>
        </div>

        {/* =========================================
            LOGO MARQUEE
        ========================================= */}

        <div className="relative h-[80px] sm:h-[100px] flex items-center group/ticker">
          {/* Base Marquee (Faded Grey) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
            }}
          >
            <div className="animate-ticker group-hover/ticker:[animation-play-state:paused] flex items-center gap-24 sm:gap-32 py-8 w-max h-full">
              {allLogos.map((logo, index) => {
                const Icon = logo.Icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-5 px-4 cursor-default"
                  >
                    <Icon className="w-10 h-10 text-[#111827]/20" />
                    <span className="text-[30px] sm:text-[42px] font-black tracking-[-0.05em] text-[#111827]/15 whitespace-nowrap">
                      {logo.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Highlight Marquee (Colored, masked to center only) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, transparent 35%, black 48%, black 52%, transparent 65%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, transparent 35%, black 48%, black 52%, transparent 65%, transparent 100%)",
            }}
          >
            <div className="animate-ticker group-hover/ticker:[animation-play-state:paused] flex items-center gap-24 sm:gap-32 py-8 w-max h-full">
              {allLogos.map((logo, index) => {
                const Icon = logo.Icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-5 px-4 cursor-default"
                  >
                    <Icon className="w-10 h-10" style={{ color: logo.color }} />
                    <span className="text-[30px] sm:text-[42px] font-black tracking-[-0.05em] whitespace-nowrap" style={{ color: logo.color }}>
                      {logo.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================
            SPACE BETWEEN LOGOS & STATS
        ========================================= */}

        <div className="h-[40px] lg:h-[50px]" />

        {/* =========================================
            STATS SECTION
        ========================================= */}

        <div className="w-full max-w-[1500px] mx-auto px-8 lg:px-20 relative z-10">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-10">

            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center group"
              >

                {/* NUMBER */}
                <div className="mb-5">

                  <span className="text-[30px] sm:text-[45px] lg:text-[50px] leading-none font-black tracking-[-0.06em] text-[#111827] group-hover:text-[#2F5BFF] transition-all duration-300">
                    {isVisible ? stat.value : "0"}
                  </span>

                </div>

                {/* LABEL */}
                <span className="text-[11px] sm:text-[13px] font-black text-[#64748b] uppercase tracking-[0.25em] opacity-75 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {stat.label}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>

      {/* =========================================
          TICKER ANIMATION
      ========================================= */}

      <style>{`
        .animate-ticker {
          animation: ticker 32s linear infinite;
        }

        @keyframes ticker {
          0% {
            transform: translateX(0%);
          }

          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default TrustStrip;