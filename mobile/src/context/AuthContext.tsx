import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import api from '../api/axios';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app launch
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('visceral_token');
      const storedUser = await AsyncStorage.getItem('visceral_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Failed to restore session:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: newToken, user } = res.data;

      await SecureStore.setItemAsync('visceral_token', newToken);
      await AsyncStorage.setItem('visceral_user', JSON.stringify(user));

      setToken(newToken);
      setCurrentUser(user);

      return { success: true };
    } catch (e: any) {
      const msg = e.response?.data?.error || 'Login gagal. Coba lagi.';
      return { success: false, error: msg };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await api.post('/auth/register', data);
      const { token: newToken, user } = res.data;

      await SecureStore.setItemAsync('visceral_token', newToken);
      await AsyncStorage.setItem('visceral_user', JSON.stringify(user));

      setToken(newToken);
      setCurrentUser(user);

      return { success: true };
    } catch (e: any) {
      const msg = e.response?.data?.error || 'Registrasi gagal. Coba lagi.';
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('visceral_token');
      await AsyncStorage.removeItem('visceral_user');
    } catch (e) {
      console.warn('Logout cleanup error:', e);
    }
    setToken(null);
    setCurrentUser(null);
  };

  const updateUser = async (user: User) => {
    setCurrentUser(user);
    await AsyncStorage.setItem('visceral_user', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isLoading,
        isLoggedIn: !!currentUser && !!token,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
