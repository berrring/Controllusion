import { apiClient } from './apiClient';
import { normalizeUserRecord, unwrapApiData } from './normalizers';

export async function getProfile() {
  const { data } = await apiClient.get('/auth/me');
  return normalizeUserRecord(data);
}

export async function updateProfile(payload) {
  const { data } = await apiClient.patch('/auth/profile', payload);
  return normalizeUserRecord(data);
}

export async function changePassword(payload) {
  const { data } = await apiClient.post('/auth/change-password', payload);
  return unwrapApiData(data);
}
