import axios from 'axios';

const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const envBase = import.meta?.env?.VITE_API_BASE?.replace(/\/$/, '');
const baseURL = envBase
  ? `${envBase}/api`
  : isLocalhost
    ? 'http://localhost:3001/api'
    : 'https://gainvault.onrender.com/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// ✅ Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle expired/invalid tokens gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('⚠️ Token invalid/expired, logging out');
      localStorage.removeItem('auth_token');
      // ❌ Removed window.location.reload()
      // Let `useAuth.checkAuthStatus` handle it naturally
    }
    return Promise.reject(error);
  }
);

export default api;
