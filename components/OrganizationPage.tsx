/* eslint-disable prettier/prettier */
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import { icons } from '../constants';

import { useAuth } from '~/context/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

interface OrganizationData {
  id: string;
  name: string;
  address: string;
  geolocation: {
    latitude: number;
    longitude: number;
  } | null;
  isVerified: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string | null;
  image: string | null;
  isActive: boolean;
}

interface ApiResponse {
  organization: OrganizationData;
  users: User[];
}

const MiniMap: React.FC<{
  latitude: number;
  longitude: number;
  name: string;
}> = ({ latitude, longitude }) => {
  return (
    <View className="h-48 overflow-hidden rounded-lg">
      {/* <MapboxComponent
        latitude={latitude}
        longitude={longitude}
        height={192} // h-48 = 192px
        width={screenWidth - 32} // Full width minus padding
      /> */}
    </View>
  );
};
const OrganizationPage = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState<OrganizationData | null>(null);
  const params = useLocalSearchParams();

  const toggleEdit = () => {
    if (isEditing) {
      Alert.alert('Discard Changes', 'Are you sure you want to discard your changes?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            setOrganizationData(originalData);
            setIsEditing(false);
          },
        },
      ]);
    } else {
      setIsEditing(true);
    }
  };

  useEffect(() => {
    if (params.latitude && params.longitude) {
      setOrganizationData((prev) =>
        prev
          ? {
              ...prev,
              geolocation: {
                ...prev.geolocation,
                latitude: Number(params.latitude),
                longitude: Number(params.longitude),
              },
            }
          : prev
      );
    }
  }, [params.latitude, params.longitude, params.timestamp]);

  useEffect(() => {
    fetchOrgDetails();
  }, []);
  const fetchOrgDetails = async () => {
    if (!authState?.data.organizationId) {
      setError('No organization ID found');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get<ApiResponse>(
        `/organizations?id=${authState.data.organizationId}`
      );

      if (response.data) {
        setOriginalData(response.data.organization);
        setOrganizationData(response.data.organization);
        setError(null);
      }
    } catch (error: any) {
      console.error('Error fetching organization details:', error);
      setError(error.response?.data?.error || 'Failed to load organization details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateField = (
    field: keyof Pick<OrganizationData, 'name' | 'address'>,
    value: string
  ) => {
    if (organizationData) {
      setOrganizationData({
        ...organizationData,
        [field]: value,
      });
    }
  };

  // In OrganizationPage, update handleSaveChanges to include the new coordinates
  const handleSaveChanges = async () => {
    if (!organizationData?.name || !organizationData.address) {
      Alert.alert('Error', 'Organization name and address are required');
      return;
    }

    setIsSaving(true);
    try {
      const updateData = {
        name: organizationData.name,
        address: organizationData.address,
        latitude: organizationData.geolocation?.latitude,
        longitude: organizationData.geolocation?.longitude,
      };

      // All changes including location are saved only when clicking "SAVE CHANGES"
      await axios.put(`/organizations?id=${authState?.data.organizationId}`, updateData);
      Alert.alert('Success', 'Organization details updated successfully');

      // Update originalData after successful save
      setOriginalData(organizationData);
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating organization:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to update organization details');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-off-100">
        <ActivityIndicator size="large" color="#59A60E" />
      </View>
    );
  }

  if (!organizationData) {
    return (
      <View className="flex-1 items-center justify-center bg-off-100">
        <Text className="text-red-500">{error || 'Failed to load organization data'}</Text>
      </View>
    );
  }
  const handleBack = () => {
    router.replace('/settings'); // Navigate to settings instead of going back
  };
  return (
    <ScrollView className="flex-1 bg-off-100">
      <View className="mt-14 px-4 py-2">
        <View className="mb-6 flex-row items-center justify-between">
          <TouchableOpacity onPress={handleBack}>
            <FontAwesome5 name="arrow-left" size={30} color="#59A60E" />
          </TouchableOpacity>
          <Text className="font-pbold text-2xl text-primary">ORGANIZATION</Text>
          <TouchableOpacity onPress={toggleEdit}>
            <FontAwesome5 name={isEditing ? 'times' : 'edit'} size={24} color="#59A60E" />
          </TouchableOpacity>
        </View>

        <View className="mb-6 items-center">
          <Text className="font-psemibold text-lg">{organizationData.name}</Text>
          {organizationData.isVerified && (
            <View className="mt-1 flex-row items-center">
              <FontAwesome5 name="check-circle" size={16} color="#59A60E" />
              <Text className="ml-2 text-primary">Verified</Text>
            </View>
          )}
        </View>

        <View className="space-y-4">
          <View>
            <Text className="mb-1 font-psemibold text-sm">Organization Name</Text>
            <TextInput
              className="rounded-md border border-primary bg-white p-2"
              placeholder="Enter organization name"
              value={organizationData.name}
              onChangeText={(text) => handleUpdateField('name', text)}
              editable={isEditing}
              style={!isEditing ? { color: '#666' } : undefined}
            />
          </View>

          <View>
            <Text className="mb-1 font-psemibold text-sm">Address</Text>
            <View className="relative">
              <TextInput
                className="rounded-md border border-primary bg-white p-2 pr-10"
                placeholder="Enter organization address"
                value={organizationData.address}
                onChangeText={(text) => handleUpdateField('address', text)}
                multiline
                editable={isEditing}
                style={!isEditing ? { color: '#666' } : undefined}
              />

              <TouchableOpacity
                className="absolute right-2 top-2"
                onPress={() => console.log('Open map picker')}>
                <Image source={icons.location} className="h-6 w-6" tintColor="#59A60E" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Display geolocation if available */}
          {organizationData.geolocation && (
            <View className="mt-4">
              <Text className="mb-2 font-psemibold text-sm">Location Map</Text>
              <TouchableOpacity
                onPress={() =>
                  isEditing &&
                  router.push({
                    pathname: '/(other)/editorg',
                    params: {
                      // Add null checks with optional chaining and default values
                      latitude: organizationData.geolocation?.latitude ?? 0,
                      longitude: organizationData.geolocation?.longitude ?? 0,
                    },
                  })
                }
                activeOpacity={isEditing ? 0.7 : 1}>
                {/* Add null check before passing props to MiniMap */}
                {organizationData.geolocation && (
                  <MiniMap
                    key={`${organizationData.geolocation.latitude}-${organizationData.geolocation.longitude}`}
                    latitude={organizationData.geolocation.latitude}
                    longitude={organizationData.geolocation.longitude}
                    name={organizationData.name}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {isEditing && (
          <TouchableOpacity
            className={`mb-6 mt-6 rounded-md bg-primary py-3 ${isSaving ? 'opacity-50' : ''}`}
            onPress={handleSaveChanges}
            disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center font-psemibold text-white">SAVE CHANGES</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default OrganizationPage;
