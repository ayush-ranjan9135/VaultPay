import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { User, Shield, Bell, CreditCard, Save, Mail, Lock } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="text-h2">Platform Settings</h2>
          <p className="text-muted">Manage your admin profile, security preferences, and system integrations.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Settings Navigation Sidebar */}
        <div className="card" style={{ width: '100%', maxWidth: '280px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', 
              background: activeTab === 'profile' ? 'var(--color-bg-subtle)' : 'transparent',
              color: activeTab === 'profile' ? 'var(--color-primary-600)' : 'var(--color-text-main)',
              border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontWeight: activeTab === 'profile' ? 600 : 500, transition: 'all var(--transition-fast)',
              textAlign: 'left'
            }}
          >
            <User size={18} /> Admin Profile
          </button>
          
          <button 
            onClick={() => setActiveTab('security')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', 
              background: activeTab === 'security' ? 'var(--color-bg-subtle)' : 'transparent',
              color: activeTab === 'security' ? 'var(--color-primary-600)' : 'var(--color-text-main)',
              border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontWeight: activeTab === 'security' ? 600 : 500, transition: 'all var(--transition-fast)',
              textAlign: 'left'
            }}
          >
            <Shield size={18} /> Security
          </button>
          
          <button 
            onClick={() => setActiveTab('notifications')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', 
              background: activeTab === 'notifications' ? 'var(--color-bg-subtle)' : 'transparent',
              color: activeTab === 'notifications' ? 'var(--color-primary-600)' : 'var(--color-text-main)',
              border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontWeight: activeTab === 'notifications' ? 600 : 500, transition: 'all var(--transition-fast)',
              textAlign: 'left'
            }}
          >
            <Bell size={18} /> Notifications
          </button>
          
          <button 
            onClick={() => setActiveTab('billing')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', 
              background: activeTab === 'billing' ? 'var(--color-bg-subtle)' : 'transparent',
              color: activeTab === 'billing' ? 'var(--color-primary-600)' : 'var(--color-text-main)',
              border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontWeight: activeTab === 'billing' ? 600 : 500, transition: 'all var(--transition-fast)',
              textAlign: 'left'
            }}
          >
            <CreditCard size={18} /> Payment Gateway
          </button>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Admin Profile</h3>
                <p className="text-muted text-small">Update your personal information and contact details.</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gradient-brand)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                  A
                </div>
                <div>
                  <button className="btn" style={{ padding: '0.5rem 1rem', background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 500, color: 'var(--color-text-strong)' }}>
                    Upload New Avatar
                  </button>
                  <p className="text-muted text-small" style={{ marginTop: '0.5rem' }}>JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <div className="input-with-icon">
                    <User size={18} className="input-icon" />
                    <input type="text" className="form-input" defaultValue="Admin" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <div className="input-with-icon">
                    <User size={18} className="input-icon" />
                    <input type="text" className="form-input" defaultValue="User" />
                  </div>
                </div>
              </div>
              
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input type="email" className="form-input" defaultValue="admin@vaultpay.com" />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Password & Security</h3>
                <p className="text-muted text-small">Update your password and secure your account.</p>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Current Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" className="form-input" placeholder="••••••••" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input type="password" className="form-input" placeholder="••••••••" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input type="password" className="form-input" placeholder="••••••••" />
                  </div>
                </div>
              </div>

              <hr style={{ borderTop: '1px solid var(--color-border-subtle)', borderBottom: 'none', margin: '2rem 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 className="font-semibold" style={{ marginBottom: '0.25rem' }}>Two-Factor Authentication</h4>
                  <p className="text-muted text-small">Add an extra layer of security to your account.</p>
                </div>
                <button className="btn" style={{ padding: '0.5rem 1rem', background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 500 }}>
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Notification Preferences</h3>
                <p className="text-muted text-small">Choose how you want to be notified about activity.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 className="font-semibold" style={{ marginBottom: '0.25rem' }}>New User Registrations</h4>
                    <p className="text-muted text-small">Receive an email when a new client signs up.</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary-500)', cursor: 'pointer' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 className="font-semibold" style={{ marginBottom: '0.25rem' }}>Invoice Payments</h4>
                    <p className="text-muted text-small">Get notified instantly when an invoice is marked as paid.</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary-500)', cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 className="font-semibold" style={{ marginBottom: '0.25rem' }}>Weekly Reports</h4>
                    <p className="text-muted text-small">Receive a weekly summary of platform revenue and activity.</p>
                  </div>
                  <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary-500)', cursor: 'pointer' }} />
                </div>
              </div>
            </div>
          )}

          {/* Billing / Gateway Tab */}
          {activeTab === 'billing' && (
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Payment Gateway Integrations</h3>
                <p className="text-muted text-small">Configure your Stripe API keys for payment processing.</p>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Stripe Publishable Key</label>
                <div className="input-with-icon">
                  <CreditCard size={18} className="input-icon" />
                  <input type="text" className="form-input" defaultValue="pk_test_51O..." />
                </div>
                <p className="text-muted text-small" style={{ marginTop: '0.5rem' }}>Used for rendering Stripe elements on the frontend.</p>
              </div>

              <div className="form-group">
                <label className="form-label">Stripe Secret Key</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" className="form-input" defaultValue="sk_test_51O..." />
                </div>
                <p className="text-muted text-small" style={{ marginTop: '0.5rem' }}>Used for processing payments on the backend. Keep this secure.</p>
              </div>
              
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--color-warning-50)', border: '1px solid var(--color-warning-700)', borderRadius: 'var(--radius-md)', color: 'var(--color-warning-700)' }}>
                <strong>Note:</strong> Changing these keys will affect all new payment intents. Ensure you are using the correct environment (Test vs Live).
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
