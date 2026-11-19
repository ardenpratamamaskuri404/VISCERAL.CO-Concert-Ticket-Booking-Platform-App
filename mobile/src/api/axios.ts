import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_URL } from './config';

let onUnauthorizedCallback: ((message?: string) => void) | null = null;

export const registerUnauthorizedHandler = (cb: ((message?: string) => void) | null) => {
  onUnauthorizedCallback = cb;
};

const AUTH_PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/verify-login-otp',
  '/auth/resend-login-otp',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      let token = null;
      if (Platform.OS === 'web') {
        token = typeof window !== 'undefined' ? localStorage.getItem('visceral_token') : null;
      } else {
        token = await SecureStore.getItemAsync('visceral_token');
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Failed to get token:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (expired/invalid session token)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const reqUrl = error.config?.url || '';
    const isPublicAuthCall = AUTH_PUBLIC_ENDPOINTS.some((ep) => reqUrl.includes(ep));

    if (error.response && error.response.status === 401 && !isPublicAuthCall) {
      try {
        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined') localStorage.removeItem('visceral_token');
        } else {
          await SecureStore.deleteItemAsync('visceral_token');
        }
      } catch (e) {
        // Ignore cleanup errors
      }
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback(
          error.response?.data?.error || 'Sesi login Anda telah habis. Silakan login kembali.'
        );
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper to update baseURL dynamically (for connecting to local network IP)
export const setApiBaseUrl = (url: string) => {
  api.defaults.baseURL = url;
};
