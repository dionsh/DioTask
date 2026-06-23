// =============================================================================
// Stack Navigator — the task flow.
// TaskList -> TaskDetails / AddTask / EditTask
// =============================================================================

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TaskListScreen from '../screens/TaskListScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import EditTaskScreen from '../screens/EditTaskScreen';
import HeaderMenuButton from '../components/HeaderMenuButton';

import { fontFamily, fontSize } from '../data/theme';
import { useAppTheme } from '../hooks/useAppTheme';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: fontFamily.bold,
          fontSize: fontSize.lg,
          color: colors.text,
        },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{
          title: 'DioTask',
          headerLeft: () => <HeaderMenuButton />,
        }}
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
        options={{ title: 'Task Details' }}
      />
      <Stack.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{ title: 'New Task', presentation: 'modal' }}
      />
      <Stack.Screen
        name="EditTask"
        component={EditTaskScreen}
        options={{ title: 'Edit Task', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
