import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from '../../services/api';
import { Shield, Lock, Mail, ArrowRight, User, Building, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', formData);
      login(data.user);
      navigate('/client');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container auth-container" style={{ display: 'flex', minHeight: '100vh', width: '100vw', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Import Inter font if not already available */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      `}</style>
      <div className="login-left auth-hero" style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#3b82f6', padding: '4rem 10%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Subtle Grid Background */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>
        
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '4.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Shield size={24} strokeWidth={2.5} style={{ color: 'white' }} />
            </div>
            <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>VaultPay</h1>
          </div>
          
          <h2 style={{ color: 'white', fontSize: '3.25rem', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-1.5px', marginBottom: '1.25rem', marginTop: 0 }}>
            Join the<br/>Secure Network.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '3rem', fontWeight: 400, maxWidth: '95%' }}>
            Register your business today to start managing invoices and receiving secure payments instantly.
          </p>
          
          <div className="features" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.1)', padding: '1rem 1.5rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', minWidth: '320px', transition: 'background 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Lock size={20} strokeWidth={2} />
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'white', letterSpacing: '0.2px' }}>Instant Access</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.1)', padding: '1rem 1.5rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', minWidth: '320px', transition: 'background 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Shield size={20} strokeWidth={2} />
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'white', letterSpacing: '0.2px' }}>No Setup Fees</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="login-right auth-form-wrapper" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f8fafc' }}>
        <div className="login-card" style={{ maxWidth: '420px', width: '100%', background: '#ffffff', padding: '3.5rem 2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: 600, color: '#0f172a', letterSpacing: '-0.5px' }}>Create Account</h2>
          <p style={{ margin: '0 0 2.5rem 0', color: '#64748b', fontSize: '0.95rem' }}>Sign up for your VaultPay client portal</p>

          {error && <div className="alert-error" style={{ padding: '0.75rem', background: '#fef2f2', color: '#991b1b', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #fecaca' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>First Name</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', display: 'flex' }}>
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem', color: '#0f172a', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Name</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', display: 'flex' }}>
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem', color: '#0f172a', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Company Name (Optional)</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', display: 'flex' }}>
                  <Building size={18} />
                </div>
                <input
                  type="text"
                  id="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem', color: '#0f172a', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', display: 'flex' }}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="client@company.com"
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem', color: '#0f172a', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', display: 'flex' }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  style={{ width: '100%', padding: '0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem', color: '#0f172a', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '0.875rem', background: '#253e7a', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.95rem', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.2s' }}
            >
              {loading ? 'Signing up...' : (
                <>
                  Sign Up Securely
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
              Already have an account? <Link to="/login" style={{ color: '#1e3a8a', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
            </div>
          </form>

          <div className="login-footer" style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Protected by reCAPTCHA and subject to the <br/> VaultPay Privacy Policy and Terms of Service.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
