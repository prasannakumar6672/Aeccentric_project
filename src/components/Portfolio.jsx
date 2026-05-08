import React, { useEffect, useState, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

const ProjectCard = ({ image, title, description, tags, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-sm transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Image Area */}
      <div className="relative aspect-[16/11] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2B] via-[#0B1A2B]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
          <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, i) => (
                <span key={i} className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-[0.15em] border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-3xl font-black text-white mb-3 tracking-tight">{title}</h3>
            <p className="text-white/70 text-[15px] font-medium mb-6 leading-relaxed line-clamp-2">{description}</p>
            <button className="flex items-center gap-2 text-white font-black text-[14px] tracking-widest uppercase group/btn">
              View Project 
              <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Static Footer Info */}
      <div className="p-8 sm:p-10 border-t border-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-[20px] font-black text-[#111827] group-hover:text-[#2F5BFF] transition-colors duration-300 tracking-tight">
              {title}
            </h3>
            <p className="text-[13px] font-bold text-[#64748b] uppercase tracking-[0.1em] mt-1 opacity-60">
              {tags[0]} • {tags[1]}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-gray-50 flex items-center justify-center text-[#111827] group-hover:bg-[#111827] group-hover:text-white group-hover:border-[#111827] transition-all duration-500 shadow-sm">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const projects = [
    {
      title: "Luxury E-commerce",
      description: "A high-performance digital shopping experience optimized for elite conversion rates and aesthetic excellence.",
      tags: ["Development", "UX Optimization", "Next.js"],
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "Real Estate Portal",
      description: "Interactive property management system with real-time map integration and dynamic search capabilities.",
      tags: ["Web App", "UI/UX", "API Design"],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "AI Flow Automator",
      description: "Enterprise-grade workflow automation platform utilizing LLMs to streamline cross-departmental operations.",
      tags: ["AI", "Automation", "n8n"],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "Gourmet Branding",
      description: "Comprehensive digital identity redesign for a Michelin-star establishment, focusing on reservation growth.",
      tags: ["Branding", "Motion", "UX"],
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "Fintech Analytics",
      description: "Complex data visualization dashboard providing real-time insights into global financial transactions.",
      tags: ["Fintech", "Dashboard", "React"],
      image: "https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "SaaS Launch System",
      description: "Strategic landing page architecture designed to maximize lead capture and product-led growth.",
      tags: ["UI/UX", "Frontend", "Growth"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
    }
  ];

  return (
    <section className="w-full section-padding bg-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-[800px] mb-24">
          <div className="inline-block px-4 py-1.5 rounded-full bg-slate-50 border border-gray-100 shadow-sm text-[#64748b] text-[12px] font-black tracking-widest uppercase mb-8">
            OUR RECENT WORK
          </div>
          <h2 className="text-[44px] sm:text-[60px] font-black text-[#111827] mb-8 leading-[1.05] tracking-tight">
            Showcasing Impactful <br /> Digital Experiences
          </h2>
          <p className="text-[18px] sm:text-[22px] text-[#64748b] font-semibold leading-relaxed max-w-[700px]">
            A curated selection of projects where design, technology, and strategy merge to deliver exceptional business results.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-14">
          {projects.map((project, index) => (
            <ProjectCard 
              key={index}
              index={index}
              {...project}
            />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-28 flex justify-center">
          <button className="inline-flex items-center gap-4 text-[#111827] font-black text-[16px] tracking-widest uppercase hover:text-[#2F5BFF] transition-all duration-300 group">
            Explore All Case Studies
            <div className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center group-hover:border-[#2F5BFF] group-hover:bg-[#2F5BFF] group-hover:text-white transition-all duration-300">
               <ArrowUpRight className="w-6 h-6" />
            </div>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Portfolio;
