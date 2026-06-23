// Rounded search field with a leading icon and a clear button.
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fontFamily, fontSize, radius, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const SearchBar = ({ value, onChangeText, placeholder = 'Search tasks…' }) => {
  const { styles, colors } = useThemedStyles(makeStyles);

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        returnKeyType="search"
        accessibilityLabel="Search tasks"
      />
      {!!value && (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={20} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: spacing.lg,
      height: 50,
    },
    input: {
      flex: 1,
      fontFamily: fontFamily.regular,
      fontSize: fontSize.md,
      color: colors.text,
      paddingVertical: 0,
    },
  });

export default SearchBar;
