import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import { useAuth } from '../../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
    router.replace('/(auth)/login');
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Edit Profil', action: () => router.push('/settings/edit-profile') },
    { icon: 'lock-closed-outline', title: 'Ubah Password', action: () => router.push('/settings/change-password') },
    { icon: 'moon-outline', title: 'Tampilan (Dark/Light)', action: () => router.push('/settings/display') },
    { icon: 'document-text-outline', title: 'Syarat & Ketentuan', action: () => router.push('/settings/terms') },
    { icon: 'help-circle-outline', title: 'Pusat Bantuan', action: () => router.push('/settings/help') },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.obsidian }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Profile Header with Gradient */}
        <LinearGradient
          colors={[Colors.darkCard, Colors.obsidian]}
          style={{ alignItems: 'center', paddingTop: 80, paddingBottom: 40, borderBottomWidth: 1, borderBottomColor: Colors.darkBorder }}
        >
          <View style={{ position: 'relative', marginBottom: 16 }}>
            <Image 
              source={
                currentUser?.avatarUrl 
                  ? { uri: `https://wisdom-detection-uncharted.ngrok-free.dev/assets/users/${currentUser.avatarUrl}` }
                  : require('../../assets/icon.png')
              }
              style={{ width: 110, height: 110, borderRadius: 55, backgroundColor: Colors.darkSurface, borderWidth: 2, borderColor: Colors.gold }}
            />
            <TouchableOpacity 
              style={{ 
                position: 'absolute', bottom: 0, right: 0, 
                backgroundColor: Colors.gold, width: 36, height: 36, 
                borderRadius: 18, alignItems: 'center', justifyContent: 'center',
                borderWidth: 3, borderColor: Colors.obsidian
              }}
            >
              <Ionicons name="camera" size={18} color={Colors.obsidian} />
            </TouchableOpacity>
          </View>
          <Text style={{ color: Colors.white, fontSize: 26, fontWeight: '900', marginBottom: 4, letterSpacing: 0.5 }}>
            {currentUser?.fullName}
          </Text>
          <View style={{ backgroundColor: 'rgba(200, 155, 60, 0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: Colors.gold }}>
            <Text style={{ color: Colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1 }}>CUSTOMER</Text>
          </View>
          <Text style={{ color: Colors.textMuted, fontSize: 14 }}>
            {currentUser?.email}
          </Text>
        </LinearGradient>

        {/* Menu Items */}
        <View style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 }}>
          
          <Text style={{ color: Colors.textMuted, fontSize: 12, fontWeight: '900', marginBottom: 12, letterSpacing: 1.5, marginLeft: 8 }}>AKUN SAYA</Text>
          <View style={{ backgroundColor: Colors.darkCard, borderRadius: 24, padding: 8, borderWidth: 1, borderColor: Colors.darkBorder, marginBottom: 24 }}>
            {[menuItems[0], menuItems[1]].map((item, index) => (
              <TouchableOpacity 
                key={index}
                onPress={item.action}
                style={{ 
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  padding: 16, borderBottomWidth: index === 0 ? 1 : 0, borderBottomColor: Colors.darkBorder
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={item.icon as any} size={20} color={Colors.gold} />
                  </View>
                  <Text style={{ color: Colors.white, fontSize: 15, fontWeight: '700' }}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={{ color: Colors.textMuted, fontSize: 12, fontWeight: '900', marginBottom: 12, letterSpacing: 1.5, marginLeft: 8 }}>UMUM</Text>
          <View style={{ backgroundColor: Colors.darkCard, borderRadius: 24, padding: 8, borderWidth: 1, borderColor: Colors.darkBorder, marginBottom: 32 }}>
            {menuItems.slice(2).map((item, index) => (
              <TouchableOpacity 
                key={index}
                onPress={item.action}
                style={{ 
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  padding: 16, borderBottomWidth: index < 2 ? 1 : 0, borderBottomColor: Colors.darkBorder
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={item.icon as any} size={20} color={Colors.textMuted} />
                  </View>
                  <Text style={{ color: Colors.white, fontSize: 15, fontWeight: '600' }}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            onPress={handleLogout}
            style={{ 
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
              backgroundColor: 'rgba(122, 46, 46, 0.15)', padding: 18, borderRadius: 20, 
              borderWidth: 1, borderColor: 'rgba(122, 46, 46, 0.3)'
            }}
          >
            <Ionicons name="log-out-outline" size={22} color={Colors.oxblood} />
            <Text style={{ color: Colors.oxblood, fontSize: 16, fontWeight: '800' }}>Keluar dari Akun</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Custom Logout Modal */}
      <Modal visible={logoutModalVisible} transparent={true} animationType="fade" onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View style={{ width: '100%', backgroundColor: Colors.darkCard, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: Colors.darkBorder }}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(122, 46, 46, 0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Ionicons name="log-out" size={32} color={Colors.oxblood} />
              </View>
              <Text style={{ color: Colors.white, fontSize: 20, fontWeight: '900', marginBottom: 8 }}>Konfirmasi Keluar</Text>
              <Text style={{ color: Colors.textMuted, fontSize: 14, textAlign: 'center' }}>Apakah Anda yakin ingin keluar dari akun Visceral?</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity onPress={() => setLogoutModalVisible(false)} style={{ flex: 1, padding: 14, borderRadius: 12, backgroundColor: Colors.darkSurface, alignItems: 'center' }}>
                <Text style={{ color: Colors.white, fontWeight: '700' }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmLogout} style={{ flex: 1, padding: 14, borderRadius: 12, backgroundColor: Colors.oxblood, alignItems: 'center' }}>
                <Text style={{ color: Colors.white, fontWeight: '800' }}>Ya, Keluar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}
