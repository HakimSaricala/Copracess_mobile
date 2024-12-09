/* eslint-disable prettier/prettier */
// app/(protected)/map.tsx
import axios from 'axios';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import ListView from '~/components/MapListView';
import { useAuth } from '~/context/AuthContext';
import { calculateDistance } from '~/lib/distanceCalculator';

interface Organization {
  id: string;
  name: string;
  address: string;
  isVerified: boolean;
  createdAt: string;
  price: Price[];
  permit: string | null;
  geolocation: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
}

interface LocationData {
  coords: {
    latitude: number;
    longitude: number;
  };
}

interface Price {
  id: string;
  price: number;
  market_price: number;
  date: string;
}

const MapScreen = () => {
  const { authState } = useAuth();
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [oilMills, setOilMills] = useState<Organization[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setUserLocation(location as LocationData);

      // Update oil mills with distance when location is available
      if (oilMills.length > 0) {
        const millsWithDistance = oilMills.map((mill) => ({
          ...mill,
          distance: calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            mill.geolocation.latitude,
            mill.geolocation.longitude
          ),
        }));
        setOilMills(millsWithDistance);
      }
    })();
  }, [oilMills]);

  useEffect(() => {
    const fetchOilMills = async () => {
      try {
        if (!authState?.accessToken) return;

        const response = await axios.get('/map', {
          headers: {
            Authorization: `Bearer ${authState.accessToken}`,
          },
        });

        if (response.data && Array.isArray(response.data.organizations)) {
          setOilMills(response.data.organizations);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching oil mills:', error);
        Alert.alert('Error', 'Failed to fetch oil mills');
      }
    };

    if (authState?.accessToken) {
      fetchOilMills();
    }
  }, [authState?.accessToken]);

  // Temporarily only render ListView
  return <ListView oilMills={oilMills} onSwitchView={() => {}} />;
};

export default MapScreen;
