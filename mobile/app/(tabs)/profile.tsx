import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import { useAuth } from '../../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Keluar', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Edit Profil', action: () => {} },
    { icon: 'lock-closed-outline', title: 'Ubah Password', action: () => {} },
    { icon: 'moon-outline', title: 'Tampilan (Dark/Light)', action: () => {} },
    { icon: 'document-text-outline', title: 'Syarat & Ketentuan', action: () => {} },
    { icon: 'help-circle-outline', title: 'Pusat Bantuan', action: () => {} },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.obsidian }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Profile Header */}
        <View style={{ alignItems: 'center', paddingTop: 80, paddingBottom: 40, borderBottomWidth: 1, borderBottomColor: Colors.darkBorder }}>
          <View style={{ position: 'relative', marginBottom: 16 }}>
            <Image 
              source={
                currentUser?.avatarUrl 
                  ? { uri: `http://10.0.2.2:3005/assets/users/${currentUser.avatarUrl}` }
                  : require('../../assets/icon.png')
              }
              style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.darkSurface }}
            />
            <TouchableOpacity 
              style={{ 
                position: 'absolute', bottom: 0, right: 0, 
                backgroundColor: Colors.gold, width: 32, height: 32, 
                borderRadius: 16, alignItems: 'center', justifyContent: 'center',
                borderWidth: 3, borderColor: Colors.obsidian
              }}
            >
              <Ionicons name="camera" size={16} color={Colors.obsidian} />
            </TouchableOpacity>
          </View>
          <Text style={{ color: Colors.white, fontSize: 24, fontWeight: '900', marginBottom: 4 }}>
            {currentUser?.fullName}
          </Text>
          <Text style={{ color: Colors.textMuted, fontSize: 14 }}>
            {currentUser?.email}
          </Text>
          {currentUser?.phoneNumber && (
            <Text style={{ color: Colors.textMuted, fontSize: 14, marginTop: 4 }}>
              {currentUser.phoneNumber}
            </Text>
          )}
        </View>

        {/* Menu Items */}
        <View style={{ paddingHorizontal: 24, paddingTop: 32, gap: 16 }}>
          <Text style={{ color: Colors.textMuted, fontSize: 12, fontWeight: '800', marginBottom: 8, letterSpacing: 1 }}>PENGATURAN</Text>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              onPress={item.action}
              style={{ 
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                backgroundColor: Colors.darkSurface, padding: 16, borderRadius: 16
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={item.icon as any} size={20} color={Colors.gold} />
                </View>
                <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}

          <TouchableOpacity 
            onPress={handleLogout}
            style={{ 
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: 'rgba(122, 46, 46, 0.1)', padding: 16, borderRadius: 16, marginTop: 16
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(122, 46, 46, 0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="log-out-outline" size={20} color={Colors.oxblood} />
              </View>
              <Text style={{ color: Colors.oxblood, fontSize: 16, fontWeight: '700' }}>Keluar</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}
