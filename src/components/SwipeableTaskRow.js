// Wraps a task card with swipe gestures:
//   • swipe right -> complete / uncomplete
//   • swipe left  -> delete (parent handles the confirmation)
// The card's tap targets (checkbox, trash) still work as before, so swiping is
// a convenience rather than the only way to act.
import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

import { fontFamily, fontSize, radius, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const SwipeableTaskRow = ({ children, completed, onToggle, onDelete }) => {
  const { styles, colors } = useThemedStyles(makeStyles);
  const ref = useRef(null);

  const close = () => ref.current && ref.current.close && ref.current.close();

  const renderLeftActions = () => (
    <View style={[styles.action, styles.leftAction]}>
      <Ionicons
        name={completed ? 'arrow-undo' : 'checkmark-done'}
        size={22}
        color={colors.white}
      />
      <Text style={styles.actionText}>{completed ? 'Pending' : 'Complete'}</Text>
    </View>
  );

  const renderRightActions = () => (
    <View style={[styles.action, styles.rightAction]}>
      <Ionicons name="trash" size={22} color={colors.white} />
      <Text style={styles.actionText}>Delete</Text>
    </View>
  );

  const handleOpen = (direction) => {
    // 'left' = left actions revealed (swiped right) -> toggle complete.
    // 'right' = right actions revealed (swiped left) -> delete.
    if (direction === 'left') {
      onToggle && onToggle();
      close();
    } else {
      close();
      onDelete && onDelete();
    }
  };

  return (
    <Swipeable
      ref={ref}
      friction={2}
      leftThreshold={48}
      rightThreshold={48}
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableOpen={handleOpen}
    >
      {children}
    </Swipeable>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    action: {
      width: 104,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      borderRadius: radius.lg,
      marginVertical: 0,
    },
    leftAction: {
      backgroundColor: colors.success,
    },
    rightAction: {
      backgroundColor: colors.danger,
    },
    actionText: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.xs,
      color: colors.white,
    },
  });

export default SwipeableTaskRow;
