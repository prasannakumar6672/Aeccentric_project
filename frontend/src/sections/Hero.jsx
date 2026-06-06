import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

// Stagger entrance transitions for elements in the hero content
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 90,
    },
  },
};

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className="relative isolate w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden pt-24 pb-12 sm:pb-20 lg:pb-32 px-6"
      style={{ background: "var(--bg)", transition: "background 0.4s" }}
    >
      {/* ── Layer 1: Ambient Coordinate Grid Backdrop ────────────────────── */}
      <div
        className="absolute inset-0 -z-30 pointer-events-none opacity-40 dark:opacity-65 transition-opacity duration-500"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
               linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`
            : `linear-gradient(rgba(37, 99, 235, 0.035) 1px, transparent 1px),
               linear-gradient(90deg, rgba(37, 99, 235, 0.035) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          backgroundPosition: "center center",
          maskImage: "radial-gradient(circle at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 80%)",
        }}
      />

      {/* ── Layer 2: Drifting Blur Glow Orbs ────────────────────────────── */}
      <div className="absolute inset-0 -z-20 pointer-events-none overflow-hidden select-none">
        {/* Orb 1 */}
        <div
          className="absolute w-[45vw] h-[45vw] min-w-[320px] rounded-full blur-[140px] mix-blend-screen animate-drift-1"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(99,102,241,0.02) 70%, transparent 100%)"
              : "radial-gradient(circle, rgba(37,99,235,0.05) 0%, rgba(147,51,234,0.01) 70%, transparent 100%)",
            top: "15%",
            left: "10%",
          }}
        />
        {/* Orb 2 */}
        <div
          className="absolute w-[45vw] h-[45vw] min-w-[320px] rounded-full blur-[140px] mix-blend-screen animate-drift-2"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(59,130,246,0.01) 70%, transparent 100%)"
              : "radial-gradient(circle, rgba(147,51,234,0.03) 0%, rgba(37,99,235,0.005) 70%, transparent 100%)",
            bottom: "15%",
            right: "10%",
          }}
        />
      </div>

      {/* ── Layer 3: Optimized Interactive Canvas for Particles and Data Flows ── */}
      <InteractiveNeuralCanvas isDark={isDark} />

      {/* ── Hero Text Content (Stagger Animated) ───────────────────────── */}
      <motion.div
        className="hero-content relative w-full text-center flex flex-col items-center"
        style={{ zIndex: 2 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="hero-badge mb-7 inline-flex items-center gap-2.5 px-5 py-2 rounded-full"
          style={{
            border: "1px solid var(--border)",
            background: "var(--bg)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
              animation: "pulse-dot 2s ease-in-out infinite",
            }}
          />
          <span
            className="text-[11px] font-black tracking-[0.22em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            AI-Powered Digital Agency
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="hero-content"
          style={{
            fontSize: "var(--hero-h1-size, clamp(3rem, 7vw, 6.5rem))",
            fontWeight: 800,
            color: "var(--text)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginTop: "4px",
            textAlign: "center",
          }}
        >
          We Build Intelligent
          <br />
          <span
            className="block text-transparent bg-clip-text"
            style={{
              backgroundImage: isDark
                ? "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)"
                : "linear-gradient(135deg, #E83E8C 0%, #1D4ED8 100%)", // Matches the pink-to-blue gradient in logo
            }}
          >
            Digital Systems
          </span>
          That Scale Your Business
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="hero-sub"
          style={{
            marginTop: "var(--hero-sub-mt, 24px)",
            fontSize: "var(--hero-sub-size, clamp(16px, 1.4vw, 19px))",
            color: "var(--text-muted)",
            maxWidth: "600px",
            lineHeight: 1.8,
          }}
        >
          From high-performance software engineering to intelligent AI-driven automation, we engineer next-generation platforms that scale.
        </motion.p>

        {/* CTA */}
        <motion.div variants={itemVariants} className="hero-cta" style={{ marginTop: "var(--hero-cta-mt, 40px)" }}>
          <Link
            to="/consultation"
            className="cta-btn"
            style={{ display: "inline-flex" }}
          >
            FREE CONSULTATION
            <div className="cta-arrow">
              <ChevronRight
                style={{ width: "14px", height: "14px" }}
                strokeWidth={2.5}
              />
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Scroll Indicator ────────────────────────────────────────────── */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float"
        style={{ zIndex: 2, opacity: 0.5 }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.25em]"
          style={{ color: "var(--text-subtle)" }}
        >
          Scroll
        </span>
        <ArrowDown
          className="w-4 h-4"
          style={{ color: "var(--text-subtle)" }}
          strokeWidth={2}
        />
      </div>

      {/* ── Micro-Animations CSS ───────────────────────────────────────── */}
      <style>
        {`
          @keyframes pulse-dot {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.35); opacity: 1; box-shadow: 0 0 12px var(--accent); }
          }
          @keyframes drift-1 {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(35px, -25px) scale(1.08); }
          }
          @keyframes drift-2 {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(-25px, 35px) scale(1.05); }
          }
          .animate-drift-1 {
            animation: drift-1 18s ease-in-out infinite;
          }
          .animate-drift-2 {
            animation: drift-2 22s ease-in-out infinite;
          }
          .animate-float {
            animation: float-scroll 2.5s ease-in-out infinite;
          }
          @keyframes float-scroll {
            0%, 100% { transform: translate(-50%, 0); }
            50% { transform: translate(-50%, 8px); }
          }
          @media (max-width: 768px) {
            .hero-content {
              --hero-h1-size: clamp(2rem, 8vw, 3rem) !important;
              --hero-sub-size: clamp(14px, 3.8vw, 16px) !important;
              --hero-sub-mt: 16px !important;
              --hero-cta-mt: 24px !important;
            }
            .hero-badge {
              margin-bottom: 16px !important;
              padding: 6px 14px !important;
            }
          }
        `}
      </style>
    </section>
  );
}

// ── SUB-COMPONENT: Interactive Canvas Particle Loop ───────────────────
function InteractiveNeuralCanvas({ isDark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Explicit fail-safe dimensions initialization
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 45; // Subtle enterprise network density
    const connectionDistance = 115;
    const mouse = { x: null, y: null, targetX: null, targetY: null };

    // High-DPI screen sharp scaling support
    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      // Fallback to window dimensions if container bounding box is empty during layout pass
      const w = rect.width || window.innerWidth;
      const h = rect.height || window.innerHeight;

      width = canvas.width = w * dpr;
      height = canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      width = w;
      height = h;
    };

    // Initialize nodes
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.9),
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.5 + 1.2,
      });
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = null;
      mouse.targetY = null;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    handleResize();

    // Traveling packet flows along connections
    let packets = [];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation (LERP) for high-end organic flow
      if (mouse.targetX !== null && mouse.targetY !== null) {
        if (mouse.x === null) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.08;
          mouse.y += (mouse.targetY - mouse.y) * 0.08;
        }
      } else {
        mouse.x = null;
        mouse.y = null;
      }

      // Update and draw nodes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce nodes off boundaries gently and clamp inside safely
        const pad = 10;
        if (p.x < pad || p.x > width - pad) {
          p.vx *= -1;
          p.x = Math.max(pad, Math.min(p.x, width - pad));
        }
        if (p.y < pad || p.y > height - pad) {
          p.vy *= -1;
          p.y = Math.max(pad, Math.min(p.y, height - pad));
        }

        // Subtle mouse pull (attraction force)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 170) {
            const force = (170 - dist) / 170;
            p.x += (dx / dist) * force * 0.22;
            p.y += (dy / dist) * force * 0.22;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(156, 163, 175, 0.4)" : "rgba(100, 116, 139, 0.35)";
        ctx.fill();
      });

      // Connecting lines
      const activeConnections = [];

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark
              ? `rgba(59, 130, 246, ${alpha})`
              : `rgba(37, 99, 235, ${alpha * 0.85})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();

            // Store active pairs for potential data packet transit
            activeConnections.push({ p1, p2, dist });
          }
        }
      }

      // Periodically spawn packet flows
      if (activeConnections.length > 0 && packets.length < 5 && Math.random() < 0.02) {
        const conn = activeConnections[Math.floor(Math.random() * activeConnections.length)];
        const swap = Math.random() > 0.5;
        packets.push({
          from: swap ? conn.p1 : conn.p2,
          to: swap ? conn.p2 : conn.p1,
          progress: 0,
          speed: 0.015 + Math.random() * 0.015,
        });
      }

      // Render packet beams
      packets = packets.filter((pkt) => {
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) return false;

        const x = pkt.from.x + (pkt.to.x - pkt.from.x) * pkt.progress;
        const y = pkt.from.y + (pkt.to.y - pkt.from.y) * pkt.progress;

        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(96, 165, 250, 0.95)" : "rgba(37, 99, 235, 0.9)";

        ctx.shadowBlur = isDark ? 6 : 0;
        ctx.shadowColor = isDark ? "rgba(96, 165, 250, 0.9)" : "transparent";
        ctx.fill();
        ctx.shadowBlur = 0; // Clear shadow properties

        return true;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}