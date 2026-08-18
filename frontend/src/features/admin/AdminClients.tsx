import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { Users, UserPlus, Mail, Building, MoreHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  role: string;
}

const AdminClients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editClient) return;
    setSaving(true);
    try {
      await api.put(`/admin/clients/${editClient._id}`, {
        firstName: editClient.firstName,
        lastName: editClient.lastName,
        companyName: editClient.companyName,
      });
      setEditClient(null);
      fetchClients();
    } catch (error) {
      console.error('Failed to update client:', error);
      alert('Failed to update client');
    } finally {
      setSaving(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data } = await api.get('/admin/clients');
      setClients(data.clients);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <DashboardLayout>
      <div className="dashboard-section">
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 className="text-h2" style={{ margin: 0 }}>Client Management</h2>
            <p className="text-muted text-body" style={{ margin: '0.25rem 0 0 0' }}>Manage your clients and their details</p>
          </div>
          <button className="btn btn-primary" onClick={() => alert('Add Client functionality coming soon!')}>
            <UserPlus size={18} /> Add New Client
          </button>
        </div>

        <div className="card" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <div className="skeleton" style={{ height: '40px', marginBottom: '1rem' }}></div>
              <div className="skeleton" style={{ height: '40px', marginBottom: '1rem' }}></div>
              <div className="skeleton" style={{ height: '40px', marginBottom: '1rem' }}></div>
              <div className="skeleton" style={{ height: '40px' }}></div>
            </div>
          ) : clients.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--color-text-muted)' }}>
                <Users size={32} />
              </div>
              <h3 className="text-h3" style={{ marginBottom: '0.5rem', color: 'var(--color-text-strong)' }}>No clients yet</h3>
              <p className="text-body">Add your first client to start creating invoices.</p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => alert('Add Client functionality coming soon!')}>
                <UserPlus size={18} /> Add Client
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Company</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem' }}>
                            {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                          </div>
                          <div style={{ fontWeight: 600, color: 'var(--color-text-strong)' }}>
                            {client.firstName} {client.lastName}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                          <Mail size={16} /> {client.email}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                          {client.companyName ? (
                            <><Building size={16} /> {client.companyName}</>
                          ) : (
                            <span style={{ fontStyle: 'italic' }}>None provided</span>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', position: 'relative' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.5rem' }} 
                          aria-label="More options"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(openDropdown === client._id ? null : client._id);
                          }}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        
                        {openDropdown === client._id && (
                          <div style={{ position: 'absolute', top: '100%', right: '1rem', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', padding: '0.5rem 0', zIndex: 50, minWidth: '150px', textAlign: 'left' }}>
                            <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-text-main)' }} onClick={() => { setViewClient(client); setOpenDropdown(null); }}>
                              View Details
                            </button>
                            <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-text-main)' }} onClick={() => { setEditClient(client); setOpenDropdown(null); }}>
                              Edit Client
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      <Modal isOpen={!!viewClient} onClose={() => setViewClient(null)} title="Client Details" maxWidth="450px">
        {viewClient && (
          <div style={{ padding: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '50%', 
                background: 'var(--gradient-brand)', color: 'white', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '1.5rem', fontWeight: 700, boxShadow: 'var(--shadow-glow)' 
              }}>
                {viewClient.firstName.charAt(0)}{viewClient.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="text-h3" style={{ margin: 0, color: 'var(--color-text-strong)' }}>
                  {viewClient.firstName} {viewClient.lastName}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  <Mail size={14} /> <span>{viewClient.email}</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid var(--color-border-subtle)' }}>
              <p className="text-caption text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
                <Building size={14} /> Company Information
              </p>
              <p className="text-body font-semibold" style={{ color: 'var(--color-text-strong)', fontSize: '1.1rem' }}>
                {viewClient.companyName || 'No company listed'}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Client Modal */}
      <Modal isOpen={!!editClient} onClose={() => setEditClient(null)} title="Edit Client" maxWidth="500px">
        {editClient && (
          <form onSubmit={handleUpdateClient} style={{ padding: '0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="First Name"
                type="text"
                value={editClient.firstName}
                onChange={e => setEditClient({...editClient, firstName: e.target.value})}
                required
              />
              <Input
                label="Last Name"
                type="text"
                value={editClient.lastName}
                onChange={e => setEditClient({...editClient, lastName: e.target.value})}
                required
              />
            </div>
            
            <div style={{ marginTop: '0.5rem' }}>
              <Input
                label="Company Name"
                type="text"
                value={editClient.companyName || ''}
                onChange={e => setEditClient({...editClient, companyName: e.target.value})}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-subtle)' }}>
              <Button type="button" onClick={() => setEditClient(null)} variant="secondary">
                Cancel
              </Button>
              <Button type="submit" isLoading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

    </DashboardLayout>
  );
};

export default AdminClients;
