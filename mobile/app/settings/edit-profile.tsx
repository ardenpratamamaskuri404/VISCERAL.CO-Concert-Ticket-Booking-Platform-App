import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors, getThemeColors } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useApp } from '../../src/context/AppContext';
import api from '../../src/api/axios';
import { getAssetUrl } from '../../src/api/config';
import GoldButton from '../../src/components/GoldButton';

export default function EditProfileScreen() {
  const router = useRouter();
  const { currentUser, updateUser } = useAuth();
  const { darkMode } = useApp();
  const theme = getThemeColors(darkMode);

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [pickedImage, setPickedImage] = useState<{ uri: string; fileName?: string | null; mimeType?: string | null } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setPhoneNumber(currentUser.phoneNumber || '');
    }
  }, [currentUser]);

  const handlePickAvatar = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Izin Diperlukan', 'Berikan izin akses galeri untuk memilih foto profil.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setPickedImage({
          uri: asset.uri,
          fileName: asset.fileName,
          mimeType: asset.mimeType,
        });
      }
    } catch (e: any) {
      Alert.alert('Error', 'Gagal membuka galeri foto.');
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Validasi', 'Nama lengkap tidak boleh kosong.');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (pickedImage) {
        const formData = new FormData();
        formData.append('fullName', fullName.trim());
        formData.append('phoneNumber', phoneNumber.trim());

        const filename = pickedImage.fileName || `avatar-${Date.now()}.jpg`;
        const mime = pickedImage.mimeType || 'image/jpeg';

        if (Platform.OS === 'web') {
          const blobRes = await fetch(pickedImage.uri);
          const blob = await blobRes.blob();
          formData.append('avatarFile', blob as any, filename);
        } else {
          formData.append('avatarFile', {
            uri: pickedImage.uri,
            name: filename,
            type: mime,
          } as any);
        }

        res = await api.put('/users/profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await api.put('/users/profile', {
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
        });
      }

      if (res.data?.data) {
        await updateUser(res.data.data);
        Alert.alert('Berhasil', 'Profil dan foto berhasil diperbarui secara real-time!');
        router.back();
      } else {
        Alert.alert('Gagal', 'Respons server tidak valid.');
      }
    } catch (e: any) {
      Alert.alert('Gagal', e.response?.data?.error || 'Gagal menyimpan perubahan profil.');
    } finally {
      setLoading(false);
    }
  };

  const avatarSource = pickedImage?.uri
    ? { uri: pickedImage.uri }
    : currentUser?.avatarUrl
    ? { uri: getAssetUrl(currentUser.avatarUrl, 'users') || undefined }
    : null;

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
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>Edit Profil</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity
            onPress={handlePickAvatar}
            activeOpacity={0.85}
            style={{
              width: 108,
              height: 108,
              borderRadius: 54,
              backgroundColor: theme.surface,
              borderWidth: 2,
              borderColor: Colors.gold,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              position: 'relative',
            }}
          >
            {avatarSource ? (
              <Image
                source={avatarSource}
                style={{ width: 104, height: 104, borderRadius: 52 }}
              />
            ) : (
              <Ionicons name="person" size={44} color={theme.textMuted} />
            )}
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: Colors.gold,
                padding: 8,
                borderRadius: 18,
                borderWidth: 2,
                borderColor: theme.bg,
              }}
            >
              <Ionicons name="camera" size={16} color={Colors.obsidian} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickAvatar}>
            <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '700' }}>
              Ketuk untuk Ubah Foto Profil
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: theme.text, marginBottom: 8, fontWeight: '700' }}>Nama Lengkap</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          style={{
            backgroundColor: theme.inputBg,
            color: theme.text,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            marginBottom: 16,
          }}
          placeholder="Masukkan nama lengkap"
          placeholderTextColor={theme.textMuted}
        />

        <Text style={{ color: theme.text, marginBottom: 8, fontWeight: '700' }}>Email (Tidak bisa diubah)</Text>
        <TextInput
          value={currentUser?.email || ''}
          editable={false}
          style={{
            backgroundColor: theme.disabledBg,
            color: theme.textMuted,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            marginBottom: 16,
          }}
        />

        <Text style={{ color: theme.text, marginBottom: 8, fontWeight: '700' }}>Nomor Telepon</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={{
            backgroundColor: theme.inputBg,
            color: theme.text,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            marginBottom: 32,
          }}
          placeholder="081234567890"
          keyboardType="phone-pad"
          placeholderTextColor={theme.textMuted}
        />

        <GoldButton title="Simpan Perubahan" onPress={handleSave} loading={loading} />
      </ScrollView>
    </View>
  );
}
