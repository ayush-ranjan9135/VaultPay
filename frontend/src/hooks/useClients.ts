import { useState, useCallback } from 'react';
import api from '../services/api';

export const useClients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/admin/clients');
      setClients(data.clients || []);
    } catch (err: any) {
      console.error('Failed to fetch clients:', err);
      setError('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  }, []);

  const createClient = useCallback(async (payload: any) => {
    try {
      const { data } = await api.post('/admin/clients', payload);
      await fetchClients();
      return data.client;
    } catch (err: any) {
      console.error('Error creating client:', err);
      throw err;
    }
  }, [fetchClients]);

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient
  };
};
