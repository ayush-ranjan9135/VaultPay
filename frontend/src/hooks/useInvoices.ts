import { useState, useCallback } from 'react';
import api from '../services/api';

export const useInvoices = (role: 'admin' | 'client') => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/${role}/invoices`);
      setInvoices(data.invoices || []);
    } catch (err: any) {
      console.error('Failed to fetch invoices:', err);
      setError('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  }, [role]);

  const fetchInvoice = useCallback(async (id: string) => {
    try {
      const { data } = await api.get(`/${role}/invoices/${id}`);
      return data.invoice;
    } catch (err: any) {
      console.error('Failed to fetch invoice details', err);
      return null;
    }
  }, [role]);

  const createInvoice = useCallback(async (payload: any) => {
    if (role !== 'admin') throw new Error('Unauthorized');
    try {
      const { data } = await api.post('/admin/invoices', payload);
      await fetchInvoices();
      return data.invoice;
    } catch (err: any) {
      console.error('Error creating invoice:', err);
      throw err;
    }
  }, [role, fetchInvoices]);

  const updateInvoice = useCallback(async (id: string, payload: any) => {
    if (role !== 'admin') throw new Error('Unauthorized');
    try {
      await api.put(`/admin/invoices/${id}`, payload);
      await fetchInvoices();
    } catch (err: any) {
      console.error('Error updating invoice:', err);
      throw err;
    }
  }, [role, fetchInvoices]);

  const payInvoice = useCallback(async (id: string) => {
    if (role !== 'client') throw new Error('Unauthorized');
    try {
      const { data } = await api.post(`/client/invoices/${id}/pay`);
      return data.checkoutUrl;
    } catch (err: any) {
      console.error('Failed to initiate payment:', err);
      throw err;
    }
  }, [role]);

  return {
    invoices,
    loading,
    error,
    fetchInvoices,
    fetchInvoice,
    createInvoice,
    updateInvoice,
    payInvoice
  };
};
