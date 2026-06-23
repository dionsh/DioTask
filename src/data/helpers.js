// =============================================================================
// Small pure helpers shared across the app.
// =============================================================================

/**
 * Generate a reasonably unique id without pulling in an external dependency.
 */
export const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Lightweight email format check (good enough for client-side validation).
 */
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

/**
 * Format an ISO date string into a friendly, human readable label.
 * e.g. "Jun 23, 2026"
 */
export const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format an ISO date string with the time included.
 * e.g. "Jun 23, 2026 · 14:30"
 */
export const formatDateTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  const datePart = formatDate(isoString);
  const timePart = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${datePart} · ${timePart}`;
};

// -----------------------------------------------------------------------------
// Due dates.
// Due dates are stored as a plain 'YYYY-MM-DD' string (no time / no timezone),
// which keeps day-level comparisons free of timezone surprises.
// -----------------------------------------------------------------------------

/** Convert a Date into a local 'YYYY-MM-DD' string. */
export const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/** Today as a 'YYYY-MM-DD' string (local time). */
export const todayKey = () => toDateKey(new Date());

/** Parse a 'YYYY-MM-DD' string into a local Date at midnight (or null). */
export const parseDateKey = (key) => {
  if (!key || typeof key !== 'string') return null;
  const [y, m, d] = key.split('-').map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Whole-day difference (dueKey - today). Negative = past, 0 = today. */
export const daysUntil = (dueKey) => {
  const due = parseDateKey(dueKey);
  if (!due) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.round((due.getTime() - today.getTime()) / MS_PER_DAY);
};

/** True when a task is past its due date and still not completed. */
export const isOverdue = (dueKey, completed) => {
  if (completed) return false;
  const diff = daysUntil(dueKey);
  return diff !== null && diff < 0;
};

/**
 * Friendly due-date label, e.g. "Today", "Tomorrow", "Yesterday",
 * "In 3 days", "3 days ago", or a formatted date for anything further out.
 */
export const formatDueLabel = (dueKey) => {
  const due = parseDateKey(dueKey);
  if (!due) return '';
  const diff = daysUntil(dueKey);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff > 1 && diff <= 6) return `In ${diff} days`;
  if (diff < -1 && diff >= -6) return `${Math.abs(diff)} days ago`;
  return due.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: due.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  });
};

// -----------------------------------------------------------------------------
// Priority.
// -----------------------------------------------------------------------------

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const PRIORITY_OPTIONS = [
  { key: PRIORITY.LOW, label: 'Low' },
  { key: PRIORITY.MEDIUM, label: 'Medium' },
  { key: PRIORITY.HIGH, label: 'High' },
];

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

/** Sort rank for a priority (lower = more urgent). */
export const priorityRank = (priority) =>
  PRIORITY_RANK[priority] ?? PRIORITY_RANK.medium;

/** Resolve a priority to a palette color. */
export const priorityColor = (colors, priority) => {
  if (priority === PRIORITY.HIGH) return colors.danger;
  if (priority === PRIORITY.LOW) return colors.textMuted;
  return colors.warning; // medium
};
