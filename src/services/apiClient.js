import axios from 'axios';
import { attachMockAdapter } from './mockServer';
import { getSession } from './storage';

export const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.request.use((config) => {
  const session = getSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

attachMockAdapter(apiClient);
