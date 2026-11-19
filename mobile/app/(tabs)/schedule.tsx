import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, getThemeColors } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { getAssetUrl } from '../../src/api/config';
import { Ionicons } from '@expo/vector-icons';

export default function ScheduleTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { events, artists, fetchEvents, darkMode } = useApp();
  const theme = getThemeColors(darkMode);

  const [now, setNow] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Live 1-second timer for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  const sortedEvents = useMemo(() => {
    return [...events]
      .filter((ev) => ev.status === 'PUBLISHED')
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  }, [events]);

  const monthOptions = useMemo(() => {
    const map = new Map<string, string>();
    sortedEvents.forEach((ev) => {
      const d = new Date(ev.eventDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
      if (!map.has(key)) map.set(key, label);
    });
    return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
  }, [sortedEvents]);

  const filteredEvents = useMemo(() => {
    return sortedEvents.filter((ev) => {
      if (onlyAvailable && ev.salesClosed) return false;
      if (selectedMonth === 'ALL') return true;
      const d = new Date(ev.eventDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return key === selectedMonth;
    });
  }, [sortedEvents, selectedMonth, onlyAvailable]);

  const nextUpcomingEvent = useMemo(() => {
    return (
      sortedEvents.find((ev) => new Date(ev.eventDate) > now && !ev.salesClosed) ||
      sortedEvents[0]
    );
  }, [sortedEvents, now]);

  const getCountdown = (targetDate: string) => {
    const diff = new Date(targetDate).getTime() - now.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const getEventArtistNames = (ev: any) => {
    if (!ev?.artists) return '';
    return ev.artists
      .map((ea: any) => artists.find((a) => a.id === ea.artistId)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const countdown = nextUpcomingEvent ? getCountdown(nextUpcomingEvent.eventDate) : null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: Math.max(insets.top + 16, 56),
          paddingBottom: 18,
          backgroundColor: theme.card,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <Text style={{ color: theme.gold, fontSize: 26, fontWeight: '900' }}>
          Jadwal Konser
        </Text>
        <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>
          Hitung mundur & agenda pertunjukan VISCERAL.CO secara real-time
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 115 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.gold} />
        }
      >
        {/* Spotlight Konser Terdekat + Real-Time Countdown */}
        {nextUpcomingEvent && countdown && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push(`/event/${nextUpcomingEvent.id}`)}
            style={{
              backgroundColor: theme.card,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: Colors.gold,
              overflow: 'hidden',
              marginBottom: 22,
            }}
          >
            {nextUpcomingEvent.bannerUrl ? (
              <Image
                source={{ uri: getAssetUrl(nextUpcomingEvent.bannerUrl, 'events') || undefined }}
                style={{ width: '100%', height: 150 }}
                resizeMode="cover"
              />
            ) : null}

            <View style={{ padding: 18 }}>
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: Colors.gold,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 99,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: Colors.obsidian, fontSize: 10, fontWeight: '900' }}>
                  KONSER TERDEKAT
                </Text>
              </View>

              <Text style={{ color: theme.text, fontSize: 19, fontWeight: '900', marginBottom: 6 }}>
                {nextUpcomingEvent.title}
              </Text>
              <Text style={{ color: theme.textMuted, fontSize: 12, marginBottom: 14 }}>
                {new Date(nextUpcomingEvent.eventDate).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                • {nextUpcomingEvent.venueName}
              </Text>

              {/* Countdown 4 Kotak Real-Time */}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[
                  { label: 'Hari', val: countdown.days },
                  { label: 'Jam', val: countdown.hours },
                  { label: 'Menit', val: countdown.minutes },
                  { label: 'Detik', val: countdown.seconds },
                ].map((box) => (
                  <View
                    key={box.label}
                    style={{
                      flex: 1,
                      backgroundColor: theme.surface,
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: 14,
                      paddingVertical: 10,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: theme.gold, fontSize: 20, fontWeight: '900' }}>
                      {String(box.val).padStart(2, '0')}
                    </Text>
                    <Text style={{ color: theme.textMuted, fontSize: 10, fontWeight: '700' }}>
                      {box.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Filter Bulan & Tersedia */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, marginBottom: 20 }}
        >
          <TouchableOpacity
            onPress={() => setSelectedMonth('ALL')}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 99,
              backgroundColor: selectedMonth === 'ALL' ? Colors.gold : theme.card,
              borderWidth: 1,
              borderColor: selectedMonth === 'ALL' ? Colors.gold : theme.border,
            }}
          >
            <Text
              style={{
                color: selectedMonth === 'ALL' ? Colors.obsidian : theme.text,
                fontSize: 12,
                fontWeight: '800',
              }}
            >
              Semua Bulan
            </Text>
          </TouchableOpacity>

          {monthOptions.map((m) => {
            const active = selectedMonth === m.key;
            return (
              <TouchableOpacity
                key={m.key}
                onPress={() => setSelectedMonth(m.key)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 99,
                  backgroundColor: active ? Colors.gold : theme.card,
                  borderWidth: 1,
                  borderColor: active ? Colors.gold : theme.border,
                }}
              >
                <Text
                  style={{
                    color: active ? Colors.obsidian : theme.text,
                    fontSize: 12,
                    fontWeight: '700',
                  }}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={() => setOnlyAvailable((prev) => !prev)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 99,
              backgroundColor: onlyAvailable ? Colors.oxblood : theme.card,
              borderWidth: 1,
              borderColor: onlyAvailable ? Colors.oxblood : theme.border,
            }}
          >
            <Text
              style={{
                color: onlyAvailable ? Colors.white : theme.text,
                fontSize: 12,
                fontWeight: '700',
              }}
            >
              Tersedia Saja
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Daftar Jadwal */}
        {filteredEvents.map((ev) => {
          const d = new Date(ev.eventDate);
          const artistNames = getEventArtistNames(ev);
          const evCountdown = getCountdown(ev.eventDate);
          const isPast = d.getTime() <= now.getTime();

          return (
            <TouchableOpacity
              key={ev.id}
              activeOpacity={0.85}
              onPress={() => router.push(`/event/${ev.id}`)}
              style={{
                backgroundColor: theme.card,
                borderRadius: 20,
                padding: 16,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: theme.border,
                flexDirection: 'row',
                gap: 14,
                alignItems: 'center',
              }}
            >
              {/* Kotak Tanggal */}
              <View
                style={{
                  width: 58,
                  height: 64,
                  borderRadius: 16,
                  backgroundColor: theme.surface,
                  borderWidth: 1,
                  borderColor: theme.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: theme.gold, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' }}>
                  {d.toLocaleDateString('id-ID', { month: 'short' })}
                </Text>
                <Text style={{ color: theme.text, fontSize: 22, fontWeight: '900' }}>
                  {d.getDate()}
                </Text>
              </View>

              {/* Info Event */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 99,
                      backgroundColor: ev.salesClosed
                        ? 'rgba(122, 46, 46, 0.2)'
                        : 'rgba(46, 204, 113, 0.15)',
                    }}
                  >
                    <Text
                      style={{
                        color: ev.salesClosed ? Colors.oxblood : Colors.success,
                        fontSize: 9,
                        fontWeight: '900',
                      }}
                    >
                      {ev.salesClosed ? 'PENJUALAN DITUTUP' : 'TERSEDIA'}
                    </Text>
                  </View>
                  {!isPast && (
                    <Text style={{ color: theme.gold, fontSize: 10, fontWeight: '800' }}>
                      {evCountdown.days}h {String(evCountdown.hours).padStart(2, '0')}:
                      {String(evCountdown.minutes).padStart(2, '0')}:
                      {String(evCountdown.seconds).padStart(2, '0')}
                    </Text>
                  )}
                </View>

                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }} numberOfLines={1}>
                  {ev.title}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }} numberOfLines={1}>
                  {d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB • {ev.venueName}
                </Text>
                {artistNames ? (
                  <Text style={{ color: theme.gold, fontSize: 11, fontWeight: '600', marginTop: 3 }} numberOfLines={1}>
                    {artistNames}
                  </Text>
                ) : null}
              </View>

              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          );
        })}

        {filteredEvents.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Ionicons name="calendar-outline" size={48} color={theme.border} style={{ marginBottom: 12 }} />
            <Text style={{ color: theme.textMuted, fontSize: 14 }}>
              Tidak ada jadwal konser pada filter ini.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
