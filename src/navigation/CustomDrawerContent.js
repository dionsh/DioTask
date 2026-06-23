// Branded drawer content: app header on top, navigation items in the middle,
// theme toggle + logout + version footer at the bottom.
import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../hooks/useAuth';
import { useAppTheme } from '../hooks/useAppTheme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { confirmAction } from '../data/confirm';
import { fontFamily, fontSize, radius, spacing } from '../data/theme';

const CustomDrawerContent = (props) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, colors } = useAppTheme();
  const { styles } = useThemedStyles(makeStyles);

  const initial = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();

  const confirmLogout = () => {
    confirmAction({
      title: 'Log out',
      message: 'Are you sure you want to log out?',
      confirmLabel: 'Log out',
      destructive: true,
      onConfirm: logout,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.appName} numberOfLines={1}>
          {user?.name || 'DioTask'}
        </Text>
        <Text style={styles.tagline} numberOfLines={1}>
          {user?.email || 'Stay organized, get things done'}
        </Text>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.items}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={toggleTheme}
          style={styles.themeRow}
          accessibilityRole="switch"
          accessibilityState={{ checked: isDark }}
          accessibilityLabel="Toggle dark mode"
        >
          <Ionicons
            name={isDark ? 'moon' : 'sunny-outline'}
            size={20}
            color={colors.primary}
          />
          <Text style={styles.themeText}>Dark mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.borderStrong, true: colors.primary }}
            thumbColor={colors.white}
          />
        </Pressable>

        <Pressable
          onPress={confirmLogout}
          style={({ pressed }) => [styles.logout, pressed && styles.logoutPressed]}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    header: {
      paddingTop: spacing.xxxl,
      paddingBottom: spacing.lg,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: radius.pill,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    avatarText: {
      fontFamily: fontFamily.extrabold,
      fontSize: fontSize.xxl,
      color: colors.onPrimary,
    },
    appName: {
      fontFamily: fontFamily.extrabold,
      fontSize: fontSize.xl,
      color: colors.text,
    },
    tagline: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginTop: 2,
    },
    items: {
      paddingTop: spacing.sm,
    },
    footer: {
      padding: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: spacing.sm,
    },
    themeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.md,
    },
    themeText: {
      flex: 1,
      fontFamily: fontFamily.semibold,
      fontSize: fontSize.md,
      color: colors.text,
    },
    logout: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.md,
    },
    logoutPressed: {
      backgroundColor: colors.dangerSoft,
    },
    logoutText: {
      fontFamily: fontFamily.semibold,
      fontSize: fontSize.md,
      color: colors.danger,
    },
    footerText: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.xs,
      color: colors.textMuted,
      marginTop: spacing.xs,
    },
  });

export default CustomDrawerContent;
