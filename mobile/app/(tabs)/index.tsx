import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, FlatList, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, getThemeColors } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { useAuth } from '../../src/context/AuthContext';
import { getAssetUrl } from '../../src/api/config';
import EventCard from '../../src/components/EventCard';
import VisceralLogo from '../../src/components/VisceralLogo';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { events, artists, fetchEvents, fetchArtists, darkMode } = useApp();
  const { currentUser } = useAuth();
  const theme = getThemeColors(darkMode);
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchEvents(), fetchArtists()]);
    setRefreshing(false);
  };

  const featuredEvents = events.filter((e) => e.status === 'PUBLISHED').slice(0, 3);
  const filteredEvents = events.filter((e) => {
    if (e.status !== 'PUBLISHED') return false;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venueName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArtist =
      !selectedArtistId || e.artists?.some((ea) => ea.artistId === selectedArtistId);
    return matchesSearch && matchesArtist;
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <VisceralLogo size={48} />
          <View>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>Selamat datang,</Text>
            <Text style={{ color: theme.gold, fontSize: 16, fontWeight: '800' }}>{currentUser?.fullName?.split(' ')[0]}</Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => router.push('/chat')}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color={theme.gold} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.gold} />}
      >
        {/* Search Bar */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: theme.card, 
            borderRadius: 16, 
            paddingHorizontal: 16, 
            borderWidth: 1, 
            borderColor: theme.border 
          }}>
            <Ionicons name="search" size={20} color={theme.textMuted} />
            <TextInput
              style={{ flex: 1, color: theme.text, paddingVertical: 14, paddingHorizontal: 12, fontSize: 14 }}
              placeholder="Cari konser impianmu..."
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Live Artists Lineup Filter */}
        {artists.length > 0 && (
          <View style={{ marginBottom: 28 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 14 }}>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>Lineup Artis</Text>
              {selectedArtistId && (
                <TouchableOpacity onPress={() => setSelectedArtistId(null)}>
                  <Text style={{ color: theme.gold, fontSize: 12, fontWeight: '700' }}>Reset Filter</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 14 }}>
              {artists.map((artist) => {
                const isSelected = selectedArtistId === artist.id;
                const photoUri = getAssetUrl(artist.photoUrl, 'artists');
                return (
                  <TouchableOpacity
                    key={artist.id}
                    onPress={() => setSelectedArtistId(isSelected ? null : artist.id)}
                    style={{ alignItems: 'center', width: 72 }}
                  >
                    <View
                      style={{
                        width: 62,
                        height: 62,
                        borderRadius: 31,
                        backgroundColor: theme.card,
                        borderWidth: 2,
                        borderColor: isSelected ? Colors.gold : theme.border,
                        overflow: 'hidden',
                        marginBottom: 6,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {photoUri ? (
                        <Image source={{ uri: photoUri }} style={{ width: '100%', height: '100%' }} />
                      ) : (
                        <Ionicons name="person" size={24} color={theme.textMuted} />
                      )}
                    </View>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: isSelected ? theme.gold : theme.textMuted,
                        fontSize: 11,
                        fontWeight: isSelected ? '800' : '600',
                        textAlign: 'center',
                      }}
                    >
                      {artist.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Featured Events */}
        {!searchQuery && !selectedArtistId && featuredEvents.length > 0 && (
          <View style={{ marginBottom: 32 }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', marginLeft: 24, marginBottom: 16 }}>Highlight Event</Text>
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
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', marginBottom: 16 }}>
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
