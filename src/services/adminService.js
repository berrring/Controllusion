import { apiClient } from './apiClient';

export async function getUsers() {
  const { data } = await apiClient.get('/users');
  return data;
}

export async function inviteUser(payload) {
  const { data } = await apiClient.post('/users/invite', payload);
  return data;
}

export async function updateUser(id, payload) {
  const { data } = await apiClient.patch(`/users/${id}`, payload);
  return data;
}
