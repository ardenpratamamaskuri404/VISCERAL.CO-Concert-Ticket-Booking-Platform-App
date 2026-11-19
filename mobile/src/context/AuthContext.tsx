import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { AppState, Platform } from 'react-native';
import api, { registerUnauthorizedHandler } from '../api/axios';
import { User } from '../types';

const setStoredToken = async (val: string) => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') localStorage.setItem('visceral_token', val);
  } else {
    await SecureStore.setItemAsync('visceral_token', val);
  }
};

const getStoredToken = async () => {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' ? localStorage.getItem('visceral_token') : null;
  }
  return await SecureStore.getItemAsync('visceral_token');
};

const deleteStoredToken = async () => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') localStorage.removeItem('visceral_token');
  } else {
    await SecureStore.deleteItemAsync('visceral_token');
  }
};

// Base64URL decoder compatible with Web & React Native (Hermes)
const decodeBase64Url = (input: string): string | null => {
  try {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    if (typeof atob === 'function') {
      return atob(padded);
    }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    for (let bc = 0, bs = 0, buffer, i = 0; (buffer = padded.charAt(i++)); ) {
      const idx = chars.indexOf(buffer);
      if (idx === -1) continue;
      bs = bc % 4 ? bs * 64 + idx : idx;
      if (bc++ % 4) output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
    }
    return output;
  } catch {
    return null;
  }
};

const getTokenExpiryMs = (jwtToken: string | null): number | null => {
  if (!jwtToken) return null;
  const parts = jwtToken.split('.');
  if (parts.length !== 3) return null;
  const decoded = decodeBase64Url(parts[1]);
  if (!decoded) return null;
  try {
    const payload = JSON.parse(decoded);
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

interface LoginResult {
  success: boolean;
  requiresOtp?: boolean;
  email?: string;
  otpExpiresInSeconds?: number;
  message?: string;
  user?: User;
  error?: string;
}

interface VerifyOtpResult {
  success: boolean;
  user?: User;
  expiresInHours?: number;
  error?: string;
}

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  sessionExpiresAt: string | null;
  sessionExpiredMessage: string | null;
  clearSessionExpiredMessage: () => void;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  verifyLoginOtp: (email: string, otp: string) => Promise<VerifyOtpResult>;
  resendLoginOtp: (email: string, password: string) => Promise<{ success: boolean; otpExpiresInSeconds?: number; message?: string; error?: string }>;
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
  const [sessionExpiresAt, setSessionExpiresAt] = useState<string | null>(null);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSessionExpiredMessage = useCallback(() => {
    setSessionExpiredMessage(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await deleteStoredToken();
      await AsyncStorage.removeItem('visceral_user');
    } catch (e) {
      console.warn('Logout cleanup error:', e);
    }
    setToken(null);
    setCurrentUser(null);
    setSessionExpiresAt(null);
  }, []);

  const forceExpireLogout = useCallback(
    async (msg?: string) => {
      await logout();
      setSessionExpiredMessage(msg || 'Batas waktu sesi login Anda telah berakhir. Silakan login kembali.');
    },
    [logout]
  );

  // Register 401 handler from axios interceptor
  useEffect(() => {
    registerUnauthorizedHandler((msg) => {
      forceExpireLogout(msg);
    });
    return () => registerUnauthorizedHandler(null);
  }, [forceExpireLogout]);

  // Restore session on app launch (reject if expired)
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await getStoredToken();
        const storedUser = await AsyncStorage.getItem('visceral_user');

        if (storedToken && storedUser) {
          const expMs = getTokenExpiryMs(storedToken);
          if (expMs && Date.now() >= expMs) {
            await deleteStoredToken();
            await AsyncStorage.removeItem('visceral_user');
            setSessionExpiredMessage('Sesi login Anda telah habis. Silakan login kembali.');
          } else {
            setToken(storedToken);
            setCurrentUser(JSON.parse(storedUser));
            if (expMs) setSessionExpiresAt(new Date(expMs).toISOString());
          }
        }
      } catch (e) {
        console.warn('Failed to restore session:', e);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  // Active auto-logout timer + AppState foreground check while logged in
  useEffect(() => {
    if (!token || !currentUser) return;

    const expMs = getTokenExpiryMs(token);
    if (!expMs || Date.now() >= expMs) {
      forceExpireLogout('Batas waktu sesi login Anda telah berakhir. Silakan login kembali.');
      return;
    }

    // Cek validitas sesi ke backend middleware
    api.get('/auth/session').catch(() => {
      // 401 ditangani oleh unauthorized handler
    });

    const remainingMs = expMs - Date.now();
    const timer = setTimeout(() => {
      forceExpireLogout('Batas waktu sesi login Anda telah berakhir. Silakan login kembali.');
    }, Math.min(remainingMs, 2147483647));

    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        const currentExp = getTokenExpiryMs(token);
        if (!currentExp || Date.now() >= currentExp) {
          forceExpireLogout('Batas waktu sesi login Anda telah berakhir. Silakan login kembali.');
        }
      }
    });

    return () => {
      clearTimeout(timer);
      appStateSub.remove();
    };
  }, [token, currentUser, forceExpireLogout]);

  const persistSession = async (newToken: string, user: User, expiresAt?: string) => {
    await setStoredToken(newToken);
    await AsyncStorage.setItem('visceral_user', JSON.stringify(user));
    setToken(newToken);
    setCurrentUser(user);
    setSessionExpiredMessage(null);
    const expMs = expiresAt ? new Date(expiresAt).getTime() : getTokenExpiryMs(newToken);
    setSessionExpiresAt(expMs ? new Date(expMs).toISOString() : null);
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const res = await api.post('/auth/login', { email: email.trim(), password });

      if (res.data?.requiresOtp) {
        return {
          success: true,
          requiresOtp: true,
          email: res.data.email || email.trim(),
          otpExpiresInSeconds: res.data.otpExpiresInSeconds || 300,
          message: res.data.message,
        };
      }

      const { token: newToken, user, expiresAt } = res.data;
      await persistSession(newToken, user, expiresAt);
      return { success: true, user };
    } catch (e: any) {
      const msg = e.response?.data?.error || 'Login gagal. Coba lagi.';
      return { success: false, error: msg };
    }
  };

  const verifyLoginOtp = async (email: string, otp: string): Promise<VerifyOtpResult> => {
    try {
      const res = await api.post('/auth/verify-login-otp', {
        email: email.trim(),
        otp: otp.trim(),
      });
      const { token: newToken, user, expiresAt, expiresInHours } = res.data;
      await persistSession(newToken, user, expiresAt);
      return { success: true, user, expiresInHours };
    } catch (e: any) {
      const msg = e.response?.data?.error || 'Verifikasi OTP gagal. Coba lagi.';
      return { success: false, error: msg };
    }
  };

  const resendLoginOtp = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/resend-login-otp', {
        email: email.trim(),
        password,
      });
      return {
        success: true,
        otpExpiresInSeconds: res.data.otpExpiresInSeconds || 300,
        message: res.data.message,
      };
    } catch (e: any) {
      const msg = e.response?.data?.error || 'Gagal mengirim ulang OTP.';
      return { success: false, error: msg };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await api.post('/auth/register', data);
      const { token: newToken, user, expiresAt } = res.data;
      await persistSession(newToken, user, expiresAt);
      return { success: true };
    } catch (e: any) {
      const msg = e.response?.data?.error || 'Registrasi gagal. Coba lagi.';
      return { success: false, error: msg };
    }
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
        sessionExpiresAt,
        sessionExpiredMessage,
        clearSessionExpiredMessage,
        isLoading,
        isLoggedIn: !!currentUser && !!token,
        login,
        verifyLoginOtp,
        resendLoginOtp,
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
