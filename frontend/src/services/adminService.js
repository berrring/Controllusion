import { apiClient } from './apiClient';
import { normalizeListResponse, unwrapApiData } from './normalizers';

export async function getUsers() {
  const { data } = await apiClient.get('/users');
  return normalizeListResponse(data, 'users');
}

export async function inviteUser(payload) {
  const { data } = await apiClient.post('/users/invite', payload);
  return unwrapApiData(data);
}

export async function updateUser(id, payload) {
  const { data } = await apiClient.patch(`/users/${id}`, payload);
  return unwrapApiData(data);
}
