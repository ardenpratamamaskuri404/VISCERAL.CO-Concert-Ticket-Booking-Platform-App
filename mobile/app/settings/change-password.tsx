import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getThemeColors } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import api from '../../src/api/axios';
import { Ionicons } from '@expo/vector-icons';
import GoldButton from '../../src/components/GoldButton';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { darkMode } = useApp();
  const theme = getThemeColors(darkMode);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Validasi', 'Semua kolom wajib diisi');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Validasi', 'Password baru minimal harus terdiri dari 8 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Validasi', 'Password baru dan konfirmasi tidak cocok');
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/users/password', {
        oldPassword,
        newPassword,
      });
      Alert.alert('Berhasil', res.data?.message || 'Password berhasil diubah!');
      router.back();
    } catch (e: any) {
      Alert.alert('Gagal', e.response?.data?.error || 'Gagal mengubah password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          backgroundColor: theme.card,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 8, backgroundColor: theme.iconBg, borderRadius: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>Ubah Password</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ color: theme.textMuted, marginBottom: 24, lineHeight: 22 }}>
          Pastikan password baru Anda terdiri dari minimal 8 karakter dan mengandung kombinasi huruf dan angka.
        </Text>

        <Text style={{ color: theme.text, marginBottom: 8, fontWeight: '700' }}>Password Lama</Text>
        <TextInput
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
          style={{
            backgroundColor: theme.inputBg,
            color: theme.text,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            marginBottom: 16,
          }}
          placeholder="Masukkan password saat ini"
          placeholderTextColor={theme.textMuted}
        />

        <Text style={{ color: theme.text, marginBottom: 8, fontWeight: '700' }}>Password Baru</Text>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={{
            backgroundColor: theme.inputBg,
            color: theme.text,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            marginBottom: 16,
          }}
          placeholder="Masukkan password baru"
          placeholderTextColor={theme.textMuted}
        />

        <Text style={{ color: theme.text, marginBottom: 8, fontWeight: '700' }}>Konfirmasi Password Baru</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={{
            backgroundColor: theme.inputBg,
            color: theme.text,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            marginBottom: 32,
          }}
          placeholder="Ulangi password baru"
          placeholderTextColor={theme.textMuted}
        />

        <GoldButton title="Perbarui Password" onPress={handleSave} loading={loading} />
      </ScrollView>
    </View>
  );
}
