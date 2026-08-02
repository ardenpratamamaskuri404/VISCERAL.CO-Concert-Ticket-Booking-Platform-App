import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import GoldButton from '../../src/components/GoldButton';
import api from '../../src/api/axios';
import { Ionicons } from '@expo/vector-icons';

export default function OTPScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mockOtpMsg, setMockOtpMsg] = useState('');
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOTP = async () => {
    if (!email) {
      setError('Masukkan email terlebih dahulu');
      return;
    }
    setLoading(true);
    setError('');
    setMockOtpMsg('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setOtpSent(true);
      setCountdown(60);
      if (res.data.isMock) {
        setMockOtpMsg(`[MOCK MODE] Kode OTP Anda: ${res.data.mockOtp}`);
      }
    } catch (e: any) {
      setError(e.response?.data?.error || 'Gagal mengirim OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError('Masukkan 6 digit kode OTP');
      return;
    }
    // We navigate to reset-password and pass the email and OTP as params
    router.push({
      pathname: '/(auth)/reset-password',
      params: { email, otp: otpString }
    });
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus next
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: Colors.obsidian }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
        <TouchableOpacity 
          style={{ position: 'absolute', top: 60, left: 24, padding: 8 }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>

        <View style={{ marginBottom: 40, marginTop: 40 }}>
          <Text style={{ color: Colors.gold, fontSize: 32, fontWeight: '900', marginBottom: 8 }}>
            {otpSent ? 'Verifikasi OTP' : 'Lupa Password?'}
          </Text>
          <Text style={{ color: Colors.textMuted, fontSize: 16 }}>
            {otpSent 
              ? `Masukkan 6 digit kode yang dikirim ke email\n${email}` 
              : 'Masukkan email akun Anda untuk menerima kode verifikasi OTP.'}
          </Text>
        </View>

        {error ? (
          <View style={{ backgroundColor: Colors.oxblood, padding: 12, borderRadius: 12, marginBottom: 20 }}>
            <Text style={{ color: Colors.white, fontSize: 12, fontWeight: '700' }}>{error}</Text>
          </View>
        ) : null}

        {mockOtpMsg ? (
          <View style={{ backgroundColor: Colors.goldDark, padding: 12, borderRadius: 12, marginBottom: 20 }}>
            <Text style={{ color: Colors.obsidian, fontSize: 14, fontWeight: '900', textAlign: 'center' }}>{mockOtpMsg}</Text>
          </View>
        ) : null}

        {!otpSent ? (
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
            <GoldButton 
              title="Kirim Kode OTP" 
              onPress={handleSendOTP} 
              loading={loading}
              size="lg"
            />
          </View>
        ) : (
          <View style={{ gap: 32 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref: any) => (inputRefs.current[index] = ref)}
                  style={{
                    backgroundColor: Colors.darkSurface,
                    color: Colors.gold,
                    width: 48,
                    height: 56,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: digit ? Colors.gold : Colors.darkBorder,
                    fontSize: 24,
                    fontWeight: '900',
                    textAlign: 'center'
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              ))}
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: Colors.textMuted, fontSize: 14 }}>
                Belum menerima kode?
              </Text>
              {countdown > 0 ? (
                <Text style={{ color: Colors.goldLight, fontSize: 14, fontWeight: '700', marginTop: 8 }}>
                  Kirim ulang dalam 00:{countdown.toString().padStart(2, '0')}
                </Text>
              ) : (
                <TouchableOpacity onPress={handleSendOTP} style={{ marginTop: 8 }}>
                  <Text style={{ color: Colors.gold, fontSize: 14, fontWeight: '800' }}>Kirim Ulang Kode</Text>
                </TouchableOpacity>
              )}
            </View>

            <GoldButton 
              title="Verifikasi" 
              onPress={handleVerifyOTP} 
              size="lg"
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
