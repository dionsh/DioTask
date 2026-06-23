// =============================================================================
// useAuth — the canonical way to read auth state and trigger auth actions.
// =============================================================================

import { useContext } from 'react';

import { AuthContext } from '../data/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>.');
  }

  return context;
};

export default useAuth;
