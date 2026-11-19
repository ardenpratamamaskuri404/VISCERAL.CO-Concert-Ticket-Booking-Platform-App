import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3005/api',
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('visceral_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AUTH_PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/verify-login-otp',
  '/auth/resend-login-otp',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// Response interceptor to catch 401 (token expired / invalid) and auto-logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const reqUrl = error.config?.url || '';
    const isPublicAuthCall = AUTH_PUBLIC_ENDPOINTS.some((ep) => reqUrl.includes(ep));

    if (error.response && error.response.status === 401 && !isPublicAuthCall) {
      const hadToken = !!localStorage.getItem('visceral_token');
      localStorage.removeItem('visceral_user');
      localStorage.removeItem('visceral_token');
      localStorage.removeItem('visceral_token_exp');

      if (hadToken) {
        const msg =
          error.response.data?.error ||
          'Sesi login Anda telah habis. Silakan login kembali.';
        sessionStorage.setItem('visceral_session_expired_msg', msg);
        window.dispatchEvent(new CustomEvent('visceral:session-expired', { detail: { message: msg } }));

        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=1';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
