import React from "react";
import { ChevronRight } from "lucide-react";

const phases = [
  {
    phase: "Phase 1",
    title: "Discovery & Strategy",
    description:
      "We analyze your business operations, workflows and digital ecosystem to identify growth bottlenecks, automation opportunities and scalable system architecture.",
  },
  {
    phase: "Phase 2",
    title: "Systems Buildout",
    description:
      "Our team engineers scalable websites, AI automations, CRM systems and operational workflows tailored specifically for your business infrastructure.",
  },
  {
    phase: "Phase 3",
    title: "Implementation",
    description:
      "We integrate tools, deploy workflows, optimize performance and ensure every digital system functions seamlessly across your organization.",
  },
  {
    phase: "Phase 4",
    title: "Optimization & Growth",
    description:
      "We continuously monitor analytics, improve systems, optimize conversions and scale automation processes for long-term business growth.",
  },
];

const Approach = () => {
  return (
    <section className="relative w-full py-24 lg:py-40 bg-[#F8FAFC] overflow-hidden">

      {/* Background Glows */}
      <div className="absolute top-[-150px] left-[-120px] w-[400px] h-[400px] bg-[#2F5BFF]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-150px] right-[-120px] w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full" />

      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 relative z-10">
        <div className="rounded-[40px] border border-[#E5E7EB] bg-white shadow-[0_10px_60px_rgba(15,23,42,0.04)] p-8 md:p-12 xl:p-16">

          {/* ── TOP SECTION ──────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

            {/* LEFT */}
            <div className="w-full">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#E5E7EB] bg-white shadow-sm mb-8">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2F5BFF]" />
                <span className="text-[12px] tracking-[0.2em] font-black uppercase text-[#111827]">
                  Our Approach
                </span>
              </div>

              <h2 className="text-[40px] sm:text-[52px] xl:text-[58px] leading-[1.05] font-black tracking-[-0.04em] text-[#111827]">
                We Build <br />
                <span className="relative inline-block mt-3">
                  <span className="relative z-10 text-white px-4">Intelligent Systems</span>
                  <div className="absolute inset-0 bg-[#2F5BFF] rounded-2xl -rotate-1" />
                </span>
                <br />For Modern Growth
              </h2>

              <p className="mt-8 text-[17px] leading-[1.9] text-[#64748B] font-medium">
                Our process combines strategy, engineering, automation and
                performance optimization to create scalable digital systems
                that accelerate growth and operational efficiency.
              </p>

              <button
                className="mt-10 group flex items-center gap-4 bg-[#0B1A2B] text-white font-bold tracking-widest transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#122240]"
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

            {/* RIGHT IMAGE */}
            <div className="w-full relative">
              <div className="absolute inset-0 bg-[#2F5BFF]/10 blur-[80px] rounded-[40px]" />
              <div className="relative overflow-hidden rounded-[32px] border border-[#E5E7EB] bg-white shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop"
                  alt="Team Meeting"
                  className="w-full h-[420px] lg:h-[480px] xl:h-[500px] object-cover"
                />
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-5 shadow-xl">
                  <p className="text-[13px] font-bold tracking-widest text-[#64748B] uppercase">
                    Workflow Efficiency
                  </p>
                  <div className="mt-2 flex items-end gap-3">
                    <h3 className="text-[34px] font-black text-[#111827]">+240%</h3>
                    <span className="pb-2 text-[#2F5BFF] font-bold">Growth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── PHASE CARDS ──────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">
            {phases.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[32px] border border-[#E5E7EB] bg-[#FCFCFD] p-10 min-h-[260px] transition-all duration-700 hover:-translate-y-2 hover:border-[#2F5BFF] hover:shadow-[0_30px_70px_rgba(47,91,255,0.25)]"
              >
                {/* 
                  Enhanced Hover Background: 
                  A deep blue gradient with a cinematic light flare 
                */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0038FF] via-[#0029BB] to-[#001A7A] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* The "Sheen/Flare" layer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-white/20 blur-[100px] rounded-full rotate-45 transform group-hover:translate-x-[20%] group-hover:translate-y-[20%] transition-transform duration-1000" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Top Section: Badge and Arrow */}
                  <div className="flex items-center justify-between mb-10">
                    <div className="px-5 py-2 rounded-full border border-[#E5E7EB] bg-white shadow-sm transition-all duration-300">
                      <span className="text-[12px] font-black uppercase tracking-[0.1em] text-[#111827]">
                        {item.phase}
                      </span>
                    </div>

                    {/* Long Horizontal White Arrow */}
                    <div className="w-[140px] h-[1px] bg-white opacity-0 group-hover:opacity-100 transition-all duration-700 relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-white rotate-45" />
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-grow">
                    <h3 className="text-[34px] sm:text-[38px] leading-[1.1] font-black tracking-[-0.03em] text-[#111827] group-hover:text-white transition-colors duration-500 mb-6">
                      {item.title}
                    </h3>

                    <p className="text-[17px] leading-[1.8] text-[#64748B] font-medium group-hover:text-white/90 transition-colors duration-500 max-w-[550px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Approach;