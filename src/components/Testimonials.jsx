import React, { useEffect, useState, useRef } from "react";
import { Quote, Star } from "lucide-react";

const TestimonialCard = ({ quote, author, role, company, image, index }) => {
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
      className={`relative group overflow-hidden rounded-[36px] border border-gray-200 bg-white p-10 sm:p-12 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_35px_80px_rgba(15,23,42,0.08)] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute top-0 right-0 w-[220px] h-[220px] bg-blue-100/40 blur-[90px]" />
      </div>

      {/* Quote Icon */}
      <div className="absolute top-10 right-10 opacity-[0.04] group-hover:opacity-[0.08] transition-all duration-500">
        <Quote size={90} strokeWidth={1.5} />
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1 mb-8 relative z-10">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className="fill-[#2F5BFF] text-[#2F5BFF]" />
        ))}
      </div>

      {/* Review */}
      <p className="text-[20px] sm:text-[22px] leading-[1.8] text-[#111827] font-semibold tracking-[-0.02em] mb-10 relative z-10">
        "{quote}"
      </p>

      {/* Bottom */}
      <div className="flex items-center gap-5 relative z-10">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
          <img src={image} alt={author} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-[18px] font-black text-[#111827]">{author}</h4>
          <p className="text-[12px] uppercase tracking-[0.18em] text-gray-400 font-bold mt-1">
            {role} • {company}
          </p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote: "AECCENTRIC completely transformed our scaling strategy. Their AI automation systems saved us over 20 hours a week in manual overhead.",
      author: "Sarah Johnson",
      role: "COO",
      company: "TechFlow Solutions",
      image: "https://i.pravatar.cc/300?img=32",
    },
    {
      quote: "The branding and UI design they delivered was world-class. Our conversion rates increased by 45% within just 30 days of launch.",
      author: "Marcus Chen",
      role: "Founder",
      company: "Alpha Systems",
      image: "https://i.pravatar.cc/300?img=12",
    },
    {
      quote: "Their team's expertise in technical automation is unmatched. They built a custom infrastructure that scales seamlessly with our growth.",
      author: "Elena Rodriguez",
      role: "CTO",
      company: "Nexus Dynamics",
      image: "https://i.pravatar.cc/300?img=24",
    },
  ];

  return (
    <section className="relative w-full py-24 lg:py-40 mt-20 bg-white overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-r from-blue-100/20 via-indigo-100/10 to-purple-100/20 blur-[140px]" />

      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-20 items-start">

          {/* LEFT SIDE — Cards */}
          <div className="flex flex-col gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} index={index} {...testimonial} />
            ))}
          </div>

          {/* RIGHT SIDE — Sticky Text */}
          <div className="sticky top-32">

            {/* Tag */}
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#E5E7EB] bg-white shadow-sm mb-10">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2F5BFF]" />
              <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#111827]">
                Client Reviews
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-[52px] sm:text-[72px] lg:text-[88px] font-black text-[#111827] leading-[0.92] tracking-[-0.06em] mb-10">
              Trusted By <br />
              Fast Growing <br />
              Brands.
            </h2>

            {/* Description */}
            <p className="text-[20px] sm:text-[22px] text-gray-500 leading-[1.8] font-medium max-w-[550px] mb-16">
              From AI automation to premium digital systems, we help ambitious
              companies scale operations, improve conversion, and dominate digitally.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-16">
              <div>
                <h3 className="text-[44px] font-black text-[#111827]">50+</h3>
                <p className="text-gray-400 uppercase tracking-[0.16em] text-[12px] font-bold mt-2">
                  Projects Delivered
                </p>
              </div>
              <div>
                <h3 className="text-[44px] font-black text-[#111827]">98%</h3>
                <p className="text-gray-400 uppercase tracking-[0.16em] text-[12px] font-bold mt-2">
                  Client Satisfaction
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;