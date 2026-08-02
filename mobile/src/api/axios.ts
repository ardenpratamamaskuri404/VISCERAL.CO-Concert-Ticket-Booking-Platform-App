import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Untuk Android emulator gunakan 10.0.2.2, untuk device fisik gunakan IP lokal
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3005/api'; // Android emulator
  }
  return 'http://localhost:3005/api'; // iOS simulator
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('visceral_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Failed to get token from SecureStore:', e);
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
        await SecureStore.deleteItemAsync('visceral_token');
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
