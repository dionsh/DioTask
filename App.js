// =============================================================================
// DioTask — application entry point.
// Sets up gesture handling, safe areas, theming, the task store, fonts and
// navigation.
// =============================================================================

import 'react-native-gesture-handler'; // must be first (required by the drawer)

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';

import { ThemeProvider } from './src/data/ThemeContext';
import { AuthProvider } from './src/data/AuthContext';
import { TasksProvider } from './src/data/TasksContext';
import { CelebrationProvider } from './src/data/CelebrationContext';
import RootNavigator from './src/navigation/RootNavigator';
import Loader from './src/components/Loader';
import { useAppTheme } from './src/hooks/useAppTheme';

// Reads the active palette and tints React Navigation + the status bar so there
// is no white flash between screens and the system bar stays legible.
const ThemedRoot = () => {
  const { colors, isDark } = useAppTheme();

  const base = isDark ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
};

const AppContent = ({ fontsLoaded }) => {
  if (!fontsLoaded) {
    return <Loader message="Starting DioTask…" />;
  }

  return (
    <AuthProvider>
      <TasksProvider>
        <CelebrationProvider>
          <ThemedRoot />
        </CelebrationProvider>
      </TasksProvider>
    </AuthProvider>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent fontsLoaded={fontsLoaded} />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
