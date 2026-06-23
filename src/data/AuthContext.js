// =============================================================================
// AuthContext — a lightweight, local-only authentication store.
//
// There is no backend in this project, so accounts are stored on-device with
// AsyncStorage and validated client-side. This is enough to demonstrate a real
// sign-up / log-in flow and route guarding. (Passwords are kept in plain text
// locally purely for this demo — do NOT do this in a production app.)
// =============================================================================

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  loadUsers,
  saveUsers,
  loadSession,
  saveSession,
  clearSession,
} from './storage';
import { generateId } from './helpers';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Restore any existing session on startup.
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const session = await loadSession();
      if (isMounted) {
        setUser(session);
        setInitializing(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const signUp = useCallback(async ({ name, email, password }) => {
    setSubmitting(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const users = await loadUsers();

      const exists = users.some(
        (u) => u.email.toLowerCase() === normalizedEmail
      );
      if (exists) {
        throw new Error('An account with this email already exists.');
      }

      const account = {
        id: generateId(),
        name: name.trim(),
        email: normalizedEmail,
        password, // demo only — never store plain passwords for real
      };
      await saveUsers([...users, account]);

      const session = { id: account.id, name: account.name, email: account.email };
      await saveSession(session);
      setUser(session);
      return session;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setSubmitting(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const users = await loadUsers();

      const match = users.find(
        (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
      );
      if (!match) {
        throw new Error('Invalid email or password.');
      }

      const session = { id: match.id, name: match.name, email: match.email };
      await saveSession(session);
      setUser(session);
      return session;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, initializing, submitting, signUp, login, logout }),
    [user, initializing, submitting, signUp, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
