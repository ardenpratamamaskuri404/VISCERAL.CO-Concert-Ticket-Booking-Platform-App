import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import GoldButton from '../../src/components/GoldButton';

export default function EditProfileScreen() {
  const router = useRouter();
  const { currentUser } = useAuth();
  
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Berhasil', 'Profil berhasil diperbarui!');
      router.back();
    }, 1500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.obsidian }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16, borderBottomWidth: 1, borderBottomColor: Colors.darkBorder }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800' }}>Edit Profil</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.darkSurface, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Ionicons name="person" size={40} color={Colors.textMuted} />
            <TouchableOpacity style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.gold, padding: 8, borderRadius: 16 }}>
              <Ionicons name="camera" size={16} color={Colors.obsidian} />
            </TouchableOpacity>
          </View>
          <Text style={{ color: Colors.textMuted, fontSize: 12 }}>Ubah Foto Profil</Text>
        </View>

        <Text style={{ color: Colors.white, marginBottom: 8, fontWeight: '700' }}>Nama Lengkap</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          style={{ backgroundColor: Colors.darkSurface, color: Colors.white, padding: 16, borderRadius: 12, marginBottom: 16 }}
          placeholder="Masukkan nama lengkap"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={{ color: Colors.white, marginBottom: 8, fontWeight: '700' }}>Email (Tidak bisa diubah)</Text>
        <TextInput
          value={currentUser?.email || ''}
          editable={false}
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: Colors.textMuted, padding: 16, borderRadius: 12, marginBottom: 16 }}
        />

        <Text style={{ color: Colors.white, marginBottom: 8, fontWeight: '700' }}>Nomor Telepon</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={{ backgroundColor: Colors.darkSurface, color: Colors.white, padding: 16, borderRadius: 12, marginBottom: 32 }}
          placeholder="081234567890"
          keyboardType="phone-pad"
          placeholderTextColor={Colors.textMuted}
        />

        <GoldButton title="Simpan Perubahan" onPress={handleSave} loading={loading} />
      </ScrollView>
    </View>
  );
}
