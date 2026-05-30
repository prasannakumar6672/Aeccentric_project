import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  

  
  html.dark .nexus-service-page,
  [data-theme="dark"] .nexus-service-page {
    --bg:         #030712;
    --bg-card:    #0D1526;
    --bg-sec:     #070D1A;
    --border:     rgba(255, 255, 255, 0.08);
    --border-h:   color-mix(in srgb, var(--accent) 35%, transparent);
    --text:       #F1F5F9;
    --text-muted: #94A3B8;
    --text-hint:  #64748B;
    --accent-lt:  color-mix(in srgb, var(--accent) 12%, transparent);
  }

  .nexus-service-page {
    background: var(--bg);
    color: var(--text);
    font-family: var(--f, 'Inter', sans-serif);
    -webkit-font-smoothing: antialiased;
    --bg:         #FFFFFF;
    --bg-card:    #FFFFFF;
    --bg-sec:     #F8F9FB;
    --border:     #E4E7EE;
    --border-h:   #BFDBFE;
    --text:       #0D1117;
    --text-muted: #5A6272;
    --text-hint:  #9BA3B4;
    --accent:     #2563EB;
    --accent-lt:  #EFF6FF;
    --r-sm:       10px;
    --r-md:       16px;
    --r-lg:       24px;
    --f: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  
.nexus-service-page .page { max-width: 1120px; margin: 0 auto; padding: 0 32px 120px; }

  /* HERO */
.nexus-service-page .hero { padding: 120px 0 64px; text-align: center; border-bottom: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; }
.nexus-service-page .hero-eye { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-lt); border: 1px solid var(--border-h); border-radius: 100px; padding: 5px 12px; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 22px; }
.nexus-service-page .hero-title { font-size: clamp(36px, 4.8vw, 58px); font-weight: 800; line-height: 1.06; letter-spacing: -0.035em; color: var(--text); margin-bottom: 18px; }
.nexus-service-page .hero-title .accent { color: var(--accent); }
.nexus-service-page .hero-desc { font-size: 16px; line-height: 1.78; color: var(--text-muted); max-width: 560px; margin: 0 auto 32px; font-weight: 400; }
  
  /* SECTION */
.nexus-service-page .section { padding: 48px 0; }
  
  /* CONTACT CONTENT */
.nexus-service-page .contact-wrap { display: flex; gap: 48px; }
  @media (max-width: 760px) { .contact-wrap { flex-direction: column; } }
  
.nexus-service-page .contact-form-side { flex: 1; text-align: left; }
.nexus-service-page .contact-info-side { width: 35%; flex-shrink: 0; text-align: left; }
  @media (max-width: 760px) { .contact-info-side { width: 100%; } }
  
.nexus-service-page .form-group { margin-bottom: 20px; }
.nexus-service-page .form-label { font-size: 12px; font-weight: 700; color: var(--text); text-transform: uppercase; margin-bottom: 8px; display: block; }
.nexus-service-page .form-input { width: 100%; padding: 12px 16px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-card); font-family: var(--f); font-size: 14px; outline: none; transition: border-color .2s; }
.nexus-service-page .form-input:focus { border-color: var(--accent); }
.nexus-service-page .form-textarea { width: 100%; padding: 12px 16px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-card); font-family: var(--f); font-size: 14px; outline: none; transition: border-color .2s; min-height: 120px; resize: vertical; }
.nexus-service-page .form-textarea:focus { border-color: var(--accent); }
  
.nexus-service-page .submit-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: var(--accent); color: #fff; border: none; border-radius: 100px; padding: 14px 28px; font-family: var(--f); font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: opacity .15s, transform .15s; width: 100%; }
.nexus-service-page .submit-btn:hover { opacity: 0.87; transform: translateY(-1px); }
  
.nexus-service-page .info-box { padding: 24px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-sec); margin-bottom: 24px; }
.nexus-service-page .info-title { font-size: 14px; font-weight: 700; color: var(--text); text-transform: uppercase; margin-bottom: 12px; }
.nexus-service-page .info-text { font-size: 13.5px; line-height: 1.75; color: var(--text-muted); font-weight: 400; }
.nexus-service-page .info-link { color: var(--accent); text-decoration: none; font-weight: 600; }
.nexus-service-page .info-link:hover { text-decoration: underline; }
  
.nexus-service-page .social-links { display: flex; gap: 12px; margin-top: 12px; }
.nexus-service-page .social-icon { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all .2s; }
.nexus-service-page .social-icon:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-lt); }
`;

const Contact = () => {
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMounted(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="nexus-service-page">
      <div className="page">
      <style>{css}</style>
      
      {/* HERO */}
      <section className="hero">
        <div className="hero-eye"><Mail size={10} /> Contact Us</div>
        <h1 className="hero-title">
          Let's build something<br />
          <span className="accent">extraordinary.</span>
        </h1>
        <p className="hero-desc">
          Have a complex engineering challenge? Or just want to discuss your systems architecture? We are here to help.
        </p>
      </section>

      {/* CONTACT CONTENT */}
      <section className="section">
        <div className="contact-wrap">
          
          {/* Form Side */}
          <div className="contact-form-side">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-sec)', borderRadius: 'var(--r-lg)', border: '1.5px solid var(--border)' }}>
                <CheckCircle size={48} color="#10B981" style={{ marginBottom: 16 }} />
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Thank you for reaching out. Our engineering team will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" placeholder="John Doe" required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="john@company.com" required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Company / Organization</label>
                  <input type="text" className="form-input" placeholder="Acme Inc." />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-textarea" placeholder="Tell us about your project or challenge..." required></textarea>
                </div>
                
                <button type="submit" className="submit-btn">
                  Send Message <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>

          {/* Info Side */}
          <div className="contact-info-side">
            
            <div className="info-box">
              <div className="info-title">Global HQ</div>
              <div className="info-text">
                <MapPin size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
                Plot No. 12, Tech Park, HITEC City,<br />
                Hyderabad, Telangana 500081,<br />
                India
              </div>
            </div>
            
            <div className="info-box">
              <div className="info-title">Direct Contact</div>
              <div className="info-text" style={{ marginBottom: 8 }}>
                <Phone size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
                <a href="tel:+919876543210" className="info-link">+91 98765 43210</a>
              </div>
              <div className="info-text">
                <Mail size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
                <a href="mailto:contact@aeccentric.com" className="info-link">contact@aeccentric.com</a>
              </div>
            </div>
            
            <div className="info-box">
              <div className="info-title">Working Hours</div>
              <div className="info-text">
                Monday - Friday: 9:00 AM - 6:00 PM (IST)<br />
                Saturday - Sunday: Closed
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
    </div>
  );
};

export default Contact;
