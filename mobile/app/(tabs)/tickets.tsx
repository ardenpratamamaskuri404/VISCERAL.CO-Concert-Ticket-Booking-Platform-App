import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { Order } from '../../src/types';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

export default function TicketsScreen() {
  const router = useRouter();
  const { orders, fetchOrders } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return { bg: 'rgba(200, 155, 60, 0.15)', text: Colors.gold, label: 'BERHASIL' };
      case 'PENDING':
        return { bg: 'rgba(243, 156, 18, 0.15)', text: Colors.warning, label: 'MENUNGGU PEMBAYARAN' };
      case 'CANCELLED':
      case 'EXPIRED':
        return { bg: 'rgba(122, 46, 46, 0.15)', text: Colors.oxblood, label: 'DIBATALKAN' };
      default:
        return { bg: Colors.darkSurface, text: Colors.textMuted, label: status };
    }
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const badge = getStatusBadge(item.status);
    const date = item.eventDate ? dayjs(item.eventDate).format('DD MMM YYYY') : '';
    
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.status === 'PENDING') {
            router.push(`/payment/${item.id}`);
          } else {
            // Tampilkan tiket pertama
            if (item.tickets && item.tickets.length > 0) {
              router.push(`/ticket/${item.tickets[0].id}`);
            }
          }
        }}
        style={{
          backgroundColor: Colors.darkCard,
          borderRadius: 20,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: Colors.darkBorder,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <View>
            <Text style={{ color: Colors.textMuted, fontSize: 10, fontWeight: '700', marginBottom: 4 }}>
              ORDER {item.orderNumber}
            </Text>
            <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '800' }}>
              {item.eventTitle || 'Konser Visceral'}
            </Text>
            <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 4 }}>
              {date} • {item.venueName}
            </Text>
          </View>
          <View style={{ backgroundColor: badge.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
            <Text style={{ color: badge.text, fontSize: 10, fontWeight: '900' }}>{badge.label}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.darkBorder }}>
          <View>
            <Text style={{ color: Colors.textMuted, fontSize: 10, marginBottom: 2 }}>Total Harga</Text>
            <Text style={{ color: Colors.gold, fontSize: 14, fontWeight: '900' }}>
              Rp {item.totalAmount.toLocaleString('id-ID')}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: Colors.gold, fontSize: 12, fontWeight: '700' }}>
              {item.status === 'PENDING' ? 'Bayar Sekarang' : 'Lihat Tiket'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.gold} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.obsidian }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 }}>
        <Text style={{ color: Colors.gold, fontSize: 28, fontWeight: '900' }}>Tiket Saya</Text>
        <Text style={{ color: Colors.textMuted, fontSize: 14, marginTop: 4 }}>Riwayat pemesanan tiket Anda</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold} />}
        renderItem={renderOrder}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
            <Ionicons name="ticket-outline" size={64} color={Colors.darkBorder} style={{ marginBottom: 16 }} />
            <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '700', marginBottom: 8 }}>Belum Ada Tiket</Text>
            <Text style={{ color: Colors.textMuted, fontSize: 14, textAlign: 'center' }}>
              Anda belum memiliki riwayat pemesanan tiket. Jelajahi event sekarang!
            </Text>
          </View>
        }
      />
    </View>
  );
}
