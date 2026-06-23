// =============================================================================
// Dashboard Screen.
// - Top: statistics fetched from a public API (JSONPlaceholder /todos) with
//   loading, error and success states.
// - Bottom: an overview of the user's own local tasks.
// =============================================================================

import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTasks } from '../hooks/useTasks';
import { useTodosApi } from '../hooks/useTodosApi';
import { useQuote } from '../hooks/useQuote';
import { fontFamily, fontSize, radius, shadows, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import PrimaryButton from '../components/PrimaryButton';
import QuoteCard from '../components/QuoteCard';
import Loader from '../components/Loader';

const SectionHeader = ({ icon, title, subtitle }) => {
  const { styles, colors } = useThemedStyles(makeStyles);
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const ApiSection = ({ stats, loading, error, refetch }) => {
  const { styles, colors } = useThemedStyles(makeStyles);

  if (loading && !stats) {
    return (
      <View style={styles.apiLoading}>
        <Loader message="Fetching live data…" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorCard}>
        <Ionicons name="cloud-offline-outline" size={32} color={colors.danger} />
        <Text style={styles.errorTitle}>Couldn't load data</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <PrimaryButton
          label="Try again"
          icon="refresh"
          variant="outline"
          onPress={refetch}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <>
      <View style={styles.statRow}>
        <StatCard icon="albums-outline" value={stats.total} label="Total" />
        <StatCard
          icon="checkmark-done-outline"
          value={stats.completed}
          label="Completed"
          color={colors.success}
          tint={colors.successSoft}
        />
        <StatCard
          icon="hourglass-outline"
          value={stats.pending}
          label="Pending"
          color={colors.warning}
          tint={colors.warningSoft}
        />
      </View>
      <View style={styles.progressCard}>
        <ProgressBar value={stats.completionRate} label="API completion rate" />
      </View>
    </>
  );
};

const DashboardScreen = () => {
  const { styles, colors } = useThemedStyles(makeStyles);
  const { stats: apiStats, loading, error, refetch } = useTodosApi();
  const { quote, loading: quoteLoading, error: quoteError, refetch: refetchQuote } = useQuote();
  const { stats: localStats } = useTasks();

  const handleRefresh = () => {
    refetch();
    refetchQuote();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      <Text style={styles.heading}>Dashboard</Text>
      <Text style={styles.subheading}>Live insights and your task overview</Text>

      <QuoteCard
        quote={quote}
        loading={quoteLoading}
        error={quoteError}
        onRefresh={refetchQuote}
      />

      <SectionHeader
        icon="cloud-outline"
        title="Public API stats"
        subtitle="JSONPlaceholder · /todos"
      />
      <ApiSection
        stats={apiStats}
        loading={loading}
        error={error}
        refetch={refetch}
      />

      <SectionHeader
        icon="person-circle-outline"
        title="Your tasks"
        subtitle="Stored locally on this device"
      />
      <View style={styles.statRow}>
        <StatCard icon="albums-outline" value={localStats.total} label="Total" />
        <StatCard
          icon="checkmark-done-outline"
          value={localStats.completed}
          label="Completed"
          color={colors.success}
          tint={colors.successSoft}
        />
        <StatCard
          icon="hourglass-outline"
          value={localStats.pending}
          label="Pending"
          color={colors.warning}
          tint={colors.warningSoft}
        />
      </View>
      <View style={styles.progressCard}>
        <ProgressBar
          value={localStats.completionRate}
          label="Your completion rate"
          color={colors.accent}
        />
      </View>
    </ScrollView>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: spacing.xxxl,
    },
    heading: {
      fontFamily: fontFamily.extrabold,
      fontSize: fontSize.xxl,
      color: colors.text,
    },
    subheading: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      marginBottom: spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },
    sectionIcon: {
      width: 36,
      height: 36,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionHeaderText: {
      flex: 1,
    },
    sectionTitle: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.lg,
      color: colors.text,
    },
    sectionSubtitle: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.xs,
      color: colors.textMuted,
    },
    statRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    progressCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      marginTop: spacing.md,
      ...shadows.card,
    },
    apiLoading: {
      height: 160,
      justifyContent: 'center',
    },
    errorCard: {
      alignItems: 'center',
      backgroundColor: colors.dangerSoft,
      borderRadius: radius.lg,
      padding: spacing.xl,
      gap: spacing.sm,
    },
    errorTitle: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.md,
      color: colors.danger,
    },
    errorMessage: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    retryButton: {
      marginTop: spacing.sm,
    },
  });

export default DashboardScreen;
