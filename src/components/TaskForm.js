// Shared create/edit form for a task. Used by both AddTaskScreen and
// EditTaskScreen so validation and layout stay in one place.
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { spacing } from '../data/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

import InputField from './InputField';
import DateField from './DateField';
import PrioritySelector from './PrioritySelector';
import PrimaryButton from './PrimaryButton';

const TaskForm = ({
  banner = null,
  initialValues,
  submitLabel = 'Save',
  submitIcon = 'checkmark',
  onSubmit,
  onCancel,
}) => {
  const { styles } = useThemedStyles(makeStyles);

  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [dueDate, setDueDate] = useState(initialValues?.dueDate || null);
  const [priority, setPriority] = useState(initialValues?.priority || 'medium');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!title.trim()) next.title = 'Title is required.';
    if (!description.trim()) next.description = 'Description is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ title, description, dueDate, priority });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {banner}

        <InputField
          label="Title"
          required
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (errors.title) setErrors((e) => ({ ...e, title: undefined }));
          }}
          placeholder="e.g. Finish the project report"
          error={errors.title}
          maxLength={80}
          returnKeyType="next"
        />

        <InputField
          label="Description"
          required
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            if (errors.description) setErrors((e) => ({ ...e, description: undefined }));
          }}
          placeholder="Add a few details about this task…"
          error={errors.description}
          helperText="Describe what needs to be done."
          multiline
          maxLength={500}
        />

        <DateField value={dueDate} onChange={setDueDate} />

        <PrioritySelector value={priority} onChange={setPriority} />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Cancel" variant="outline" onPress={onCancel} />
        <PrimaryButton
          label={submitLabel}
          icon={submitIcon}
          onPress={handleSubmit}
          style={styles.submit}
        />
      </View>
    </KeyboardAvoidingView>
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
    },
    footer: {
      flexDirection: 'row',
      gap: spacing.md,
      padding: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    submit: {
      flex: 1,
    },
  });

export default TaskForm;
