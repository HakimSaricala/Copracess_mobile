/* eslint-disable prettier/prettier */
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Image } from 'react-native';

import { icons } from '~/constants';
import { useAuth } from '~/context/AuthContext';

const SecurityPage = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  // Add visibility state for each password field
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleUpdateField = (field: keyof typeof securityData, value: string) => {
    setSecurityData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;
    if (!authState?.accessToken || !authState?.data?.id) {
      Alert.alert('Error', 'Authentication token not found');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: authState.data.id,
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      };

      const response = await axios.post('/change-password', payload, {
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
        },
      });

      Alert.alert('Success', 'Password updated successfully');
      router.back();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Error', error.response?.data?.error || 'Failed to update password');
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    if (!securityData.currentPassword) {
      Alert.alert('Error', 'Current password is required');
      return false;
    }
    if (!securityData.newPassword) {
      Alert.alert('Error', 'New password is required');
      return false;
    }
    if (securityData.newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  return (
    <ScrollView className="flex-1 bg-off-100">
      <View className="mt-14 px-4 py-2">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome5 name="arrow-left" size={30} color="#59A60E" />
          </TouchableOpacity>
          <Text className="font-pbold text-2xl text-primary">SECURITY</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* Form Fields */}
        <View className="space-y-4">
          <View>
            <Text className="mb-1 text-sm font-semibold">Current Password</Text>
            <View className="relative flex-row items-center">
              <TextInput
                className="flex-1 rounded-md border border-primary bg-white p-3 pr-12"
                placeholder="Enter current password"
                value={securityData.currentPassword}
                onChangeText={(text) => handleUpdateField('currentPassword', text)}
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity
                className="absolute right-3"
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <Image
                  source={showCurrentPassword ? icons.eye : icons.eyeHide}
                  className="h-6 w-6"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text className="mb-1 text-sm font-semibold">New Password</Text>
            <View className="relative flex-row items-center">
              <TextInput
                className="flex-1 rounded-md border border-primary bg-white p-3 pr-12"
                placeholder="Enter new password (min. 8 characters)"
                value={securityData.newPassword}
                onChangeText={(text) => handleUpdateField('newPassword', text)}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                className="absolute right-3"
                onPress={() => setShowNewPassword(!showNewPassword)}>
                <Image source={showNewPassword ? icons.eye : icons.eyeHide} className="h-6 w-6" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className={`mt-6 rounded-md bg-primary py-3 ${isSubmitting ? 'opacity-50' : ''}`}
          onPress={handleSaveChanges}
          disabled={isSubmitting}>
          <Text className="text-center font-semibold text-white">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SecurityPage;
