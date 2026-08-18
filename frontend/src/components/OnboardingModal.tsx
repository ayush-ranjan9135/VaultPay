import React, { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { ArrowRight, CheckCircle, Shield, Users, FileText, CreditCard, X } from 'lucide-react';

const OnboardingModal: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Check if user has completed onboarding
    if (user) {
      const hasCompleted = localStorage.getItem(`vaultpay_onboarding_${user.id}`);
      if (!hasCompleted) {
        setIsOpen(true);
      }
    }
  }, [user]);

  const handleComplete = () => {
    if (user) {
      localStorage.setItem(`vaultpay_onboarding_${user.id}`, 'true');
    }
    setIsOpen(false);
  };

  const handleNext = () => setStep(prev => prev + 1);

  if (!isOpen || !user) return null;

  const isAdmin = user.role === 'ADMIN';

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative', overflow: 'hidden', padding: 0 }}>
        
        {/* Progress Bar */}
        <div style={{ height: '4px', backgroundColor: 'var(--color-bg-subtle)', width: '100%' }}>
          <div style={{ height: '100%', backgroundColor: 'var(--color-primary-500)', width: `${(step / 3) * 100}%`, transition: 'width 0.3s ease' }}></div>
        </div>

        <button onClick={handleComplete} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ padding: '2.5rem' }}>
          {step === 1 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-700)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Shield size={32} />
              </div>
              <h2 className="text-h2" style={{ marginBottom: '1rem' }}>Welcome to VaultPay</h2>
              <p className="text-body text-muted" style={{ marginBottom: '2rem' }}>
                Manage invoices, track payments, and securely collect business payments from one place.
              </p>
              <button onClick={handleNext} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center' }}>
              <h2 className="text-h2" style={{ marginBottom: '1rem' }}>Your Workspace is Ready</h2>
              <p className="text-body text-muted" style={{ marginBottom: '2rem' }}>
                We've identified your account and set up your secure portal.
              </p>
              
              <div style={{ backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--color-primary-700)', fontWeight: 600, fontSize: '1.125rem' }}>
                  <CheckCircle size={24} />
                  {isAdmin ? "You're an Administrator" : "You're a Client"}
                </div>
              </div>

              <button onClick={handleNext} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                See how it works <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-h2" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Getting Started</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {isAdmin ? (
                  <>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-700)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Users size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 600, margin: 0 }}>1. Add Client</h4>
                        <p className="text-small text-muted" style={{ margin: 0 }}>Set up their profile</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-700)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 600, margin: 0 }}>2. Create Invoice</h4>
                        <p className="text-small text-muted" style={{ margin: 0 }}>Bill them instantly</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-success-50)', color: 'var(--color-success-700)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 600, margin: 0 }}>3. Track Payment</h4>
                        <p className="text-small text-muted" style={{ margin: 0 }}>Watch revenue grow</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-700)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 600, margin: 0 }}>1. View Invoice</h4>
                        <p className="text-small text-muted" style={{ margin: 0 }}>Check your dashboard</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-700)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Users size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 600, margin: 0 }}>2. Review Details</h4>
                        <p className="text-small text-muted" style={{ margin: 0 }}>Ensure amounts match</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-success-50)', color: 'var(--color-success-700)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 600, margin: 0 }}>3. Pay Securely</h4>
                        <p className="text-small text-muted" style={{ margin: 0 }}>Process via Stripe</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button onClick={handleComplete} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
