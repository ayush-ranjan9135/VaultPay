import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { DollarSign, TrendingUp, Clock, Users, ArrowUpRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data.data);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((amount || 0) / 100);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="text-h2">Dashboard Overview</h2>
        <p className="text-muted">Monitor your revenue and client activity at a glance.</p>
      </div>

      <div className="stats-grid">
        {loading ? (
          <>
            <div className="stat-card skeleton" style={{ height: '140px' }}></div>
            <div className="stat-card skeleton" style={{ height: '140px' }}></div>
            <div className="stat-card skeleton" style={{ height: '140px' }}></div>
            <div className="stat-card skeleton" style={{ height: '140px' }}></div>
          </>
        ) : (
          <>
            <Card className="stat-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, textTransform: 'none', color: 'var(--color-text-muted)' }}>
                  Total Volume
                </h3>
                <div style={{ padding: '8px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '8px', color: 'var(--color-text-strong)' }}>
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="stat-value">{formatCurrency(stats?.totalAmount)}</div>
            </Card>

            <Card className="stat-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, textTransform: 'none', color: 'var(--color-text-muted)' }}>
                  Paid Revenue
                </h3>
                <div style={{ padding: '8px', backgroundColor: 'var(--color-success-50)', borderRadius: '8px', color: 'var(--color-success-700)' }}>
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="stat-value text-success">{formatCurrency(stats?.paidAmount)}</div>
            </Card>

            <Card className="stat-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, textTransform: 'none', color: 'var(--color-text-muted)' }}>
                  Pending Receivables
                </h3>
                <div style={{ padding: '8px', backgroundColor: 'var(--color-warning-50)', borderRadius: '8px', color: 'var(--color-warning-700)' }}>
                  <Clock size={20} />
                </div>
              </div>
              <div className="stat-value text-warning">{formatCurrency(stats?.pendingAmount)}</div>
            </Card>

            <Card className="stat-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, textTransform: 'none', color: 'var(--color-text-muted)' }}>
                  Active Clients
                </h3>
                <div style={{ padding: '8px', backgroundColor: 'var(--color-primary-50)', borderRadius: '8px', color: 'var(--color-primary-700)' }}>
                  <Users size={20} />
                </div>
              </div>
              <div className="stat-value">{stats?.clientCount || 0}</div>
            </Card>
          </>
        )}
      </div>

      <div className="dashboard-section" style={{ marginTop: '3rem' }}>
        <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>Recent Activity</h3>
        <Card style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          {loading ? (
            <div className="skeleton" style={{ height: '24px', width: '200px', margin: '0 auto' }}></div>
          ) : (
            <>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--color-text-muted)' }}>
                <Clock size={24} />
              </div>
              <h4 className="text-body font-semibold" style={{ marginBottom: '0.5rem' }}>No recent activity</h4>
              <p className="text-muted text-small">Create an invoice or add a client to see activity here.</p>
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
