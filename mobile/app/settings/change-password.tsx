import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import GoldButton from '../../src/components/GoldButton';

export default function ChangePasswordScreen() {
  const router = useRouter();
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Semua kolom wajib diisi');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Password baru dan konfirmasi tidak cocok');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Berhasil', 'Password berhasil diubah!');
      router.back();
    }, 1500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.obsidian }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16, borderBottomWidth: 1, borderBottomColor: Colors.darkBorder }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800' }}>Ubah Password</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ color: Colors.textMuted, marginBottom: 24, lineHeight: 22 }}>
          Pastikan password baru Anda terdiri dari minimal 8 karakter dan mengandung kombinasi huruf dan angka.
        </Text>

        <Text style={{ color: Colors.white, marginBottom: 8, fontWeight: '700' }}>Password Lama</Text>
        <TextInput
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
          style={{ backgroundColor: Colors.darkSurface, color: Colors.white, padding: 16, borderRadius: 12, marginBottom: 16 }}
          placeholder="Masukkan password saat ini"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={{ color: Colors.white, marginBottom: 8, fontWeight: '700' }}>Password Baru</Text>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={{ backgroundColor: Colors.darkSurface, color: Colors.white, padding: 16, borderRadius: 12, marginBottom: 16 }}
          placeholder="Masukkan password baru"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={{ color: Colors.white, marginBottom: 8, fontWeight: '700' }}>Konfirmasi Password Baru</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={{ backgroundColor: Colors.darkSurface, color: Colors.white, padding: 16, borderRadius: 12, marginBottom: 32 }}
          placeholder="Ulangi password baru"
          placeholderTextColor={Colors.textMuted}
        />

        <GoldButton title="Perbarui Password" onPress={handleSave} loading={loading} />
      </ScrollView>
    </View>
  );
}
