/* eslint-disable prettier/prettier */
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { icons } from '../constants';
import LogoutModal from './LogoutModal';

import { useAuth } from '~/context/AuthContext';

const SettingsPage = () => {
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const router = useRouter();
  const { onLogout, authState } = useAuth();

  const isCopraOwner = authState?.data.role === 'COPRA_BUYER';

  const handleLogoutPress = () => {
    setIsLogoutModalVisible(true);
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalVisible(false);
  };

  const handleLogoutConfirm = async () => {
    console.log('Logging out...');
    if (onLogout) {
      try {
        setIsLogoutModalVisible(false);
        await onLogout();
        router.replace('/Siginin');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    } else {
      console.error('Logout function is not defined!');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-off-100">
      <View className="flex-1 px-6 pt-2">
        <View className="items-center">
          <Text className="mb-2 font-pbold text-3xl text-primary">SETTINGS</Text>
        </View>
        <View className="mb-4 items-center">
          <View className="mb-1 h-24 w-24 items-center justify-center rounded-full bg-primary">
            {authState?.data.image ? (
              <Image source={{ uri: authState.data.image }} className="h-24 w-24 rounded-full" />
            ) : (
              <Image source={icons.profile} className="h-14 w-14" tintColor="white" />
            )}
          </View>
          <Text className="font-psemibold text-lg">{authState?.data.name || 'Name'}</Text>
        </View>

        <TouchableOpacity
          className="mb-2 flex-row items-center justify-between rounded-md border border-primary bg-white px-4 py-3"
          onPress={() => router.push('/profile')}>
          <View className="flex-row items-center">
            <FontAwesome name="user" size={20} color="#59A60E" style={{ marginRight: 10 }} />
            <Text className="font-pregular text-lg">Profile</Text>
          </View>
          <FontAwesome name="angle-right" size={24} color="#59A60E" />
        </TouchableOpacity>

        {!isCopraOwner && (
          <TouchableOpacity
            className="mb-2 flex-row items-center justify-between rounded-md border border-primary bg-white px-4 py-3"
            onPress={() => router.push('/organization')}>
            <View className="flex-row items-center">
              <FontAwesome name="building" size={20} color="#59A60E" style={{ marginRight: 10 }} />
              <Text className="font-pregular text-lg">Organization</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color="#59A60E" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="mb-2 flex-row items-center justify-between rounded-md border border-primary bg-white px-4 py-3"
          onPress={() => router.push('/security')}>
          <View className="flex-row items-center">
            <FontAwesome name="lock" size={20} color="#59A60E" style={{ marginRight: 10 }} />
            <Text className="font-pregular text-lg">Security</Text>
          </View>
          <FontAwesome name="angle-right" size={24} color="#59A60E" />
        </TouchableOpacity>

        <View className="flex-1" />
        <View className="mb-6 w-full items-end">
          <TouchableOpacity
            className="w-1/2 rounded-md bg-primary py-3"
            onPress={handleLogoutPress}>
            <Text className="text-center font-psemibold text-white">LOG OUT</Text>
          </TouchableOpacity>
        </View>
      </View>

      <LogoutModal
        isVisible={isLogoutModalVisible}
        onCancel={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </SafeAreaView>
  );
};

export default SettingsPage;
