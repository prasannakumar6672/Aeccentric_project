import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [servicesOpen, setServicesOpen] = useState(false);

  const services = [
    { name: "Web Engineering", href: "/services/web-engineering" },
    { name: "AI Orchestration", href: "/services/ai-orchestration" },
    { name: "Brand Identity", href: "/services/brand-identity" },
    { name: "Growth Systems", href: "/services/growth-systems" },
    { name: "3D Fabrication", href: "/services/3d-fabrication" },
  ];

  const getHref = (item) => {
    if (item === 'Services') return '#services';
    return `#${item.toLowerCase().replace(' ', '-')}`;
  };

  return (
    <nav className="fixed top-6 left-0 right-0 w-full z-[100] flex justify-center px-6 pointer-events-none">
      <div className="w-full max-w-[1300px] h-[80px] px-10 flex items-center justify-between bg-white rounded-[12px] pointer-events-auto shadow-sm border border-gray-200">

        {/* Logo */}
        <Link to="/" className="flex items-center cursor-pointer shrink-0">
          <img
            src="/logo.png"
            alt="Aeccentric Logo"
            className="h-[56px] w-auto object-contain mix-blend-multiply brightness-[1.1] contrast-[1.2] hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* Center Links */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-12 font-semibold text-[16px] text-[#111827]">
          {['Services', 'Work', 'Process', 'Resources', 'About us'].map((item, i) => {
            const hasChevron = ['Services', 'Work', 'Resources'].includes(item);
            const isServices = item === 'Services';

            return (
              <div
                key={i}
                className="relative py-4"
                onMouseEnter={() => isServices && setServicesOpen(true)}
                onMouseLeave={() => isServices && setServicesOpen(false)}
              >
                <a
                  href={getHref(item)}
                  className="flex items-center gap-2 hover:text-[#2F5BFF] transition-colors duration-200"
                >
                  {item}
                  {hasChevron && (
                    <ChevronDown
                      className={`w-[18px] h-[18px] stroke-[2.5px] transition-transform duration-300 ${isServices && servicesOpen ? 'rotate-180' : ''}`}
                    />
                  )}
                </a>

                {/* Services Dropdown */}
                {isServices && (
                  <div
                    className={`absolute top-full left-0 pt-2 transition-all duration-200 ${servicesOpen
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="w-[220px] bg-white rounded-[12px] border border-gray-200 shadow-[0_12px_40px_rgba(15,23,42,0.1)] py-3">
                      {services.map((service, si) => (
                        <Link
                          key={si}
                          to={service.href}
                          onClick={() => setServicesOpen(false)}
                          className={`block px-5 py-[10px] text-[15px] font-medium transition-colors duration-150 hover:text-[#2F5BFF] hover:bg-gray-50 ${si === 0 ? 'text-[#2F5BFF]' : 'text-[#374151]'}`}
                        >
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right CTA */}
        <div className="flex items-center shrink-0">
          <button className="hidden sm:flex items-center justify-center min-w-[190px] h-[54px] bg-[#0B1220] text-white border border-[#1E293B] rounded-[6px] font-semibold text-[15px] tracking-[-0.01em] hover:bg-[#111C31] transition-all duration-300 shadow-[0_8px_30px_rgba(15,23,42,0.18)]">
            Free Consultation
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;