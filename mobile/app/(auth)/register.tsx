import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import GoldButton from '../../src/components/GoldButton';
import VisceralLogo from '../../src/components/VisceralLogo';
import { useAuth } from '../../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Simple password strength calculation
  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Semua field bertanda * wajib diisi');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok');
      return;
    }
    if (!agree) {
      setError('Anda harus menyetujui Syarat & Ketentuan');
      return;
    }

    setLoading(true);
    setError('');

    const res = await register({ fullName, email, phoneNumber, password });
    
    setLoading(false);

    if (res.success) {
      router.replace('/(tabs)');
    } else {
      setError(res.error || 'Registrasi gagal');
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: 60 }}>
        
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <VisceralLogo size={100} />
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: Colors.gold, fontSize: 32, fontWeight: '900', marginBottom: 8 }}>Daftar Akun</Text>
          <Text style={{ color: Colors.textMuted, fontSize: 16 }}>Bergabunglah dengan VISCERAL.CO</Text>
        </View>

        {error ? (
          <View style={{ backgroundColor: Colors.oxblood, padding: 12, borderRadius: 12, marginBottom: 20 }}>
            <Text style={{ color: Colors.white, fontSize: 12, fontWeight: '700' }}>{error}</Text>
          </View>
        ) : null}

        <View style={{ gap: 16 }}>
          <View>
            <Text style={{ color: Colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 8, marginLeft: 4 }}>Nama Lengkap *</Text>
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
              placeholder="Sesuai KTP"
              placeholderTextColor={Colors.textMuted}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View>
            <Text style={{ color: Colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 8, marginLeft: 4 }}>Email *</Text>
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
              placeholder="nama@email.com"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text style={{ color: Colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 8, marginLeft: 4 }}>Nomor Handphone</Text>
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
              placeholder="08123456789"
              placeholderTextColor={Colors.textMuted}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          <View>
            <Text style={{ color: Colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 8, marginLeft: 4 }}>Password *</Text>
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

          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 }}
            onPress={() => setAgree(!agree)}
            activeOpacity={0.8}
          >
            <View style={{ 
              width: 24, height: 24, borderRadius: 6, borderWidth: 2, 
              borderColor: agree ? Colors.gold : Colors.darkBorder,
              backgroundColor: agree ? Colors.gold : 'transparent',
              alignItems: 'center', justifyContent: 'center'
            }}>
              {agree && <Ionicons name="checkmark" size={16} color={Colors.obsidian} />}
            </View>
            <Text style={{ color: Colors.textMuted, fontSize: 13, flex: 1, lineHeight: 20 }}>
              Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi VISCERAL.CO
            </Text>
          </TouchableOpacity>

          <GoldButton 
            title="Daftar Sekarang" 
            onPress={handleRegister} 
            loading={loading}
            size="lg"
            style={{ marginTop: 20 }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24, gap: 4, paddingBottom: 40 }}>
            <Text style={{ color: Colors.textMuted, fontSize: 14 }}>Sudah punya akun?</Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={{ color: Colors.gold, fontSize: 14, fontWeight: '800' }}>Login di sini</Text>
            </TouchableOpacity>
          </View>
          
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
