import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export const PROVIDER_GOOGLE = 'google';
export const Marker = ({ title, description }: any) => null;

export default function SafeMapView({ initialRegion, children, style }: any) {
  return (
    <View style={[{ flex: 1, backgroundColor: '#14110F', justifyContent: 'center', alignItems: 'center', padding: 24 }, style]}>
      <Ionicons name="map-outline" size={56} color={Colors.gold} />
      <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800', marginTop: 14 }}>
        Peta Lokasi Venue
      </Text>
      <Text style={{ color: Colors.textMuted, fontSize: 13, marginTop: 6, textAlign: 'center' }}>
        Koordinat: {initialRegion?.latitude ?? '-6.2088'}, {initialRegion?.longitude ?? '106.8456'}
      </Text>
      <Text style={{ color: Colors.gold, fontSize: 12, marginTop: 10 }}>
        (Tampilan Google Maps interaktif aktif penuh pada perangkat Android / iOS)
      </Text>
    </View>
  );
}
