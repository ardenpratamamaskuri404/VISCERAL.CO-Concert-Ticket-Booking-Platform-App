import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import { useAuth } from '../../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function AdminLoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        setError('Akses Ditolak. Anda bukan Admin.');
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
        
        {/* Back Button */}
        <TouchableOpacity 
          style={{ position: 'absolute', top: 50, left: 24, zIndex: 10, padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>

        {/* Logo/Icon */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(239, 68, 68, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
             <Ionicons name="shield-half" size={50} color="#ef4444" />
          </View>
        </View>

        <View style={{ marginBottom: 40, alignItems: 'center' }}>
          <Text style={{ color: '#ef4444', fontSize: 28, fontWeight: '900', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 2 }}>Restricted Area</Text>
          <Text style={{ color: Colors.textMuted, fontSize: 14, textAlign: 'center' }}>Gate Scanner System Authorization</Text>
        </View>

        {error ? (
          <View style={{ backgroundColor: '#7f1d1d', padding: 12, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#ef4444' }}>
            <Text style={{ color: Colors.white, fontSize: 13, fontWeight: '700', textAlign: 'center' }}>{error}</Text>
          </View>
        ) : null}

        <View style={{ gap: 20 }}>
          <View>
            <Text style={{ color: '#ef4444', fontSize: 12, fontWeight: '800', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase' }}>Admin Email</Text>
            <TextInput
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                color: Colors.white,
                padding: 16,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: 'rgba(239, 68, 68, 0.3)',
                fontSize: 16
              }}
              placeholder="admin@visceral.co"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text style={{ color: '#ef4444', fontSize: 12, fontWeight: '800', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase' }}>Password</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  color: Colors.white,
                  padding: 16,
                  paddingRight: 50,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  fontSize: 16
                }}
                placeholder="********"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={{ position: 'absolute', right: 16, top: 16 }}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{
              backgroundColor: '#ef4444',
              padding: 18,
              borderRadius: 16,
              alignItems: 'center',
              marginTop: 20,
              opacity: loading ? 0.7 : 1
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>
              {loading ? 'Authenticating...' : 'Access System'}
            </Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
