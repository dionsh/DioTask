// =============================================================================
// DioTask — Design Tokens
// A single source of truth for colors, spacing, typography, radii and shadows.
//
// Colors now come in two palettes (light / dark). Components should read the
// active palette via `useThemedStyles` / `useAppTheme` rather than importing a
// fixed `colors` object — that's what makes the runtime dark-mode toggle work.
// `spacing`, `radius`, `fontFamily` and `fontSize` are theme-independent.
// =============================================================================

// -----------------------------------------------------------------------------
// Light palette (the original DioTask look).
// -----------------------------------------------------------------------------
export const lightColors = {
  // Brand (teal) — primary actions, active states and highlights.
  primary: '#0D9488',
  primaryDark: '#0F766E',
  primaryLight: '#2DD4BF',
  primarySoft: '#CCFBF1',

  // Accent (orange) — reserved for the most important call-to-action.
  accent: '#EA580C',
  accentSoft: '#FFEDD5',

  // Surfaces & background
  background: '#F0FDFA',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',

  // Text
  text: '#0F2E2B',
  textSecondary: '#5B7B79',
  textMuted: '#94A3B8',
  onPrimary: '#FFFFFF',

  // Lines
  border: '#DBEAE8',
  borderStrong: '#CBD5E1',

  // Semantic states
  success: '#16A34A',
  successSoft: '#DCFCE7',
  warning: '#D97706',
  warningSoft: '#FEF3C7',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',

  // Misc
  white: '#FFFFFF',
  overlay: 'rgba(15, 23, 42, 0.45)',
};

// -----------------------------------------------------------------------------
// Dark palette — a deep teal-tinted dark theme that keeps the brand identity.
// Every key in `lightColors` has a matching entry here.
// -----------------------------------------------------------------------------
export const darkColors = {
  primary: '#2DD4BF',
  primaryDark: '#14B8A6',
  primaryLight: '#5EEAD4',
  primarySoft: '#0F3A35',

  accent: '#FB923C',
  accentSoft: '#7C2D12',

  background: '#0A1413',
  surface: '#10201D',
  surfaceAlt: '#1A2C29',

  text: '#E6F4F1',
  textSecondary: '#9DB6B1',
  textMuted: '#6F8A85',
  onPrimary: '#04211D',

  border: '#23332F',
  borderStrong: '#324743',

  success: '#22C55E',
  successSoft: '#10331F',
  warning: '#F59E0B',
  warningSoft: '#3A2C0A',
  danger: '#F87171',
  dangerSoft: '#3A1614',

  white: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export const palettes = {
  light: lightColors,
  dark: darkColors,
};

// Default export kept for any non-themed context and as a safe fallback.
export const colors = lightColors;

// 4 / 8 pt spacing rhythm
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

// Plus Jakarta Sans (loaded in App.js). These names map to the @expo-google-fonts
// package. If the fonts fail to load, the platform falls back gracefully.
export const fontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
};

// Subtle, consistent elevation scale (used sparingly — Flat Design).
export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  floating: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
};

export default { lightColors, darkColors, palettes, colors, spacing, radius, fontFamily, fontSize, shadows };
