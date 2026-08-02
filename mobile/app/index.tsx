import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { Colors } from '../src/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate logo
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Pulse effect
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Show tagline
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(async () => {
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        const hasOnboarded = await AsyncStorage.getItem('visceral_onboarded');
        if (hasOnboarded) {
          router.replace('/(auth)/login');
        } else {
          router.replace('/onboarding');
        }
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isLoading, isLoggedIn]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.obsidian,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background glow effect */}
      <Animated.View
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: Colors.gold,
          opacity: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.08],
          }),
          transform: [
            {
              scale: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 2.5],
              }),
            },
          ],
        }}
      />

      {/* Logo */}
      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
          alignItems: 'center',
        }}
      >
        <Image
          source={require('../assets/icon.png')}
          style={{ width: 100, height: 100, borderRadius: 24 }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Brand Name */}
      <Animated.View style={{ opacity: taglineOpacity, marginTop: 24, alignItems: 'center' }}>
        <Text
          style={{
            color: Colors.gold,
            fontSize: 28,
            fontWeight: '900',
            letterSpacing: 3,
          }}
        >
          VISCERAL
        </Text>
        <Text
          style={{
            color: Colors.goldLight,
            fontSize: 11,
            fontWeight: '600',
            letterSpacing: 6,
            marginTop: 4,
          }}
        >
          LIVE CONCERTS
        </Text>
      </Animated.View>

      {/* Decorative oxblood line */}
      <Animated.View
        style={{
          opacity: taglineOpacity,
          width: 60,
          height: 2,
          backgroundColor: Colors.oxblood,
          marginTop: 20,
          borderRadius: 1,
        }}
      />
    </View>
  );
}
