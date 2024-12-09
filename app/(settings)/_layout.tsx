/* eslint-disable prettier/prettier */
import { Stack } from 'expo-router';
import React from 'react';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="organization" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="security" />
    </Stack>
  );
}
