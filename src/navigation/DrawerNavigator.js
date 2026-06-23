// =============================================================================
// Drawer Navigator — the root navigator.
// Holds the main tabbed experience plus a standalone "About" screen.
// =============================================================================

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import TabNavigator from './TabNavigator';
import AboutScreen from '../screens/AboutScreen';
import CustomDrawerContent from './CustomDrawerContent';

import { fontFamily, fontSize } from '../data/theme';
import { useAppTheme } from '../hooks/useAppTheme';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { colors } = useAppTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerActiveBackgroundColor: colors.primarySoft,
        drawerStyle: { backgroundColor: colors.surface },
        drawerLabelStyle: {
          fontFamily: fontFamily.semibold,
          fontSize: fontSize.md,
          marginLeft: -8,
        },
        // Styled header used by drawer screens that opt in (e.g. About).
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: fontFamily.bold,
          fontSize: fontSize.lg,
          color: colors.text,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          title: 'My Tasks',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'About',
          headerShown: true,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
