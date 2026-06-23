// =============================================================================
// Login Screen — sign in to an existing local account.
// =============================================================================

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../hooks/useAuth';
import { isValidEmail } from '../data/helpers';
import { fontFamily, fontSize, radius, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

const LoginScreen = ({ navigation }) => {
  const { login, submitting } = useAuth();
  const { styles, colors } = useThemedStyles(makeStyles);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const clearFieldError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = 'Email is required.';
    else if (!isValidEmail(email)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async () => {
    setFormError('');
    if (!validate()) return;
    try {
      await login({ email, password });
    } catch (err) {
      setFormError(err.message || 'Unable to log in. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.logo}>
              <Ionicons name="checkmark-done-circle" size={44} color={colors.primary} />
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Log in to continue with DioTask</Text>
          </View>

          <View style={styles.card}>
            {!!formError && (
              <View style={styles.banner}>
                <Ionicons name="alert-circle" size={18} color={colors.danger} />
                <Text style={styles.bannerText}>{formError}</Text>
              </View>
            )}

            <InputField
              label="Email"
              required
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                clearFieldError('email');
              }}
              placeholder="you@example.com"
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
            />

            <InputField
              label="Password"
              required
              isPassword
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                clearFieldError('password');
              }}
              placeholder="Your password"
              error={errors.password}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <PrimaryButton
              label="Log In"
              icon="log-in-outline"
              onPress={handleLogin}
              loading={submitting}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don't have an account?</Text>
            <Pressable
              onPress={() => navigation.navigate('Register')}
              hitSlop={8}
              accessibilityRole="button"
            >
              <Text style={styles.switchLink}>Sign up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fontFamily.extrabold,
    fontSize: fontSize.xxl,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  bannerText: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.danger,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xl,
  },
  switchText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  switchLink: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
});

export default LoginScreen;
