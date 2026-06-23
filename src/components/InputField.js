// Labeled text input with required indicator, helper text, inline error and an
// optional password show/hide toggle.
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fontFamily, fontSize, radius, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  required = false,
  multiline = false,
  isPassword = false,
  ...rest
}) => {
  const { styles, colors } = useThemedStyles(makeStyles);
  const [secure, setSecure] = useState(isPassword);

  return (
    <View style={styles.wrapper}>
      {!!label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputRow,
          multiline && styles.inputRowMultiline,
          !!error && styles.inputRowError,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          multiline={multiline}
          secureTextEntry={secure}
          style={[styles.input, multiline && styles.inputMultiline]}
          {...rest}
        />

        {isPassword && (
          <Pressable
            onPress={() => setSecure((s) => !s)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={secure ? 'Show password' : 'Hide password'}
          >
            <Ionicons
              name={secure ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        )}
      </View>

      {!!error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : (
        !!helperText && <Text style={styles.helper}>{helperText}</Text>
      )}
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    wrapper: {
      marginBottom: spacing.lg,
    },
    label: {
      fontFamily: fontFamily.semibold,
      fontSize: fontSize.sm,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    required: {
      color: colors.danger,
      fontFamily: fontFamily.bold,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      minHeight: 52,
    },
    inputRowMultiline: {
      minHeight: 120,
      alignItems: 'flex-start',
      paddingVertical: spacing.md,
    },
    inputRowError: {
      borderColor: colors.danger,
      backgroundColor: colors.dangerSoft,
    },
    input: {
      flex: 1,
      fontFamily: fontFamily.regular,
      fontSize: fontSize.md,
      color: colors.text,
      paddingVertical: spacing.md,
    },
    inputMultiline: {
      minHeight: 96,
      textAlignVertical: 'top',
      paddingVertical: 0,
    },
    error: {
      marginTop: spacing.xs,
      color: colors.danger,
      fontFamily: fontFamily.medium,
      fontSize: fontSize.xs,
    },
    helper: {
      marginTop: spacing.xs,
      color: colors.textMuted,
      fontFamily: fontFamily.regular,
      fontSize: fontSize.xs,
    },
  });

export default InputField;
