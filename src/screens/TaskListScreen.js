// =============================================================================
// Task List Screen — the home of the app.
// Shows all tasks with real-time search, filtering and sorting (by due date or
// newest), handles the loading and empty states, and offers quick
// complete/delete actions via tap or swipe.
// =============================================================================

import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTasks } from '../hooks/useTasks';
import { useCelebration } from '../hooks/useCelebration';
import { FILTERS } from '../data/TasksContext';
import { parseDateKey } from '../data/helpers';
import { confirmAction } from '../data/confirm';
import { spacing, fontFamily, fontSize, radius } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import TaskCard from '../components/TaskCard';
import SwipeableTaskRow from '../components/SwipeableTaskRow';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import Fab from '../components/Fab';

const SORTS = { DUE: 'due', CREATED: 'created' };

const dueTime = (task) => {
  const d = parseDateKey(task.dueDate);
  return d ? d.getTime() : Infinity; // no due date sorts last
};

const TaskListScreen = ({ navigation }) => {
  const { styles, colors } = useThemedStyles(makeStyles);
  const { tasks, loading, stats, toggleTask, deleteTask } = useTasks();
  const { celebrate } = useCelebration();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [sort, setSort] = useState(SORTS.DUE);

  // Derive the visible list from the source of truth (search + filter + sort).
  const visibleTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      const matchesQuery =
        !normalizedQuery || task.title.toLowerCase().includes(normalizedQuery);
      const matchesFilter =
        filter === FILTERS.ALL ||
        (filter === FILTERS.COMPLETED && task.completed) ||
        (filter === FILTERS.PENDING && !task.completed);
      return matchesQuery && matchesFilter;
    });

    const sorted = [...filtered];
    if (sort === SORTS.DUE) {
      sorted.sort((a, b) => {
        const diff = dueTime(a) - dueTime(b);
        if (diff !== 0) return diff;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } else {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return sorted;
  }, [tasks, query, filter, sort]);

  const counts = {
    [FILTERS.ALL]: stats.total,
    [FILTERS.PENDING]: stats.pending,
    [FILTERS.COMPLETED]: stats.completed,
  };

  const confirmDelete = (task) => {
    confirmAction({
      title: 'Delete task',
      message: `Are you sure you want to delete "${task.title}"? This can't be undone.`,
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: () => deleteTask(task.id),
    });
  };

  const toggleSort = () =>
    setSort((s) => (s === SORTS.DUE ? SORTS.CREATED : SORTS.DUE));

  if (loading) {
    return <Loader message="Loading your tasks…" />;
  }

  const hasTasks = tasks.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <SearchBar value={query} onChangeText={setQuery} />
        <FilterTabs value={filter} onChange={setFilter} counts={counts} />
        {hasTasks && (
          <View style={styles.sortRow}>
            <Text style={styles.resultsText}>
              {visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'}
            </Text>
            <Pressable
              onPress={toggleSort}
              style={styles.sortButton}
              accessibilityRole="button"
              accessibilityLabel={`Sort by ${sort === SORTS.DUE ? 'due date' : 'newest'}`}
            >
              <Ionicons name="swap-vertical" size={16} color={colors.primary} />
              <Text style={styles.sortText}>
                {sort === SORTS.DUE ? 'Due date' : 'Newest'}
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableTaskRow
            completed={item.completed}
            onToggle={() => {
              if (!item.completed) celebrate();
              toggleTask(item.id);
            }}
            onDelete={() => confirmDelete(item)}
          >
            <TaskCard
              task={item}
              onPress={() => navigation.navigate('TaskDetails', { id: item.id })}
              onToggle={() => {
                if (!item.completed) celebrate();
                toggleTask(item.id);
              }}
              onDelete={() => confirmDelete(item)}
            />
          </SwipeableTaskRow>
        )}
        contentContainerStyle={[
          styles.listContent,
          visibleTasks.length === 0 && styles.listContentEmpty,
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          hasTasks ? (
            <EmptyState
              icon="search-outline"
              title="No matching tasks"
              message="Try a different search term or filter."
            />
          ) : (
            <EmptyState
              icon="checkbox-outline"
              title="No tasks yet"
              message="Create your first task and start getting things done."
              actionLabel="Add your first task"
              onAction={() => navigation.navigate('AddTask')}
            />
          )
        }
      />

      <Fab onPress={() => navigation.navigate('AddTask')} />
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    controls: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
      gap: spacing.md,
    },
    sortRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    resultsText: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
    },
    sortText: {
      fontFamily: fontFamily.semibold,
      fontSize: fontSize.xs,
      color: colors.primaryDark,
    },
    listContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: 120, // clears the floating action button
    },
    listContentEmpty: {
      flexGrow: 1,
    },
    separator: {
      height: spacing.md,
    },
  });

export default TaskListScreen;
