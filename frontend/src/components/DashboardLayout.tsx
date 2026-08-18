import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { Shield, LogOut, LayoutDashboard, FileText, Users, Settings, User as UserIcon, Menu, X, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import OnboardingModal from './OnboardingModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'ADMIN';
  const basePath = isAdmin ? '/admin' : '/client';

  // Theme detection and persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('vaultpay-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('theme-dark', savedTheme === 'dark');
      document.documentElement.classList.toggle('theme-light', savedTheme === 'light');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('vaultpay-theme', newTheme);
    document.documentElement.classList.toggle('theme-dark', newTheme === 'dark');
    document.documentElement.classList.toggle('theme-light', newTheme === 'light');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = isAdmin ? [
    { label: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Clients', path: '/admin/clients', icon: <Users size={20} /> },
    { label: 'Invoices', path: '/admin/invoices', icon: <FileText size={20} /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ] : [
    { label: 'Overview', path: '/client', icon: <LayoutDashboard size={20} /> },
    { label: 'My Invoices', path: '/client/invoices', icon: <FileText size={20} /> },
    { label: 'Settings', path: '/client/settings', icon: <Settings size={20} /> },
  ];

  // Helper to format breadcrumb
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/client') return 'Overview';
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  };

  return (
    <div className="dashboard-layout">
      <OnboardingModal />
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 30 }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar no-print ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <Shield size={24} style={{ color: 'var(--color-primary-500)' }} />
          <span className="font-bold text-xl">VaultPay</span>
          {/* Mobile Close Button */}
          <button 
            className="btn btn-secondary mobile-only" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ marginLeft: 'auto', padding: '4px' }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="sidebar-role" style={{ padding: '0 1.5rem 2rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
          {isAdmin ? 'Admin Portal' : 'Client Portal'}
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer" style={{ padding: '1.5rem 1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: 'auto' }}>
          <button onClick={logout} className="nav-item" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Mobile Hamburger */}
            <button 
              className="btn btn-secondary mobile-only"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div>
              <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span>{isAdmin ? 'Admin' : 'Client'}</span>
                <span>/</span>
                <span style={{ color: 'var(--color-text-strong)', fontWeight: 500 }}>{getPageTitle()}</span>
              </div>
            </div>
          </div>
          <div className="user-profile" ref={dropdownRef} style={{ position: 'relative' }}>
            <button 
              className="avatar-btn" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="User menu"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', borderRadius: '50%' }}
            >
              <div className="avatar" style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-900)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            </button>
            
            {dropdownOpen && (
              <div className="profile-dropdown" style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0, width: '240px', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', padding: '0.5rem 0', zIndex: 50 }}>
                <div className="dropdown-header" style={{ padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ color: 'var(--color-text-strong)', fontSize: '0.95rem' }}>{user?.firstName} {user?.lastName}</strong>
                  <span className="dropdown-email" style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{user?.email}</span>
                </div>
                <div className="dropdown-divider" style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: '0.5rem 0' }}></div>
                
                <Link to={`${basePath}/settings`} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', color: 'var(--color-text-main)', textDecoration: 'none', fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => setDropdownOpen(false)}>
                  <UserIcon size={16} /> My Profile
                </Link>
                
                <button onClick={toggleTheme} className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', color: 'var(--color-text-main)', textDecoration: 'none', fontSize: '0.9rem', cursor: 'pointer', background: 'transparent', border: 'none', textAlign: 'left' }}>
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
                
                <div className="dropdown-divider" style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: '0.5rem 0' }}></div>
                
                <button onClick={logout} className="dropdown-item text-error" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', textDecoration: 'none', fontSize: '0.9rem', cursor: 'pointer', background: 'transparent', border: 'none', textAlign: 'left' }}>
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
