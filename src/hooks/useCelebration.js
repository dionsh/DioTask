// =============================================================================
// useCelebration — trigger the task-completion celebration from anywhere.
// =============================================================================

import { useContext } from 'react';

import { CelebrationContext } from '../data/CelebrationContext';

export const useCelebration = () => {
  const context = useContext(CelebrationContext);

  if (!context) {
    throw new Error('useCelebration must be used within a <CelebrationProvider>.');
  }

  return context;
};

export default useCelebration;
