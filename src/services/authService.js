import { apiClient } from './apiClient';

export async function login(credentials) {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data;
}

export async function register(payload) {
  const { data } = await apiClient.post('/auth/register', payload);
  return data;
}

export async function getCurrentUser() {
  const { data } = await apiClient.get('/auth/me');
  return data;
}

export async function updateProfile(payload) {
  const { data } = await apiClient.patch('/auth/profile', payload);
  return data;
}

export async function changePassword(payload) {
  const { data } = await apiClient.post('/auth/change-password', payload);
  return data;
}

export async function logout() {
  const { data } = await apiClient.post('/auth/logout');
  return data;
}
