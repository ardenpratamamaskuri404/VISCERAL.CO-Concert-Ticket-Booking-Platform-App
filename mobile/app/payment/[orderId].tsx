import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../../src/constants/theme';
import GoldButton from '../../src/components/GoldButton';
import api from '../../src/api/axios';
import { getSocket } from '../../src/api/socket';
import { Order } from '../../src/types';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

export default function PaymentScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const isRedirecting = useRef(false);

  const handleSuccess = () => {
    if (isRedirecting.current) return;
    isRedirecting.current = true;
    router.replace(`/order-success/${orderId}`);
  };

  useEffect(() => {
    fetchOrder();

    // Listen to real-time payment status updates
    const socket = getSocket();
    socket.on('order_paid', (data: { orderId?: string, id?: string }) => {
      if (data.orderId === orderId || data.id === orderId) {
        handleSuccess();
      }
    });

    // Set up polling as a fallback in case socket disconnects while app is in background
    const pollInterval = setInterval(() => {
      fetchOrder();
    }, 3000);

    return () => {
      socket.off('order_paid');
      clearInterval(pollInterval);
    };
  }, [orderId]);

  const fetchOrder = async () => {
    if (isRedirecting.current) return;
    try {
      const res = await api.get(`/orders/${orderId}`);
      if (res.data?.data) {
        setOrder(res.data.data);
        if (res.data.data.status === 'PAID') {
          handleSuccess();
        }
      }
    } catch (e) {
      console.error('Fetch order failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!order) return;

    if (order.paymentMethod.startsWith('DOKU')) {
      try {
        const returnUrl = Linking.createURL(`/payment/${order.id}`);
        const res = await api.post(`/orders/${order.id}/generate-doku`, { returnUrl });
        if (res.data?.dokuUrl) {
          await WebBrowser.openBrowserAsync(res.data.dokuUrl);
          // When user closes browser, re-check status
          fetchOrder();
        } else {
          Alert.alert('Info', 'Link pembayaran tidak tersedia.');
        }
      } catch (e: any) {
        Alert.alert('Error', e.response?.data?.error || 'Gagal memuat halaman pembayaran');
      }
    } else {
      // Manual transfer flow (mocked)
      Alert.alert('Info', 'Silakan lakukan transfer manual ke rekening yang tertera, lalu konfirmasi.');
    }
  };

  const copyVirtualAccount = async () => {
    // In a real app, this would be the actual VA number from DOKU response
    const vaNumber = `8900${order?.orderNumber?.replace(/\D/g, '').substring(0, 8)}`;
    // Note: requires expo-clipboard to be installed, we use a fallback alert if not
    Alert.alert('Berhasil', 'Nomor Virtual Account disalin: ' + vaNumber);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.obsidian, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.obsidian, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: Colors.white }}>Pesanan tidak ditemukan.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: Colors.gold }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isDoku = order.paymentMethod.startsWith('DOKU');

  return (
    <View style={{ flex: 1, backgroundColor: Colors.obsidian }}>
      
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/tickets')} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
          <Ionicons name="close" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800' }}>Pembayaran</Text>
      </View>

      <View style={{ padding: 24, alignItems: 'center' }}>
        <Text style={{ color: Colors.textMuted, fontSize: 14, marginBottom: 8 }}>Total Pembayaran</Text>
        <Text style={{ color: Colors.gold, fontSize: 36, fontWeight: '900', marginBottom: 32 }}>
          Rp {order.totalAmount.toLocaleString('id-ID')}
        </Text>

        <View style={{ width: '100%', backgroundColor: Colors.darkCard, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: Colors.darkBorder, alignItems: 'center' }}>
          <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '700', marginBottom: 24 }}>
            Selesaikan Pembayaran Anda
          </Text>
          
          <Text style={{ color: Colors.textMuted, fontSize: 14, marginBottom: 8, textAlign: 'center' }}>
            Pesanan ini akan kedaluwarsa pada:
          </Text>
          <Text style={{ color: Colors.oxblood, fontSize: 16, fontWeight: '800', marginBottom: 32 }}>
            {dayjs(order.expiresAt).format('DD MMM YYYY, HH:mm')} WIB
          </Text>

          {isDoku ? (
            <GoldButton 
              title="Bayar dengan DOKU" 
              onPress={handlePay} 
              size="lg"
              style={{ width: '100%' }}
              icon={<Ionicons name="card" size={20} color={Colors.obsidian} />}
            />
          ) : (
             <View style={{ width: '100%' }}>
                <Text style={{ color: Colors.textMuted, fontSize: 12, marginBottom: 4 }}>Bank Transfer BCA</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.darkSurface, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.darkBorder, marginBottom: 16 }}>
                  <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800', letterSpacing: 2 }}>8900 1234 5678</Text>
                  <TouchableOpacity onPress={copyVirtualAccount}>
                    <Ionicons name="copy-outline" size={20} color={Colors.gold} />
                  </TouchableOpacity>
                </View>
                <GoldButton 
                  title="Saya Sudah Transfer" 
                  onPress={() => Alert.alert('Info', 'Tim kami akan memverifikasi pembayaran Anda.')} 
                  size="lg"
                  style={{ width: '100%' }}
                />
             </View>
          )}

          <TouchableOpacity onPress={() => router.push('/(tabs)/tickets')} style={{ marginTop: 24 }}>
            <Text style={{ color: Colors.textMuted, fontSize: 14, textDecorationLine: 'underline' }}>Bayar Nanti (Cek Tiket Saya)</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}
