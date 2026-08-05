import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../src/constants/theme';
import GoldButton from '../src/components/GoldButton';
import VisceralLogo from '../src/components/VisceralLogo';

const { width } = Dimensions.get('window');

const slides = [
  {
    title: 'Temukan Konser Impianmu',
    description: 'Jelajahi ribuan event konser dari artis favoritmu dan dapatkan tiket terbaik.',
    image: require('../assets/images/onboarding1.png'),
  },
  {
    title: 'Pesan Tiket dengan Mudah',
    description: 'Pilih kursi, bayar dengan berbagai metode pembayaran, dan dapatkan e-tiket instan.',
    image: require('../assets/images/onboarding2.png'),
  },
  {
    title: 'Nikmati Pengalaman Live',
    description: 'Scan QR tiketmu di pintu masuk dan rasakan alunan musik langsung dari panggung.',
    image: require('../assets/images/onboarding3.png'),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll animation
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < slides.length - 1) {
        flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
        // The onMomentumScrollEnd will update the state when user swipes, 
        // but for programmatic scroll we should update it here to keep the interval in sync.
        setCurrentIndex(currentIndex + 1);
      } else {
        clearInterval(timer); // Stop at the last slide
      }
    }, 3500); // Ganti slide otomatis setiap 3.5 detik

    return () => clearInterval(timer);
  }, [currentIndex]);

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
      {/* Top Bar: Logo + Skip */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <VisceralLogo size={48} />
          <View>
            <Text style={{ color: Colors.gold, fontSize: 14, fontWeight: '900', letterSpacing: 2 }}>VISCERAL</Text>
            <Text style={{ color: Colors.oxblood, fontSize: 8, fontWeight: '700', letterSpacing: 3 }}>LIVE CONCERTS</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={{ color: Colors.textMuted, fontSize: 14, fontWeight: '600' }}>Lewati</Text>
        </TouchableOpacity>
      </View>

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
                width: width * 0.8,
                height: width * 0.8,
                borderRadius: 24,
                backgroundColor: Colors.darkSurface,
                borderWidth: 2,
                borderColor: Colors.goldDark,
                overflow: 'hidden',
                marginBottom: 48,
                shadowColor: Colors.gold,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <Image 
                source={item.image} 
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              />
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
