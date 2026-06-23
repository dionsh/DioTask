// Small pill that communicates a task's completion status with colour + icon.
// (Never relies on colour alone — there is always an icon and a label.)
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fontFamily, fontSize, radius, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const StatusBadge = ({ completed }) => {
  const { styles, colors } = useThemedStyles(makeStyles);

  const config = completed
    ? {
        label: 'Completed',
        icon: 'checkmark-circle',
        color: colors.success,
        background: colors.successSoft,
      }
    : {
        label: 'Pending',
        icon: 'time-outline',
        color: colors.warning,
        background: colors.warningSoft,
      };

  return (
    <View style={[styles.badge, { backgroundColor: config.background }]}>
      <Ionicons name={config.icon} size={14} color={config.color} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.pill,
      gap: spacing.xs,
    },
    label: {
      fontFamily: fontFamily.semibold,
      fontSize: fontSize.xs,
    },
  });

export default StatusBadge;
