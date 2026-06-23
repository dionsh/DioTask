// Compact statistic tile used on the Dashboard (e.g. "Total", "Completed").
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fontFamily, fontSize, radius, shadows, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const StatCard = ({ icon, value, label, color, tint }) => {
  const { styles, colors } = useThemedStyles(makeStyles);
  const iconColor = color || colors.primary;
  const iconTint = tint || colors.primarySoft;

  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: iconTint }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      gap: spacing.xs,
      ...shadows.card,
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    value: {
      fontFamily: fontFamily.extrabold,
      fontSize: fontSize.xxl,
      color: colors.text,
    },
    label: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
  });

export default StatCard;
