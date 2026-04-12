import { apiClient } from './apiClient';
import { normalizeListResponse, unwrapApiData } from './normalizers';

export async function getCustomers() {
  const { data } = await apiClient.get('/customers');
  return normalizeListResponse(data, 'customers');
}

export async function getCustomerById(id) {
  const { data } = await apiClient.get(`/customers/${id}`);
  return unwrapApiData(data);
}

export async function createCustomer(payload) {
  const { data } = await apiClient.post('/customers', payload);
  return unwrapApiData(data);
}

export async function updateCustomer(id, payload) {
  const { data } = await apiClient.patch(`/customers/${id}`, payload);
  return unwrapApiData(data);
}

export async function deleteCustomer(id) {
  const { data } = await apiClient.delete(`/customers/${id}`);
  return data;
}
