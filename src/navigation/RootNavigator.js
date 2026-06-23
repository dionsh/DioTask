// =============================================================================
// Root Navigator — decides between the signed-in app and the auth flow.
//
// Uses React Navigation's recommended authentication pattern: a single root
// stack whose screens are mounted/unmounted based on auth state. This makes the
// login/logout transition reliable (the previous approach of swapping two
// different root navigators could leave the drawer stuck on logout).
// =============================================================================

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../hooks/useAuth';
import DrawerNavigator from './DrawerNavigator';
import AuthNavigator from './AuthNavigator';
import Loader from '../components/Loader';

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <Loader message="Loading DioTask…" />;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="App" component={DrawerNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;
