import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const getPageDetails = () => {
    switch (id) {
      case 'edit-profile':
        return { title: 'Edit Profil', icon: 'person', content: 'Fitur Edit Profil akan segera hadir pada update berikutnya.' };
      case 'change-password':
        return { title: 'Ubah Password', icon: 'lock-closed', content: 'Fitur Ubah Password akan segera hadir pada update berikutnya.' };
      case 'display':
        return { title: 'Tampilan', icon: 'moon', content: 'Pengaturan mode terang dan gelap akan segera hadir.' };
      case 'terms':
        return { title: 'Syarat & Ketentuan', icon: 'document-text', content: 'Ini adalah halaman Syarat dan Ketentuan penggunaan aplikasi Visceral.' };
      case 'help':
        return { title: 'Pusat Bantuan', icon: 'help-circle', content: 'Jika Anda membutuhkan bantuan, silakan hubungi tim dukungan kami di support@visceral.co.' };
      default:
        return { title: 'Pengaturan', icon: 'settings', content: 'Halaman tidak ditemukan.' };
    }
  };

  const details = getPageDetails();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.obsidian }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.darkBorder }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800' }}>{details.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center', paddingTop: 60 }}>
        <Ionicons name={details.icon as any} size={80} color={Colors.gold} style={{ opacity: 0.8, marginBottom: 24 }} />
        <Text style={{ color: Colors.white, fontSize: 24, fontWeight: '900', marginBottom: 16, textAlign: 'center' }}>
          {details.title}
        </Text>
        <Text style={{ color: Colors.textMuted, fontSize: 16, textAlign: 'center', lineHeight: 24 }}>
          {details.content}
        </Text>
        
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ backgroundColor: Colors.gold, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 16, marginTop: 40 }}
        >
          <Text style={{ color: Colors.obsidian, fontSize: 16, fontWeight: '800' }}>Kembali ke Profil</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
