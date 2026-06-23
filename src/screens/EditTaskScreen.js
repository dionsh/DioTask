// =============================================================================
// Edit Task Screen — change an existing task's title, description, due date or
// priority. Reuses the shared TaskForm and persists via updateTask.
// =============================================================================

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTasks } from '../hooks/useTasks';
import { fontFamily, fontSize, radius, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import TaskForm from '../components/TaskForm';
import EmptyState from '../components/EmptyState';

const EditTaskScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { getTaskById, updateTask } = useTasks();
  const { styles, colors } = useThemedStyles(makeStyles);
  const task = getTaskById(id);

  if (!task) {
    return (
      <View style={styles.fallback}>
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

  const handleSubmit = (values) => {
    updateTask(id, values);
    navigation.goBack();
  };

  const banner = (
    <View style={styles.banner}>
      <View style={styles.bannerIcon}>
        <Ionicons name="pencil" size={20} color={colors.primary} />
      </View>
      <View style={styles.bannerText}>
        <Text style={styles.bannerTitle}>Edit task</Text>
        <Text style={styles.bannerSubtitle}>
          Update any details below and save your changes.
        </Text>
      </View>
    </View>
  );

  return (
    <TaskForm
      banner={banner}
      initialValues={task}
      submitLabel="Save Changes"
      submitIcon="checkmark"
      onSubmit={handleSubmit}
      onCancel={() => navigation.goBack()}
    />
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    fallback: {
      flex: 1,
      backgroundColor: colors.background,
    },
    banner: {
      flexDirection: 'row',
      gap: spacing.md,
      backgroundColor: colors.primarySoft,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.xl,
    },
    bannerIcon: {
      width: 44,
      height: 44,
      borderRadius: radius.pill,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bannerText: {
      flex: 1,
      gap: 2,
    },
    bannerTitle: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.md,
      color: colors.text,
    },
    bannerSubtitle: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      lineHeight: 19,
    },
  });

export default EditTaskScreen;
