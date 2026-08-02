import React, { useRef, useState } from 'react';
import { View, Text, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, GoldGradient } from '../src/constants/theme';
import GoldButton from '../src/components/GoldButton';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    title: 'Temukan Konser Impianmu',
    description: 'Jelajahi ribuan event konser dari artis favoritmu dan dapatkan tiket terbaik.',
    emoji: '🎵',
  },
  {
    title: 'Pesan Tiket dengan Mudah',
    description: 'Pilih kursi, bayar dengan berbagai metode pembayaran, dan dapatkan e-tiket instan.',
    emoji: '🎫',
  },
  {
    title: 'Nikmati Pengalaman Live',
    description: 'Scan QR tiketmu di pintu masuk dan rasakan alunan musik langsung dari panggung.',
    emoji: '🎤',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSkip = async () => {
    await AsyncStorage.setItem('visceral_onboarded', 'true');
    router.replace('/(auth)/login');
  };

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await AsyncStorage.setItem('visceral_onboarded', 'true');
      router.replace('/(auth)/register');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.obsidian }}>
      {/* Skip button */}
      <TouchableOpacity
        onPress={handleSkip}
        style={{ position: 'absolute', top: 60, right: 24, zIndex: 10 }}
      >
        <Text style={{ color: Colors.textMuted, fontSize: 14, fontWeight: '600' }}>Lewati</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              width,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 40,
            }}
          >
            {/* Illustration */}
            <View
              style={{
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: Colors.darkSurface,
                borderWidth: 2,
                borderColor: Colors.darkBorder,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 48,
              }}
            >
              <Text style={{ fontSize: 72 }}>{item.emoji}</Text>
            </View>

            <Text
              style={{
                color: Colors.gold,
                fontSize: 26,
                fontWeight: '900',
                textAlign: 'center',
                marginBottom: 16,
                letterSpacing: 0.5,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                color: Colors.textMuted,
                fontSize: 15,
                textAlign: 'center',
                lineHeight: 24,
              }}
            >
              {item.description}
            </Text>
          </View>
        )}
      />

      {/* Bottom section */}
      <View style={{ paddingHorizontal: 40, paddingBottom: 60, alignItems: 'center' }}>
        {/* Dot indicator */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 32 }}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={{
                width: currentIndex === i ? 28 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: currentIndex === i ? Colors.gold : Colors.darkBorder,
              }}
            />
          ))}
        </View>

        <GoldButton
          title={currentIndex === slides.length - 1 ? 'Mulai Sekarang' : 'Selanjutnya'}
          onPress={handleNext}
          size="lg"
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}
