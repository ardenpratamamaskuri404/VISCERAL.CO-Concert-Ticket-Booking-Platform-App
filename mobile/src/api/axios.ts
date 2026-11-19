import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_URL } from './config';

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

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token expired or invalid — clear stored data
      try {
        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined') localStorage.removeItem('visceral_token');
        } else {
          await SecureStore.deleteItemAsync('visceral_token');
        }
      } catch (e) {
        // Ignore cleanup errors
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
