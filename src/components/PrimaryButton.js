// Reusable button with a few variants. Handles press feedback, disabled and
// loading states, and keeps a comfortable 44pt+ touch target.
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fontFamily, fontSize, radius, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const makeVariants = (colors) => ({
  primary: { bg: colors.primary, fg: colors.onPrimary, border: 'transparent' },
  accent: { bg: colors.accent, fg: colors.white, border: 'transparent' },
  danger: { bg: colors.danger, fg: colors.white, border: 'transparent' },
  outline: { bg: 'transparent', fg: colors.primary, border: colors.primary },
});

const PrimaryButton = ({
  label,
  onPress,
  icon,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const { styles, colors } = useThemedStyles(makeStyles);
  const variants = makeVariants(colors);
  const theme = variants[variant] || variants.primary;
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={label}
      android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.bg,
          borderColor: theme.border,
        },
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.fg} />
      ) : (
        <View style={styles.content}>
          {!!icon && <Ionicons name={icon} size={18} color={theme.fg} />}
          <Text style={[styles.label, { color: theme.fg }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    button: {
      minHeight: 52,
      borderRadius: radius.md,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    label: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.md,
    },
    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
    disabled: {
      opacity: 0.5,
    },
  });

export default PrimaryButton;
