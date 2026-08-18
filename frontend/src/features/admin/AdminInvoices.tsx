import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { Plus, FileText, CheckCircle, Clock, XCircle, FilePlus, X, ArrowRight, ArrowLeft, MoreHorizontal, Eye, Edit } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import type { Column } from '../../components/ui/Table';
import { useInvoices } from '../../hooks/useInvoices';
import { useClients } from '../../hooks/useClients';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    companyName?: string;
  };
  issueDate: string;
  dueDate: string;
  status: string;
  total: number;
  subtotal?: number;
  tax?: number;
  notes?: string;
  items?: Array<{ description: string, quantity: number, unitPrice: number, amount: number }>;
}

interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
}

const AdminInvoices: React.FC = () => {
  const { invoices, loading: invoicesLoading, fetchInvoices, fetchInvoice, createInvoice, updateInvoice } = useInvoices('admin');
  const { clients, loading: clientsLoading, fetchClients } = useClients();
  
  const loading = invoicesLoading || clientsLoading;

  const [showModal, setShowModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // View/Edit State
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [editInvoice, setEditInvoice] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  
  // Wizard State
  const [step, setStep] = useState(1);
  const [creating, setCreating] = useState(false);

  // Form State
  const [clientId, setClientId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, [fetchInvoices, fetchClients]);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleViewDetails = async (id: string) => {
    setOpenDropdown(null);
    const invoice = await fetchInvoice(id);
    if (invoice) setViewInvoice(invoice);
  };

  const handleEditInvoiceAction = async (id: string) => {
    setOpenDropdown(null);
    const invoice = await fetchInvoice(id);
    if (invoice) {
      setEditInvoice({
        ...invoice,
        dueDate: invoice.dueDate ? invoice.dueDate.split('T')[0] : '',
      });
    }
  };

  const handleUpdateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateInvoice(editInvoice._id, {
        dueDate: editInvoice.dueDate,
        status: editInvoice.status,
        notes: editInvoice.notes
      });
      setEditInvoice(null);
    } catch (error) {
      alert('Failed to update invoice');
    } finally {
      setSaving(false);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientId) setStep(2);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const amountInCents = Math.round(parseFloat(amount) * 100);
      await createInvoice({
        clientId,
        dueDate,
        notes,
        items: [{ description, quantity: 1, unitPrice: amountInCents, amount: amountInCents }]
      });
      closeModal();
    } catch (error) {
      alert('Failed to create invoice');
    } finally {
      setCreating(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setClientId('');
    setDueDate('');
    setDescription('');
    setAmount('');
    setNotes('');
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

  const getSelectedClient = () => clients.find(c => c._id === clientId);

  const columns: Column<Invoice>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice',
      render: (inv) => <span style={{ fontWeight: 600, color: 'var(--color-primary-700)' }}>{inv.invoiceNumber}</span>
    },
    {
      key: 'client',
      header: 'Client',
      render: (inv) => (
        <>
          <div style={{ fontWeight: 500, color: 'var(--color-text-strong)' }}>{inv.clientId.firstName} {inv.clientId.lastName}</div>
          <div className="text-caption text-muted">{inv.clientId.email}</div>
        </>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (inv) => <span style={{ fontWeight: 600 }}>{formatCurrency(inv.total)}</span>
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (inv) => <span className="text-muted">{new Date(inv.dueDate).toLocaleDateString()}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (inv) => getStatusBadge(inv.status)
    },
    {
      key: 'actions',
      header: <div style={{ textAlign: 'right' }}>Actions</div>,
      render: (inv) => (
        <div style={{ textAlign: 'right', position: 'relative' }}>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem' }} 
            aria-label="More options"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdown(openDropdown === inv._id ? null : inv._id);
            }}
          >
            <MoreHorizontal size={18} />
          </button>
          
          {openDropdown === inv._id && (
            <div style={{ position: 'absolute', top: '100%', right: '1rem', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', padding: '0.5rem 0', zIndex: 50, minWidth: '180px', textAlign: 'left' }}>
              <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-text-main)' }} onClick={(e) => { e.stopPropagation(); handleViewDetails(inv._id); }}>
                <Eye size={16} /> View Details
              </button>
              <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-text-main)' }} onClick={(e) => { e.stopPropagation(); handleEditInvoiceAction(inv._id); }}>
                <Edit size={16} /> Edit Invoice
              </button>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-section">
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 className="text-h2" style={{ margin: 0 }}>All Invoices</h2>
            <p className="text-muted text-body" style={{ margin: '0.25rem 0 0 0' }}>Manage and track all client billing</p>
          </div>
          <Button onClick={() => setShowModal(true)} leftIcon={<FilePlus size={18} />}>
            Create Invoice
          </Button>
        </div>

        <Card noPadding>
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <div className="skeleton" style={{ height: '40px', marginBottom: '1rem' }}></div>
              <div className="skeleton" style={{ height: '40px', marginBottom: '1rem' }}></div>
              <div className="skeleton" style={{ height: '40px', marginBottom: '1rem' }}></div>
              <div className="skeleton" style={{ height: '40px' }}></div>
            </div>
          ) : invoices.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--color-text-muted)' }}>
                <FileText size={32} />
              </div>
              <h3 className="text-h3" style={{ marginBottom: '0.5rem', color: 'var(--color-text-strong)' }}>No invoices generated</h3>
              <p className="text-body">Create your first invoice to start billing clients.</p>
              <Button onClick={() => setShowModal(true)} style={{ marginTop: '1.5rem' }} leftIcon={<FilePlus size={18} />}>
                Create Invoice
              </Button>
            </div>
          ) : (
            <Table 
              data={invoices} 
              columns={columns} 
              keyExtractor={(inv) => inv._id}
            />
          )}
        </Card>

        {/* Create Invoice Wizard Modal */}
        <Modal isOpen={showModal} onClose={closeModal} title={`Create Invoice (Step ${step} of 2)`}>
          {step === 1 ? (
            <form onSubmit={handleNextStep}>
              <div className="form-group">
                <label className="form-label">Select Client</label>
                <select 
                  className="form-input" 
                  value={clientId} 
                  onChange={e => setClientId(e.target.value)}
                  required
                >
                  <option value="">-- Choose a Client --</option>
                  {clients.map(c => (
                    <option key={c._id} value={c._id}>{c.firstName} {c.lastName} ({c.email})</option>
                  ))}
                </select>
                {clients.length === 0 && (
                  <p className="text-caption text-error" style={{ marginTop: '0.5rem' }}>No clients found. Please add a client first.</p>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <Button type="submit" disabled={!clientId} rightIcon={<ArrowRight size={18} />}>
                  Next Step
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreateInvoice}>
              <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <p className="text-caption text-muted" style={{ margin: 0 }}>Billing to:</p>
                <p className="text-body font-semibold" style={{ margin: 0, color: 'var(--color-text-strong)' }}>
                  {getSelectedClient()?.firstName} {getSelectedClient()?.lastName}
                </p>
              </div>

              <Input
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                required
              />

              <Input
                label="Item Description"
                type="text"
                placeholder="e.g. Web Development Retainer"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />

              <div className="form-group w-full">
                <label className="form-label">Amount (USD)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontWeight: 500 }}>$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    min="1"
                    className="form-input" 
                    style={{ paddingLeft: '2rem', width: '100%' }}
                    placeholder="1500.00"
                    value={amount} 
                    onChange={e => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group w-full">
                <label className="form-label">Notes (Optional)</label>
                <textarea 
                  className="form-input" 
                  style={{ width: '100%', resize: 'vertical' }}
                  rows={3}
                  placeholder="Thank you for your business..."
                  value={notes} 
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <Button type="button" onClick={() => setStep(1)} variant="secondary" fullWidth leftIcon={<ArrowLeft size={18} />}>
                  Back
                </Button>
                <Button type="submit" isLoading={creating} fullWidth leftIcon={!creating && <CheckCircle size={18} />}>
                  Send Invoice
                </Button>
              </div>
            </form>
          )}
        </Modal>

        {/* View Details Modal */}
        <Modal isOpen={!!viewInvoice} onClose={() => setViewInvoice(null)} title="Invoice Details" maxWidth="700px">
          {viewInvoice && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                  <h4 className="text-h4">{viewInvoice.invoiceNumber}</h4>
                  <p className="text-muted text-small">Issued: {new Date(viewInvoice.issueDate).toLocaleDateString()}</p>
                  <p className="text-muted text-small">Due: {new Date(viewInvoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {getStatusBadge(viewInvoice.status)}
                  <h2 className="text-h2" style={{ margin: '0.5rem 0 0 0' }}>{formatCurrency(viewInvoice.total)}</h2>
                </div>
              </div>
              
              <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <h5 className="text-caption text-muted" style={{ margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>Billed To</h5>
                <p className="text-body font-semibold" style={{ margin: 0 }}>{viewInvoice.clientId.firstName} {viewInvoice.clientId.lastName}</p>
                <p className="text-body text-muted" style={{ margin: 0 }}>{viewInvoice.clientId.email}</p>
                {viewInvoice.clientId.companyName && <p className="text-body text-muted" style={{ margin: 0 }}>{viewInvoice.clientId.companyName}</p>}
              </div>

              <Table 
                data={viewInvoice.items || []}
                keyExtractor={(_, idx) => String(idx)}
                columns={[
                  { key: 'description', header: 'Description', render: (item) => item.description },
                  { key: 'quantity', header: <div style={{ textAlign: 'center' }}>Qty</div>, render: (item) => <div style={{ textAlign: 'center' }}>{item.quantity}</div> },
                  { key: 'price', header: <div style={{ textAlign: 'right' }}>Price</div>, render: (item) => <div style={{ textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</div> },
                  { key: 'amount', header: <div style={{ textAlign: 'right' }}>Amount</div>, render: (item) => <div style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.amount)}</div> }
                ]}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                <div style={{ flex: 1, paddingRight: '2rem' }}>
                  {viewInvoice.notes && (
                    <>
                      <h5 className="text-caption text-muted" style={{ margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>Notes</h5>
                      <p className="text-small text-muted">{viewInvoice.notes}</p>
                    </>
                  )}
                </div>
                <div style={{ width: '250px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="text-muted">Subtotal</span>
                    <span>{formatCurrency(viewInvoice.subtotal || 0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span className="text-muted">Tax</span>
                    <span>{formatCurrency(viewInvoice.tax || 0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.125rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.5rem' }}>
                    <span>Total</span>
                    <span>{formatCurrency(viewInvoice.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Edit Invoice Modal */}
        <Modal isOpen={!!editInvoice} onClose={() => setEditInvoice(null)} title="Edit Invoice" maxWidth="500px">
          {editInvoice && (
            <form onSubmit={handleUpdateInvoice}>
              <div className="form-group">
                <label className="form-label">Invoice Status</label>
                <select 
                  className="form-input"
                  style={{ width: '100%' }}
                  value={editInvoice.status}
                  onChange={e => setEditInvoice({...editInvoice, status: e.target.value})}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>
              
              <Input
                label="Due Date"
                type="date"
                value={editInvoice.dueDate}
                onChange={e => setEditInvoice({...editInvoice, dueDate: e.target.value})}
                required
              />

              <div className="form-group w-full">
                <label className="form-label">Notes</label>
                <textarea 
                  className="form-input" 
                  style={{ width: '100%', resize: 'vertical' }}
                  rows={4}
                  value={editInvoice.notes || ''}
                  onChange={e => setEditInvoice({...editInvoice, notes: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <Button type="button" onClick={() => setEditInvoice(null)} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit" isLoading={saving}>
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </Modal>

      </div>
    </DashboardLayout>
  );
};

export default AdminInvoices;
