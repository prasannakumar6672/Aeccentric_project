import React, { useEffect, useState, useRef } from 'react';
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';

const ProjectCard = ({ image, title, description, tags, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-sm transition-all duration-1000 flex-shrink-0 w-[380px] sm:w-[440px] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      style={{ transitionDelay: `${index * 100}ms` }}
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
                <span
                  key={i}
                  className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-[0.15em] border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{title}</h3>
            <p className="text-white/70 text-[14px] font-medium mb-6 leading-relaxed line-clamp-2">{description}</p>
            <button className="flex items-center gap-2 text-white font-black text-[13px] tracking-widest uppercase group/btn">
              View Project
              <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Static Footer */}
      <div className="p-8 border-t border-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-[18px] font-black text-[#111827] group-hover:text-[#2563EB] transition-colors duration-300 tracking-tight">
              {title}
            </h3>
            <p className="text-[12px] font-bold text-[#64748b] uppercase tracking-[0.1em] mt-1 opacity-60">
              {tags[0]} â€¢ {tags[1]}
            </p>
          </div>
          <div className="w-11 h-11 rounded-full border-2 border-gray-100 flex items-center justify-center text-[#111827] group-hover:bg-[#111827] group-hover:text-white group-hover:border-[#111827] transition-all duration-500">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A digital commerce solution optimizing online sales for retail business owners. Streamlined orders and inventory efficiently.",
      tags: ["E-Commerce", "Retail", "Full-Stack"],
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200",
    },
    {
      title: "Academic Management System",
      description: "Platform for managing student records and academic operations. Improved communication between faculty, students, and administration.",
      tags: ["EdTech", "Management", "Web App"],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200",
    },
    {
      title: "Agro Application",
      description: "Smart agriculture platform to digitize operations and improve accessibility. Features a user-friendly design and practical business tools.",
      tags: ["AgriTech", "Mobile App", "Agriculture"],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    },
    {
      title: "Inventory Management",
      description: "Inventory & warehouse management solution providing real-time stock visibility and improving operational efficiency.",
      tags: ["Automation", "ERP", "Logistics"],
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
    },
    {
      title: "Enterprise Productivity",
      description: "Cloud-based scalable architecture for business operations, focusing on industry-focused digital transformation.",
      tags: ["Enterprise", "Cloud", "SMEs"],
      image: "https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=1200",
    },
    {
      title: "Custom Software",
      description: "Tailored full-stack application development demonstrating capabilities in business automation and scalable architecture.",
      tags: ["Custom App", "Scalable", "Startups"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    },
  ];

  const SCROLL_AMOUNT = 460;

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: 'smooth' });
  };

  const onScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    return () => el?.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="w-full py-24 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16">
          <div className="max-w-[640px]">
            <div className="inline-block px-4 py-1.5 rounded-full bg-slate-50 border border-gray-100 shadow-sm text-[#64748b] text-[11px] font-black tracking-widest uppercase mb-6">
              Our Recent Work
            </div>
            <h2 className="text-[40px] sm:text-[52px] font-black text-[#111827] leading-[1.05] tracking-tight mb-5">
              Built to outlast<br />the brief.
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#64748b] font-semibold leading-relaxed">
              Where bold ideas meet ruthless execution â€” projects that move metrics, not just pixels.
            </p>
          </div>

          {/* Nav arrows */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous projects"
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${canScrollLeft
                ? 'border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next projects"
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${canScrollRight
                ? 'border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal scroll track */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-6 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
          {projects.map((project, index) => (
            <ProjectCard key={index} index={index} {...project} />
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-8 h-[2px] bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#111827] rounded-full transition-all duration-300"
            style={{
              width: scrollRef.current
                ? `${((scrollRef.current.scrollLeft + scrollRef.current.clientWidth) / scrollRef.current.scrollWidth) * 100}%`
                : '33%',
            }}
          />
        </div>

        {/* Footer CTA */}
        <div className="mt-20 flex justify-center">
          <button className="inline-flex items-center gap-4 text-[#111827] font-black text-[15px] tracking-widest uppercase hover:text-[#2563EB] transition-all duration-300 group">
            Explore All Case Studies
            <div className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center group-hover:border-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Portfolio;