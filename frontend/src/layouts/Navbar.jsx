import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sun, Moon, LayoutDashboard, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SERVICES = [
  { name: 'AI Services & Automation', href: '/services/ai-services-and-automation', tag: null },
  { name: 'IT & Product Development', href: '/services/it-product-development', tag: null },
  { name: '3D Printing & Engineering', href: '/services/3d-printing-and-engineering-solutions', tag: null },
  { name: 'Digital Transformation', href: '/services/digital-transformation-services', tag: null },
  { name: 'AI-Powered Manufacturing', href: '/services/ai-powered-manufacturing', tag: null },
];

const WORK = [
  { name: 'Testimonials', href: '/work/testimonials' },
  { name: 'Case Studies', href: '/work/case-studies' },
  { name: 'Resources', href: '/resources' },
];

const ABOUT = [
  { name: 'Company', href: '/about/company' },
  { name: 'Team', href: '/about/team' },
];

/* ── Animation Config ─────────────────────────────────────────── */
const dropdownVariants = {
  initial: { opacity: 0, y: 12, scale: 0.98, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, y: 8, scale: 0.98, filter: 'blur(4px)' },
};

/* ── Mega Panel (Services) ─────────────────────────────────────── */
const ServicesMega = ({ onClose }) => (
  <motion.div
    variants={dropdownVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
    style={{ zIndex: 300 }}
  >
    <div
      className="w-[320px] rounded-[4px] border relative overflow-hidden backdrop-blur-2xl"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
        boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.02) inset',
      }}
    >
      <div className="p-4 flex flex-col gap-2">
        {SERVICES.map((s) => (
          <Link
            key={s.href}
            to={s.href}
            onClick={onClose}
            className="group flex items-center justify-between px-4 py-3 rounded-[2px] transition-all duration-200 hover:bg-[var(--bg-secondary)]"
          >
            <span className="text-[14px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">
              {s.name}
            </span>
            {s.tag && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  background: s.tag === 'Popular' ? 'var(--accent-light)' : '#10B98115',
                  color: s.tag === 'Popular' ? 'var(--accent)' : '#10B981',
                }}
              >
                {s.tag}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  </motion.div>
);

/* ── Compact Panel (Work / About) ─────────────────────────────── */
const CompactPanel = ({ items, onClose }) => (
  <motion.div
    variants={dropdownVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    className="absolute top-full left-0 pt-4"
    style={{ zIndex: 300 }}
  >
    <div
      className="w-[220px] rounded-[4px] border relative overflow-hidden backdrop-blur-2xl"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
        boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.02) inset',
      }}
    >
      <div className="p-4 flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={onClose}
            className="group block px-4 py-3 rounded-[2px] transition-all duration-200 hover:bg-[var(--bg-secondary)]"
          >
            <span className="text-[14px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  </motion.div>
);

/* ── Main Navbar ──────────────────────────────────────────────── */
const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setActiveMenu(null);
    setIsMobileMenuOpen(false);
    setExpandedMenu(null);
  }, [location.pathname]);

  const openMenu = (name) => {
    clearTimeout(closeTimer.current);
    setActiveMenu(name);
  };

  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 140);
  };

  const keepOpen = () => clearTimeout(closeTimer.current);

  const NAV = [
    { name: 'Services', menu: 'Services' },
    { name: 'Work', menu: 'Work' },
    { name: 'About', menu: 'About' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4 px-6 pointer-events-none">
        <div
          className="w-full max-w-[1280px] h-[72px] px-6 flex items-center justify-between pointer-events-auto transition-all duration-500 rounded-[24px]"
          style={{
            background: scrolled
              ? theme === 'dark' ? 'rgba(3,7,18,0.85)' : 'rgba(255,255,255,0.85)'
              : theme === 'dark' ? 'rgba(3,7,18,0.5)' : 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(32px) saturate(200%)',
            WebkitBackdropFilter: 'blur(32px) saturate(200%)',
            border: `1px solid ${scrolled ? 'var(--border)' : 'rgba(128,128,128,0.1)'}`,
            boxShadow: scrolled
              ? '0 12px 40px -12px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.05) inset'
              : '0 8px 32px -8px rgba(0,0,0,0.08)',
          }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <img
              src="/logo.png"
              alt="AECCENTRIC"
              className={`h-[40px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.02] ${theme === 'dark'
                ? 'brightness-[1.2] invert'
                : 'mix-blend-multiply brightness-[1.1] contrast-[1.2]'
                }`}
            />
            <span className="text-[16px] font-black uppercase tracking-wider text-[var(--text)] transition-colors duration-300">
              AECCENTRIC
            </span>
          </Link>

          {/* Center links (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.menu && openMenu(item.menu)}
                onMouseLeave={closeMenu}
              >
                {item.href ? (
                  <Link
                    to={item.href}
                    className="flex items-center px-4 py-2.5 rounded-[12px] text-[14px] font-medium tracking-wide transition-all duration-300 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-[12px] text-[14px] font-medium tracking-wide transition-all duration-300 ${activeMenu === item.menu
                      ? 'text-[var(--text)] bg-[var(--bg-secondary)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]'
                      }`}
                  >
                    {item.name}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${activeMenu === item.menu ? 'rotate-180 text-[var(--text)]' : ''
                        }`}
                    />
                  </button>
                )}

                <AnimatePresence>
                  {activeMenu === 'Services' && item.menu === 'Services' && (
                    <div onMouseEnter={keepOpen} onMouseLeave={closeMenu}>
                      <ServicesMega onClose={() => setActiveMenu(null)} />
                    </div>
                  )}
                  {activeMenu === 'Work' && item.menu === 'Work' && (
                    <div onMouseEnter={keepOpen} onMouseLeave={closeMenu}>
                      <CompactPanel items={WORK} onClose={() => setActiveMenu(null)} />
                    </div>
                  )}
                  {activeMenu === 'About' && item.menu === 'About' && (
                    <div onMouseEnter={keepOpen} onMouseLeave={closeMenu}>
                      <CompactPanel items={ABOUT} onClose={() => setActiveMenu(null)} />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-[12px] flex items-center justify-center transition-all duration-300 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border)] cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Employee Portal (Desktop) */}
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-[14px] bg-gradient-to-r from-[#2563EB] to-[#00C2FF] opacity-0 group-hover:opacity-40 blur-md transition-all duration-500"></div>
              <Link to="/ems-login" className="relative block">
                <button
                  className="hidden sm:flex items-center gap-2 px-6 h-[42px] text-white rounded-[12px] font-semibold text-[14px] tracking-wide transition-all duration-300 group-hover:scale-[1.02] active:scale-[0.98] shadow-[0_2px_10px_-2px_rgba(37,99,235,0.4)] cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1a3ed0 100%)' }}
                >
                  <LayoutDashboard size={16} className="transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110" />
                  Employee Portal
                </button>
              </Link>
            </div>

            {/* Mobile Hamburger toggle (visible below lg) */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="flex lg:hidden w-10 h-10 rounded-[12px] items-center justify-center transition-all duration-300 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border)] shrink-0 cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/45 backdrop-blur-md z-[90] pointer-events-auto"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[85vw] max-w-[320px] bg-[var(--bg-card)] border-l border-[var(--border)] z-[95] shadow-2xl p-6 flex flex-col justify-between pointer-events-auto overflow-y-auto"
            >
              <div className="flex flex-col gap-6 mt-16">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                  <span className="text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                    Navigation Menu
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)] cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Mobile accordion nav list */}
                <div className="flex flex-col gap-2">
                  {NAV.map((item) => {
                    if (item.href) {
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center px-4 py-3 rounded-xl text-[14px] font-bold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)] transition-all"
                        >
                          {item.name}
                        </Link>
                      );
                    }

                    const isExpanded = expandedMenu === item.name;
                    return (
                      <div key={item.name} className="flex flex-col">
                        <button
                          onClick={() => setExpandedMenu(isExpanded ? null : item.name)}
                          className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-[14px] font-bold transition-all cursor-pointer ${isExpanded ? 'text-[var(--text)] bg-[var(--bg-secondary)]' : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]'
                            }`}
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[var(--text)]' : ''}`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                              className="overflow-hidden pl-4 pr-2 flex flex-col gap-1.5 mt-1 border-l border-[var(--border)] ml-4"
                            >
                              {item.menu === 'Services' && SERVICES.map(s => (
                                <Link
                                  key={s.href}
                                  to={s.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center justify-between px-3.5 py-2.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[13px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                                >
                                  <span>{s.name}</span>
                                  {s.tag && (
                                    <span
                                      className="px-1.5 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase tracking-wide shrink-0 ml-2"
                                      style={{
                                        background: s.tag === 'Popular' ? 'var(--accent-light)' : '#10B98115',
                                        color: s.tag === 'Popular' ? 'var(--accent)' : '#10B981',
                                      }}
                                    >
                                      {s.tag}
                                    </span>
                                  )}
                                </Link>
                              ))}
                              {item.menu === 'Work' && WORK.map(w => (
                                <Link
                                  key={w.href}
                                  to={w.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block px-3.5 py-2.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[13px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                                >
                                  {w.name}
                                </Link>
                              ))}
                              {item.menu === 'About' && ABOUT.map(a => (
                                <Link
                                  key={a.href}
                                  to={a.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block px-3.5 py-2.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[13px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                                >
                                  {a.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile CTA Portal */}
              <div className="flex flex-col gap-4 pt-6 border-t border-[var(--border)] mt-auto pb-4 shrink-0">
                <Link
                  to="/ems-login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 text-white rounded-xl font-bold text-[13.5px] tracking-wide transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-600/25 active:scale-[0.98] cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1a3ed0 100%)' }}
                >
                  <LayoutDashboard size={15} />
                  Employee Portal
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;