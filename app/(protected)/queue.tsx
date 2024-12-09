/* eslint-disable prettier/prettier */
// app/(protected)/queue.tsx
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useCameraPermissions } from 'expo-camera';
import { useRouter, usePathname } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { View, SafeAreaView, StatusBar, TouchableOpacity, Animated, Alert } from 'react-native';

import VirtualQueueHeader from '~/components/VirtualQueueHeader';
import VirtualQueueFlatList from '~/components/VirtualQueueTable';
import { useAuth } from '~/context/AuthContext';

const Queue: React.FC = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [maxScrollY, setMaxScrollY] = useState(1);
  const router = useRouter();
  const pathname = usePathname();

  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  const handleScanQR = async () => {
    if (!isPermissionGranted) {
      const { granted } = await requestPermission();
      if (granted) {
        router.replace('/(other)/camera');
      } else {
        Alert.alert(
          'Camera Permission Denied',
          'You need to enable camera access to scan QR codes.',
          [{ text: 'OK' }]
        );
      }
    } else {
      router.replace('/(other)/camera');
    }
  };

  const handleContentSizeChange = (contentWidth: number, height: number) => {
    setMaxScrollY(Math.max(height - 400, 1));
  };

  const opacity = scrollY.interpolate({
    inputRange: [0, maxScrollY],
    outputRange: [1, 0.2],
    extrapolate: 'clamp',
  });

  const data = [{ key: 'header' }, { key: 'table' }];

  const { authState } = useAuth();

  interface QueueData {
    completed: number;
    currentlyUnloading: string;
    onTheWay: number;
    totalTrucks: number;
  }

  const [loading, setLoading] = useState(true);
  const [queueData, setQueueData] = useState<QueueData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = async () => {
    if (!authState?.accessToken) {
      setLoading(false);
      setError('Authentication required');
      return;
    }

    try {
      const response = await axios.get('/queue/card', {
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
        },
      });
      setQueueData(response.data.queue);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching queue:', err);
      setError(err.response?.data?.details || 'Failed to fetch queue data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [router, pathname]);

  const renderItem = ({ item }: { item: { key: string } }) => {
    if (item.key === 'header') {
      return (
        <View className="p-4">
          <VirtualQueueHeader
            queueNumber="VQ-321"
            currentlyUnloading={queueData?.currentlyUnloading || 'None'}
            totalTrucks={queueData?.totalTrucks || 0}
            completed={queueData?.completed || 0}
            onTheWay={queueData?.onTheWay || 0}
          />
        </View>
      );
    }
    if (item.key === 'table') {
      return <VirtualQueueFlatList />;
    }
    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-off-100">
      <StatusBar barStyle="dark-content" backgroundColor="#FBF6EE" />
      <View className="flex-1">
        <Animated.FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
          onContentSizeChange={handleContentSizeChange}
        />
        <Animated.View
          style={{ opacity }}
          className="absolute bottom-5 left-0 right-0 items-center">
          <TouchableOpacity
            onPress={handleScanQR}
            className="h-20 w-20 items-center justify-center rounded-full border-4 border-secondary-100 bg-primary shadow-lg"
            style={{
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}>
            <Ionicons name="qr-code-outline" size={45} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default Queue;
