// =============================================================================
// useAppTheme — read the active palette and theme controls (isDark, toggle…).
// =============================================================================

import { useContext } from 'react';

import { ThemeContext } from '../data/ThemeContext';

export const useAppTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used within a <ThemeProvider>.');
  }

  return context;
};

export default useAppTheme;
