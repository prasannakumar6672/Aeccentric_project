import React from "react";
import {
  FaXTwitter,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa6";

const Footer = () => {
  const navColumns = [
    {
      heading: "Services",
      links: [
        "AI Automation Systems",
        "Full-Stack Development",
        "Growth Marketing",
        "Brand Identity Design",
        "UI/UX Engineering",
        "3D Printing & Prototyping",
      ],
    },
    {
      heading: "Company",
      links: [
        "About Us",
        "Careers",
        "Blog",
        "Resources",
      ],
    },
    {
      heading: "Connect",
      links: [
        "hello@aeccentric.com",
        "LinkedIn",
        "Instagram",
      ],
    },
  ];

  const socials = [
    { icon: <FaXTwitter size={15} />, href: "#" },
    { icon: <FaLinkedin size={15} />, href: "#" },
    { icon: <FaYoutube size={16} />, href: "#" },
    { icon: <FaInstagram size={15} />, href: "#" },
  ];

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #020617 0%, #050816 60%, #02040B 100%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(47,91,255,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-[1350px] mx-auto px-8 sm:px-12 pt-28 pb-12">

        {/* Top Grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-20 pb-20"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >

          {/* Left Branding */}
          <div className="lg:col-span-4">

            {/* Logo */}
            <div className="flex items-center gap-4 mb-8">

              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(47,91,255,0.18), rgba(91,127,255,0.08))",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span className="text-white font-black text-[18px]">
                  A
                </span>
              </div>

              <div>
                <h2 className="text-white font-black text-[22px] tracking-tight">
                  AECCENTRIC
                </h2>

                <p className="text-[11px] uppercase tracking-[0.28em] text-white/30 mt-1">
                  AI Powered Systems
                </p>
              </div>

            </div>

            {/* Description */}
            <p className="text-[15px] leading-[1.9] text-white/40 max-w-[360px]">
              We engineer scalable AI ecosystems, automation systems,
              high-performance applications, and cinematic digital experiences
              for modern businesses.
            </p>

            {/* Socials */}
            <div className="flex gap-4 mt-10">

              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {s.icon}
                </a>
              ))}

            </div>
          </div>

          {/* Right Links */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-14">

            {navColumns.map((col, ci) => (
              <div key={ci}>

                <h4 className="text-[12px] font-black uppercase tracking-[0.28em] text-white mb-8">
                  {col.heading}
                </h4>

                <ul className="space-y-5">

                  {col.links.map((link, li) => (
                    <li key={li}>

                      <a
                        href="#"
                        className="text-[15px] text-white/40 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                      >
                        {link}
                      </a>

                    </li>
                  ))}

                </ul>
              </div>
            ))}

          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10">

          {/* Policy Links */}
          <div className="flex flex-wrap items-center gap-8">

            {["Privacy Policy", "Terms & Conditions"].map((item, i) => (
              <a
                key={i}
                href="#"
                className="text-[13px] text-white/25 hover:text-white/60 transition-all duration-300"
              >
                {item}
              </a>
            ))}

          </div>

          {/* Copyright */}
          <p className="text-[13px] text-white/25 tracking-wide">
            © 2026 AECCENTRIC. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;