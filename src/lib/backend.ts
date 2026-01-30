import { Configuration } from '@/configuration';
import { useAuthStore } from '@/store/auth.store';
import axios from 'axios';

export const backend = axios.create({
  baseURL: Configuration.backend_url,
});

backend.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
