/* eslint-disable prettier/prettier */
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';

import { icons } from '../constants';

import { useAuth } from '~/context/AuthContext';

const ProfilePage = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: authState?.data.name || '',
    email: authState?.data.email || '', // Add email field
    image: authState?.data.image || '',
    isTwoFactorEnabled: authState?.data.isTwoFactorEnabled || false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    try {
      setIsImageLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        // Upload to Cloudinary
        const cloudinaryUrl = ''; //TODO: Upload image to Cloudinary

        if (cloudinaryUrl) {
          setFormData((prev) => ({
            ...prev,
            image: cloudinaryUrl,
          }));
        } else {
          Alert.alert('Error', 'Failed to upload image');
        }
      }
    } catch (error) {
      console.error('Error picking/uploading image:', error);
      Alert.alert('Error', 'Failed to select/upload image');
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleUpdateField = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name || formData.name.length < 2) {
      Alert.alert('Error', 'Name must be at least 2 characters long');
      return false;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      Alert.alert('Error', 'Invalid email format');
      return false;
    }
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;
    if (!authState?.accessToken) {
      Alert.alert('Error', 'Authentication token not found');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.put('/user', formData, {
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      if (response.data.requiresOTP) {
        Alert.alert('Verification Required', 'Please check your email for OTP');
      } else {
        Alert.alert('Success', 'Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          Alert.alert('Error', 'Request timed out. Please try again.');
        } else if (!error.response) {
          Alert.alert('Error', 'Network error. Please check your connection.');
        } else {
          Alert.alert('Error', error.response?.data?.error || 'Failed to update profile');
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-off-100">
      <View className="mt-14 px-4 py-2">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome5 name="arrow-left" size={30} color="#59A60E" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)} disabled={isSubmitting}>
            <FontAwesome5
              name={isEditing ? 'times' : 'edit'}
              size={24}
              color={isSubmitting ? '#ccc' : '#59A60E'}
            />
          </TouchableOpacity>
        </View>

        {/* Profile Image */}
        <View className="mb-6 items-center">
          <TouchableOpacity
            onPress={isEditing ? pickImage : undefined}
            disabled={isSubmitting || isImageLoading}
            className="mb-2 h-24 w-24 items-center justify-center rounded-full bg-primary">
            {isImageLoading ? (
              <ActivityIndicator color="white" />
            ) : formData.image ? (
              <Image source={{ uri: formData.image }} className="h-24 w-24 rounded-full" />
            ) : (
              <Image source={icons.profile} className="h-14 w-14" tintColor="white" />
            )}
            {isEditing && !isImageLoading && (
              <View className="absolute bottom-0 right-0 rounded-full bg-primary p-2">
                <FontAwesome5 name="camera" size={14} color="white" />
              </View>
            )}
          </TouchableOpacity>

          <Text className="font-psemibold text-lg">{formData.name}</Text>
        </View>

        {/* Form Fields */}
        <View className="space-y-4">
          <View>
            <Text className="mb-1 font-psemibold text-sm">Name</Text>
            <TextInput
              className={`rounded-md border border-primary bg-white p-2 ${
                !isEditing ? 'opacity-50' : ''
              }`}
              value={formData.name}
              onChangeText={(text) => handleUpdateField('name', text)}
              editable={isEditing && !isSubmitting}
              placeholder="Enter your name"
            />
          </View>

          <View>
            <Text className="mb-1 font-psemibold text-sm">Email</Text>
            <TextInput
              className="rounded-md border border-primary bg-white p-2 opacity-50"
              value={formData.email} // Use formData instead of authState directly
              editable={false}
            />
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="font-psemibold text-sm">Two-Factor Authentication</Text>
            <Switch
              value={formData.isTwoFactorEnabled}
              onValueChange={(value) => handleUpdateField('isTwoFactorEnabled', value)}
              disabled={!isEditing || isSubmitting}
            />
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          className={`mt-6 rounded-md py-3 ${
            isEditing ? 'bg-primary' : 'bg-blue-500'
          } ${isSubmitting || !isEditing ? 'opacity-50' : ''}`}
          onPress={isEditing ? handleSaveChanges : () => setIsEditing(true)}
          disabled={isSubmitting}>
          <Text className="text-center font-psemibold text-white">
            {isEditing ? (isSubmitting ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
