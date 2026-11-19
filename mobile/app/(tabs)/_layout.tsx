import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, getThemeColors } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';

const { width } = Dimensions.get('window');

function CustomTabBar({ state, descriptors, navigation, unreadNotifCount, darkMode }: any) {
  const router = useRouter();
  const theme = getThemeColors(darkMode);
  if (!state?.routes) return null;

  return (
    <View style={styles.tabBarContainer}>
      <View
        style={[
          styles.tabBar,
          { backgroundColor: theme.tabBarBg, borderColor: theme.tabBarBorder },
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors?.[route.key] || { options: {} };
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            if (navigation?.emit) {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            } else if (!isFocused) {
              const targetPath = route.name === 'index' ? '/(tabs)' : `/(tabs)/${route.name}`;
              router.navigate(targetPath as any);
            }
          };

          let iconName: any = 'home';
          if (route.name === 'index') iconName = isFocused ? 'home' : 'home-outline';
          if (route.name === 'schedule') iconName = isFocused ? 'calendar' : 'calendar-outline';
          if (route.name === 'tickets') iconName = isFocused ? 'ticket' : 'ticket-outline';
          if (route.name === 'profile') iconName = isFocused ? 'person' : 'person-outline';

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              activeOpacity={0.8}
              style={[
                styles.tabItem,
                isFocused && styles.tabItemFocused
              ]}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={iconName}
                  size={22}
                  color={isFocused ? Colors.obsidian : theme.text}
                />
                {route.name === 'profile' && unreadNotifCount > 0 && (
                  <View style={[styles.badge, { borderColor: theme.tabBarBg }]}>
                    <Text style={styles.badgeText}>{unreadNotifCount}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? Colors.obsidian : theme.textMuted },
                ]}
              >
                {label as string}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { unreadNotifCount, darkMode } = useApp();

  return (
    <Tabs
      tabBar={(props) => (
        <CustomTabBar {...props} unreadNotifCount={unreadNotifCount} darkMode={darkMode} />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Jadwal',
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Tiket Saya',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    width: '90%',
    justifyContent: 'space-between',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 24,
  },
  tabItemFocused: {
    backgroundColor: Colors.gold,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.oxblood,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#1E1E1E',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: 'bold',
  }
});
