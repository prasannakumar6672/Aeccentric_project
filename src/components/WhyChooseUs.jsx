import React from 'react';
import { ShieldCheck, Zap, TrendingUp, Users } from 'lucide-react';

const WhyChooseUs = () => {
  const points = [
    {
      icon: ShieldCheck,
      title: "Security & Trust",
      description: "Enterprise-grade security protocols for all AI integrations and data handling systems."
    },
    {
      icon: Zap,
      title: "Extreme Speed",
      description: "Our high-performance systems are engineered for sub-second responses and lightning-fast execution."
    },
    {
      icon: TrendingUp,
      title: "ROI Focused",
      description: "We don't just build systems; we engineer revenue multipliers that impact your bottom line."
    },
    {
      icon: Users,
      title: "Expert Partners",
      description: "Consider us an extension of your team, providing 24/7 technical oversight and growth strategy."
    }
  ];

  return (
    <section className="relative w-full py-24 lg:py-40 bg-white overflow-hidden">
      <div className="max-w-[1350px] mx-auto px-6 sm:px-10 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#E5E7EB] bg-white shadow-sm mb-10">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2F5BFF]" />
              <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#111827]">
                The Aeccentric Advantage
              </span>
            </div>

            <h2 className="text-[52px] sm:text-[68px] font-black text-[#111827] mb-8 leading-[0.95] tracking-[-0.05em]">
              Why Global Leaders <br /> Choose Our Systems.
            </h2>
            <p className="text-[18px] sm:text-[21px] text-[#64748b] font-medium leading-relaxed max-w-[550px] mb-12">
              We combine deep technical expertise with a clinical focus on business growth to deliver systems that traditional agencies simply can't build.
            </p>
            
            <button
              className="mt-4 group flex items-center gap-4 bg-[#0B1A2B] text-white font-bold tracking-widest transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#122240]"
              style={{
                padding: "18px 40px",
                fontSize: "14px",
                borderRadius: "14px",
                boxShadow: "0 4px 0 0 #2F5BFF, 0 8px 28px -4px rgba(47,91,255,0.4)",
              }}
            >
              DISCOVER OUR EDGE
              <div
                className="flex items-center justify-center rounded-full border border-white/40 transition-all duration-300 group-hover:border-white/80 group-hover:translate-x-1"
                style={{ width: "30px", height: "30px" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </button>
          </div>

          {/* Right: Points Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {points.map((point, index) => (
              <div key={index} className="group relative overflow-hidden rounded-[32px] border border-[#E5E7EB] bg-[#FCFCFD] p-10 transition-all duration-500 hover:-translate-y-2 hover:border-[#2F5BFF] hover:shadow-[0_20px_50px_rgba(47,91,255,0.12)]">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center mb-8 group-hover:bg-[#2F5BFF] group-hover:border-[#2F5BFF] group-hover:text-white transition-all duration-500 text-[#111827]">
                  <point.icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <h3 className="text-[22px] font-black tracking-[-0.03em] text-[#111827] mb-4 group-hover:text-[#2F5BFF] transition-colors duration-300">
                  {point.title}
                </h3>
                <p className="text-[16px] text-[#64748b] font-medium leading-[1.8]">
                  {point.description}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
