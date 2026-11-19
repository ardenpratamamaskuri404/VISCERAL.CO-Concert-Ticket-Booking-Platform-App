import { Platform } from 'react-native';

export const getServerUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3005';
  }
  return 'http://localhost:3005';
};

export const SERVER_URL = getServerUrl();
export const API_URL = `${SERVER_URL}/api`;

export const getAssetUrl = (
  url?: string | null,
  folder: 'events' | 'artists' | 'users' = 'events'
): string | null => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SERVER_URL}/assets/${folder}/${url}`;
};
