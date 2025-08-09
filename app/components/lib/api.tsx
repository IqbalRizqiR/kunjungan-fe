// lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001', // Sesuaikan dengan backendmu
  withCredentials: true, // Jika perlu untuk cookie atau session
});

// JWT Token? Tambahkan interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Or context
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};