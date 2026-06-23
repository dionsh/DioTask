// =============================================================================
// CelebrationContext — exposes a single `celebrate()` function that any screen
// can call to trigger the completion animation. The overlay itself is rendered
// once, here at the provider level, so it floats above the whole app.
// =============================================================================

import React, { createContext, useCallback, useMemo, useState } from 'react';

import CelebrationOverlay from '../components/CelebrationOverlay';

const MESSAGES = [
  'Good job! Task completed 🎉',
  'Well done! One down 💪',
  'Task crushed! 🚀',
  'Awesome work! ✨',
  'You did it! 🌟',
  'Boom! Another one done 🔥',
];

export const CelebrationContext = createContext(null);

export const CelebrationProvider = ({ children }) => {
  const [state, setState] = useState({ visible: false, message: '' });

  const celebrate = useCallback((message) => {
    const chosen =
      message || MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setState({ visible: true, message: chosen });
  }, []);

  const hide = useCallback(() => {
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  const value = useMemo(() => ({ celebrate }), [celebrate]);

  return (
    <CelebrationContext.Provider value={value}>
      {children}
      <CelebrationOverlay
        visible={state.visible}
        message={state.message}
        onHide={hide}
      />
    </CelebrationContext.Provider>
  );
};
