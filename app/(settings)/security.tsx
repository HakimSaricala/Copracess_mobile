/* eslint-disable prettier/prettier */
// app/(settings)/security.tsx

import { Stack } from 'expo-router';
import React from 'react';

import SecurityPage from '~/components/SecurityPage';

const Security = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SecurityPage />
    </>
  );
};

export default Security;
