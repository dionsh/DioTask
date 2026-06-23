// Hamburger button that opens the drawer. Used in stack/tab headers that live
// nested below the DrawerNavigator.
import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';

import { spacing } from '../data/theme';
import { useAppTheme } from '../hooks/useAppTheme';

const HeaderMenuButton = () => {
  const navigation = useNavigation();
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Open menu"
      style={{ paddingHorizontal: spacing.sm }}
    >
      <Ionicons name="menu" size={26} color={colors.text} />
    </Pressable>
  );
};

export default HeaderMenuButton;
