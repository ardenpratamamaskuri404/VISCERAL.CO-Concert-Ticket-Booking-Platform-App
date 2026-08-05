import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import GoldButton from '../../src/components/GoldButton';
import VisceralLogo from '../../src/components/VisceralLogo';
import api from '../../src/api/axios';
import { Ionicons } from '@expo/vector-icons';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email, otp } = useLocalSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError('Password baru dan Konfirmasi Password wajib diisi');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword: password
      });
      
      // Navigate to login and perhaps show a success param/toast
      router.replace('/(auth)/login');
    } catch (e: any) {
      setError(e.response?.data?.error || 'Gagal mengubah password');
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordStrength = () => {
    const strength = getPasswordStrength();
    return (
      <View style={{ flexDirection: 'row', gap: 4, marginTop: 8 }}>
        {[1, 2, 3, 4].map((level) => (
          <View
            key={level}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: strength >= level ? Colors.gold : Colors.darkBorder,
            }}
          />
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: Colors.obsidian }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
        
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <VisceralLogo size={100} />
        </View>

        <View style={{ marginBottom: 40 }}>
          <Text style={{ color: Colors.gold, fontSize: 32, fontWeight: '900', marginBottom: 8 }}>Password Baru</Text>
          <Text style={{ color: Colors.textMuted, fontSize: 16 }}>Buat password baru yang kuat untuk akun Anda</Text>
        </View>

        {error ? (
          <View style={{ backgroundColor: Colors.oxblood, padding: 12, borderRadius: 12, marginBottom: 20 }}>
            <Text style={{ color: Colors.white, fontSize: 12, fontWeight: '700' }}>{error}</Text>
          </View>
        ) : null}

        <View style={{ gap: 20 }}>
          <View>
            <Text style={{ color: Colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 8, marginLeft: 4 }}>Password Baru *</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={{
                  backgroundColor: Colors.darkSurface,
                  color: Colors.white,
                  padding: 16,
                  paddingRight: 50,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: Colors.darkBorder,
                  fontSize: 16
                }}
                placeholder="Minimal 8 karakter"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={{ position: 'absolute', right: 16, top: 16 }}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            {renderPasswordStrength()}
          </View>

          <View>
            <Text style={{ color: Colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 8, marginLeft: 4 }}>Konfirmasi Password *</Text>
            <TextInput
              style={{
                backgroundColor: Colors.darkSurface,
                color: Colors.white,
                padding: 16,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: Colors.darkBorder,
                fontSize: 16
              }}
              placeholder="Ulangi password"
              placeholderTextColor={Colors.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          <GoldButton 
            title="Simpan Password Baru" 
            onPress={handleResetPassword} 
            loading={loading}
            size="lg"
            style={{ marginTop: 12 }}
          />

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
