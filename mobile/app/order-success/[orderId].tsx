import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import GoldButton from '../../src/components/GoldButton';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import api from '../../src/api/axios';

const { width } = Dimensions.get('window');

export default function OrderSuccessScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch order to get ticket ID for quick navigation
    api.get(`/orders/${orderId}`)
      .then(res => {
        const order = res.data?.data;
        if (order && order.tickets && order.tickets.length > 0) {
          setTicketId(order.tickets[0].id);
        }
      })
      .catch(err => console.error('Error fetching order tickets', err));
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.obsidian, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      
      {/* Decorative success animation background */}
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
        <LottieView
          autoPlay
          loop
          style={{ width: width * 1.5, height: width * 1.5 }}
          source={require('../../assets/confetti.json')} // Ensure this exists or fallback gracefully
          // For this example without actual lottie json file, it will just show empty if not found, we rely on the checkmark below
        />
      </View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
        <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(46, 204, 113, 0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12 }}>
            <Ionicons name="checkmark" size={48} color={Colors.white} />
          </View>
        </View>

        <Text style={{ color: Colors.gold, fontSize: 32, fontWeight: '900', marginBottom: 12, textAlign: 'center' }}>
          Pembayaran Berhasil!
        </Text>
        
        <Text style={{ color: Colors.textMuted, fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 40 }}>
          Terima kasih telah memesan tiket di VISCERAL.CO.{'\n'}E-tiket Anda sudah siap.
        </Text>
      </Animated.View>

      <Animated.View style={{ opacity: opacityAnim, width: '100%', gap: 16 }}>
        <GoldButton 
          title="Lihat Barcode Tiket" 
          onPress={() => {
            if (ticketId) {
              router.replace(`/ticket/${ticketId}`);
            } else {
              router.replace('/(tabs)/tickets');
            }
          }} 
          size="lg"
        />
        <GoldButton 
          title="Daftar Semua Tiket Saya" 
          onPress={() => router.replace('/(tabs)/tickets')} 
          variant="outline"
          size="lg"
        />
      </Animated.View>
    </View>
  );
}
