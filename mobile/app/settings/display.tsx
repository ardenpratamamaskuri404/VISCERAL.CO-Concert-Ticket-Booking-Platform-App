import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function DisplayScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark for this theme

  return (
    <View style={{ flex: 1, backgroundColor: Colors.obsidian }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16, borderBottomWidth: 1, borderBottomColor: Colors.darkBorder }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800' }}>Tampilan</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ color: Colors.textMuted, marginBottom: 24 }}>
          Sesuaikan tema aplikasi sesuai dengan kenyamanan mata Anda.
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.darkSurface, padding: 20, borderRadius: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <Ionicons name={isDarkMode ? 'moon' : 'sunny'} size={24} color={Colors.gold} />
            <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '700' }}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: Colors.darkBorder, true: Colors.gold }}
            thumbColor={Colors.white}
          />
        </View>
        
        {/* Placeholder info */}
        <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 16, textAlign: 'center' }}>
          Catatan: Visceral secara bawaan dioptimalkan untuk Dark Mode demi pengalaman visual yang mewah.
        </Text>
      </ScrollView>
    </View>
  );
}
