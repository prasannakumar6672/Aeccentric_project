import React, { useEffect } from 'react';
import Footer from './Footer';
import Contact from '../components/Contact';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const ServiceLayout = ({ title, subtitle, description, points, image, accent, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      
      <main className="pt-40 pb-20">
        <div className="max-w-[1350px] mx-auto px-8 sm:px-12">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-3 mb-12 text-[13px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <a href="/" className="hover:text-[#2F5BFF] transition-colors flex items-center gap-2">
              <ArrowLeft size={14} /> Home
            </a>
            <ChevronRight size={14} />
            <span className="text-[#111827]">Services</span>
            <ChevronRight size={14} />
            <span style={{ color: accent }}>{title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
            <div>
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-gray-100 bg-white shadow-sm mb-10">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />
                <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#111827]">
                  {subtitle}
                </span>
              </div>

              <h1 className="text-[58px] sm:text-[76px] lg:text-[88px] font-black text-[#111827] leading-[0.95] tracking-[-0.05em] mb-10">
                {title}.
              </h1>

              <p className="text-[20px] sm:text-[24px] text-[#64748b] font-medium leading-relaxed max-w-[600px] mb-12">
                {description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mb-16">
                {points.map((point, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                    <span className="text-[15px] font-bold text-[#111827] tracking-tight">{point}</span>
                  </div>
                ))}
              </div>

              <button
                className="group flex items-center gap-6 bg-[#0B1A2B] text-white px-10 h-[70px] rounded-2xl font-black tracking-[0.2em] text-[14px] hover:scale-[1.05] transition-all duration-500 shadow-xl"
                style={{ boxShadow: `0 10px 30px -10px ${accent}40` }}
              >
                START YOUR PROJECT
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:border-white/60">
                  <ChevronRight size={20} />
                </div>
              </button>
            </div>

            <div className="relative group">
              <div 
                className="absolute -inset-4 rounded-[48px] blur-2xl opacity-20 transition-all duration-700 group-hover:opacity-40"
                style={{ backgroundColor: accent }}
              />
              <div className="relative rounded-[40px] overflow-hidden border border-gray-100 shadow-2xl">
                <img src={image} alt={title} className="w-full h-full object-cover aspect-[4/5] scale-105 group-hover:scale-100 transition-transform duration-1000" />
              </div>
            </div>
          </div>

          {/* Detailed Content Section */}
          <div className="py-20 border-t border-gray-100">
            {children}
          </div>

        </div>
      </main>

      <Contact />
      <Footer />
    </div>
  );
};

export default ServiceLayout;
