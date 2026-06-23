// =============================================================================
// Task Details Screen — full view of a single task.
// Reached by tapping a task card. Lets the user edit, toggle completion or
// delete the task.
// =============================================================================

import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTasks } from '../hooks/useTasks';
import { useCelebration } from '../hooks/useCelebration';
import { fontFamily, fontSize, radius, shadows, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import {
  formatDateTime,
  formatDueLabel,
  isOverdue,
  priorityColor,
} from '../data/helpers';
import { confirmAction } from '../data/confirm';

import StatusBadge from '../components/StatusBadge';
import PrimaryButton from '../components/PrimaryButton';
import EmptyState from '../components/EmptyState';

const priorityLabel = (priority) => {
  if (priority === 'high') return 'High';
  if (priority === 'low') return 'Low';
  return 'Medium';
};

const DetailRow = ({ styles, colors, icon, label, value, iconColor, valueColor }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIcon}>
      <Ionicons name={icon} size={18} color={iconColor || colors.primary} />
    </View>
    <View style={styles.detailText}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
  </View>
);

const TaskDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { styles, colors } = useThemedStyles(makeStyles);
  const { getTaskById, toggleTask, deleteTask } = useTasks();
  const { celebrate } = useCelebration();
  const task = getTaskById(id);

  // Keep the header title in sync and expose an Edit action in the header.
  useEffect(() => {
    navigation.setOptions({
      title: task ? 'Task Details' : 'Task',
      headerRight: task
        ? () => (
            <Pressable
              onPress={() => navigation.navigate('EditTask', { id })}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Edit task"
              style={styles.headerButton}
            >
              <Ionicons name="create-outline" size={22} color={colors.primary} />
            </Pressable>
          )
        : undefined,
    });
  }, [navigation, task, id, colors, styles]);

  if (!task) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="alert-circle-outline"
          title="Task not found"
          message="This task may have been deleted."
          actionLabel="Back to tasks"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  const overdue = isOverdue(task.dueDate, task.completed);

  const confirmDelete = () => {
    confirmAction({
      title: 'Delete task',
      message: `Are you sure you want to delete "${task.title}"? This can't be undone.`,
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: () => {
        deleteTask(task.id);
        navigation.goBack();
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <StatusBadge completed={task.completed} />

          <Text style={[styles.title, task.completed && styles.titleCompleted]}>
            {task.title}
          </Text>

          <View style={styles.divider} />

          <DetailRow
            styles={styles}
            colors={colors}
            icon="document-text-outline"
            label="Description"
            value={task.description}
          />
          {!!task.dueDate && (
            <DetailRow
              styles={styles}
              colors={colors}
              icon={overdue ? 'alert-circle' : 'calendar-outline'}
              label="Due date"
              value={overdue ? `${formatDueLabel(task.dueDate)} · Overdue` : formatDueLabel(task.dueDate)}
              iconColor={overdue ? colors.danger : colors.primary}
              valueColor={overdue ? colors.danger : undefined}
            />
          )}
          <DetailRow
            styles={styles}
            colors={colors}
            icon="flag-outline"
            label="Priority"
            value={priorityLabel(task.priority)}
            iconColor={priorityColor(colors, task.priority)}
          />
          <DetailRow
            styles={styles}
            colors={colors}
            icon="time-outline"
            label="Created"
            value={formatDateTime(task.createdAt)}
          />
          <DetailRow
            styles={styles}
            colors={colors}
            icon={task.completed ? 'checkmark-circle-outline' : 'ellipse-outline'}
            label="Status"
            value={task.completed ? 'Completed' : 'Not completed'}
          />
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <PrimaryButton
          label={task.completed ? 'Mark as pending' : 'Mark as completed'}
          icon={task.completed ? 'arrow-undo-outline' : 'checkmark-done'}
          variant={task.completed ? 'outline' : 'primary'}
          onPress={() => {
            if (!task.completed) celebrate();
            toggleTask(task.id);
          }}
        />
        <PrimaryButton
          label="Edit task"
          icon="create-outline"
          variant="outline"
          onPress={() => navigation.navigate('EditTask', { id })}
        />
        <PrimaryButton
          label="Delete task"
          icon="trash-outline"
          variant="danger"
          onPress={confirmDelete}
        />
      </View>
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerButton: {
      paddingHorizontal: spacing.sm,
    },
    content: {
      padding: spacing.lg,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.xl,
      gap: spacing.md,
      ...shadows.card,
    },
    title: {
      fontFamily: fontFamily.extrabold,
      fontSize: fontSize.xl,
      color: colors.text,
      lineHeight: 30,
    },
    titleCompleted: {
      textDecorationLine: 'line-through',
      color: colors.textMuted,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.xs,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    detailIcon: {
      width: 36,
      height: 36,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailText: {
      flex: 1,
      gap: 2,
    },
    detailLabel: {
      fontFamily: fontFamily.semibold,
      fontSize: fontSize.xs,
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    detailValue: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.md,
      color: colors.text,
      lineHeight: 22,
    },
    actions: {
      padding: spacing.lg,
      gap: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
  });

export default TaskDetailsScreen;
