// Simple, accessible completion progress bar with a percentage label.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fontFamily, fontSize, radius, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const ProgressBar = ({ value = 0, label = 'Completion', color }) => {
  const { styles, colors } = useThemedStyles(makeStyles);
  const barColor = color || colors.primary;
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.percent, { color: barColor }]}>{clamped}%</Text>
      </View>
      <View
        style={styles.track}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: clamped }}
      >
        <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    wrapper: {
      gap: spacing.sm,
    },
    labelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    percent: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.sm,
    },
    track: {
      height: 10,
      borderRadius: radius.pill,
      backgroundColor: colors.surfaceAlt,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: radius.pill,
    },
  });

export default ProgressBar;
