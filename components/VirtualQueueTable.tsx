/* eslint-disable prettier/prettier */
// VirtualQueueTable.tsx
import { SearchBar } from '@rneui/themed';
import axios from 'axios';
import { useRouter, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';

import FilterModal from './FilterModal';

import AssessmentCard from '~/components/AssessmentCard';
import AssessmentModal from '~/components/AssessmentModal';
import { icons, images } from '~/constants';
import { useAuth } from '~/context/AuthContext';
import { saveAssessment } from '~/services/assessment';
import type { VirtualQueueItem, Filters } from '~/types/type';

const VirtualQueueFlatList: React.FC = () => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [queue, setQueue] = useState<VirtualQueueItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState('');

  const fetchQueue = async () => {
    if (!authState?.accessToken) {
      setLoading(false);
      setError('Authentication required');
      return;
    }

    try {
      const response = await axios.get('/queue', {
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
        },
      });
      setQueue(response.data.queue || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching queue:', err);
      setError(err.response?.data?.details || 'Failed to fetch queue data');
      setQueue([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [authState?.accessToken, router, pathname]);

  const onRefresh = () => {
    console.log('Manual refresh triggered');
    setRefreshing(true);
    fetchQueue();
  };

  const handleOpenFilterModal = () => {
    setIsFilterModalVisible(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalVisible(false);
  };

  const handleApplyFilters = (filters: Filters) => {
    console.log('Filters applied:', filters);
    handleCloseFilterModal();
  };
  const updateSearch = (query: string) => {
    setSearch(query);
    // Add your search logic here
  };
  const ListHeaderComponent = () => (
    <View className="mb-4 flex-row items-center">
      <View className="mr-2 flex-1">
        <SearchBar
          placeholder="Search..."
          onChangeText={updateSearch}
          value={search}
          platform="default"
          containerStyle={{
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            borderBottomWidth: 0,
          }}
          inputContainerStyle={{
            backgroundColor: 'white',
            borderRadius: 8,
          }}
          searchIcon={{ color: '#59A60E' }}
          clearIcon={{ color: '#59A60E' }}
        />
      </View>
      <TouchableOpacity onPress={handleOpenFilterModal} className="rounded bg-white p-2">
        <Image source={icons.filter} className="h-6 w-6" style={{ tintColor: '#59A60E' }} />
      </TouchableOpacity>
    </View>
  );
  const ListEmptyComponent = () => (
    <View className="flex flex-col items-center justify-center">
      {!loading ? (
        <>
          <Image
            source={images.empty}
            className="h-40 w-40"
            alt="No queue items found"
            resizeMode="contain"
          />
          <Text className="my-5 text-sm text-white">{error || 'No queue items found'}</Text>
        </>
      ) : (
        <ActivityIndicator size="small" color="#59A60E" />
      )}
    </View>
  );

  const ListFooterComponent = () =>
    queue.length > 0 ? (
      <View className="mt-4 flex-row justify-between">
        <TouchableOpacity className="rounded-lg bg-white px-6 py-2">
          <Text className="font-medium text-primary">PREVIOUS</Text>
        </TouchableOpacity>
        <TouchableOpacity className="rounded-lg bg-white px-6 py-2">
          <Text className="font-medium text-primary">NEXT</Text>
        </TouchableOpacity>
      </View>
    ) : null;

  const [isAssessmentModalVisible, setIsAssessmentModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VirtualQueueItem | null>(null);

  const handleCardPress = (item: VirtualQueueItem) => {
    setSelectedItem(item);
    setIsAssessmentModalVisible(true);
  };

  const handleCloseAssessmentModal = () => {
    setIsAssessmentModalVisible(false);
    setSelectedItem(null);
  };

  const handleSaveAssessment = async (details: { actualWeight: string; qualityGrade: string }) => {
    if (!authState?.accessToken) {
      console.error('No access token found');
      Alert.alert('Error', 'No access token found');
      return;
    }

    if (!selectedItem) {
      console.log('No selected item');
      Alert.alert('Error', 'No selected item');
      return;
    }
    const { id, bookingId } = selectedItem;
    const formData = {
      bookingId,
      actualWeight: details.actualWeight,
      qualityGrade: details.qualityGrade,
      oilMillId: authState.data.organizationId,
    };

    await saveAssessment(formData, authState.accessToken, onRefresh, handleCloseAssessmentModal);
  };

  return (
    <>
      <SafeAreaView className="m-3 flex-1 rounded-lg bg-primary p-3">
        <FlatList
          data={queue}
          renderItem={({ item, index }) => (
            <AssessmentCard item={item} index={index} onPress={() => handleCardPress(item)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={{ padding: 18 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#59A60E']} // Android
              tintColor="#59A60E" // iOS
            />
          }
        />

        <FilterModal
          visible={isFilterModalVisible}
          onClose={handleCloseFilterModal}
          onApplyFilters={handleApplyFilters}
        />
      </SafeAreaView>

      {selectedItem && (
        <AssessmentModal
          visible={isAssessmentModalVisible}
          item={selectedItem}
          onClose={handleCloseAssessmentModal}
          onSave={handleSaveAssessment}
        />
      )}
    </>
  );
};

export default VirtualQueueFlatList;
