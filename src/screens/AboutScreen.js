// =============================================================================
// About Screen — accessible from the drawer. Summarizes the app and its tech.
// =============================================================================

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fontFamily, fontSize, radius, shadows, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const FEATURES = [
  { icon: 'list-outline', text: 'Create, edit, complete and delete tasks' },
  { icon: 'calendar-outline', text: 'Due dates with overdue highlighting and sorting' },
  { icon: 'search-outline', text: 'Real-time search and status filters' },
  { icon: 'cloud-outline', text: 'Live dashboard powered by a public API' },
  { icon: 'moon-outline', text: 'Light and dark themes' },
  { icon: 'save-outline', text: 'Tasks persist locally with AsyncStorage' },
];

const TECH = ['React Native', 'Expo', 'React Navigation', 'AsyncStorage', 'Expo Vector Icons'];

const AboutScreen = () => {
  const { styles, colors } = useThemedStyles(makeStyles);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Ionicons name="checkmark-done-circle" size={44} color={colors.primary} />
        </View>
        <Text style={styles.appName}>DioTask</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.tagline}>
          A clean, modern task manager to help you stay organized and get things
          done.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Features</Text>
        {FEATURES.map((feature) => (
          <View key={feature.text} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Ionicons name={feature.icon} size={18} color={colors.primary} />
            </View>
            <Text style={styles.featureText}>{feature.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Built with</Text>
        <View style={styles.tags}>
          {TECH.map((tech) => (
            <View key={tech} style={styles.tag}>
              <Text style={styles.tagText}>{tech}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.footer}>Made with care · DioTask</Text>
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
    hero: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    logo: {
      width: 88,
      height: 88,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    appName: {
      fontFamily: fontFamily.extrabold,
      fontSize: fontSize.xxl,
      color: colors.text,
    },
    version: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.sm,
      color: colors.textMuted,
      marginTop: 2,
    },
    tagline: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginTop: spacing.md,
      paddingHorizontal: spacing.md,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      marginTop: spacing.lg,
      gap: spacing.md,
      ...shadows.card,
    },
    cardTitle: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.lg,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    featureIcon: {
      width: 36,
      height: 36,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureText: {
      flex: 1,
      fontFamily: fontFamily.regular,
      fontSize: fontSize.md,
      color: colors.text,
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    tag: {
      backgroundColor: colors.primarySoft,
      borderRadius: radius.pill,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
    },
    tagText: {
      fontFamily: fontFamily.semibold,
      fontSize: fontSize.sm,
      color: colors.primaryDark,
    },
    footer: {
      textAlign: 'center',
      fontFamily: fontFamily.regular,
      fontSize: fontSize.xs,
      color: colors.textMuted,
      marginTop: spacing.xl,
    },
  });

export default AboutScreen;
