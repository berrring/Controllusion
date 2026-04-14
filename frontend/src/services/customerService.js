import { apiClient } from './apiClient';
import { mockApi, shouldUseMockApi } from './mockApi';
import { normalizeListResponse, unwrapApiData } from './normalizers';

export async function getCustomers() {
  if (shouldUseMockApi()) {
    return mockApi.customers.getCustomers();
  }

  const { data } = await apiClient.get('/customers');
  return normalizeListResponse(data, 'customers');
}

export async function getCustomerById(id) {
  if (shouldUseMockApi()) {
    return mockApi.customers.getCustomerById(id);
  }

  const { data } = await apiClient.get(`/customers/${id}`);
  return unwrapApiData(data);
}

export async function createCustomer(payload) {
  if (shouldUseMockApi()) {
    return mockApi.customers.createCustomer(payload);
  }

  const { data } = await apiClient.post('/customers', payload);
  return unwrapApiData(data);
}

export async function updateCustomer(id, payload) {
  if (shouldUseMockApi()) {
    return mockApi.customers.updateCustomer(id, payload);
  }

  const { data } = await apiClient.patch(`/customers/${id}`, payload);
  return unwrapApiData(data);
}

export async function deleteCustomer(id) {
  if (shouldUseMockApi()) {
    return mockApi.customers.deleteCustomer(id);
  }

  const { data } = await apiClient.delete(`/customers/${id}`);
  return data;
}
