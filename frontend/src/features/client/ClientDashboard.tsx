import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { DollarSign, CheckCircle2, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';

const ClientDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/client/stats');
        setStats(data.data);
      } catch (error) {
        console.error('Failed to fetch client stats', error);
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
        <h2 className="text-h2">Client Overview</h2>
        <p className="text-muted">Track your outstanding balances and payment history.</p>
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
                  Total Billed
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
                  Amount Paid
                </h3>
                <div style={{ padding: '8px', backgroundColor: 'var(--color-success-50)', borderRadius: '8px', color: 'var(--color-success-700)' }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <div className="stat-value text-success">{formatCurrency(stats?.paidAmount)}</div>
            </Card>

            <Card className="stat-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', border: stats?.pendingAmount > 0 ? '1px solid var(--color-error-500)' : '1px solid var(--color-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, textTransform: 'none', color: 'var(--color-text-muted)' }}>
                  Amount Due
                </h3>
                <div style={{ padding: '8px', backgroundColor: 'var(--color-error-50)', borderRadius: '8px', color: 'var(--color-error-700)' }}>
                  <AlertCircle size={20} />
                </div>
              </div>
              <div className="stat-value text-error">{formatCurrency(stats?.pendingAmount)}</div>
            </Card>

            <Card className="stat-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, textTransform: 'none', color: 'var(--color-text-muted)' }}>
                  Total Invoices
                </h3>
                <div style={{ padding: '8px', backgroundColor: 'var(--color-primary-50)', borderRadius: '8px', color: 'var(--color-primary-700)' }}>
                  <FileText size={20} />
                </div>
              </div>
              <div className="stat-value">{stats?.totalInvoices || 0}</div>
            </Card>
          </>
        )}
      </div>

      <div className="dashboard-section" style={{ marginTop: '3rem' }}>
        <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>Action Center</h3>
        {loading ? (
          <div className="card skeleton" style={{ height: '150px' }}></div>
        ) : stats?.pendingAmount > 0 ? (
          <Card style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-bg-surface)', borderLeft: '4px solid var(--color-error-500)' }}>
            <div>
              <h4 className="text-h3 text-error" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} /> Action Required
              </h4>
              <p className="text-muted">You have an outstanding balance of {formatCurrency(stats?.pendingAmount)}. Please review and process your payment.</p>
            </div>
            <Link to="/client/invoices" className="btn btn-danger">
              View Invoices <ArrowRight size={18} />
            </Link>
          </Card>
        ) : (
          <Card style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: 'var(--color-bg-surface)' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-success-50)', color: 'var(--color-success-500)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle2 size={24} />
            </div>
            <h4 className="text-body font-semibold" style={{ marginBottom: '0.5rem' }}>All Caught Up!</h4>
            <p className="text-muted text-small">You have no outstanding invoices to pay.</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
