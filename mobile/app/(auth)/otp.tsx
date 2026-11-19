import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import GoldButton from '../../src/components/GoldButton';
import VisceralLogo from '../../src/components/VisceralLogo';
import api from '../../src/api/axios';
import { useAuth } from '../../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function OTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode?: string;
    email?: string;
    password?: string;
    target?: string;
    otpExpiresInSeconds?: string;
    info?: string;
  }>();

  const { verifyLoginOtp, resendLoginOtp, logout } = useAuth();
  const isLoginMode = params.mode === 'LOGIN';

  const [email, setEmail] = useState(params.email || '');
  const [otpSent, setOtpSent] = useState(isLoginMode);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState(
    isLoginMode
      ? params.info || `Kode OTP 6 digit telah dikirim ke ${params.email || 'email Anda'}.`
      : ''
  );
  const [countdown, setCountdown] = useState(isLoginMode ? 60 : 0);
  const [otpRemaining, setOtpRemaining] = useState(
    isLoginMode ? Number(params.otpExpiresInSeconds) || 300 : 300
  );

  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (!otpSent) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      setOtpRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpSent]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSendOTP = async () => {
    if (isLoginMode) {
      if (!email || !params.password) {
        setError('Sesi kirim ulang habis. Silakan kembali ke halaman login.');
        return;
      }
      setLoading(true);
      setError('');
      const res = await resendLoginOtp(email, String(params.password));
      setLoading(false);
      if (res.success) {
        setOtp(['', '', '', '', '', '']);
        setCountdown(60);
        setOtpRemaining(res.otpExpiresInSeconds || 300);
        setInfoMsg(res.message || `Kode OTP baru telah dikirim ke ${email}.`);
      } else {
        setError(res.error || 'Gagal mengirim ulang OTP');
      }
      return;
    }

    if (!email) {
      setError('Masukkan email terlebih dahulu');
      return;
    }
    setLoading(true);
    setError('');
    setInfoMsg('');
    try {
      await api.post('/auth/forgot-password', { email });
      setOtpSent(true);
      setCountdown(60);
      setOtpRemaining(300);
      setInfoMsg('Kode verifikasi OTP telah dikirimkan ke email Anda.');
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

    if (isLoginMode) {
      setLoading(true);
      setError('');
      const res = await verifyLoginOtp(email, otpString);
      setLoading(false);

      if (res.success && res.user) {
        if (params.target === 'admin' && res.user.role !== 'ADMIN' && res.user.role !== 'SUPERADMIN') {
          await logout();
          setError('Akses Ditolak. Anda bukan Admin.');
          return;
        }
        if (res.user.role === 'ADMIN' || res.user.role === 'SUPERADMIN') {
          router.replace('/(admin)/scanner');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        setError(res.error || 'Kode OTP tidak valid atau sudah kedaluwarsa');
      }
      return;
    }

    // Mode Lupa Password -> lanjut ke Reset Password
    router.push({
      pathname: '/(auth)/reset-password',
      params: { email, otp: otpString },
    });
  };

  const handleOtpChange = (text: string, index: number) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6).split('');
      const next = ['', '', '', '', '', ''];
      pasted.forEach((d, idx) => {
        next[idx] = d;
      });
      setOtp(next);
      const nextIdx = Math.min(pasted.length, 5);
      (inputRefs.current[nextIdx] as any)?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleaned.slice(-1);
    setOtp(newOtp);
    setError('');

    if (cleaned && index < 5) {
      (inputRefs.current[index + 1] as any)?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      (inputRefs.current[index - 1] as any)?.focus();
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

        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <VisceralLogo size={100} />
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: Colors.gold, fontSize: 30, fontWeight: '900', marginBottom: 8 }}>
            {isLoginMode ? 'Verifikasi OTP Login' : otpSent ? 'Verifikasi OTP' : 'Lupa Password?'}
          </Text>
          <Text style={{ color: Colors.textMuted, fontSize: 15 }}>
            {otpSent
              ? `Masukkan 6 digit kode yang dikirim ke email\n${email}`
              : 'Masukkan email akun Anda untuk menerima kode verifikasi OTP.'}
          </Text>
          {otpSent && (
            <Text style={{ color: otpRemaining > 0 ? Colors.goldLight : '#ef4444', fontSize: 13, fontWeight: '700', marginTop: 8 }}>
              {otpRemaining > 0
                ? `Berlaku selama: ${formatTimer(otpRemaining)}`
                : 'Kode OTP kedaluwarsa. Silakan kirim ulang.'}
            </Text>
          )}
        </View>

        {error ? (
          <View style={{ backgroundColor: Colors.oxblood, padding: 12, borderRadius: 12, marginBottom: 16 }}>
            <Text style={{ color: Colors.white, fontSize: 12, fontWeight: '700' }}>{error}</Text>
          </View>
        ) : null}

        {infoMsg && !error ? (
          <View style={{ backgroundColor: 'rgba(200, 155, 60, 0.15)', borderWidth: 1, borderColor: Colors.gold, padding: 12, borderRadius: 12, marginBottom: 16 }}>
            <Text style={{ color: Colors.gold, fontSize: 13, fontWeight: '700', textAlign: 'center' }}>{infoMsg}</Text>
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
                  fontSize: 16,
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
          <View style={{ gap: 28 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6 }}>
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
                    textAlign: 'center',
                  }}
                  keyboardType="numeric"
                  maxLength={6}
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
                <TouchableOpacity onPress={handleSendOTP} disabled={loading} style={{ marginTop: 8 }}>
                  <Text style={{ color: Colors.gold, fontSize: 14, fontWeight: '800' }}>Kirim Ulang Kode</Text>
                </TouchableOpacity>
              )}
            </View>

            <GoldButton
              title={isLoginMode ? 'Verifikasi & Masuk' : 'Verifikasi'}
              onPress={handleVerifyOTP}
              loading={loading}
              disabled={otp.join('').length < 6 || otpRemaining === 0}
              size="lg"
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
