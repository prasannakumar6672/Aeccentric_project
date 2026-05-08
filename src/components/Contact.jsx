import React from "react";
import { ChevronRight } from "lucide-react";

const Contact = () => {
  return (
    <section className="relative w-full pt-28 lg:pt-40 pb-64 lg:pb-80 bg-white overflow-hidden px-4 sm:px-8">

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-blue-100/30 via-indigo-100/20 to-purple-100/30 blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">

        {/* Header Content */}
        <div className="animate-reveal flex flex-col items-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#E5E7EB] bg-white shadow-sm mb-10">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2F5BFF]" />

            <span className="text-[12px] font-black tracking-[0.2em] text-[#111827] uppercase">
              Start Your Transformation
            </span>
          </div>

          {/* Heading */}
          <h2 className="mx-auto max-w-[1200px] text-[48px] md:text-[72px] lg:text-[88px] font-black text-[#111827] leading-[0.95] tracking-[-0.05em] mb-10 text-center">
            Let’s Build Intelligent <br className="hidden md:block" />
            Systems For Your Business
          </h2>

          {/* Subtext */}
          <p className="mx-auto text-center text-[20px] md:text-[24px] text-gray-500 max-w-[850px] leading-relaxed font-medium mb-20">
            Ready to systemize your success? Click below to book your free
            strategy consultation and explore AI automation solutions tailored
            for your business growth.
          </p>

          {/* CTA */}
          <div className="w-full flex justify-center mb-20">

            <button
              onClick={() =>
                window.open("https://calendly.com/your-link", "_blank")
              }
              className="group relative overflow-hidden bg-[#0B1A2B] text-white px-12 h-[76px] rounded-full font-black tracking-[0.2em] text-[16px] hover:scale-[1.04] transition-all duration-500 shadow-[0_25px_60px_rgba(47,91,255,0.18)] flex items-center justify-center gap-4"
            >

              {/* Hover Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#2F5BFF] to-[#5B7FFF] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Button Content */}
              <span className="relative z-10 flex items-center gap-4">

                BOOK A FREE STRATEGY CALL

                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-[#0B1A2B] transition-all duration-500">

                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-500" />

                </div>

              </span>
            </button>
          </div>

          {/* Bottom Hint */}
          <div className="flex items-center gap-3 opacity-60">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />

            <span className="text-[12px] font-bold uppercase tracking-[0.25em] text-gray-400">
              Limited consultation slots available
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;