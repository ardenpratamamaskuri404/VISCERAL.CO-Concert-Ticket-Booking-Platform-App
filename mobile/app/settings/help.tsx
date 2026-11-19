import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { getThemeColors } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function HelpCenterScreen() {
  const router = useRouter();
  const { darkMode } = useApp();
  const theme = getThemeColors(darkMode);

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@visceral.com');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/6281234567890');
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
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>Pusat Bantuan</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ color: theme.textMuted, marginBottom: 24, lineHeight: 22 }}>
          Jika Anda mengalami kendala saat memesan tiket, masalah pada pembayaran, atau memiliki pertanyaan seputar event, tim Visceral siap membantu Anda 24/7.
        </Text>

        <TouchableOpacity
          onPress={handleContactSupport}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.card,
            padding: 20,
            borderRadius: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: 'rgba(200, 155, 60, 0.1)',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}
          >
            <Ionicons name="mail" size={24} color={theme.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700', marginBottom: 4 }}>
              Email Support
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13 }}>support@visceral.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleWhatsApp}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.card,
            padding: 20,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: 'rgba(37, 211, 102, 0.1)',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700', marginBottom: 4 }}>
              WhatsApp CS
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13 }}>+62 812 3456 7890</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </TouchableOpacity>

        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <Text style={{ color: theme.textMuted, fontSize: 12 }}>Visceral Ticket System v2.0.0</Text>
          <Text style={{ color: theme.gold, fontSize: 10, fontWeight: '800', marginTop: 4 }}>
            PREMIUM EXPERIENCE
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
