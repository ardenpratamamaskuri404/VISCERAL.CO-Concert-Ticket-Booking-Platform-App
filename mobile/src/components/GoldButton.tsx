import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GoldGradient, Colors, Shadows } from '../constants/theme';

interface GoldButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function GoldButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  variant = 'solid',
  size = 'md',
}: GoldButtonProps) {
  const paddingMap = { sm: 10, md: 14, lg: 18 };
  const fontMap = { sm: 12, md: 14, lg: 16 };

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        style={[
          {
            borderWidth: 1.5,
            borderColor: Colors.gold,
            borderRadius: 16,
            paddingVertical: paddingMap[size],
            paddingHorizontal: 24,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.gold} />
        ) : (
          <>
            {icon}
            <Text
              style={[
                {
                  color: Colors.gold,
                  fontWeight: '800',
                  fontSize: fontMap[size],
                  letterSpacing: 0.5,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[{ borderRadius: 16, opacity: disabled ? 0.5 : 1, ...Shadows.gold }, style]}
    >
      <LinearGradient
        colors={GoldGradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          paddingVertical: paddingMap[size],
          paddingHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.obsidian} />
        ) : (
          <>
            {icon}
            <Text
              style={[
                {
                  color: Colors.obsidian,
                  fontWeight: '900',
                  fontSize: fontMap[size],
                  letterSpacing: 0.5,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
