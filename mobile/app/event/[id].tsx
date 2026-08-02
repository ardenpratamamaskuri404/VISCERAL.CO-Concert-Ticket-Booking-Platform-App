import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator, Modal, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors, Shadows } from '../../src/constants/theme';
import GoldButton from '../../src/components/GoldButton';
import api from '../../src/api/axios';
import { Event, TicketCategory } from '../../src/types';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');
const { width } = Dimensions.get('window');

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [mapModalVisible, setMapModalVisible] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      if (res.data?.data) {
        setEvent(res.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch event:', e);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://10.0.2.2:3005/assets/events/${url}`;
  };

  const handleCheckout = () => {
    if (!selectedCategory || !event) return;
    
    // For seating events, this would normally go to a seat selection screen
    // For simplicity in this demo, we'll assume festival/auto-assign if seated
    router.push({
      pathname: `/checkout/${event.id}`,
      params: { 
        categoryId: selectedCategory.id,
        quantity: ticketCount
      }
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.obsidian, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.obsidian, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: Colors.white }}>Event tidak ditemukan.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: Colors.gold }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const date = dayjs(event.eventDate);
  const isSalesClosed = event.salesClosed || event.categories?.every((c) => c.isSalesClosed);

  // Mock coordinates for the venue (Jakarta)
  const venueRegion = {
    latitude: -6.200000,
    longitude: 106.816666,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.obsidian }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Banner & Header */}
        <View style={{ height: 350, position: 'relative' }}>
          <Image 
            source={getImageUrl(event.bannerUrl) ? { uri: getImageUrl(event.bannerUrl)! } : require('../../assets/icon.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(20,17,15,0)', 'rgba(20,17,15,0.8)', Colors.obsidian]}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200 }}
          />
          
          <TouchableOpacity 
            style={{ position: 'absolute', top: 60, left: 24, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>

          {isSalesClosed && (
            <View style={{ position: 'absolute', top: 60, right: 24, backgroundColor: Colors.oxblood, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
              <Text style={{ color: Colors.white, fontSize: 12, fontWeight: '900', letterSpacing: 1 }}>SALES CLOSED</Text>
            </View>
          )}

          <View style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
            <Text style={{ color: Colors.white, fontSize: 28, fontWeight: '900', marginBottom: 8 }}>{event.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="calendar" size={16} color={Colors.gold} />
                <Text style={{ color: Colors.white, fontSize: 14 }}>{date.format('DD MMM YYYY')}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="time" size={16} color={Colors.gold} />
                <Text style={{ color: Colors.white, fontSize: 14 }}>{date.format('HH:mm')} WIB</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={{ padding: 24, gap: 32 }}>
          
          {/* Artists */}
          {event.artists && event.artists.length > 0 && (
            <View>
              <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800', marginBottom: 16 }}>Lineup Artis</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
                {event.artists.map((ea, index) => (
                  <View key={index} style={{ alignItems: 'center', width: 90 }}>
                    <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.darkSurface, marginBottom: 8, borderWidth: ea.isHeadliner ? 2 : 0, borderColor: Colors.gold }}>
                      {/* Artist Photo Placeholder */}
                      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="person" size={32} color={Colors.textMuted} />
                      </View>
                    </View>
                    <Text numberOfLines={1} style={{ color: Colors.white, fontSize: 12, fontWeight: '700', textAlign: 'center' }}>{ea.artist.name}</Text>
                    {ea.isHeadliner && (
                      <Text style={{ color: Colors.gold, fontSize: 9, fontWeight: '900', marginTop: 2 }}>HEADLINER</Text>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Description */}
          <View>
            <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800', marginBottom: 12 }}>Tentang Event</Text>
            <Text style={{ color: Colors.textMuted, fontSize: 14, lineHeight: 24 }}>
              {event.description}
            </Text>
          </View>

          {/* Location & Map Mini */}
          <View>
            <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800', marginBottom: 12 }}>Lokasi</Text>
            <View style={{ backgroundColor: Colors.darkCard, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: Colors.darkBorder }}>
              <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: Colors.darkBorder }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(200, 155, 60, 0.1)', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="location" size={20} color={Colors.gold} />
                </View>
                <Text style={{ color: Colors.white, fontSize: 14, fontWeight: '700', flex: 1 }}>{event.venueName}</Text>
              </View>
              
              {/* Mini Map View */}
              <TouchableOpacity 
                activeOpacity={0.9} 
                onPress={() => setMapModalVisible(true)}
                style={{ height: 150, width: '100%', position: 'relative' }}
              >
                <MapView
                  style={{ flex: 1 }}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={venueRegion}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                >
                  <Marker coordinate={{ latitude: venueRegion.latitude, longitude: venueRegion.longitude }} />
                </MapView>
                <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(20,17,15,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ backgroundColor: 'rgba(20,17,15,0.8)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="expand" size={16} color={Colors.white} />
                    <Text style={{ color: Colors.white, fontSize: 12, fontWeight: '700' }}>Ketuk untuk perbesar</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ticket Categories */}
          <View>
            <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800', marginBottom: 16 }}>Pilih Kategori Tiket</Text>
            {event.categories?.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => !cat.isSalesClosed && cat.availableSeats > 0 && setSelectedCategory(cat)}
                activeOpacity={0.8}
                style={{
                  backgroundColor: selectedCategory?.id === cat.id ? 'rgba(200, 155, 60, 0.1)' : Colors.darkCard,
                  borderWidth: 2,
                  borderColor: selectedCategory?.id === cat.id ? Colors.gold : Colors.darkBorder,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  opacity: (cat.isSalesClosed || cat.availableSeats === 0) ? 0.5 : 1
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '800' }}>{cat.name}</Text>
                  <Text style={{ color: Colors.gold, fontSize: 16, fontWeight: '900' }}>Rp {Number(cat.price).toLocaleString('id-ID')}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: Colors.textMuted, fontSize: 12 }}>
                    {event.isSeated ? 'Seated (Kursi)' : 'Standing (Festival)'}
                  </Text>
                  
                  {cat.isSalesClosed ? (
                    <Text style={{ color: Colors.oxblood, fontSize: 12, fontWeight: '800' }}>CLOSED</Text>
                  ) : cat.availableSeats === 0 ? (
                    <Text style={{ color: Colors.oxblood, fontSize: 12, fontWeight: '800' }}>SOLD OUT</Text>
                  ) : (
                    <Text style={{ color: Colors.goldLight, fontSize: 12, fontWeight: '600' }}>Sisa {cat.availableSeats} tiket</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={{ 
        position: 'absolute', bottom: 0, left: 0, right: 0, 
        backgroundColor: Colors.darkSurface, 
        borderTopWidth: 1, borderTopColor: Colors.darkBorder,
        padding: 24, paddingBottom: Platform.OS === 'ios' ? 32 : 24,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.obsidian, borderRadius: 12, borderWidth: 1, borderColor: Colors.darkBorder }}>
          <TouchableOpacity 
            onPress={() => setTicketCount(Math.max(1, ticketCount - 1))}
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="remove" size={20} color={Colors.white} />
          </TouchableOpacity>
          <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '800', width: 30, textAlign: 'center' }}>{ticketCount}</Text>
          <TouchableOpacity 
            onPress={() => setTicketCount(Math.min(5, ticketCount + 1))}
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="add" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <GoldButton 
          title="Pesan Sekarang" 
          onPress={handleCheckout} 
          disabled={!selectedCategory || isSalesClosed}
          style={{ flex: 1, marginLeft: 16 }}
        />
      </View>

      {/* Map Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={mapModalVisible}
        onRequestClose={() => setMapModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: Colors.obsidian }}>
          <View style={{ paddingTop: 60, paddingBottom: 20, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.darkSurface, zIndex: 10 }}>
            <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800' }}>Lokasi Venue</Text>
            <TouchableOpacity onPress={() => setMapModalVisible(false)} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 }}>
              <Ionicons name="close" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <MapView
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            initialRegion={venueRegion}
            showsUserLocation={true}
          >
            <Marker 
              coordinate={{ latitude: venueRegion.latitude, longitude: venueRegion.longitude }} 
              title={event.venueName}
              description={event.title}
            />
          </MapView>
          <View style={{ position: 'absolute', bottom: 40, left: 24, right: 24 }}>
            <GoldButton 
              title="Tutup Peta" 
              onPress={() => setMapModalVisible(false)} 
              size="lg"
            />
          </View>
        </View>
      </Modal>

    </View>
  );
}
