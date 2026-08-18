import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../auth/AuthContext';
import api from '../../services/api';
import { User as UserIcon, Mail, Building, Edit2, Check, X, Shield, Bell, CreditCard, Lock } from 'lucide-react';

const ClientSettings: React.FC = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        companyName: user.companyName || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const { data } = await api.put('/auth/me', formData);
      if (data.success) {
        login(data.user);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error: any) {
      console.error('Update error:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="text-h2">Account Settings</h2>
          <p className="text-muted">Manage your personal profile, security preferences, and billing methods.</p>
        </div>
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
            <UserIcon size={18} /> Profile Information
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
            <CreditCard size={18} /> Billing Methods
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
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form className="card" onSubmit={handleProfileSubmit} style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Profile Information</h3>
                <p className="text-muted text-small">Update your personal and company details.</p>
              </div>

              {message.text && (
                <div style={{
                  padding: '1rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)',
                  backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: message.type === 'success' ? 'var(--color-success-700)' : 'var(--color-error-700)',
                  display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500
                }}>
                  {message.type === 'success' && <Check size={18} />}
                  {message.text}
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gradient-brand)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                  {user?.firstName?.[0] || 'U'}
                </div>
                <div>
                  <button type="button" className="btn" style={{ padding: '0.5rem 1rem', background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 500, color: 'var(--color-text-strong)' }}>
                    Upload Photo
                  </button>
                  <p className="text-muted text-small" style={{ marginTop: '0.5rem' }}>JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <div className="input-with-icon">
                    <UserIcon size={18} className="input-icon" />
                    <input type="text" name="firstName" className="form-input" value={formData.firstName} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <div className="input-with-icon">
                    <UserIcon size={18} className="input-icon" />
                    <input type="text" name="lastName" className="form-input" value={formData.lastName} onChange={handleChange} required />
                  </div>
                </div>
              </div>
              
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label">Company Name (Optional)</label>
                <div className="input-with-icon">
                  <Building size={18} className="input-icon" />
                  <input type="text" name="companyName" className="form-input" value={formData.companyName} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input type="email" className="form-input" value={user?.email || ''} disabled style={{ backgroundColor: 'var(--color-bg-subtle)', cursor: 'not-allowed', color: 'var(--color-text-muted)' }} />
                </div>
                <p className="text-muted text-small" style={{ marginTop: '0.5rem' }}>Your email address cannot be changed directly.</p>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={18} />
                  {loading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
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

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                <button type="button" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Payment Methods</h3>
                  <p className="text-muted text-small">Manage your saved cards and bank accounts for paying invoices.</p>
                </div>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>+ Add Payment Method</button>
              </div>

              <div style={{ padding: '3rem 2rem', textAlign: 'center', border: '1px dashed var(--color-border-strong)', borderRadius: 'var(--radius-lg)' }}>
                <CreditCard size={32} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
                <h4 className="font-semibold" style={{ marginBottom: '0.5rem' }}>No payment methods saved</h4>
                <p className="text-muted text-small">Add a credit card or bank account to pay your invoices faster.</p>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Notification Preferences</h3>
                <p className="text-muted text-small">Choose how you want to be notified about your invoices.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 className="font-semibold" style={{ marginBottom: '0.25rem' }}>New Invoices</h4>
                    <p className="text-muted text-small">Receive an email when a new invoice is issued to you.</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary-500)', cursor: 'pointer' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 className="font-semibold" style={{ marginBottom: '0.25rem' }}>Payment Receipts</h4>
                    <p className="text-muted text-small">Get an email receipt when your payment is successfully processed.</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary-500)', cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 className="font-semibold" style={{ marginBottom: '0.25rem' }}>Upcoming Due Dates</h4>
                    <p className="text-muted text-small">Get a reminder 3 days before an invoice is due.</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary-500)', cursor: 'pointer' }} />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientSettings;
