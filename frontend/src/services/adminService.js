import { apiClient } from './apiClient';
import { mockApi, shouldUseMockApi } from './mockApi';
import { normalizeListResponse, unwrapApiData } from './normalizers';

export async function getUsers() {
  if (shouldUseMockApi()) {
    return mockApi.admin.getUsers();
  }

  const { data } = await apiClient.get('/users');
  return normalizeListResponse(data, 'users');
}

export async function inviteUser(payload) {
  if (shouldUseMockApi()) {
    return mockApi.admin.inviteUser(payload);
  }

  const { data } = await apiClient.post('/users/invite', payload);
  return unwrapApiData(data);
}

export async function updateUser(id, payload) {
  if (shouldUseMockApi()) {
    return mockApi.admin.updateUser(id, payload);
  }

  const { data } = await apiClient.patch(`/users/${id}`, payload);
  return unwrapApiData(data);
}
