// Floating action button — the single primary CTA on the Task List screen.
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fontFamily, fontSize, radius, shadows, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const Fab = ({ onPress, label = 'New Task', icon = 'add' }) => {
  const { styles, colors } = useThemedStyles(makeStyles);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: false }}
      style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={22} color={colors.white} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    fab: {
      position: 'absolute',
      right: spacing.lg,
      bottom: spacing.xl,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.accent,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radius.pill,
      ...shadows.floating,
    },
    pressed: {
      opacity: 0.9,
      transform: [{ scale: 0.97 }],
    },
    label: {
      color: colors.white,
      fontFamily: fontFamily.bold,
      fontSize: fontSize.md,
    },
  });

export default Fab;
