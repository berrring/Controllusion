import { apiClient } from './apiClient';
import { mockApi, shouldUseMockApi } from './mockApi';
import { normalizeUserRecord, unwrapApiData } from './normalizers';

export async function getProfile() {
  if (shouldUseMockApi()) {
    return mockApi.profile.getProfile();
  }

  const { data } = await apiClient.get('/auth/me');
  return normalizeUserRecord(data);
}

export async function updateProfile(payload) {
  if (shouldUseMockApi()) {
    return mockApi.profile.updateProfile(payload);
  }

  const { data } = await apiClient.patch('/auth/profile', payload);
  return normalizeUserRecord(data);
}

export async function changePassword(payload) {
  if (shouldUseMockApi()) {
    return mockApi.profile.changePassword(payload);
  }

  const { data } = await apiClient.post('/auth/change-password', payload);
  return unwrapApiData(data);
}
