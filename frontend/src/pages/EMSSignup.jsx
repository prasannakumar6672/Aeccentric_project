import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

/* â”€â”€â”€ Concentric Rings (same as Hero) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ConcentricRings = () => (
  <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: 0 }}>
    <div className="absolute w-[300px] h-[300px] rounded-full bg-white blur-[60px] opacity-10"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
    {[180, 320, 460, 600, 740, 880, 1020].map((size, i) => (
      <div
        key={i}
        className="absolute rounded-full border border-white"
        style={{
          width: `${size}px`, height: `${size}px`,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          filter: 'blur(1.5px)',
          opacity: Math.max(0.03, 0.18 - i * 0.025),
        }}
      />
    ))}
  </div>
);

/* â”€â”€â”€ Particle Canvas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const dots = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      alpha: Math.random() * 0.35 + 0.08,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147,197,253,${d.alpha})`; ctx.fill();
      });
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(147,197,253,${0.07 * (1 - dist / 100)})`; ctx.lineWidth = 0.7; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

/* â”€â”€â”€ Floating Stat Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const FloatCard = ({ icon, label, value, delay, amp }) => {
  const [y, setY] = useState(0);
  useEffect(() => {
    let id;
    const animate = (ts) => {
      setY(Math.sin((ts / 1000 + delay) * (0.7 + delay * 0.08)) * amp);
      id = requestAnimationFrame(animate);
    };
    id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [delay, amp]);
  return (
    <div
      style={{ transform: `translateY(${y}px)`, transition: 'transform 0.06s linear' }}
      className="flex items-center gap-3 bg-white/[0.06] backdrop-blur-sm border border-white/[0.10] rounded-2xl px-4 py-3 w-fit"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px]"
        style={{ background: 'rgba(37,99,235,0.15)' }}>
        {icon}
      </div>
      <div>
        <p className="text-white/40 text-[10px] font-semibold uppercase tracking-[0.2em]">{label}</p>
        <p className="text-white font-black text-[17px] leading-tight tracking-tight">{value}</p>
      </div>
    </div>
  );
};

/* â”€â”€â”€ Main EMS Login Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const EMSSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { fullName: form.fullName, email: form.email, password: form.password });
      const { accessToken, user } = res.data;
      localStorage.setItem('ems_token', accessToken);
      localStorage.setItem('ems_user', JSON.stringify(user));
      if (user.role === 'super_admin' || user.role === 'admin' || user.role === 'hr') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/employee');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden transition-colors duration-500" style={{ background: 'var(--bg)' }}>

      {/* â”€â”€ LEFT BRAND PANEL â”€â”€ */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative p-16 overflow-hidden" style={{ background: 'linear-gradient(145deg, #010b18 0%, #020d1e 50%, #010b18 100%)' }}>
        <ParticleCanvas />
        <ConcentricRings />

        {/* Large decorative AE */}
        <div className="absolute bottom-0 right-[-40px] text-[320px] font-black leading-none select-none pointer-events-none opacity-[0.03]" style={{ color: '#fff', letterSpacing: '-0.06em' }}>AE</div>

        {/* Glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-80px] right-[-60px] w-[380px] h-[380px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full blur-[80px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <img src="/logo.png" alt="AECCENTRIC" className="h-[48px] w-auto object-contain brightness-0 invert" />
          <span className="text-white text-[22px] font-black uppercase tracking-tight" style={{ letterSpacing: '-0.03em' }}>
            AECCENTRIC
          </span>
        </div>

        {/* Hero text â€” same gradient as Hero component */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 mb-8"
            style={{ background: 'rgba(37,99,235,0.08)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" style={{ boxShadow: '0 0 6px #2563EB' }} />
            <span className="text-[11px] font-semibold tracking-[0.22em] text-white/50 uppercase">Employee Management System</span>
          </div>

          <h1 className="font-black leading-[1.12] tracking-tight" style={{
            fontSize: 'clamp(30px, 3.2vw, 48px)', letterSpacing: '-0.03em', color: '#fff'
          }}>
            Your workplace.<br />
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Intelligently managed.
            </span>
          </h1>

          <p className="text-white/40 mt-5 text-[15px] leading-[1.85] max-w-[380px]">
            Unified platform for attendance, projects, payroll, tasks, and real-time team management â€” built for AECCENTRIC.
          </p>

          {/* Floating stat cards */}
          <div className="flex flex-col gap-3 mt-10 max-w-[260px]">
            <FloatCard icon="ðŸ‘¥" label="Active Employees" value="200+" delay={0} amp={7} />
            <FloatCard icon="ðŸ“" label="Live Projects" value="50+" delay={1.5} amp={5} />
            <FloatCard icon="âœ…" label="Tasks Completed" value="1,200+" delay={3} amp={9} />
          </div>
        </div>

        {/* Footer note â€” same copyright style as Footer */}
        <p className="relative z-10 text-[12px] uppercase tracking-[0.22em] text-white/20">
          Â© 2025 AECCENTRIC Â· Hyderabad, India
        </p>
      </div>

      {/* â”€â”€ RIGHT LOGIN PANEL â”€â”€ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        {/* Mobile bg */}
        <div className="lg:hidden absolute inset-0 pointer-events-none">
          <ParticleCanvas />
          <div className="absolute inset-0" style={{ background: 'rgba(2,6,23,0.7)' }} />
        </div>

        <div
          className="relative z-10 w-full max-w-[460px]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0px)' : 'translateY(36px)',
            transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* White card â€” matches Navbar pill style */}
          <div className="bg-[var(--bg-card)] rounded-[20px] shadow-[var(--shadow-lg)] border border-[var(--border)] overflow-hidden transition-all duration-500">

            {/* Card top accent */}
            <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, #2563EB, #1D4ED8)' }} />

            <div className="p-10">
              {/* Header */}
              <div style={{
                opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.5s 0.1s cubic-bezier(0.16,1,0.3,1), transform 0.5s 0.1s cubic-bezier(0.16,1,0.3,1)',
              }}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent-light)] mb-6"
                  style={{ background: 'var(--accent-light)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--accent)]">Employee Portal</span>
                </div>
                <h2 className="font-black text-[var(--text)]" style={{ fontSize: '28px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                  Create Account
                </h2>
                <p className="text-[var(--text-muted)] text-[14px] mt-2 leading-relaxed">
                  Register to access your AECCENTRIC workspace
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
                {/* Email */}
                {[
                  {
                    id: 'fullName', name: 'fullName', type: 'text', label: 'Full Name',
                    placeholder: 'John Doe', autoComplete: 'name',
                    icon: (
                      <svg className="w-[18px] h-[18px] text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                    ),
                    delay: 0.12,
                  },
                  {
                    id: 'email', name: 'email', type: 'email', label: 'Work Email',
                    placeholder: 'you@aeccentric.com', autoComplete: 'email',
                    icon: (
                      <svg className="w-[18px] h-[18px] text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    ),
                    delay: 0.18,
                  },
                  {
                    id: 'password', name: 'password', type: showPass ? 'text' : 'password', label: 'Password',
                    placeholder: 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢', autoComplete: 'current-password',
                    icon: (
                      <svg className="w-[18px] h-[18px] text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    ),
                    delay: 0.30,
                    trailing: (
                      <button type="button" onClick={() => setShowPass(v => !v)} className="text-gray-400 hover:text-[#2563EB] transition-colors">
                        {showPass ? (
                          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" />
                          </svg>
                        ) : (
                          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    ),
                  },
                ].map((field) => (
                  <div key={field.id} style={{
                    opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                    transition: `opacity 0.5s ${field.delay}s cubic-bezier(0.16,1,0.3,1), transform 0.5s ${field.delay}s cubic-bezier(0.16,1,0.3,1)`,
                  }}>
                    <label htmlFor={field.id} className="block text-[var(--text)] text-[13px] font-semibold mb-2 tracking-wide">
                      {field.label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">{field.icon}</span>
                      <input
                        id={field.id} name={field.name} type={field.type}
                        autoComplete={field.autoComplete} placeholder={field.placeholder}
                        value={form[field.name]} onChange={handleChange}
                        className="w-full h-[52px] pl-[46px] pr-12 text-[var(--text)] placeholder-[var(--text-subtle)] text-[15px] outline-none rounded-[10px] border border-[var(--border)] focus:border-[var(--accent)] focus:ring-2 transition-all duration-200"
                        style={{ background: 'var(--bg-input)', '--tw-ring-color': 'var(--accent-glow)' }}
                      />
                      {field.trailing && <span className="absolute right-4 top-1/2 -translate-y-1/2">{field.trailing}</span>}
                    </div>
                  </div>
                ))}

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-[10px] bg-red-50 border border-red-200 text-red-600 text-[13px]">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </div>
                )}

                <div className="flex justify-end -mt-1" style={{
                  opacity: mounted ? 1 : 0, transition: 'opacity 0.5s 0.42s ease',
                }}>
                  <Link to="/ems-login" className="text-[var(--accent)] text-[13px] font-semibold hover:underline transition-all">
                    Already have an account? Sign in
                  </Link>
                </div>

                {/* Submit â€” same style as Hero CTA */}
                <div style={{
                  opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 0.5s 0.48s cubic-bezier(0.16,1,0.3,1), transform 0.5s 0.48s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  <button
                    type="submit" disabled={loading}
                    className="w-full h-[54px] flex items-center justify-center gap-2 font-black text-[15px] tracking-widest text-white rounded-[12px] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                    style={{
                      background: 'var(--navy)',
                      boxShadow: '0 4px 0 0 var(--accent), 0 8px 28px -4px var(--accent-glow)',
                      letterSpacing: '0.08em',
                    }}
                    onMouseEnter={e => !loading && (e.currentTarget.style.background = 'var(--navy-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--navy)')}
                  >
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        SIGNING UPâ€¦
                      </>
                    ) : (
                      <>
                        SIGN UP
                        <div className="flex items-center justify-center rounded-full border border-white/40 w-[28px] h-[28px]">
                          <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                          </svg>
                        </div>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-7">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-gray-300 text-[12px]">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Back to site */}
              <div className="text-center" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s 0.6s ease' }}>
                <Link to="/" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent)] text-[13px] font-semibold transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Back to AECCENTRIC website
                </Link>
              </div>
            </div>
          </div>

          {/* Security note */}
          <p className="text-center text-white/25 text-[12px] mt-5 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Secured with JWT Â· AECCENTRIC EMS v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default EMSSignup;
