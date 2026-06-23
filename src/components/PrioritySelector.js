// Segmented control for choosing a task's priority (Low / Medium / High).
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fontFamily, fontSize, radius, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { PRIORITY_OPTIONS, priorityColor } from '../data/helpers';

const PrioritySelector = ({ label = 'Priority', value, onChange }) => {
  const { styles, colors } = useThemedStyles(makeStyles);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {PRIORITY_OPTIONS.map((option) => {
          const active = value === option.key;
          const dot = priorityColor(colors, option.key);
          return (
            <Pressable
              key={option.key}
              onPress={() => onChange(option.key)}
              style={[styles.option, active && { borderColor: dot, backgroundColor: colors.surfaceAlt }]}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${option.label} priority`}
            >
              <View style={[styles.dot, { backgroundColor: dot }]} />
              <Text style={[styles.optionText, active && styles.optionTextActive]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    wrapper: {
      marginBottom: spacing.lg,
    },
    label: {
      fontFamily: fontFamily.semibold,
      fontSize: fontSize.sm,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    option: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: radius.pill,
    },
    optionText: {
      fontFamily: fontFamily.semibold,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    optionTextActive: {
      color: colors.text,
    },
  });

export default PrioritySelector;
