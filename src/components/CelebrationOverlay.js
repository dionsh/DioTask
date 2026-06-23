// =============================================================================
// CelebrationOverlay — a delightful "good job!" moment shown when a task is
// completed. Built entirely with the Animated API (no extra dependencies):
//   • the backdrop fades in
//   • a checkmark badge springs into place
//   • colorful particles burst outward
//   • the message fades in, then the whole thing auto-dismisses
// =============================================================================

import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fontFamily, fontSize, radius, shadows, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const PARTICLE_COUNT = 12;

const CelebrationOverlay = ({ visible, message, onHide }) => {
  const { styles, colors } = useThemedStyles(makeStyles);

  const particleColors = useMemo(
    () => [
      colors.primary,
      colors.accent,
      colors.primaryLight,
      colors.warning,
      colors.success,
    ],
    [colors]
  );

  const backdrop = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const burst = useRef(new Animated.Value(0)).current;

  // Fixed particle layout (created once) so the burst looks consistent.
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() * 0.5 - 0.25);
        return {
          angle,
          distance: 90 + Math.random() * 70,
          size: 8 + Math.random() * 7,
          colorIndex: i % 5,
        };
      }),
    []
  );

  const hide = () => {
    Animated.parallel([
      Animated.timing(backdrop, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(contentOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.85, duration: 220, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onHide();
    });
  };

  useEffect(() => {
    if (!visible) return undefined;

    backdrop.setValue(0);
    scale.setValue(0);
    contentOpacity.setValue(0);
    burst.setValue(0);

    Animated.parallel([
      Animated.timing(backdrop, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 140,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(burst, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(hide, 1700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={hide}
      statusBarTranslucent
    >
      <Pressable style={styles.fill} onPress={hide} accessibilityRole="button">
        <Animated.View style={[styles.backdrop, { opacity: backdrop }]} />

        <View style={styles.center} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.card,
              { opacity: contentOpacity, transform: [{ scale }] },
            ]}
          >
            <View style={styles.badgeWrap}>
              {particles.map((p, index) => {
                const translateX = burst.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, Math.cos(p.angle) * p.distance],
                });
                const translateY = burst.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, Math.sin(p.angle) * p.distance],
                });
                const opacity = burst.interpolate({
                  inputRange: [0, 0.1, 0.75, 1],
                  outputRange: [0, 1, 1, 0],
                });
                const pScale = burst.interpolate({
                  inputRange: [0, 0.3, 1],
                  outputRange: [0.3, 1, 0.5],
                });
                return (
                  <Animated.View
                    key={index}
                    style={[
                      styles.particle,
                      {
                        width: p.size,
                        height: p.size,
                        backgroundColor: particleColors[p.colorIndex],
                        opacity,
                        transform: [{ translateX }, { translateY }, { scale: pScale }],
                      },
                    ]}
                  />
                );
              })}

              <View style={styles.badge}>
                <Ionicons name="checkmark" size={44} color={colors.white} />
              </View>
            </View>

            <Text style={styles.title}>{message}</Text>
            <Text style={styles.subtitle}>Keep up the great work!</Text>
          </Animated.View>
        </View>
      </Pressable>
    </Modal>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    fill: {
      flex: 1,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.overlay,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    card: {
      width: '100%',
      maxWidth: 320,
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.xl,
      alignItems: 'center',
      ...shadows.floating,
    },
    badgeWrap: {
      width: 96,
      height: 96,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    badge: {
      width: 88,
      height: 88,
      borderRadius: radius.pill,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    particle: {
      position: 'absolute',
      borderRadius: radius.sm,
    },
    title: {
      fontFamily: fontFamily.extrabold,
      fontSize: fontSize.xl,
      color: colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.xs,
    },
  });

export default CelebrationOverlay;
