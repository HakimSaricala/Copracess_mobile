/* eslint-disable prettier/prettier */
// app/(protected)/booking.tsx

import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';

import BookingCalendar from '~/components/BookingCalendar';
import BookingHistorySidebar from '~/components/BookingSideBar';
import SelectOilMillModal from '~/components/SelectMillModal';
import { useAuth } from '~/context/AuthContext';

interface Organization {
  id: string;
  name: string;
  address: string;
}

interface Booking {
  id: string;
  description: string;
  copraBuyerId: string;
  oilMillId: string;
  estimatedWeight: number;
  deliveryDate: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  driver: string;
  plateNumber: string;
  verificationToken?: string;
  createdAt: string;
  updatedAt: string;
}

const BookingScreen = () => {
  const params = useLocalSearchParams();
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [oilMills, setOilMills] = useState<Organization[]>([]);
  const [isLoadingOilMills, setIsLoadingOilMills] = useState(true);
  const [isHistorySidebarVisible, setIsHistorySidebarVisible] = useState(false);
  const [isOilMillModalVisible, setIsOilMillModalVisible] = useState(false);
  const [selectedOilMill, setSelectedOilMill] = useState<Organization | null>(null);
  useEffect(() => {
    if (params.organizationId && oilMills.length > 0) {
      const selectedOrg = oilMills.find((mill) => mill.id === params.organizationId);
      if (selectedOrg) {
        setSelectedOilMill(selectedOrg);
        setForm((prev) => ({
          ...prev,
          oilMillId: selectedOrg.id,
        }));
      }
    }
  }, [params.organizationId, oilMills]);
  const [form, setForm] = useState({
    id: '',
    description: '',
    copraBuyerId: authState?.data.id || '',
    oilMillId: '',
    estimatedWeight: '',
    deliveryDate: '',
    status: 'PENDING' as const,
    driver: '',
    plateNumber: '',
    verificationToken: '',
  });

  useEffect(() => {
    if (authState?.accessToken) {
      fetchBookings();
      fetchOilMills();
    }
  }, [authState?.accessToken]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/booking');
      setBookingHistory(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to fetch booking history');
    }
  };

  const fetchOilMills = async () => {
    try {
      const response = await axios.get('/map');
      setOilMills(response.data.organizations);
    } catch (error) {
      console.error('Error fetching oil mills:', error);
      Alert.alert('Error', 'Failed to fetch oil mills');
    } finally {
      setIsLoadingOilMills(false);
    }
  };

  const validateForm = () => {
    if (!form.oilMillId?.trim()) {
      Alert.alert('Error', 'Please select an oil mill');
      return false;
    }
    if (!form.deliveryDate?.trim()) {
      Alert.alert('Error', 'Please select a delivery date');
      return false;
    }
    if (!form.estimatedWeight?.trim()) {
      Alert.alert('Error', 'Please enter the estimated weight');
      return false;
    }
    if (!form.plateNumber?.trim()) {
      Alert.alert('Error', 'Please enter the plate number');
      return false;
    }
    if (!form.driver?.trim()) {
      Alert.alert('Error', 'Please enter the driver name');
      return false;
    }
    if (!form.description?.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }

    const weight = parseFloat(form.estimatedWeight);
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Error', 'Please enter a valid weight');
      return false;
    }

    const deliveryDate = new Date(form.deliveryDate);
    if (isNaN(deliveryDate.getTime())) {
      Alert.alert('Error', 'Invalid delivery date format');
      return false;
    }

    return true;
  };

  const handleBook = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const bookingData = {
        id: '',
        description: form.description.trim(),
        copraBuyerId: form.copraBuyerId,
        oilMillId: form.oilMillId,
        estimatedWeight: parseFloat(form.estimatedWeight),
        deliveryDate: new Date(form.deliveryDate).toISOString(),
        status: 'PENDING' as const,
        driver: form.driver.trim(),
        plateNumber: form.plateNumber.trim().toUpperCase(),
        verificationToken: '',
      };
      console.log('Booking data:', bookingData);
      await axios.post('/booking', bookingData, {
        headers: {
          Authorization: `Bearer ${authState?.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      Alert.alert('Success', 'Booking created successfully');
      await fetchBookings();
      resetForm();
    } catch (error: any) {
      console.error('Booking error:', error.response?.data || error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      id: '',
      description: '',
      copraBuyerId: authState?.data.id || '',
      oilMillId: '',
      estimatedWeight: '',
      deliveryDate: '',
      status: 'PENDING',
      driver: '',
      plateNumber: '',
      verificationToken: '',
    });
    setSelectedDate('');
    setSelectedOilMill(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date selected';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setForm((prev) => ({ ...prev, deliveryDate: date }));
  };

  if (isLoadingOilMills) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#59A60E" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-off-100">
      <ScrollView className="p-4">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-pbold text-2xl text-primary">Book a Delivery</Text>
          <TouchableOpacity
            className="rounded-lg border border-primary bg-white p-2"
            onPress={() => setIsHistorySidebarVisible(true)}>
            <FontAwesome name="history" size={24} color="#59A60E" />
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-psemibold text-lg">Select Oil Mill:</Text>
          <TouchableOpacity
            onPress={() => setIsOilMillModalVisible(true)}
            className="rounded-md border border-primary bg-white p-3">
            {selectedOilMill ? (
              <>
                <Text className="font-pmedium text-primary">{selectedOilMill.name}</Text>
                <Text className="text-gray-600 text-sm">{selectedOilMill.address}</Text>
              </>
            ) : (
              <Text className="text-gray-500">Select an oil mill</Text>
            )}
          </TouchableOpacity>
        </View>

        <BookingCalendar onDateSelect={handleDateSelect} />

        <View className="mb-4 mt-4">
          <Text className="mb-2 font-psemibold text-lg">Selected Date:</Text>
          <View className="rounded-md border border-primary bg-white p-3">
            <Text className="font-pregular text-black">{formatDate(selectedDate)}</Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-psemibold text-lg">Description:</Text>
          <TextInput
            value={form.description}
            onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
            className="rounded-md border border-primary bg-white p-3 font-pregular"
            placeholder="Enter delivery description"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-psemibold text-lg">Weight (tons):</Text>
          <TextInput
            value={form.estimatedWeight}
            onChangeText={(text) => setForm((prev) => ({ ...prev, estimatedWeight: text }))}
            keyboardType="decimal-pad"
            className="h-12 rounded-md border border-primary bg-white p-3 font-pregular"
            placeholder="Enter estimated weight"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-psemibold text-lg">Plate Number:</Text>
          <TextInput
            value={form.plateNumber}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, plateNumber: text.toUpperCase() }))
            }
            autoCapitalize="characters"
            className="h-12 rounded-md border border-primary bg-white p-3 font-pregular"
            placeholder="Enter plate number"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-psemibold text-lg">Driver Name:</Text>
          <TextInput
            value={form.driver}
            onChangeText={(text) => setForm((prev) => ({ ...prev, driver: text }))}
            className="h-12 rounded-md border border-primary bg-white p-3 font-pregular"
            placeholder="Enter driver name"
          />
        </View>

        <TouchableOpacity
          onPress={handleBook}
          disabled={isLoading}
          className={`mb-10 rounded-md bg-primary py-3 ${isLoading ? 'opacity-50' : ''}`}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center font-pbold text-lg text-white">Book Delivery</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <SelectOilMillModal
        visible={isOilMillModalVisible}
        onClose={() => setIsOilMillModalVisible(false)}
        onSelect={(mill) => {
          setSelectedOilMill(mill);
          setForm((prev) => ({ ...prev, oilMillId: mill.id }));
        }}
        organizations={oilMills}
        selectedOrganization={selectedOilMill}
        isLoading={isLoadingOilMills}
      />

      <BookingHistorySidebar
        isVisible={isHistorySidebarVisible}
        onClose={() => setIsHistorySidebarVisible(false)}
        bookingHistory={bookingHistory}
        oilMills={oilMills} // Add this prop
      />
    </View>
  );
};

export default BookingScreen;
