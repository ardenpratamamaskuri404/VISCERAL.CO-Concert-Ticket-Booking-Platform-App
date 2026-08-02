import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '../constants/theme';
import { Event } from '../types';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

interface EventCardProps {
  event: Event;
  onPress: () => void;
  variant?: 'featured' | 'grid';
}

const getImageUrl = (url?: string) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `http://10.0.2.2:3005/assets/events/${url}`;
};

export default function EventCard({ event, onPress, variant = 'featured' }: EventCardProps) {
  const eventDate = new Date(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const lowestPrice = event.categories?.length
    ? Math.min(...event.categories.map((c) => Number(c.price)))
    : 0;

  const isSalesClosed = event.salesClosed || event.categories?.every((c) => c.isSalesClosed);

  if (variant === 'grid') {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[
          {
            backgroundColor: Colors.darkCard,
            borderRadius: 20,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: Colors.darkBorder,
            width: (width - 48 - 12) / 2,
          },
          Shadows.card,
        ]}
      >
        <Image
          source={
            getImageUrl(event.bannerUrl)
              ? { uri: getImageUrl(event.bannerUrl)! }
              : require('../../assets/icon.png')
          }
          style={{ width: '100%', height: 100, backgroundColor: Colors.darkSurface }}
          resizeMode="cover"
        />
        {isSalesClosed && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: Colors.oxblood,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 8, fontWeight: '800' }}>SOLD OUT</Text>
          </View>
        )}
        <View style={{ padding: 12 }}>
          <Text
            numberOfLines={2}
            style={{ color: Colors.darkText, fontWeight: '800', fontSize: 12, marginBottom: 4 }}
          >
            {event.title}
          </Text>
          <Text style={{ color: Colors.textMuted, fontSize: 10, marginBottom: 6 }}>
            {formattedDate}
          </Text>
          <Text style={{ color: Colors.gold, fontWeight: '900', fontSize: 12 }}>
            Rp {lowestPrice.toLocaleString('id-ID')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Featured card
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        {
          width: CARD_WIDTH,
          borderRadius: 24,
          overflow: 'hidden',
          marginRight: 16,
          backgroundColor: Colors.darkCard,
          borderWidth: 1,
          borderColor: Colors.darkBorder,
        },
        Shadows.dark,
      ]}
    >
      <Image
        source={
          getImageUrl(event.bannerUrl)
            ? { uri: getImageUrl(event.bannerUrl)! }
            : require('../../assets/icon.png')
        }
        style={{ width: '100%', height: 180, backgroundColor: Colors.darkSurface }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(20,17,15,0.95)']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 140,
          justifyContent: 'flex-end',
          padding: 16,
        }}
      >
        {isSalesClosed && (
          <View
            style={{
              position: 'absolute',
              top: -40,
              right: 16,
              backgroundColor: Colors.oxblood,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1 }}>
              SOLD OUT
            </Text>
          </View>
        )}
        <Text
          numberOfLines={2}
          style={{ color: '#fff', fontWeight: '900', fontSize: 18, marginBottom: 4 }}
        >
          {event.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="calendar-outline" size={12} color={Colors.gold} />
            <Text style={{ color: Colors.textMuted, fontSize: 11 }}>{formattedDate}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="location-outline" size={12} color={Colors.gold} />
            <Text numberOfLines={1} style={{ color: Colors.textMuted, fontSize: 11, maxWidth: 120 }}>
              {event.venueName}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <Text style={{ color: Colors.gold, fontWeight: '900', fontSize: 15 }}>
            Mulai Rp {lowestPrice.toLocaleString('id-ID')}
          </Text>
          <View
            style={{
              backgroundColor: 'rgba(200,155,60,0.15)',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: Colors.gold, fontSize: 10, fontWeight: '800' }}>
              {event.categories?.reduce((sum, c) => sum + (c.availableSeats || 0), 0)} kursi
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
