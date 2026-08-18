import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { Users, UserPlus, Mail, Building, MoreHorizontal } from 'lucide-react';

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

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
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
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem' }} aria-label="More options">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminClients;
