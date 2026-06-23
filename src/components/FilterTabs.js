// Segmented control to filter the task list: All / Pending / Completed.
// Each segment shows a live count so the user always knows the breakdown.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FILTERS } from '../data/TasksContext';
import { fontFamily, fontSize, radius, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const TABS = [
  { key: FILTERS.ALL, label: 'All' },
  { key: FILTERS.PENDING, label: 'Pending' },
  { key: FILTERS.COMPLETED, label: 'Completed' },
];

const FilterTabs = ({ value, onChange, counts }) => {
  const { styles } = useThemedStyles(makeStyles);

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const active = value === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, active && styles.tabActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${tab.label} tasks`}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
            {!!counts && (
              <View style={[styles.countPill, active && styles.countPillActive]}>
                <Text style={[styles.count, active && styles.countActive]}>
                  {counts[tab.key] ?? 0}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceAlt,
      borderRadius: radius.md,
      padding: spacing.xs,
      gap: spacing.xs,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
    },
    tabActive: {
      backgroundColor: colors.primary,
    },
    label: {
      fontFamily: fontFamily.semibold,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    labelActive: {
      color: colors.onPrimary,
    },
    countPill: {
      minWidth: 22,
      paddingHorizontal: spacing.xs,
      paddingVertical: 1,
      borderRadius: radius.pill,
      backgroundColor: colors.border,
      alignItems: 'center',
    },
    countPillActive: {
      backgroundColor: 'rgba(255,255,255,0.25)',
    },
    count: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.xs,
      color: colors.textSecondary,
    },
    countActive: {
      color: colors.onPrimary,
    },
  });

export default FilterTabs;
