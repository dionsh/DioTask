// =============================================================================
// useTasks — the canonical way screens/components read & mutate tasks.
// Thin wrapper around TasksContext that also guards against being used outside
// of the provider.
// =============================================================================

import { useContext } from 'react';

import { TasksContext } from '../data/TasksContext';

export const useTasks = () => {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error('useTasks must be used within a <TasksProvider>.');
  }

  return context;
};

export default useTasks;
