import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import GoldButton from '../../src/components/GoldButton';
import { Ionicons } from '@expo/vector-icons';
import api from '../../src/api/axios';

const { width } = Dimensions.get('window');

export default function SeatSelectionScreen() {
  const { categoryId, eventId, eventTitle, eventDate, venueName } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      // The API events/:id already includes the category and seats
      const res = await api.get(`/events/${eventId}`);
      if (res.data?.data) {
        const cat = res.data.data.categories.find((c: any) => c.id === categoryId);
        if (cat) {
          setCategoryName(cat.name);
          setPrice(Number(cat.price));
          // Seats are already returned from events.routes.ts
          setSeats(cat.seats || []);
        }
      }
    } catch (e) {
      console.error('Fetch seats failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatToggle = (seatNumber: string, status: string) => {
    if (status !== 'AVAILABLE') return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      if (selectedSeats.length >= 5) {
        // Just ignore if > 5
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) return;
    router.push({
      pathname: `/checkout/[eventId]`,
      params: { 
        eventId, 
        categoryId, 
        quantity: selectedSeats.length.toString(),
        selectedSeats: selectedSeats.join(',') 
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

  // Group seats conceptually if we wanted rows, but let's just make a simple grid.
  // Generate rows of 4 or 6 for a stadium look.
  const numColumns = 4;
  const SEAT_SIZE = (width - 48 - (numColumns - 1) * 12) / numColumns;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.obsidian }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: Colors.darkSurface }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800' }}>Pilih Kursi - {categoryName}</Text>
          <Text style={{ color: Colors.textMuted, fontSize: 12 }}>{eventTitle}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 150 }}>
        
        {/* Stage Graphic */}
        <View style={{ width: '100%', height: 60, backgroundColor: Colors.darkCard, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 40, borderWidth: 2, borderColor: Colors.gold }}>
          <Text style={{ color: Colors.gold, fontWeight: '900', letterSpacing: 8 }}>PANGGUNG</Text>
        </View>

        {/* Seat Legend */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32, paddingHorizontal: 16 }}>
          <View style={{ alignItems: 'center', gap: 8 }}>
            <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: Colors.darkSurface, borderWidth: 1, borderColor: Colors.darkBorder }} />
            <Text style={{ color: Colors.textMuted, fontSize: 12 }}>Tersedia</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 8 }}>
            <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: Colors.gold }} />
            <Text style={{ color: Colors.white, fontSize: 12 }}>Dipilih</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 8 }}>
            <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: 'rgba(255, 0, 0, 0.2)', borderWidth: 1, borderColor: Colors.oxblood }} />
            <Text style={{ color: Colors.textMuted, fontSize: 12 }}>Terjual</Text>
          </View>
        </View>

        {/* Seat Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {seats.map((seat) => {
            const isSelected = selectedSeats.includes(seat.seatNumber);
            const isAvailable = seat.status === 'AVAILABLE';

            let bgColor = Colors.darkSurface;
            let borderColor = Colors.darkBorder;
            let textColor = Colors.white;

            if (isSelected) {
              bgColor = Colors.gold;
              borderColor = Colors.gold;
              textColor = Colors.obsidian;
            } else if (!isAvailable) {
              bgColor = 'rgba(255,0,0,0.1)';
              borderColor = 'rgba(255,0,0,0.3)';
              textColor = 'rgba(255,255,255,0.3)';
            }

            return (
              <TouchableOpacity
                key={seat.id || seat.seatNumber}
                onPress={() => handleSeatToggle(seat.seatNumber, seat.status)}
                activeOpacity={isAvailable ? 0.7 : 1}
                style={{
                  width: SEAT_SIZE,
                  height: SEAT_SIZE,
                  backgroundColor: bgColor,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: borderColor,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={{ color: textColor, fontWeight: '800', fontSize: 14 }}>
                  {seat.seatNumber.replace('S-', '')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={{ 
        position: 'absolute', bottom: 0, left: 0, right: 0, 
        backgroundColor: Colors.darkSurface, 
        borderTopWidth: 1, borderTopColor: Colors.darkBorder,
        padding: 24, paddingBottom: 32,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <View>
          <Text style={{ color: Colors.textMuted, fontSize: 12, marginBottom: 4 }}>
            {selectedSeats.length} Kursi Dipilih
          </Text>
          <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '900' }}>
            Rp {(price * selectedSeats.length).toLocaleString('id-ID')}
          </Text>
        </View>

        <GoldButton 
          title="Lanjut Bayar" 
          onPress={handleProceed} 
          disabled={selectedSeats.length === 0}
          style={{ width: 150 }}
        />
      </View>
    </View>
  );
}
