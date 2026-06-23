// =============================================================================
// useTodosApi — fetches public todo statistics for the Dashboard.
// Encapsulates loading / error / data state and exposes a refetch function so
// the UI can retry on failure.
// =============================================================================

import { useCallback, useEffect, useState } from 'react';

import { fetchTodoStats } from '../data/api';

export const useTodosApi = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodoStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Unable to reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount (app startup for the Dashboard tab).
  useEffect(() => {
    load();
  }, [load]);

  return { stats, loading, error, refetch: load };
};

export default useTodosApi;
