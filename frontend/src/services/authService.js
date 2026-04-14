import { apiClient } from './apiClient';
import { mockApi, shouldUseMockApi } from './mockApi';
import { normalizeUserRecord, pickFirstDefined, unwrapApiData } from './normalizers';

function normalizeAuthResponse(data) {
  const payload = unwrapApiData(data);
  const user = normalizeUserRecord(payload);
  const token = pickFirstDefined(payload?.token, payload?.accessToken, payload?.jwt, payload?.access_token);

  return {
    token,
    refreshToken: pickFirstDefined(payload?.refreshToken, payload?.refresh_token),
    user,
  };
}

export async function login(credentials) {
  if (shouldUseMockApi()) {
    return mockApi.auth.login(credentials);
  }

  const { data } = await apiClient.post('/auth/login', credentials);
  return normalizeAuthResponse(data);
}

export async function register(payload) {
  if (shouldUseMockApi()) {
    return mockApi.auth.register(payload);
  }

  const { data } = await apiClient.post('/auth/register', payload);
  return normalizeAuthResponse(data);
}

export async function getCurrentUser() {
  if (shouldUseMockApi()) {
    return mockApi.auth.getCurrentUser();
  }

  const { data } = await apiClient.get('/auth/me');
  return normalizeUserRecord(data);
}

export async function logout() {
  if (shouldUseMockApi()) {
    return mockApi.auth.logout();
  }

  const { data } = await apiClient.post('/auth/logout');
  return data;
}
