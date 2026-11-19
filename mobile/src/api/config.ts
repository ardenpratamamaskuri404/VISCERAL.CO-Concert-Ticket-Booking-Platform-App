import { Platform } from 'react-native';
import Constants from 'expo-constants';

const DEFAULT_NGROK_URL = 'https://wisdom-detection-uncharted.ngrok-free.dev';

const extractExpoHost = (): string | null => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
    (Constants as any).manifest?.debuggerHost;

  if (!hostUri || typeof hostUri !== 'string') return null;
  return hostUri.split(':')[0] || null;
};

const isPrivateLanIp = (host: string): boolean => {
  return (
    host.startsWith('192.168.') ||
    host.startsWith('10.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
  );
};

export const getServerUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
  }

  if (Platform.OS === 'web') {
    return 'http://localhost:3005';
  }

  // Native (Expo Go di HP fisik / Emulator): deteksi LAN IP atau tunnel secara otomatis
  const expoHost = extractExpoHost();
  if (expoHost) {
    if (isPrivateLanIp(expoHost)) {
      return `http://${expoHost}:3005`;
    }
    if (expoHost.includes('exp.direct') || expoHost.includes('ngrok')) {
      return DEFAULT_NGROK_URL;
    }
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
