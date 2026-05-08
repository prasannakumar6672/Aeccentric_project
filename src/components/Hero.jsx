import React, { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";

/* ─── Frame sequence config ───────────────────────────────────────────── */
const TOTAL_FRAMES = 33;
const TOUCH_FRAME  = 33;
const FPS          = 22;
const PAUSE_MS     = 900;

// Use Vite's glob import to automatically load and bundle the images
// from the root hero_animation_frames folder
const frameModules = import.meta.glob('../../../hero_animation_frames/hero_animation_frames/*.png', { eager: true, import: 'default' });

// Extract the sorted paths
const FRAMES = Object.keys(frameModules)
  .sort()
  .map((key) => frameModules[key]);

/* ─── Preload all images on startup ───────────────────────────────────── */
function preloadFrames(urls) {
  urls.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

export default function Hero() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [direction, setDirection]       = useState(1);  // 1 = forward, -1 = reverse
  const [paused, setPaused]             = useState(false);
  const [loaded, setLoaded]             = useState(false);
  const timerRef = useRef(null);

  /* Preload on mount */
  useEffect(() => {
    preloadFrames(FRAMES);
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  /* frame ticker */
  useEffect(() => {
    if (!loaded) return;
    if (paused) return;

    timerRef.current = setTimeout(() => {
      setCurrentFrame((prev) => {
        const next = prev + direction;

        /* reached touch frame → pause, then reverse */
        if (next >= TOUCH_FRAME) {
          setPaused(true);
          setTimeout(() => {
            setDirection(-1);
            setPaused(false);
          }, PAUSE_MS);
          return TOUCH_FRAME;
        }

        /* reached start → flip forward again */
        if (next <= 0) {
          setDirection(1);
          return 0;
        }

        return next;
      });
    }, 1000 / FPS);

    return () => clearTimeout(timerRef.current);
  }, [currentFrame, direction, paused, loaded]);

  return (
    <section
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white pt-[140px] pb-32 lg:pb-48 px-6"
    >

      {/* ── CSS ── */}
      <style>{`
        @keyframes halo-spin {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }

        @keyframes fade-in-up {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .hero-content { animation: fade-in-up 0.9s ease both; }
        .hero-badge   { animation: fade-in-up 0.7s ease both; }
        .hero-sub     { animation: fade-in-up 1.1s 0.15s ease both; }
        .hero-cta     { animation: fade-in-up 1.1s 0.3s ease both; }
      `}</style>

      {/* ── Concentric Rings Background ── */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square max-w-[2500px] -z-20 pointer-events-none flex items-center justify-center">
        {/* Soft center glow to blend the center */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-white blur-[80px] z-10 opacity-60" />
        
        {/* Rings */}
        {[250, 450, 650, 850, 1050, 1250, 1450, 1650, 1850, 2050, 2250].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-gray-300"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              filter: "blur(2.5px)",
              opacity: Math.max(0.05, 0.35 - (i * 0.03)),
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.02), 0 0 20px rgba(0,0,0,0.02)"
            }}
          />
        ))}
      </div>

      {/* ════════════════════════════════════════════
          HAND FRAME ANIMATION — full-width canvas
          mix-blend-mode:multiply erases the dark BG
      ════════════════════════════════════════════ */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* The frame image — blend mode strips the dark BG */}
        <img
          src={FRAMES[currentFrame]}
          alt=""
          aria-hidden="true"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "multiply",    /* dark BG becomes white, hands remain */
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.4s ease",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />


      </div>

      {/* ════════════════════════════════════════════
          HERO TEXT CONTENT — above all layers
      ════════════════════════════════════════════ */}
      <div
        className="hero-content relative max-w-[1100px] w-full text-center flex flex-col items-center"
        style={{ zIndex: 2 }}
      >
        {/* Badge */}
        <div className="hero-badge mb-8 px-5 py-2 rounded-full border border-blue-100 bg-white/90 backdrop-blur-sm shadow-sm inline-flex items-center gap-2">
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "#2F5BFF", display: "inline-block",
            boxShadow: "0 0 6px #2F5BFF",
          }} />
          <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
            AI-Powered Digital Agency
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(32px, 5.5vw, 74px)",
          fontWeight: 800,
          color: "#0F172A",
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          marginTop: "12px",
          textAlign: "center",
        }}>
          We Build Intelligent
          <br />
          <span style={{
            display: "block",
            whiteSpace: "nowrap",
            background: "linear-gradient(135deg, #2F5BFF 0%, #A855F7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Digital Systems
          </span>
          That Scale Your Business
        </h1>

        {/* Subtext */}
        <p className="hero-sub" style={{
          marginTop: "28px",
          fontSize: "clamp(15px, 1.5vw, 19px)",
          color: "#64748B",
          maxWidth: "640px",
          lineHeight: 1.75,
        }}>
          From high-performance websites to AI-powered automation, we create
          systems that drive growth, efficiency, and real results.
        </p>

        {/* CTA */}
        <div className="hero-cta" style={{ marginTop: "44px" }}>
          <button
            className="group flex items-center gap-4 bg-[#0B1A2B] text-white font-bold tracking-widest transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#122240]"
            style={{
              padding: "18px 40px",
              fontSize: "14px",
              borderRadius: "14px",
              boxShadow: "0 4px 0 0 #2F5BFF, 0 8px 28px -4px rgba(47,91,255,0.4)",
            }}
          >
            FREE CONSULTATION
            <div
              className="flex items-center justify-center rounded-full border border-white/40 transition-all duration-300 group-hover:border-white/80 group-hover:translate-x-1"
              style={{ width: "30px", height: "30px" }}
            >
              <ChevronRight style={{ width: "14px", height: "14px" }} strokeWidth={2.5} />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}