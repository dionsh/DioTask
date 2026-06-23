// =============================================================================
// AsyncStorage persistence layer.
// All reads/writes for the user's tasks funnel through here so the rest of the
// app never talks to AsyncStorage directly (separation of concerns).
// =============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';

// Tasks are stored per-user so each account has its own list.
const tasksKey = (userId) => `@diotask:tasks:${userId}`;
const USERS_KEY = '@diotask:users';
const SESSION_KEY = '@diotask:session';
const THEME_KEY = '@diotask:theme';

/**
 * Load the persisted task list for a given user. Returns an empty array if the
 * user is unknown, nothing is stored yet, or the stored value is corrupt.
 */
export const loadTasks = async (userId) => {
  if (!userId) return [];
  try {
    const raw = await AsyncStorage.getItem(tasksKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('[storage] Failed to load tasks:', error);
    return [];
  }
};

/**
 * Persist the full task list for a given user.
 */
export const saveTasks = async (userId, tasks) => {
  if (!userId) return;
  try {
    await AsyncStorage.setItem(tasksKey(userId), JSON.stringify(tasks));
  } catch (error) {
    console.warn('[storage] Failed to save tasks:', error);
  }
};

// -----------------------------------------------------------------------------
// Auth persistence (local-only / mock account store — no backend involved).
// -----------------------------------------------------------------------------

/** Load all registered accounts. */
export const loadUsers = async () => {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('[storage] Failed to load users:', error);
    return [];
  }
};

/** Persist the full list of registered accounts. */
export const saveUsers = async (users) => {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.warn('[storage] Failed to save users:', error);
  }
};

/** Load the currently signed-in user (or null). */
export const loadSession = async () => {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('[storage] Failed to load session:', error);
    return null;
  }
};

/** Persist the active session. */
export const saveSession = async (user) => {
  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (error) {
    console.warn('[storage] Failed to save session:', error);
  }
};

/** Remove the active session (sign out). */
export const clearSession = async () => {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.warn('[storage] Failed to clear session:', error);
  }
};

// -----------------------------------------------------------------------------
// Theme preference (light / dark).
// -----------------------------------------------------------------------------

/** Load the saved color-scheme preference ('light' | 'dark' | null). */
export const loadThemePreference = async () => {
  try {
    return await AsyncStorage.getItem(THEME_KEY);
  } catch (error) {
    console.warn('[storage] Failed to load theme preference:', error);
    return null;
  }
};

/** Persist the color-scheme preference. */
export const saveThemePreference = async (scheme) => {
  try {
    await AsyncStorage.setItem(THEME_KEY, scheme);
  } catch (error) {
    console.warn('[storage] Failed to save theme preference:', error);
  }
};
