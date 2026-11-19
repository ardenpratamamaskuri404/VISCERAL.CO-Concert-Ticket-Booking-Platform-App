import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, getThemeColors } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function DisplayScreen() {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useApp();
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
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>Tampilan</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ color: theme.textMuted, marginBottom: 24 }}>
          Sesuaikan tema aplikasi sesuai dengan kenyamanan mata Anda.
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: theme.border,
            padding: 20,
            borderRadius: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <Ionicons name={darkMode ? 'moon' : 'sunny'} size={24} color={theme.gold} />
            <View>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>
                {darkMode ? 'Dark Mode' : 'Light Mode'}
              </Text>
              <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                {darkMode ? 'Tema gelap Obsidian aktif' : 'Tema terang aktif'}
              </Text>
            </View>
          </View>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: Colors.lightBorder, true: Colors.gold }}
            thumbColor={Colors.white}
          />
        </View>

        <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 16, textAlign: 'center' }}>
          Pengaturan tampilan tersimpan otomatis dan langsung diterapkan ke seluruh halaman aplikasi.
        </Text>
      </ScrollView>
    </View>
  );
}
