// Friendly empty-state used when there are no tasks (or no search results).
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fontFamily, fontSize, radius, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import PrimaryButton from './PrimaryButton';

const EmptyState = ({
  icon = 'clipboard-outline',
  title = 'Nothing here yet',
  message,
  actionLabel,
  onAction,
}) => {
  const { styles, colors } = useThemedStyles(makeStyles);

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={44} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}
      {!!actionLabel && !!onAction && (
        <PrimaryButton
          label={actionLabel}
          icon="add"
          onPress={onAction}
          style={styles.action}
        />
      )}
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxxl,
    },
    iconCircle: {
      width: 96,
      height: 96,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    title: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.lg,
      color: colors.text,
      textAlign: 'center',
    },
    message: {
      marginTop: spacing.sm,
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    action: {
      marginTop: spacing.xl,
    },
  });

export default EmptyState;
