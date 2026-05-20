import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

const Consultation = () => {
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => setCalendlyLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col relative overflow-hidden transition-colors duration-500">

      {/* Spacer to guarantee content starts below fixed Navbar */}
      <div className="h-[120px] lg:h-[220px] w-full shrink-0" />

      {/* Background Glows for Premium Look */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[var(--accent)] opacity-[0.05] blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />

      {/* ── Page Header ── */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 w-full relative z-10 mb-16 lg:mb-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] shadow-sm mb-10">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
          <span className="text-[12px] uppercase tracking-[0.25em] font-black text-[var(--text)]">
            Direct Engineering Access
          </span>
        </div>

        <h1 className="w-full text-center text-[44px] sm:text-[58px] lg:text-[72px] font-black text-[var(--text)] leading-[1.1] tracking-tight mb-8">
          Schedule Your <br className="hidden sm:block" />
          <span className="text-[var(--accent)]">Free Strategy Session</span>
        </h1>

        <p
          className="text-center text-[18px] sm:text-[22px] text-[var(--text-muted)] font-medium leading-relaxed max-w-[800px] mx-auto"
        >
          Book a focused 30-minute deep dive with our lead engineers.
          Get expert technical advice, validate your roadmap, and scope your project's potential.
        </p>
      </div>

      {/* Page wrapper — centres the card vertically & horizontally */}
      <div className="flex-1 flex items-start justify-center px-4 relative z-10 pb-20">

        {/* THE CARD — mirrors Axe Automation exactly */}
        <div
          className="w-full flex flex-col lg:flex-row bg-[var(--bg-card)] rounded-[32px] overflow-hidden shadow-[var(--shadow-lg)] border border-[var(--border)]"
          style={{ maxWidth: 1000 }}
        >

          {/* ═══════════════════════════
              LEFT INFO PANEL
          ═══════════════════════════ */}
          <div className="w-full lg:w-[400px] shrink-0 border-b lg:border-b-0 lg:border-r border-[var(--border)] p-10 sm:p-14 flex flex-col bg-[var(--bg-secondary)]/30">

            {/* Logo */}
            <div>
              <img
                src="/logo.png"
                alt="AECCENTRIC"
                className="h-16 w-auto object-contain dark:invert transition-all"
              />
            </div>

            <div className="flex-1 flex flex-col justify-center py-10">
              {/* Brand */}
              <p className="text-[13px] font-black text-[var(--accent)] tracking-[0.3em] mb-4 uppercase">
                Aeccentric
              </p>

              {/* Session title */}
              <h2 className="text-[30px] sm:text-[34px] lg:text-[28px] xl:text-[32px] font-black text-[var(--text)] leading-[1.1] tracking-tight mb-8 break-words">
                Technical Discovery Call
              </h2>

              {/* Duration */}
              <div className="flex items-center gap-3 text-[var(--text)] mb-10 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-full w-fit shadow-sm">
                <Clock size={16} className="text-[var(--text-muted)]" />
                <span className="text-[15px] font-black tracking-tight">30 Minute Session</span>
              </div>

              {/* Intro line */}
              <p className="text-[16px] text-[var(--text-muted)] font-medium mb-6">
                During this session, we will:
              </p>

              {/* Bullet list */}
              <ul className="space-y-4">
                {[
                  "Audit your current technology stack",
                  "Identify high-impact AI opportunities",
                  "Map out custom automation workflows",
                  "Provide a scalable technical roadmap",
                  "Scoping for timelines & development costs",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <div className="mt-[6px] w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                    <span className="text-[15px] text-[var(--text)] font-bold leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Privacy link pinned to bottom */}
            <div className="pt-10 border-t border-[var(--border)]">
              <p className="text-[14px] text-[var(--text-muted)] font-medium leading-relaxed mb-6">
                No sales pressure. Just engineering expertise to help you build the right product.
              </p>
              <a href="/privacy" className="text-[13px] font-black text-[var(--accent)] tracking-wider uppercase hover:opacity-80 transition-opacity">
                Privacy Policy & Terms
              </a>
            </div>
          </div>

          {/* ═══════════════════════════
              RIGHT: CALENDLY
          ═══════════════════════════ */}
          <div className="flex-1 relative min-h-[720px] bg-white">

            {!calendlyLoaded && (
              <div className="absolute inset-0 bg-[var(--bg-card)] z-20 flex flex-col items-center justify-center gap-5">
                <div className="w-12 h-12 rounded-full border-[5px] border-[var(--accent)] border-t-transparent animate-spin" />
                <p className="text-[15px] font-black text-[var(--text)]">Initializing Calendar...</p>
              </div>
            )}

            <div
              className="calendly-inline-widget w-full"
              data-url="https://calendly.com/237r1a6672-cmrtc/30min?hide_event_type_details=1&hide_gdpr_banner=1"
              style={{ minWidth: 320, height: 720 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultation;