// =============================================================================
// TasksContext — the single source of truth for the user's tasks.
// Holds the task list in state, hydrates it from AsyncStorage on startup and
// persists every change. Exposes a small, intention-revealing API to the rest
// of the app (add / toggle / delete) plus derived statistics.
// =============================================================================

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { loadTasks, saveTasks } from './storage';
import { generateId } from './helpers';
import { useAuth } from '../hooks/useAuth';

// Filter options used by the Task List screen.
export const FILTERS = {
  ALL: 'all',
  PENDING: 'pending',
  COMPLETED: 'completed',
};

export const TasksContext = createContext(null);

export const TasksProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tracks which user the in-memory `tasks` actually belong to. This guards the
  // persist effect from writing one user's tasks under another user's key while
  // a switch is in flight.
  const loadedFor = useRef(null);

  // (Re)load the task list whenever the signed-in user changes. On logout
  // (userId === null) the list is cleared.
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    loadedFor.current = null;

    (async () => {
      const stored = userId ? await loadTasks(userId) : [];
      if (!isMounted) return;
      setTasks(stored);
      loadedFor.current = userId;
      setLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Persist on every change — but only once we've actually loaded the current
  // user's tasks (so we never overwrite with an empty/stale list).
  useEffect(() => {
    if (!loading && userId && loadedFor.current === userId) {
      saveTasks(userId, tasks);
    }
  }, [tasks, loading, userId]);

  const addTask = useCallback(({ title, description, dueDate = null, priority = 'medium' }) => {
    const newTask = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate || null,
      priority,
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id, fields) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        return {
          ...task,
          ...fields,
          // Keep trimmed text and a normalized due date.
          ...(fields.title !== undefined ? { title: fields.title.trim() } : {}),
          ...(fields.description !== undefined
            ? { description: fields.description.trim() }
            : {}),
          ...(fields.dueDate !== undefined
            ? { dueDate: fields.dueDate || null }
            : {}),
        };
      })
    );
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const getTaskById = useCallback(
    (id) => tasks.find((task) => task.id === id),
    [tasks]
  );

  // Local task statistics, recomputed only when the list changes.
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, completionRate };
  }, [tasks]);

  const value = useMemo(
    () => ({
      tasks,
      loading,
      stats,
      addTask,
      updateTask,
      toggleTask,
      deleteTask,
      getTaskById,
    }),
    [tasks, loading, stats, addTask, updateTask, toggleTask, deleteTask, getTaskById]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};
