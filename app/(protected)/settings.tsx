/* eslint-disable prettier/prettier */
// app/(protected)/settings.tsx
import { Stack } from 'expo-router';
import React from 'react';

import SettingsPage from '~/components/SettingsPage';

const Settings = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SettingsPage />
    </>
  );
};

export default Settings;
