// =============================================================================
// Bottom Tab Navigator — top-level sections inside the drawer.
// Tasks (the stack flow) + Dashboard (API + local stats).
// =============================================================================

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import StackNavigator from './StackNavigator';
import DashboardScreen from '../screens/DashboardScreen';
import HeaderMenuButton from '../components/HeaderMenuButton';

import { fontFamily, fontSize } from '../data/theme';
import { useAppTheme } from '../hooks/useAppTheme';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamily.semibold,
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="TasksTab"
        component={StackNavigator}
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'checkbox' : 'checkbox-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          // Dashboard isn't inside a stack, so it gets its own header + menu button.
          headerShown: true,
          headerTitle: 'DioTask',
          headerStyle: { backgroundColor: colors.surface },
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: fontFamily.bold,
            fontSize: fontSize.lg,
            color: colors.text,
          },
          headerLeft: () => <HeaderMenuButton />,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'stats-chart' : 'stats-chart-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
