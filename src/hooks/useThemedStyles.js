// =============================================================================
// useThemedStyles — build a StyleSheet from the active palette.
//
// Usage:
//   const makeStyles = (colors) => StyleSheet.create({ ... });
//   const { styles, colors } = useThemedStyles(makeStyles);
//
// The styles are memoized and only rebuilt when the palette changes (i.e. when
// the user toggles dark mode), so this is cheap on every render.
// =============================================================================

import { useMemo } from 'react';

import { useAppTheme } from './useAppTheme';

export const useThemedStyles = (makeStyles) => {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [makeStyles, colors]);
  return { styles, colors };
};

export default useThemedStyles;
