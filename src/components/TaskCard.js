// The core task card shown in the list.
// - Tap the card  -> open details
// - Tap the circle -> toggle completed / pending (quick action)
// - Tap the trash  -> delete (quick action, confirmation handled by parent)
// Shows a priority dot next to the title and a due-date chip (red when overdue).
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fontFamily, fontSize, radius, shadows, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import {
  daysUntil,
  formatDate,
  formatDueLabel,
  isOverdue,
  priorityColor,
} from '../data/helpers';
import StatusBadge from './StatusBadge';

const DueChip = ({ styles, colors, dueDate, completed }) => {
  const overdue = isOverdue(dueDate, completed);
  const today = daysUntil(dueDate) === 0;

  let color = colors.textSecondary;
  let background = colors.surfaceAlt;
  if (!completed && overdue) {
    color = colors.danger;
    background = colors.dangerSoft;
  } else if (!completed && today) {
    color = colors.warning;
    background = colors.warningSoft;
  }

  return (
    <View style={[styles.dueChip, { backgroundColor: background }]}>
      <Ionicons
        name={overdue && !completed ? 'alert-circle' : 'calendar-outline'}
        size={12}
        color={color}
      />
      <Text style={[styles.dueText, { color }]}>{formatDueLabel(dueDate)}</Text>
    </View>
  );
};

const TaskCard = ({ task, onPress, onToggle, onDelete }) => {
  const { styles, colors } = useThemedStyles(makeStyles);
  const { title, description, completed, createdAt, dueDate, priority } = task;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: colors.primarySoft }}
      accessibilityRole="button"
      accessibilityLabel={`Task: ${title}. ${completed ? 'Completed' : 'Pending'}.`}
      style={({ pressed }) => [
        styles.card,
        completed && styles.cardCompleted,
        pressed && styles.pressed,
      ]}
    >
      {/* Toggle complete / pending */}
      <Pressable
        onPress={onToggle}
        hitSlop={10}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completed }}
        accessibilityLabel={completed ? 'Mark as pending' : 'Mark as completed'}
        style={[styles.checkbox, completed && styles.checkboxChecked]}
      >
        {completed && <Ionicons name="checkmark" size={16} color={colors.white} />}
      </Pressable>

      {/* Main content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View
            style={[styles.priorityDot, { backgroundColor: priorityColor(colors, priority) }]}
          />
          <Text
            style={[styles.title, completed && styles.titleCompleted]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {!!description && (
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.dateRow}>
            <Ionicons name="time-outline" size={13} color={colors.textMuted} />
            <Text style={styles.date}>{formatDate(createdAt)}</Text>
          </View>
          {!!dueDate && (
            <DueChip styles={styles} colors={colors} dueDate={dueDate} completed={completed} />
          )}
          <StatusBadge completed={completed} />
        </View>
      </View>

      {/* Delete quick action */}
      <Pressable
        onPress={onDelete}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Delete task"
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={20} color={colors.danger} />
      </Pressable>
    </Pressable>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      gap: spacing.md,
      ...shadows.card,
    },
    cardCompleted: {
      backgroundColor: colors.surfaceAlt,
      borderColor: colors.border,
    },
    pressed: {
      opacity: 0.92,
    },
    checkbox: {
      width: 26,
      height: 26,
      borderRadius: radius.pill,
      borderWidth: 2,
      borderColor: colors.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    checkboxChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    content: {
      flex: 1,
      gap: spacing.xs,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    priorityDot: {
      width: 8,
      height: 8,
      borderRadius: radius.pill,
    },
    title: {
      flex: 1,
      fontFamily: fontFamily.bold,
      fontSize: fontSize.md,
      color: colors.text,
    },
    titleCompleted: {
      textDecorationLine: 'line-through',
      color: colors.textMuted,
    },
    description: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    date: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.xs,
      color: colors.textMuted,
    },
    dueChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.pill,
    },
    dueText: {
      fontFamily: fontFamily.semibold,
      fontSize: fontSize.xs,
    },
    deleteButton: {
      padding: spacing.xs,
    },
  });

export default TaskCard;
