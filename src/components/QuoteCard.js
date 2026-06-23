// "Quote of the Day" card — a motivational quote from a successful business
// leader, fetched from a public API. Tap the refresh icon (or pull-to-refresh
// the Dashboard) to get a new one.
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fontFamily, fontSize, radius, shadows, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const QuoteCard = ({ quote, loading, error, onRefresh }) => {
  const { styles, colors } = useThemedStyles(makeStyles);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="bulb-outline" size={16} color={colors.accent} />
        <Text style={styles.eyebrow}>Quote of the day</Text>
        <Pressable
          onPress={onRefresh}
          hitSlop={10}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="New quote"
          style={({ pressed }) => [styles.refresh, pressed && styles.refreshPressed]}
        >
          <Ionicons name="refresh" size={16} color={colors.primary} />
        </Pressable>
      </View>

      {loading && !quote ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : error && !quote ? (
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={onRefresh} hitSlop={8} accessibilityRole="button">
            <Text style={styles.retry}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <Text style={styles.quote}>“{quote?.content}”</Text>
          <Text style={styles.author}>— {quote?.author}</Text>
        </>
      )}
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
      padding: spacing.lg,
      gap: spacing.sm,
      marginBottom: spacing.md,
      ...shadows.card,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    eyebrow: {
      flex: 1,
      fontFamily: fontFamily.bold,
      fontSize: fontSize.xs,
      color: colors.accent,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    refresh: {
      width: 30,
      height: 30,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primarySoft,
    },
    refreshPressed: {
      opacity: 0.7,
    },
    loading: {
      height: 56,
      justifyContent: 'center',
    },
    quote: {
      fontFamily: fontFamily.semibold,
      fontSize: fontSize.lg,
      color: colors.text,
      lineHeight: 26,
      fontStyle: 'italic',
    },
    author: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      alignSelf: 'flex-end',
    },
    errorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    errorText: {
      flex: 1,
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    retry: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.sm,
      color: colors.primary,
    },
  });

export default QuoteCard;
