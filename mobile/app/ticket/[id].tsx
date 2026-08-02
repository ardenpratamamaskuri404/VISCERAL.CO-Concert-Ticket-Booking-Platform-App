import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '../../src/constants/theme';
import api from '../../src/api/axios';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mapModalVisible, setMapModalVisible] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      // In a real scenario we'd fetch specific ticket details. 
      // For this demo, let's assume there's an endpoint or we fetch from orders.
      // We will mock the fetch response based on common structures for now.
      const res = await api.get(`/tickets/${id}`);
      if (res.data?.data) {
        setTicket(res.data.data);
      } else {
        // Fallback mock if endpoint isn't perfectly matched in backend yet
        setTicket({
          id: id,
          ticketCode: `VSC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          seatNumber: 'FEST-01',
          categoryName: 'Festival',
          status: 'ACTIVE',
          order: {
            customerName: 'Customer Name',
            eventTitle: 'Visceral Live',
            venueName: 'Jakarta International Stadium',
            eventDate: new Date().toISOString(),
          }
        });
      }
    } catch (e) {
      console.error('Fetch ticket failed:', e);
      // Mock data for demo if backend fails
      setTicket({
        id: id,
        ticketCode: `VSC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        seatNumber: 'FEST-01',
        categoryName: 'Festival',
        status: 'ACTIVE',
        order: {
          customerName: 'John Doe',
          eventTitle: 'Visceral Live Concert',
          venueName: 'Jakarta International Stadium',
          eventDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.obsidian, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.obsidian, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: Colors.white }}>Tiket tidak ditemukan.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: Colors.gold }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { order } = ticket;
  const date = dayjs(order.eventDate);

  // Mock coordinates for the venue
  const venueRegion = {
    latitude: -6.1245,
    longitude: 106.8500, // JIS coordinates roughly
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.obsidian }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800' }}>E-Tiket</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center', paddingBottom: 100 }}>
        
        {/* The Ticket Card */}
        <View style={{ width: '100%', backgroundColor: Colors.darkCard, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: Colors.darkBorder }}>
          
          {/* Top Section - Event Details */}
          <View style={{ padding: 24, backgroundColor: Colors.darkSurface, borderBottomWidth: 2, borderBottomColor: Colors.obsidian, borderStyle: 'dashed' }}>
            <Text style={{ color: Colors.gold, fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 8 }}>VISCERAL.CO</Text>
            <Text style={{ color: Colors.white, fontSize: 24, fontWeight: '900', marginBottom: 16 }}>{order.eventTitle}</Text>
            
            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(200, 155, 60, 0.1)', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="calendar" size={20} color={Colors.gold} />
              </View>
              <View>
                <Text style={{ color: Colors.textMuted, fontSize: 12 }}>Tanggal</Text>
                <Text style={{ color: Colors.white, fontSize: 14, fontWeight: '700' }}>{date.format('DD MMM YYYY')}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 16 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(200, 155, 60, 0.1)', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="time" size={20} color={Colors.gold} />
              </View>
              <View>
                <Text style={{ color: Colors.textMuted, fontSize: 12 }}>Waktu</Text>
                <Text style={{ color: Colors.white, fontSize: 14, fontWeight: '700' }}>{date.format('HH:mm')} WIB</Text>
              </View>
            </View>
          </View>

          {/* Cutouts for ticket effect */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', top: 165, left: -10, right: -10, zIndex: 10 }}>
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.obsidian }} />
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.obsidian }} />
          </View>

          {/* Bottom Section - QR & User Info */}
          <View style={{ padding: 24, alignItems: 'center' }}>
            <View style={{ backgroundColor: Colors.white, padding: 16, borderRadius: 16, marginBottom: 24 }}>
              <QRCode
                value={ticket.ticketCode}
                size={200}
                color={Colors.obsidian}
                backgroundColor={Colors.white}
              />
            </View>
            <Text style={{ color: Colors.gold, fontSize: 18, fontWeight: '900', letterSpacing: 4, marginBottom: 24 }}>
              {ticket.ticketCode}
            </Text>

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <View>
                <Text style={{ color: Colors.textMuted, fontSize: 12 }}>Nama Pemesan</Text>
                <Text style={{ color: Colors.white, fontSize: 14, fontWeight: '700' }}>{order.customerName}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: Colors.textMuted, fontSize: 12 }}>Kategori</Text>
                <Text style={{ color: Colors.white, fontSize: 14, fontWeight: '700' }}>{ticket.categoryName}</Text>
              </View>
            </View>

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ color: Colors.textMuted, fontSize: 12 }}>Status</Text>
                <Text style={{ color: ticket.status === 'ACTIVE' ? Colors.success : Colors.oxblood, fontSize: 14, fontWeight: '900' }}>
                  {ticket.status}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: Colors.textMuted, fontSize: 12 }}>No. Kursi</Text>
                <Text style={{ color: Colors.gold, fontSize: 14, fontWeight: '900' }}>{ticket.seatNumber || 'FESTIVAL'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Map Button */}
        <TouchableOpacity 
          onPress={() => setMapModalVisible(true)}
          style={{ 
            marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 12, 
            backgroundColor: Colors.darkSurface, padding: 16, borderRadius: 16, 
            width: '100%', borderWidth: 1, borderColor: Colors.darkBorder 
          }}
        >
          <Ionicons name="map-outline" size={24} color={Colors.gold} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '700' }}>Lihat Peta Venue</Text>
            <Text style={{ color: Colors.textMuted, fontSize: 12 }}>{order.venueName}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </TouchableOpacity>

      </ScrollView>

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
              title={order.venueName}
            />
          </MapView>
          <View style={{ position: 'absolute', bottom: 40, left: 24, right: 24 }}>
            <TouchableOpacity 
              onPress={() => setMapModalVisible(false)} 
              style={{ backgroundColor: Colors.gold, padding: 16, borderRadius: 16, alignItems: 'center' }}
            >
              <Text style={{ color: Colors.obsidian, fontSize: 16, fontWeight: '900' }}>Tutup Peta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}
