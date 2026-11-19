// VISCERAL.CO — Design Tokens (konsisten dengan Web)

export const Colors = {
  // Primary
  obsidian: '#14110F',
  gold: '#C89B3C',
  goldLight: '#F0CE7A',
  goldDark: '#9C7A2E',
  oxblood: '#7A2E2E',

  // Neutral
  white: '#FFFFFF',
  textPrimary: '#211D1A',
  textSecondary: '#6B6560',
  textMuted: '#9E9893',

  // Dark mode
  darkBg: '#0D0B0A',
  darkSurface: '#1A1613',
  darkCard: '#201C19',
  darkBorder: '#2A2520',
  darkText: '#F3EFE9',

  // Light mode
  lightBg: '#FAFAF8',
  lightSurface: '#F5F3F0',
  lightCard: '#FFFFFF',
  lightBorder: '#E8E4E0',

  // Status
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',

  // Badges
  pendingBg: 'rgba(243, 156, 18, 0.15)',
  pendingText: '#F39C12',
  paidBg: 'rgba(200, 155, 60, 0.15)',
  paidText: '#C89B3C',
  cancelledBg: 'rgba(122, 46, 46, 0.15)',
  cancelledText: '#7A2E2E',
  activeBg: 'rgba(46, 204, 113, 0.15)',
  activeText: '#2ECC71',
};

export const GoldGradient = ['#F0CE7A', '#C89B3C', '#9C7A2E'] as const;
export const OxbloodGradient = ['#A03030', '#7A2E2E', '#5A1E1E'] as const;
export const DarkGradient = ['#1A1613', '#14110F', '#0D0B0A'] as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  display: 34,
} as const;

export const Shadows = {
  gold: {
    shadowColor: '#C89B3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  dark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
} as const;

export interface AppThemeColors {
  darkMode: boolean;
  bg: string;
  surface: string;
  card: string;
  border: string;
  text: string;
  textMuted: string;
  iconBg: string;
  inputBg: string;
  disabledBg: string;
  tabBarBg: string;
  tabBarBorder: string;
  headerGradient: readonly [string, string];
  gold: string;
  oxblood: string;
}

export const getThemeColors = (darkMode: boolean): AppThemeColors => {
  if (darkMode) {
    return {
      darkMode: true,
      bg: Colors.obsidian,
      surface: Colors.darkSurface,
      card: Colors.darkCard,
      border: Colors.darkBorder,
      text: Colors.white,
      textMuted: Colors.textMuted,
      iconBg: 'rgba(255,255,255,0.05)',
      inputBg: Colors.darkSurface,
      disabledBg: 'rgba(255,255,255,0.05)',
      tabBarBg: '#1E1E1E',
      tabBarBorder: 'rgba(255,255,255,0.1)',
      headerGradient: [Colors.darkCard, Colors.obsidian],
      gold: Colors.gold,
      oxblood: Colors.oxblood,
    };
  }
  return {
    darkMode: false,
    bg: Colors.lightBg,
    surface: Colors.lightSurface,
    card: Colors.lightCard,
    border: Colors.lightBorder,
    text: Colors.textPrimary,
    textMuted: Colors.textSecondary,
    iconBg: '#EFECE8',
    inputBg: Colors.lightCard,
    disabledBg: '#EBE7E2',
    tabBarBg: Colors.lightCard,
    tabBarBorder: Colors.lightBorder,
    headerGradient: ['#F3EDE2', Colors.lightBg],
    gold: Colors.goldDark,
    oxblood: Colors.oxblood,
  };
};
