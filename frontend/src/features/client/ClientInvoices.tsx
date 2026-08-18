import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { FileText, CheckCircle, Clock, XCircle, CreditCard, ArrowRight, Download, Eye, X, Printer, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import type { Column } from '../../components/ui/Table';
import { useInvoices } from '../../hooks/useInvoices';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: string;
  total: number;
  notes?: string;
  items: Array<{
    description: string;
    quantity: number;
    amount: number;
  }>;
}

const ClientInvoices: React.FC = () => {
  const { invoices, loading, fetchInvoices, payInvoice } = useInvoices('client');
  const [payingId, setPayingId] = useState<string | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices();

    // Check URL for payment results
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    if (paymentStatus === 'success') {
      alert('Payment successful! Your invoice is being updated.');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'cancelled') {
      alert('Payment cancelled.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Reset payingId if user clicks back button from Stripe checkout
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setPayingId(null);
    };
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setPayingId(null);
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handlePay = async (invoiceId: string) => {
    setPayingId(invoiceId);
    try {
      const checkoutUrl = await payInvoice(invoiceId);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      alert('Failed to initiate payment. Please try again.');
      setPayingId(null);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <span className="badge badge-success"><CheckCircle size={14}/> Paid</span>;
      case 'PENDING':
        return <span className="badge badge-warning"><Clock size={14}/> Pending</span>;
      case 'OVERDUE':
        return <span className="badge badge-error"><XCircle size={14}/> Overdue</span>;
      default:
        return <span className="badge badge-neutral"><FileText size={14}/> {status}</span>;
    }
  };

  const columns: Column<Invoice>[] = [
    {
      key: 'invoiceDetails',
      header: 'Invoice Details',
      render: (inv) => (
        <>
          <div style={{ fontWeight: 600, color: 'var(--color-primary-700)', marginBottom: '0.25rem' }}>{inv.invoiceNumber}</div>
          <div className="text-small text-muted" style={{ marginBottom: '0.25rem' }}>
            Due: {new Date(inv.dueDate).toLocaleDateString()}
          </div>
          {inv.items && inv.items.length > 0 && (
            <div className="text-small text-muted">
              {inv.items[0].description}
            </div>
          )}
        </>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (inv) => <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{formatCurrency(inv.total)}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (inv) => getStatusBadge(inv.status)
    },
    {
      key: 'action',
      header: <div style={{ textAlign: 'right' }}>Action</div>,
      render: (inv) => (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <Button 
            variant="secondary" 
            title="View PDF"
            onClick={() => setViewingInvoice(inv)}
            style={{ padding: '0.5rem' }}
          >
            <Eye size={16} />
          </Button>
          {(inv.status === 'PENDING' || inv.status === 'OVERDUE' || inv.status === 'DRAFT') ? (
            <Button 
              onClick={() => handlePay(inv._id)}
              disabled={payingId === inv._id}
              leftIcon={payingId === inv._id ? undefined : <CreditCard size={16} />}
            >
              {payingId === inv._id ? 'Connecting...' : 'Pay Now'}
            </Button>
          ) : (
            <Button 
              variant="secondary"
              title="Download Receipt"
              leftIcon={<Download size={16} />}
            >
              Receipt
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-section no-print">
        <div style={{ marginBottom: '2rem' }}>
          <h2 className="text-h2">My Invoices</h2>
          <p className="text-muted text-body">View your billing history and make secure payments.</p>
        </div>

        <Card noPadding style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <div className="skeleton" style={{ height: '40px', marginBottom: '1rem' }}></div>
              <div className="skeleton" style={{ height: '60px', marginBottom: '1rem' }}></div>
              <div className="skeleton" style={{ height: '60px', marginBottom: '1rem' }}></div>
            </div>
          ) : invoices.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--color-text-muted)' }}>
                <CheckCircle size={32} />
              </div>
              <h3 className="text-h3" style={{ marginBottom: '0.5rem', color: 'var(--color-text-strong)' }}>You're all caught up!</h3>
              <p className="text-body">You don't have any pending or past invoices.</p>
            </div>
          ) : (
            <Table
              data={invoices}
              columns={columns}
              keyExtractor={(inv) => inv._id}
            />
          )}
        </Card>
      </div>

      {/* Invoice Viewer Modal */}
      <div className={viewingInvoice ? 'printable-invoice-container' : ''}>
        <Modal 
          isOpen={!!viewingInvoice} 
          onClose={() => setViewingInvoice(null)} 
          maxWidth="800px"
        >
          {viewingInvoice && (
            <div className="printable-invoice">
              {/* Modal Header (No Print) */}
              <div className="no-print" style={{ margin: '-1.5rem -1.5rem 0', padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'var(--color-bg-surface)', zIndex: 10 }}>
                <h3 className="text-h3" style={{ margin: 0 }}>Invoice {viewingInvoice.invoiceNumber}</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Button onClick={() => window.print()} leftIcon={<Printer size={16} />}>
                    Download PDF
                  </Button>
                  <Button variant="secondary" onClick={() => setViewingInvoice(null)} style={{ padding: '0.5rem' }}>
                    <X size={20} />
                  </Button>
                </div>
              </div>

              {/* Printable Content */}
              <div style={{ padding: '4rem 3rem', backgroundColor: '#ffffff', color: '#1e293b', position: 'relative', overflow: 'hidden', minHeight: '600px', margin: '0 -1.5rem -1.5rem' }}>
                
                {/* Background Watermark */}
                <div className="no-print-hide" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.03, pointerEvents: 'none', zIndex: 0 }}>
                  <Shield size={600} strokeWidth={1} />
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ background: 'var(--color-primary-600)', padding: '0.5rem', borderRadius: '0.5rem', display: 'inline-flex' }}>
                          <Shield size={24} style={{ color: 'white' }} />
                        </div>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>VaultPay</h2>
                      </div>
                      <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>123 Secure Lane, Tech District<br/>San Francisco, CA 94105<br/>support@vaultpay.com</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <h1 style={{ fontSize: '3rem', fontWeight: 200, color: 'var(--color-primary-600)', margin: '0 0 1rem 0', letterSpacing: '0.05em' }}>INVOICE</h1>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-end', fontSize: '0.95rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem' }}><span style={{ color: '#64748b' }}>Invoice #:</span> <strong style={{ color: '#0f172a' }}>{viewingInvoice.invoiceNumber}</strong></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem' }}><span style={{ color: '#64748b' }}>Issue Date:</span> <strong style={{ color: '#0f172a' }}>{new Date(viewingInvoice.issueDate).toLocaleDateString()}</strong></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem' }}><span style={{ color: '#64748b' }}>Due Date:</span> <strong style={{ color: '#0f172a' }}>{new Date(viewingInvoice.dueDate).toLocaleDateString()}</strong></div>
                      </div>
                      <div style={{ marginTop: '1rem', display: 'inline-block' }}>
                        {getStatusBadge(viewingInvoice.status)}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '3rem', display: 'flex', gap: '4rem' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Bill To</h4>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>Client Portal User</p>
                      <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>client@company.com</p>
                    </div>
                    <div style={{ flex: 1, paddingLeft: '2rem', borderLeft: '2px solid #f1f5f9' }}>
                      <h4 style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Payment Info</h4>
                      <p style={{ color: '#64748b', margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>Securely process via Stripe</p>
                      <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>All major credit cards accepted</p>
                    </div>
                  </div>

                  <div style={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '2rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</th>
                          <th style={{ textAlign: 'right', padding: '1rem 1.5rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qty</th>
                          <th style={{ textAlign: 'right', padding: '1rem 1.5rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</th>
                          <th style={{ textAlign: 'right', padding: '1rem 1.5rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingInvoice.items.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: idx !== viewingInvoice.items.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                            <td style={{ padding: '1.25rem 1.5rem', color: '#1e293b', fontWeight: 500 }}>{item.description}</td>
                            <td style={{ textAlign: 'right', padding: '1.25rem 1.5rem', color: '#64748b' }}>{item.quantity}</td>
                            <td style={{ textAlign: 'right', padding: '1.25rem 1.5rem', color: '#64748b' }}>{formatCurrency(item.amount)}</td>
                            <td style={{ textAlign: 'right', padding: '1.25rem 1.5rem', color: '#0f172a', fontWeight: 600 }}>{formatCurrency(item.quantity * item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, paddingRight: '4rem' }}>
                      {viewingInvoice.notes && (
                        <div>
                          <h4 style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Notes</h4>
                          <p style={{ color: '#64748b', whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.6', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>{viewingInvoice.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div style={{ width: '320px' }}>
                      <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', color: '#64748b' }}>
                          <span>Subtotal</span>
                          <span style={{ color: '#1e293b', fontWeight: 500 }}>{formatCurrency(viewingInvoice.total)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', color: '#64748b', borderBottom: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                          <span>Tax (0%)</span>
                          <span style={{ color: '#1e293b', fontWeight: 500 }}>$0.00</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Total Due</span>
                          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-600)' }}>{formatCurrency(viewingInvoice.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal Footer (No Print) */}
              <div className="no-print" style={{ margin: '0 -1.5rem -1.5rem', padding: '1.5rem 2rem', borderTop: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                {(viewingInvoice.status === 'PENDING' || viewingInvoice.status === 'OVERDUE' || viewingInvoice.status === 'DRAFT') && (
                  <Button 
                    onClick={() => handlePay(viewingInvoice._id)}
                    disabled={payingId === viewingInvoice._id}
                  >
                    {payingId === viewingInvoice._id ? 'Connecting...' : 'Pay Invoice Now'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default ClientInvoices;
