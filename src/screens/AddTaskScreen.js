// =============================================================================
// Add Task Screen — create a new task.
// Title & description are required; due date and priority are optional. On
// success a task is created with an auto-generated date and "pending" status.
// =============================================================================

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTasks } from '../hooks/useTasks';
import { fontFamily, fontSize, radius, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import TaskForm from '../components/TaskForm';

const AddTaskScreen = ({ navigation }) => {
  const { addTask } = useTasks();
  const { styles, colors } = useThemedStyles(makeStyles);

  const handleSubmit = (values) => {
    addTask(values);
    navigation.goBack();
  };

  const banner = (
    <View style={styles.banner}>
      <View style={styles.bannerIcon}>
        <Ionicons name="create-outline" size={22} color={colors.primary} />
      </View>
      <View style={styles.bannerText}>
        <Text style={styles.bannerTitle}>Create a new task</Text>
        <Text style={styles.bannerSubtitle}>
          Add a title and description, then optionally set a due date and
          priority. The created date and status are set automatically.
        </Text>
      </View>
    </View>
  );

  return (
    <TaskForm
      banner={banner}
      submitLabel="Create Task"
      submitIcon="checkmark"
      onSubmit={handleSubmit}
      onCancel={() => navigation.goBack()}
    />
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
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

export default AddTaskScreen;
