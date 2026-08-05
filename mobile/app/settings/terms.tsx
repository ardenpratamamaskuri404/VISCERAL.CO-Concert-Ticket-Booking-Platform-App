import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.obsidian }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16, borderBottomWidth: 1, borderBottomColor: Colors.darkBorder }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800' }}>Syarat & Ketentuan</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View style={{ backgroundColor: Colors.darkSurface, padding: 20, borderRadius: 16 }}>
          <Text style={{ color: Colors.gold, fontSize: 16, fontWeight: '800', marginBottom: 12 }}>1. Pembelian Tiket</Text>
          <Text style={{ color: Colors.textMuted, fontSize: 14, lineHeight: 22, marginBottom: 24 }}>
            Semua pembelian tiket melalui platform Visceral bersifat final. Tiket yang sudah dibeli tidak dapat ditukar atau dikembalikan (refund) kecuali acara dibatalkan oleh pihak penyelenggara.
          </Text>

          <Text style={{ color: Colors.gold, fontSize: 16, fontWeight: '800', marginBottom: 12 }}>2. Penggunaan Tiket</Text>
          <Text style={{ color: Colors.textMuted, fontSize: 14, lineHeight: 22, marginBottom: 24 }}>
            Tiket dilengkapi dengan QR Code unik yang hanya berlaku untuk satu kali pemindaian di pintu masuk. Dilarang keras menggandakan, membagikan, atau menjual kembali tiket ini secara tidak resmi.
          </Text>

          <Text style={{ color: Colors.gold, fontSize: 16, fontWeight: '800', marginBottom: 12 }}>3. Kebijakan Privasi</Text>
          <Text style={{ color: Colors.textMuted, fontSize: 14, lineHeight: 22, marginBottom: 24 }}>
            Visceral mengumpulkan dan menggunakan data pribadi Anda seperti nama, email, dan nomor telepon semata-mata untuk keperluan penerbitan tiket dan keamanan transaksi sesuai standar hukum yang berlaku.
          </Text>
          
          <Text style={{ color: Colors.gold, fontSize: 16, fontWeight: '800', marginBottom: 12 }}>4. Ketertiban Acara</Text>
          <Text style={{ color: Colors.textMuted, fontSize: 14, lineHeight: 22 }}>
            Pihak keamanan berhak menolak masuk atau mengeluarkan pengunjung yang melanggar aturan venue (misal: membawa barang terlarang, membuat kerusuhan).
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
