/* eslint-disable prettier/prettier */
// app/(settings)/profile.tsx

import { Stack } from 'expo-router';
import React from 'react';

import ProfilePage from '~/components/ProfilePage';

const Profile = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfilePage />
    </>
  );
};

export default Profile;
