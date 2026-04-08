import { useEffect, useState } from 'react';
import * as customerService from '../services/customerService';

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadCustomers() {
    setLoading(true);
    setError('');
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load customers.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCustomers();
  }, []);

  async function createItem(payload) {
    const customer = await customerService.createCustomer(payload);
    setCustomers((current) => [customer, ...current]);
    return customer;
  }

  async function updateItem(id, payload) {
    const customer = await customerService.updateCustomer(id, payload);
    setCustomers((current) => current.map((item) => (item.id === id ? customer : item)));
    return customer;
  }

  async function removeItem(id) {
    await customerService.deleteCustomer(id);
    setCustomers((current) => current.filter((item) => item.id !== id));
  }

  return {
    customers,
    loading,
    error,
    refetch: loadCustomers,
    createItem,
    updateItem,
    removeItem,
    setCustomers,
  };
}
