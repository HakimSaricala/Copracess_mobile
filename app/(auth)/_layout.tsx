/* eslint-disable prettier/prettier */
// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#FBF6EE' },
      }}>
      <Stack.Screen
        name="Siginin"
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Roleselect"
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="BuyerSignup"
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="MillSignup"
        options={{
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
