import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { AppProvider, useApp } from '../src/context/AppContext';
import { Colors, getThemeColors } from '../src/constants/theme';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

function SessionRedirectGuard() {
  const { isLoggedIn, isLoading, sessionExpiredMessage } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!isLoggedIn && sessionExpiredMessage && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn, isLoading, sessionExpiredMessage, segments, router]);

  return null;
}

function ThemedAppShell() {
  const { darkMode } = useApp();
  const theme = getThemeColors(darkMode);

  return (
    <>
      <SessionRedirectGuard />
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="(auth)" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="event/[id]" />
        <Stack.Screen name="checkout/[eventId]" />
        <Stack.Screen name="payment/[orderId]" />
        <Stack.Screen name="order-success/[orderId]" options={{ animation: 'fade' }} />
        <Stack.Screen name="ticket/[id]" />
        <Stack.Screen name="chat" options={{ animation: 'slide_from_bottom' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Hide splash after a short delay for smooth transition
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppProvider>
          <ThemedAppShell />
        </AppProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
