import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import GoldButton from '../../src/components/GoldButton';
import VisceralLogo from '../../src/components/VisceralLogo';
import { useAuth } from '../../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Easter Egg Logic
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  const handleLogoTap = () => {
    const now = Date.now();
    if (now - lastTapTime > 500) {
      setTapCount(1); // reset if too slow
    } else {
      const newCount = tapCount + 1;
      setTapCount(newCount);
      if (newCount >= 5) {
        setTapCount(0);
        router.push('/(auth)/admin-login');
      }
    }
    setLastTapTime(now);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email dan Password wajib diisi');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(email, password);
    
    setLoading(false);

    if (res.success) {
      if (res.user?.role === 'ADMIN' || res.user?.role === 'SUPERADMIN') {
        router.replace('/(admin)/scanner');
      } else {
        router.replace('/(tabs)');
      }
    } else {
      setError(res.error || 'Login gagal');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: Colors.obsidian }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
        
        {/* Logo with Easter Egg */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity activeOpacity={1} onPress={handleLogoTap}>
            <VisceralLogo size={120} />
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 40 }}>
          <Text style={{ color: Colors.gold, fontSize: 32, fontWeight: '900', marginBottom: 8 }}>Masuk</Text>
          <Text style={{ color: Colors.textMuted, fontSize: 16 }}>Selamat datang kembali di VISCERAL.CO</Text>
        </View>

        {error ? (
          <View style={{ backgroundColor: Colors.oxblood, padding: 12, borderRadius: 12, marginBottom: 20 }}>
            <Text style={{ color: Colors.white, fontSize: 12, fontWeight: '700' }}>{error}</Text>
          </View>
        ) : null}

        <View style={{ gap: 20 }}>
          <View>
            <Text style={{ color: Colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 8, marginLeft: 4 }}>Email</Text>
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
              placeholder="Masukkan email Anda"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text style={{ color: Colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 8, marginLeft: 4 }}>Password</Text>
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
                placeholder="Masukkan password Anda"
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
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/otp')} style={{ alignSelf: 'flex-end' }}>
            <Text style={{ color: Colors.goldLight, fontSize: 12, fontWeight: '700' }}>Lupa Password?</Text>
          </TouchableOpacity>

          <GoldButton 
            title="Masuk" 
            onPress={handleLogin} 
            loading={loading}
            size="lg"
            style={{ marginTop: 12 }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24, gap: 4 }}>
            <Text style={{ color: Colors.textMuted, fontSize: 14 }}>Belum punya akun?</Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/register')}>
              <Text style={{ color: Colors.gold, fontSize: 14, fontWeight: '800' }}>Daftar sekarang</Text>
            </TouchableOpacity>
          </View>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
