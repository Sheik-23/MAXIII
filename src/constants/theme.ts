import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    background: '#F8FAFC',
    backgroundElement: '#F1F5F9',
    backgroundSelected: '#E2E8F0',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    border: '#E2E8F0',
    primary: '#059669', // Emerald
    primaryMuted: 'rgba(5, 150, 105, 0.12)',
    accent: '#D97706', // Saffron amber
    accentMuted: 'rgba(217, 119, 6, 0.12)',
    protein: '#059669',
    carbs: '#D97706',
    fat: '#E11D48',
    fiber: '#7C3AED',
    calories: '#0284C7',
    badgeYield: '#10B981',
    cardShadow: 'rgba(15, 23, 42, 0.04)',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    background: '#0B0F17',
    backgroundElement: '#141A24',
    backgroundSelected: '#1E2636',
    surface: '#121822',
    surfaceElevated: '#1A2230',
    border: '#232D3F',
    primary: '#10B981', // Emerald
    primaryMuted: 'rgba(16, 185, 129, 0.18)',
    accent: '#F59E0B', // Saffron amber
    accentMuted: 'rgba(245, 158, 11, 0.18)',
    protein: '#10B981',
    carbs: '#FBBF24',
    fat: '#FB7185',
    fiber: '#A78BFA',
    calories: '#38BDF8',
    badgeYield: '#34D399',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

export type ThemeColors = typeof Colors.dark;
export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 9999,
} as const;

export const BottomTabInset = Platform.select({ ios: 60, android: 75 }) ?? 60;
export const MaxContentWidth = 720;
