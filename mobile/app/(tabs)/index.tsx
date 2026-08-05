import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { useAuth } from '../../src/context/AuthContext';
import EventCard from '../../src/components/EventCard';
import VisceralLogo from '../../src/components/VisceralLogo';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { events, fetchEvents } = useApp();
  const { currentUser } = useAuth();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  const featuredEvents = events.filter((e) => e.status === 'PUBLISHED').slice(0, 3);
  const filteredEvents = events.filter(
    (e) => e.status === 'PUBLISHED' && e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.obsidian }}>
      
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <VisceralLogo size={48} />
          <View>
            <Text style={{ color: Colors.textMuted, fontSize: 12 }}>Selamat datang,</Text>
            <Text style={{ color: Colors.gold, fontSize: 16, fontWeight: '800' }}>{currentUser?.fullName?.split(' ')[0]}</Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => router.push('/chat')}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.darkSurface, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color={Colors.gold} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold} />}
      >
        {/* Search Bar */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: Colors.darkSurface, 
            borderRadius: 16, 
            paddingHorizontal: 16, 
            borderWidth: 1, 
            borderColor: Colors.darkBorder 
          }}>
            <Ionicons name="search" size={20} color={Colors.textMuted} />
            <TextInput
              style={{ flex: 1, color: Colors.white, paddingVertical: 14, paddingHorizontal: 12, fontSize: 14 }}
              placeholder="Cari konser impianmu..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Featured Events */}
        {!searchQuery && featuredEvents.length > 0 && (
          <View style={{ marginBottom: 32 }}>
            <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800', marginLeft: 24, marginBottom: 16 }}>Highlight Event</Text>
            <FlatList
              data={featuredEvents}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <EventCard 
                  event={item} 
                  variant="featured"
                  onPress={() => router.push(`/event/${item.id}`)}
                />
              )}
            />
          </View>
        )}

        {/* All Events Grid */}
        <View style={{ paddingHorizontal: 24 }}>
          <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800', marginBottom: 16 }}>
            {searchQuery ? 'Hasil Pencarian' : 'Semua Konser'}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id}
                event={event} 
                variant="grid"
                onPress={() => router.push(`/event/${event.id}`)}
              />
            ))}
            
            {filteredEvents.length === 0 && (
              <View style={{ width: '100%', alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ color: Colors.textMuted, fontSize: 14 }}>Tidak ada event yang ditemukan.</Text>
              </View>
            )}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
