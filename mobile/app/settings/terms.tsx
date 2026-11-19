import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { getThemeColors } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function TermsScreen() {
  const router = useRouter();
  const { darkMode } = useApp();
  const theme = getThemeColors(darkMode);

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
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>Syarat & Ketentuan</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View
          style={{
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: theme.border,
            padding: 20,
            borderRadius: 16,
          }}
        >
          <Text style={{ color: theme.gold, fontSize: 16, fontWeight: '800', marginBottom: 12 }}>
            1. Pembelian Tiket
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 14, lineHeight: 22, marginBottom: 24 }}>
            Semua pembelian tiket melalui platform Visceral bersifat final. Tiket yang sudah dibeli tidak dapat ditukar atau dikembalikan (refund) kecuali acara dibatalkan oleh pihak penyelenggara.
          </Text>

          <Text style={{ color: theme.gold, fontSize: 16, fontWeight: '800', marginBottom: 12 }}>
            2. Penggunaan Tiket
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 14, lineHeight: 22, marginBottom: 24 }}>
            Tiket dilengkapi dengan QR Code unik yang hanya berlaku untuk satu kali pemindaian di pintu masuk. Dilarang keras menggandakan, membagikan, atau menjual kembali tiket ini secara tidak resmi.
          </Text>

          <Text style={{ color: theme.gold, fontSize: 16, fontWeight: '800', marginBottom: 12 }}>
            3. Kebijakan Privasi
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 14, lineHeight: 22, marginBottom: 24 }}>
            Visceral mengumpulkan dan menggunakan data pribadi Anda seperti nama, email, dan nomor telepon semata-mata untuk keperluan penerbitan tiket dan keamanan transaksi sesuai standar hukum yang berlaku.
          </Text>

          <Text style={{ color: theme.gold, fontSize: 16, fontWeight: '800', marginBottom: 12 }}>
            4. Ketertiban Acara
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 14, lineHeight: 22 }}>
            Pihak keamanan berhak menolak masuk atau mengeluarkan pengunjung yang melanggar aturan venue (misal: membawa barang terlarang, membuat kerusuhan).
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
