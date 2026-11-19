import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Platform, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, getThemeColors } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import GoldButton from '../../src/components/GoldButton';
import api from '../../src/api/axios';
import { Event, TicketCategory, PaymentMethodType } from '../../src/types';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

const PAYMENT_METHODS: { id: PaymentMethodType; label: string; icon: string; type: string }[] = [
  { id: 'DOKU_VA', label: 'Virtual Account', icon: 'card-outline', type: 'doku' },
  { id: 'DOKU_QRIS', label: 'QRIS', icon: 'qr-code-outline', type: 'doku' },
  { id: 'DOKU_EWALLET', label: 'E-Wallet', icon: 'wallet-outline', type: 'doku' },
  { id: 'MANUAL_TRANSFER', label: 'Transfer Bank Manual', icon: 'cash-outline', type: 'manual' },
];

export default function CheckoutScreen() {
  const { eventId, categoryId, quantity, selectedSeats } = useLocalSearchParams();
  const router = useRouter();
  const { darkMode } = useApp();
  const theme = getThemeColors(darkMode);

  const [event, setEvent] = useState<Event | null>(null);
  const [category, setCategory] = useState<TicketCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('DOKU_VA');
  const [errorModal, setErrorModal] = useState<{
    title: string;
    message: string;
    isSeatConflict: boolean;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get(`/events/${eventId}`);
      if (res.data?.data) {
        setEvent(res.data.data);
        const cat = res.data.data.categories.find((c: any) => c.id === categoryId);
        if (cat) setCategory(cat);
      }
    } catch (e) {
      console.error('Fetch event failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!category || !event) return;
    
    setSubmitting(true);
    try {
      const parsedSeats = selectedSeats ? (selectedSeats as string).split(',') : [];
      
      const tickets = parsedSeats.length > 0 
        ? parsedSeats.map(seat => ({ categoryId: category.id, seatNumber: seat }))
        : Array.from({ length: Number(quantity) }).map(() => ({ categoryId: category.id }));

      const res = await api.post('/orders/checkout', {
        eventId: event.id,
        tickets,
        paymentMethod: selectedPayment
      });

      if (res.data?.success) {
        const orderId = res.data.order.id;
        // Redirect to payment screen
        router.replace(`/payment/${orderId}`);
      }
    } catch (e: any) {
      const msg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        'Terjadi kendala saat memproses pesanan Anda. Silakan coba kembali.';
      console.warn('Create order warning:', msg);
      const isSeatConflict =
        msg.toLowerCase().includes('kursi') || msg.toLowerCase().includes('kuota');

      setErrorModal({
        title: isSeatConflict ? 'Kursi Tidak Tersedia' : 'Pemesanan Tidak Dapat Diproses',
        message: msg,
        isSeatConflict,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.obsidian, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  if (!event || !category) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.obsidian, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: Colors.white }}>Data tidak valid.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: Colors.gold }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const ticketPrice = Number(category.price);
  const qty = Number(quantity);
  const subtotal = ticketPrice * qty;
  const platformFee = 2500;
  const total = subtotal + platformFee;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.obsidian }}>
      
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: Colors.darkSurface }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800' }}>Checkout Tiket</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        
        {/* Order Summary */}
        <View style={{ backgroundColor: Colors.darkCard, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.darkBorder, marginBottom: 24 }}>
          <Text style={{ color: Colors.gold, fontSize: 12, fontWeight: '800', marginBottom: 12, letterSpacing: 1 }}>DETAIL EVENT</Text>
          <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800', marginBottom: 8 }}>{event.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
            <Text style={{ color: Colors.textMuted, fontSize: 12 }}>
              {dayjs(event.eventDate).format('DD MMM YYYY, HH:mm')} WIB
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: Colors.darkBorder, marginVertical: 16 }} />

          <Text style={{ color: Colors.gold, fontSize: 12, fontWeight: '800', marginBottom: 12, letterSpacing: 1 }}>DETAIL TIKET</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <View>
              <Text style={{ color: Colors.white, fontSize: 14 }}>{category.name} (x{qty})</Text>
              {selectedSeats && (
                <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 4 }}>Kursi: {(selectedSeats as string).replace(/,/g, ', ')}</Text>
              )}
            </View>
            <Text style={{ color: Colors.white, fontSize: 14, fontWeight: '700' }}>Rp {subtotal.toLocaleString('id-ID')}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: Colors.textMuted, fontSize: 14 }}>Biaya Layanan</Text>
            <Text style={{ color: Colors.white, fontSize: 14, fontWeight: '700' }}>Rp {platformFee.toLocaleString('id-ID')}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800', marginBottom: 16 }}>Metode Pembayaran</Text>
        <View style={{ gap: 12 }}>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedPayment(method.id)}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                backgroundColor: selectedPayment === method.id ? 'rgba(200, 155, 60, 0.1)' : Colors.darkCard,
                borderWidth: 1.5,
                borderColor: selectedPayment === method.id ? Colors.gold : Colors.darkBorder,
                borderRadius: 16,
              }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Ionicons name={method.icon as any} size={20} color={selectedPayment === method.id ? Colors.gold : Colors.textMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: Colors.white, fontSize: 15, fontWeight: '700' }}>{method.label}</Text>
                {method.type === 'doku' && (
                  <Text style={{ color: Colors.goldLight, fontSize: 10, marginTop: 2 }}>Powered by DOKU</Text>
                )}
              </View>
              <View style={{ 
                width: 24, height: 24, borderRadius: 12, 
                borderWidth: 2, borderColor: selectedPayment === method.id ? Colors.gold : Colors.darkBorder,
                alignItems: 'center', justifyContent: 'center'
              }}>
                {selectedPayment === method.id && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.gold }} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Bottom Sticky Bar */}
      <View style={{ 
        position: 'absolute', bottom: 0, left: 0, right: 0, 
        backgroundColor: theme.card, 
        borderTopWidth: 1, borderTopColor: theme.border,
        paddingHorizontal: 20, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 24,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Text style={{ color: theme.textMuted, fontSize: 14 }}>Total Pembayaran</Text>
          <Text style={{ color: theme.gold, fontSize: 20, fontWeight: '900' }}>Rp {total.toLocaleString('id-ID')}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            disabled={submitting}
            style={{
              flex: 1,
              paddingVertical: 15,
              borderRadius: 16,
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.border,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: submitting ? 0.5 : 1,
            }}
          >
            <Text style={{ color: theme.text, fontWeight: '800', fontSize: 14 }}>Batalkan</Text>
          </TouchableOpacity>
          <View style={{ flex: 2 }}>
            <GoldButton 
              title="Bayar Sekarang" 
              onPress={handleCreateOrder} 
              loading={submitting}
              size="lg"
            />
          </View>
        </View>
      </View>

      {/* Modal Notifikasi Konflik Kursi / Error Pemesanan */}
      <Modal
        visible={!!errorModal}
        transparent
        animationType="fade"
        onRequestClose={() => setErrorModal(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.72)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
        >
          <View
            style={{
              width: '100%',
              backgroundColor: theme.card,
              borderRadius: 24,
              padding: 24,
              borderWidth: 1,
              borderColor: theme.border,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 58,
                height: 58,
                borderRadius: 18,
                backgroundColor: 'rgba(122, 46, 46, 0.16)',
                borderWidth: 1,
                borderColor: 'rgba(122, 46, 46, 0.4)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <Ionicons name="alert-circle-outline" size={30} color={Colors.oxblood} />
            </View>
            <Text
              style={{
                color: theme.text,
                fontSize: 18,
                fontWeight: '900',
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              {errorModal?.title}
            </Text>
            <Text
              style={{
                color: theme.textMuted,
                fontSize: 13,
                lineHeight: 20,
                textAlign: 'center',
                marginBottom: 22,
              }}
            >
              {errorModal?.message}
            </Text>

            <View style={{ width: '100%', gap: 10 }}>
              {errorModal?.isSeatConflict && (
                <GoldButton
                  title="Pilih Kursi Lain"
                  onPress={() => {
                    setErrorModal(null);
                    router.back();
                  }}
                />
              )}
              <TouchableOpacity
                onPress={() => setErrorModal(null)}
                style={{
                  width: '100%',
                  paddingVertical: 13,
                  borderRadius: 14,
                  backgroundColor: theme.surface,
                  borderWidth: 1,
                  borderColor: theme.border,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13 }}>
                  Mengerti
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
