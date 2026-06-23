// Centered loading indicator with an optional message.
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { fontFamily, fontSize, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const Loader = ({ message = 'Loading…' }) => {
  const { styles, colors } = useThemedStyles(makeStyles);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      {!!message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      backgroundColor: colors.background,
    },
    text: {
      marginTop: spacing.md,
      color: colors.textSecondary,
      fontFamily: fontFamily.medium,
      fontSize: fontSize.sm,
    },
  });

export default Loader;
