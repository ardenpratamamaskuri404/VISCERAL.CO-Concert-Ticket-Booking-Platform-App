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
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [stageMapVisible, setStageMapVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);

  const isStandingCat = (catName: string) => {
    if (!catName) return false;
    const n = catName.toLowerCase();
    return n.includes('standing') || n.includes('festival') || n.includes('general') || n.includes('presale') || n.includes('pass') || n.includes('ga');
  };

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
    return `https://wisdom-detection-uncharted.ngrok-free.dev/assets/events/${url}`;
  };

  const handleCheckout = () => {
    if (!selectedCategory || !event) return;
    
    if (event.isSeated && !selectedCategory.name.toUpperCase().includes('FESTIVAL')) {
      // Go to seat selection
      router.push({
        pathname: `/seat-selection/${selectedCategory.id}`,
        params: {
          eventId: event.id,
          eventTitle: event.title,
          venueName: event.venueName,
          eventDate: event.eventDate
        }
      });
    } else {
      // Direct checkout for festival/standing
      router.push({
        pathname: `/checkout/${event.id}`,
        params: { 
          categoryId: selectedCategory.id,
          quantity: ticketCount
        }
      });
    }
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
                      {ea.artist.photoUrl ? (
                        <Image 
                          source={{ uri: `https://wisdom-detection-uncharted.ngrok-free.dev/assets/artists/${ea.artist.photoUrl}` }}
                          style={{ width: '100%', height: '100%', borderRadius: 40 }}
                        />
                      ) : (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="person" size={32} color={Colors.textMuted} />
                        </View>
                      )}
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

          {/* Stage Map & Categories */}
          <View style={{ backgroundColor: Colors.darkCard, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: Colors.darkBorder, marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800' }}>Kategori Tiket</Text>
              <TouchableOpacity 
                onPress={() => setStageMapVisible(true)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(200, 155, 60, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}
              >
                <Ionicons name="map-outline" size={16} color={Colors.gold} />
                <Text style={{ color: Colors.gold, fontSize: 12, fontWeight: '800' }}>Lihat Denah</Text>
              </TouchableOpacity>
            </View>

            {event.categories?.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => !cat.isSalesClosed && cat.availableSeats > 0 && setSelectedCategory(cat)}
                activeOpacity={0.8}
                style={{
                  backgroundColor: selectedCategory?.id === cat.id ? 'rgba(200, 155, 60, 0.1)' : Colors.darkSurface,
                  borderWidth: 2,
                  borderColor: selectedCategory?.id === cat.id ? Colors.gold : Colors.darkSurface,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  opacity: (cat.isSalesClosed || cat.availableSeats === 0) ? 0.6 : 1
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: selectedCategory?.id === cat.id ? Colors.gold : Colors.textMuted }} />
                    <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '800' }}>{cat.name}</Text>
                  </View>
                  <Text style={{ color: Colors.gold, fontSize: 16, fontWeight: '900' }}>Rp {Number(cat.price).toLocaleString('id-ID')}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 20 }}>
                  <Text style={{ color: Colors.textMuted, fontSize: 12 }}>
                    {isStandingCat(cat.name) || !event.isSeated ? 'Standing (Area Festival)' : 'Seated (Kursi Bernomor)'}
                  </Text>
                  
                  {cat.isSalesClosed ? (
                    <Text style={{ color: Colors.oxblood, fontSize: 12, fontWeight: '800' }}>DITUTUP</Text>
                  ) : cat.availableSeats === 0 ? (
                    <Text style={{ color: Colors.oxblood, fontSize: 12, fontWeight: '800' }}>HABIS</Text>
                  ) : (
                    <Text style={{ color: Colors.success, fontSize: 12, fontWeight: '700' }}>Tersedia {cat.availableSeats}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
        </View>
      </ScrollView>

      {/* Stage Map Modal */}
      <Modal visible={stageMapVisible} transparent={true} animationType="fade" onRequestClose={() => setStageMapVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View style={{ width: '100%', backgroundColor: Colors.darkCard, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: Colors.gold }}>
            <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.darkBorder, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800' }}>Denah Panggung</Text>
              <TouchableOpacity onPress={() => setStageMapVisible(false)}>
                <Ionicons name="close-circle" size={28} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={{ padding: 24, alignItems: 'center', backgroundColor: Colors.obsidian }}>
              {/* Dummy Stage Graphic */}
              <View style={{ width: 200, height: 60, backgroundColor: Colors.darkSurface, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 32, borderWidth: 2, borderColor: Colors.darkBorder }}>
                <Text style={{ color: Colors.white, fontWeight: '900', letterSpacing: 4 }}>PANGGUNG</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
                <View style={{ width: 100, height: 80, backgroundColor: 'rgba(200, 155, 60, 0.2)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.gold }}>
                  <Text style={{ color: Colors.gold, fontWeight: 'bold' }}>VIP A</Text>
                </View>
                <View style={{ width: 100, height: 80, backgroundColor: 'rgba(200, 155, 60, 0.2)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.gold }}>
                  <Text style={{ color: Colors.gold, fontWeight: 'bold' }}>VIP B</Text>
                </View>
              </View>
              <View style={{ width: 216, height: 100, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.textMuted }}>
                <Text style={{ color: Colors.white, fontWeight: 'bold' }}>FESTIVAL (STANDING)</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setStageMapVisible(false)} style={{ backgroundColor: Colors.gold, padding: 16, alignItems: 'center' }}>
              <Text style={{ color: Colors.obsidian, fontWeight: '900', fontSize: 16 }}>Tutup Denah</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sticky Bottom Bar */}
      <View style={{ 
        position: 'absolute', bottom: 0, left: 0, right: 0, 
        backgroundColor: Colors.darkSurface, 
        borderTopWidth: 1, borderTopColor: Colors.darkBorder,
        padding: 24, paddingBottom: Platform.OS === 'ios' ? 32 : 24,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {(!event.isSeated || (selectedCategory && isStandingCat(selectedCategory.name))) && (
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
        )}

        <GoldButton 
          title={event.isSeated && selectedCategory && !isStandingCat(selectedCategory.name) ? "Pilih Kursi" : "Pesan Sekarang"} 
          onPress={handleCheckout} 
          disabled={!selectedCategory || isSalesClosed}
          style={{ flex: 1, marginLeft: (!event.isSeated || (selectedCategory && isStandingCat(selectedCategory.name))) ? 16 : 0 }}
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
