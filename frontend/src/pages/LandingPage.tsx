import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, CreditCard, FileText, ArrowRight, CheckCircle2, Lock, Zap, BarChart3, MessageCircle, Globe, Mail, Check, Star } from 'lucide-react';

const LandingPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = windowHeight > 0 ? totalScroll / windowHeight : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Dynamic Background Elements */}
      <div className="animate-float" style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, var(--color-primary-100) 0%, rgba(255,255,255,0) 70%)', opacity: 0.5, zIndex: 0, pointerEvents: 'none', borderRadius: '50%' }}></div>
      <div className="animate-float-delayed" style={{ position: 'absolute', top: '20%', right: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, var(--color-primary-50) 0%, rgba(255,255,255,0) 70%)', opacity: 0.6, zIndex: 0, pointerEvents: 'none', borderRadius: '50%' }}></div>

      {/* Navigation - Glassmorphic */}
      <nav className={scrolled ? 'glass' : ''} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 5%', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'var(--transition-normal)', borderBottom: scrolled ? '' : '1px solid transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-primary-900)' }}>
          <div style={{ background: 'var(--gradient-brand)', padding: '0.5rem', borderRadius: 'var(--radius-lg)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
            <Shield size={24} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.5px' }} className="text-gradient">VaultPay</span>
        </div>
        
        {/* Central Navigation Links */}
        <div className="desktop-nav" style={{ gap: '2rem', alignItems: 'center', fontWeight: 500, color: 'var(--color-text-main)' }}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How it Works</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#resources" className="nav-link">Resources</a>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/login" className="btn btn-secondary" style={{ border: 'none', background: 'transparent' }}>Log in</Link>
          <Link to="/login" className="btn btn-primary animate-pulse-glow" style={{ borderRadius: 'var(--radius-xl)', padding: '0.75rem 1.5rem', fontWeight: 600 }}>Get Started</Link>
        </div>

        {/* Scroll Progress Bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'transparent' }}>
          <div style={{ height: '100%', background: 'var(--gradient-brand)', width: `${scrollProgress * 100}%`, transition: 'width 0.1s ease-out' }}></div>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ paddingTop: '12rem', paddingBottom: '8rem', paddingLeft: '5%', paddingRight: '5%', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div className="animate-fade-up" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--color-primary-50)', color: 'var(--color-primary-700)', borderRadius: 'var(--radius-2xl)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem', border: '1px solid var(--color-primary-100)' }}>
            <Zap size={16} /> Welcome to the future of B2B billing
          </div>
          <h1 className="text-display" style={{ marginBottom: '1.5rem', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            The Modern Standard for <br/> <span className="text-gradient">B2B Payments</span>
          </h1>
          <p className="text-h3 text-muted delay-100" style={{ fontWeight: 400, marginBottom: '3rem', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            Enterprise-grade invoice management, automated billing, and secure payment processing. Built for teams that move fast.
          </p>
          <div className="delay-200" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
              Start Processing Securely <ArrowRight size={20} />
            </Link>
          </div>
          <div className="delay-300" style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '4rem', color: 'var(--color-text-muted)', fontWeight: 500, flexWrap: 'wrap', fontSize: '0.95rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} className="text-success" /> End-to-End Encryption</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} className="text-success" /> Stripe Partner</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} className="text-success" /> Instant Invoicing</span>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" style={{ minHeight: '100vh', padding: '2rem 5%', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="text-h2" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>Everything you need to manage receivables</h2>
            <p className="text-muted text-body" style={{ fontSize: '1.125rem', maxWidth: '600px', margin: '1rem auto 0' }}>A unified platform that connects your billing with secure, instant payment processing.</p>
          </div>
          
          <div className="features-grid">
            {[
              { icon: <FileText size={24} />, title: 'Smart Invoicing', desc: 'Generate professional invoices in seconds. Track statuses from draft to paid with complete visibility.' },
              { icon: <CreditCard size={24} />, title: 'Frictionless Payments', desc: 'Accept secure payments directly on invoices with zero integration hassle. Powered by Stripe.' },
              { icon: <Lock size={24} />, title: 'Secure Infrastructure', desc: 'Role-based access control, strict data isolation, and verified webhook processing ensure your data is safe.' },
              { icon: <BarChart3 size={24} />, title: 'Real-time Analytics', desc: 'Get instant insights into your revenue, outstanding balances, and payment timelines.' }
            ].map((feature, idx) => (
              <div key={idx} className="feature-card glass animate-fade-up" style={{ animationDelay: `${(idx + 1) * 100}ms` }}>
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3 className="text-h3" style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{feature.title}</h3>
                <p className="text-muted" style={{ lineHeight: 1.5, fontSize: '0.95rem' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" style={{ padding: '8rem 5%', background: 'var(--gradient-brand)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 className="text-h2" style={{ color: 'white', fontSize: '2.5rem', letterSpacing: '-1px' }}>From invoice to payment — without the paperwork.</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.25rem', maxWidth: '600px', margin: '1rem auto 0' }}>A seamless end-to-end workflow designed for modern businesses.</p>
          </div>

          <div className="timeline-container">
            {[
              { num: '01', title: 'Create Invoice', desc: 'Admin generates a professional invoice with custom line items in seconds.' },
              { num: '02', title: 'Client Receives Invoice', desc: 'The invoice instantly appears in the client\'s secure portal.' },
              { num: '03', title: 'Client Reviews & Pays', desc: 'Client securely pays via credit card or ACH using our Stripe integration.' },
              { num: '04', title: 'Records Updated', desc: 'Both Admin and Client dashboards reflect the updated revenue metrics automatically.' }
            ].map((step, index) => (
              <div key={index} className="timeline-step animate-fade-up" style={{ animationDelay: `${(index + 1) * 150}ms` }}>
                <div className="timeline-number">
                  {step.num}
                </div>
                <div className="timeline-content">
                  <h3 className="text-h3" style={{ marginBottom: '0.5rem', color: 'white', fontSize: '1.5rem' }}>{step.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="pricing-header">
          <h2>Plans for every stage of growth</h2>
          <p>Choose the perfect tier for your invoicing and billing needs.</p>
        </div>

        <div className="pricing-grid">
          
          {/* Free Tier */}
          <div className="pricing-card">
            <h3 className="pricing-title">Pay As You Go</h3>
            <p className="pricing-desc">No monthly fees. Perfect for businesses getting started with B2B payments.</p>
            <div className="pricing-price-wrap">
              <div className="pricing-starting">Starting at</div>
              <div className="pricing-price">2.9<span className="pricing-currency">%</span></div>
              <div className="pricing-period">+ 30¢ per successful card charge</div>
            </div>
            <button disabled className="pricing-btn" style={{ cursor: 'not-allowed', opacity: 0.7 }}>Start Processing</button>
            
            <div className="pricing-features-title">PAY AS YOU GO FEATURES</div>
            <div className="pricing-features-list">
              <div className="pricing-feature"><Check /> No setup or monthly fees</div>
              <div className="pricing-feature"><Check /> Accept cards & ACH transfers</div>
              <div className="pricing-feature"><Check /> Basic invoicing & payment links</div>
              <div className="pricing-feature"><Check /> Standard fraud protection</div>
              <div className="pricing-feature"><Check /> 2-day rolling payouts</div>
            </div>
          </div>

          {/* Starter Tier */}
          <div className="pricing-card">
            <h3 className="pricing-title">Growth</h3>
            <p className="pricing-desc">For growing businesses needing custom branding and faster payouts.</p>
            <div className="pricing-price-wrap">
              <div className="pricing-starting">Starting at</div>
              <div className="pricing-price"><span className="pricing-currency">$</span>49</div>
              <div className="pricing-period">per month + 2.5% + 30¢ per tx</div>
            </div>
            <button disabled className="pricing-btn" style={{ cursor: 'not-allowed', opacity: 0.7 }}>Start 14-day trial</button>
            
            <div className="pricing-features-title">GROWTH FEATURES</div>
            <div className="pricing-features-list">
              <div className="pricing-feature"><Check /> Everything in Pay As You Go</div>
              <div className="pricing-feature"><Check /> Custom branded checkout portal</div>
              <div className="pricing-feature"><Check /> Next-day payouts</div>
              <div className="pricing-feature"><Check /> Email & SMS payment reminders</div>
              <div className="pricing-feature"><Check /> Accounting software sync</div>
              <div className="pricing-feature"><Check /> Up to 5 team members</div>
            </div>
          </div>

          {/* Pro Tier (Highlighted) */}
          <div className="pricing-card highlight">
            <div className="pricing-badge">BEST FOR GROWING TEAMS</div>
            <h3 className="pricing-title">Scale</h3>
            <p className="pricing-desc">Advanced APIs and automated reconciliation for scaling finance teams.</p>
            <div className="pricing-price-wrap">
              <div className="pricing-starting">Starting at</div>
              <div className="pricing-price"><span className="pricing-currency">$</span>199</div>
              <div className="pricing-period">per month + 1.9% per tx</div>
            </div>
            <button disabled className="pricing-btn primary" style={{ cursor: 'not-allowed', opacity: 0.7 }}>Start 14-day trial</button>
            
            <div className="pricing-features-title">SCALE FEATURES</div>
            <div className="pricing-features-list">
              <div className="pricing-feature"><Check /> Everything in Growth</div>
              <div className="pricing-feature"><Check /> Advanced API & Webhooks</div>
              <div className="pricing-feature"><Check /> Automated reconciliation</div>
              <div className="pricing-feature"><Check /> Custom reporting & analytics</div>
              <div className="pricing-feature"><Check /> Unlimited team members</div>
              <div className="pricing-feature"><Check /> Priority 24/7 technical support</div>
              <div className="pricing-feature"><Check /> Advanced role-based access</div>
            </div>
          </div>

          {/* Enterprise Tier */}
          <div className="pricing-card enterprise">
            <h3 className="pricing-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--color-primary-500)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Star size={16} fill="currentColor" /> UNLIMITED SCALE
            </h3>
            <h3 className="pricing-title">Custom</h3>
            <p className="pricing-desc">Custom transaction rates and dedicated infrastructure for high-volume processors.</p>
            <div className="pricing-price-wrap">
              <div className="pricing-starting">Custom Pricing</div>
              <div className="pricing-price" style={{ fontSize: '2rem' }}>Contact</div>
              <div className="pricing-period">for volume pricing</div>
            </div>
            <button disabled className="pricing-btn solid-white" style={{ cursor: 'not-allowed', opacity: 0.7 }}>Contact Sales</button>
            
            <div className="pricing-features-title">ENTERPRISE FEATURES</div>
            <div className="pricing-features-list">
              <div className="pricing-feature"><Check /> Custom transaction pricing</div>
              <div className="pricing-feature"><Check /> Dedicated processing infrastructure</div>
              <div className="pricing-feature"><Check /> Custom SLA & uptime guarantee</div>
              <div className="pricing-feature"><Check /> Dedicated technical account manager</div>
              <div className="pricing-feature"><Check /> Custom SSO & SAML integration</div>
              <div className="pricing-feature"><Check /> White-label deployment options</div>
            </div>
          </div>

        </div>

        <div className="pricing-footer">
          <div className="pricing-footer-item">
            <Shield size={18} /> Trusted by modern B2B teams
          </div>
          <div className="pricing-footer-item">
            <CheckCircle2 size={18} /> No long-term contracts
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="resources" style={{ padding: '6rem 5% 3rem', background: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border-subtle)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="footer-grid" style={{ gap: '4rem', marginBottom: '4rem' }}>
            
            <div className="footer-brand-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-primary-900)' }}>
                <div style={{ background: 'var(--color-primary-50)', padding: '0.5rem', borderRadius: 'var(--radius-lg)' }}>
                  <Shield size={24} style={{ color: 'var(--color-primary-600)' }} />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>VaultPay</span>
              </div>
              <p className="text-muted" style={{ lineHeight: 1.6, maxWidth: '300px' }}>
                The modern standard for B2B payments. Secure, automated, and built for scale.
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <a href="#" style={{ color: 'var(--color-text-muted)', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary-500)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}><MessageCircle size={20} /></a>
                <a href="#" style={{ color: 'var(--color-text-muted)', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary-500)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}><Globe size={20} /></a>
                <a href="#" style={{ color: 'var(--color-text-muted)', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary-500)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}><Mail size={20} /></a>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Product</h4>
              <a href="#" className="nav-link text-muted">Features</a>
              <a href="#" className="nav-link text-muted">Integrations</a>
              <a href="#" className="nav-link text-muted">Pricing</a>
              <a href="#" className="nav-link text-muted">Changelog</a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Resources</h4>
              <a href="#" className="nav-link text-muted">Documentation</a>
              <a href="#" className="nav-link text-muted">API Reference</a>
              <a href="#" className="nav-link text-muted">Help Center</a>
              <a href="#" className="nav-link text-muted">Blog</a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Company</h4>
              <a href="#" className="nav-link text-muted">About Us</a>
              <a href="#" className="nav-link text-muted">Careers</a>
              <a href="#" className="nav-link text-muted">Privacy Policy</a>
              <a href="#" className="nav-link text-muted">Terms of Service</a>
            </div>

          </div>
          
          <div className="footer-bottom" style={{ paddingTop: '2rem', borderTop: '1px solid var(--color-border-subtle)', gap: '1rem' }}>
            <p className="text-muted text-small">&copy; {new Date().getFullYear()} VaultPay Financial. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }} className="text-muted">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success-500)' }}></div>
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
