// Due-date picker: a tappable field that opens a lightweight calendar modal.
// Built with plain React Native (no native date-picker dependency) so it works
// identically on iOS, Android and web. Values are 'YYYY-MM-DD' strings.
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fontFamily, fontSize, radius, shadows, spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import {
  formatDueLabel,
  parseDateKey,
  toDateKey,
  todayKey,
} from '../data/helpers';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const addDays = (n) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return toDateKey(d);
};

const DateField = ({ label = 'Due date', value, onChange }) => {
  const { styles, colors } = useThemedStyles(makeStyles);
  const [open, setOpen] = useState(false);

  const initial = parseDateKey(value) || new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const cells = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const out = [];
    for (let i = 0; i < firstWeekday; i += 1) out.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) out.push(day);
    return out;
  }, [viewYear, viewMonth]);

  const openPicker = () => {
    const base = parseDateKey(value) || new Date();
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setOpen(true);
  };

  const goMonth = (delta) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const select = (key) => {
    onChange(key);
    setOpen(false);
  };

  const today = todayKey();

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        onPress={openPicker}
        style={styles.field}
        accessibilityRole="button"
        accessibilityLabel={value ? `Due ${formatDueLabel(value)}` : 'Set a due date'}
      >
        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
        <Text style={[styles.fieldText, !value && styles.placeholder]}>
          {value ? formatDueLabel(value) : 'No due date'}
        </Text>
        {!!value && (
          <Pressable
            onPress={() => onChange(null)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Clear due date"
          >
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.calendar} onPress={() => {}}>
            <View style={styles.quickRow}>
              <QuickChip styles={styles} label="Today" onPress={() => select(addDays(0))} />
              <QuickChip styles={styles} label="Tomorrow" onPress={() => select(addDays(1))} />
              <QuickChip styles={styles} label="Next week" onPress={() => select(addDays(7))} />
            </View>

            <View style={styles.monthRow}>
              <Pressable onPress={() => goMonth(-1)} hitSlop={10} accessibilityLabel="Previous month">
                <Ionicons name="chevron-back" size={22} color={colors.text} />
              </Pressable>
              <Text style={styles.monthTitle}>
                {MONTHS[viewMonth]} {viewYear}
              </Text>
              <Pressable onPress={() => goMonth(1)} hitSlop={10} accessibilityLabel="Next month">
                <Ionicons name="chevron-forward" size={22} color={colors.text} />
              </Pressable>
            </View>

            <View style={styles.weekRow}>
              {WEEKDAYS.map((w, i) => (
                <Text key={i} style={styles.weekday}>
                  {w}
                </Text>
              ))}
            </View>

            <View style={styles.grid}>
              {cells.map((day, i) => {
                if (day === null) return <View key={i} style={styles.cell} />;
                const key = toDateKey(new Date(viewYear, viewMonth, day));
                const selected = key === value;
                const isToday = key === today;
                return (
                  <Pressable
                    key={i}
                    style={[styles.cell, styles.dayCell, selected && styles.daySelected]}
                    onPress={() => select(key)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${MONTHS[viewMonth]} ${day}`}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isToday && !selected && styles.dayToday,
                        selected && styles.daySelectedText,
                      ]}
                    >
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable style={styles.clearRow} onPress={() => select(null)}>
              <Ionicons name="close-circle-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.clearText}>Clear due date</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const QuickChip = ({ styles, label, onPress }) => (
  <Pressable style={styles.chip} onPress={onPress} accessibilityRole="button">
    <Text style={styles.chipText}>{label}</Text>
  </Pressable>
);

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
    field: {
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
    fieldText: {
      flex: 1,
      fontFamily: fontFamily.regular,
      fontSize: fontSize.md,
      color: colors.text,
    },
    placeholder: {
      color: colors.textMuted,
    },
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    calendar: {
      width: '100%',
      maxWidth: 340,
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.lg,
      gap: spacing.md,
      ...shadows.floating,
    },
    quickRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    chip: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
    },
    chipText: {
      fontFamily: fontFamily.semibold,
      fontSize: fontSize.xs,
      color: colors.primaryDark,
    },
    monthRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xs,
    },
    monthTitle: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.md,
      color: colors.text,
    },
    weekRow: {
      flexDirection: 'row',
    },
    weekday: {
      flex: 1,
      textAlign: 'center',
      fontFamily: fontFamily.semibold,
      fontSize: fontSize.xs,
      color: colors.textMuted,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    cell: {
      width: `${100 / 7}%`,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayCell: {
      borderRadius: radius.pill,
    },
    daySelected: {
      backgroundColor: colors.primary,
    },
    dayText: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.sm,
      color: colors.text,
    },
    dayToday: {
      color: colors.primary,
      fontFamily: fontFamily.extrabold,
    },
    daySelectedText: {
      color: colors.onPrimary,
      fontFamily: fontFamily.bold,
    },
    clearRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingTop: spacing.sm,
    },
    clearText: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
  });

export default DateField;
