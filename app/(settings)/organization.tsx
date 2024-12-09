/* eslint-disable prettier/prettier */
// app/(settings)/organization.tsx

import { Stack } from 'expo-router';
import React from 'react';

import OrganizationPage from '~/components/OrganizationPage';

const Organization = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OrganizationPage />
    </>
  );
};

export default Organization;
