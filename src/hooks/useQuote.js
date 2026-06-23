// =============================================================================
// useQuote — fetches a "Quote of the Day" from a successful business leader.
// A new quote is loaded on mount and on every refetch (never cached for a day).
// =============================================================================

import { useCallback, useEffect, useState } from 'react';

import { fetchBusinessQuote } from '../data/api';

export const useQuote = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchBusinessQuote();
      setQuote(data);
    } catch (err) {
      setError(err.message || 'Could not load a quote. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { quote, loading, error, refetch: load };
};

export default useQuote;
