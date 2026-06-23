// =============================================================================
// Cross-platform confirmation dialog.
//
// React Native's `Alert.alert` is a no-op on react-native-web (its web shim is
// literally `static alert() {}`), so confirmation dialogs — and their button
// callbacks — silently do nothing in the browser. This helper falls back to the
// browser's native `window.confirm` on web and uses `Alert.alert` everywhere
// else, so destructive actions like log out / delete work on every platform.
// =============================================================================

import { Alert, Platform } from 'react-native';

/**
 * Ask the user to confirm an action, then run `onConfirm` if they agree.
 *
 * @param {object}   options
 * @param {string}   options.title         Dialog title.
 * @param {string}  [options.message]      Optional explanatory message.
 * @param {string}  [options.confirmLabel] Label for the confirm button.
 * @param {string}  [options.cancelLabel]  Label for the cancel button.
 * @param {boolean} [options.destructive]  Style the confirm button as destructive (iOS).
 * @param {Function} options.onConfirm     Called when the user confirms.
 */
export const confirmAction = ({
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
}) => {
  if (Platform.OS === 'web') {
    const text = message ? `${title}\n\n${message}` : title;
    const ok =
      typeof window !== 'undefined' && typeof window.confirm === 'function'
        ? window.confirm(text)
        : true;
    if (ok && onConfirm) onConfirm();
    return;
  }

  Alert.alert(title, message, [
    { text: cancelLabel, style: 'cancel' },
    {
      text: confirmLabel,
      style: destructive ? 'destructive' : 'default',
      onPress: onConfirm,
    },
  ]);
};

export default confirmAction;
