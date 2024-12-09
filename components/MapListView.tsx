/* eslint-disable prettier/prettier */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router'; // Add this import at the top

interface Price {
  id: string;
  price: number;
  market_price: number;
  date: string;
}

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

interface ListViewProps {
  oilMills: Organization[];
  onSwitchView: () => void;
}

const ListView: React.FC<ListViewProps> = ({ oilMills, onSwitchView }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Mills' },
    { id: 'nearest', label: 'Nearest' },
    { id: 'verified', label: 'Verified' },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getLatestPrice = (prices: Price[]) => {
    if (!prices || prices.length === 0) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part to compare dates only

    const todayPrice = prices.find((price) => {
      const priceDate = new Date(price.date);
      priceDate.setHours(0, 0, 0, 0);
      return priceDate.getTime() === today.getTime();
    });

    return todayPrice || null; // Return today's price or null if none exists
  };

  const sortMills = useCallback(
    (mills: Organization[]) => {
      switch (activeCategory) {
        case 'nearest':
          return [...mills].sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        case 'verified':
          return [...mills].filter((mill) => mill.isVerified);
        default:
          return mills;
      }
    },
    [activeCategory]
  );
  const MillCard = ({ mill }: { mill: Organization }) => {
    const latestPrice = getLatestPrice(mill.price);

    const handleBookNow = () => {
      router.push({
        pathname: '/booking',
        params: { organizationId: mill.id },
      });
    };

    return (
      <View className="mb-3 rounded-xl bg-white p-4 shadow-sm">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-pbold text-lg">{mill.name}</Text>
              {mill.isVerified && (
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={20}
                  color="#59A60E"
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
            <Text className="text-gray-600 mt-1 font-pregular text-sm">{mill.address}</Text>
            {mill.distance !== undefined && (
              <Text className="mt-1 font-pmedium text-sm text-primary">
                {mill.distance.toFixed(1)} km away
              </Text>
            )}
          </View>

          <View className="items-end">
            <View>
              <Text className="font-pbold text-lg text-primary">
                ₱{latestPrice ? latestPrice.price.toFixed(2) : '0.00'}
              </Text>
              <Text className="text-gray-500 font-pregular text-xs">
                {latestPrice ? formatDate(latestPrice.date) : ''}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
            <Text className="text-gray-600 ml-1 font-pregular text-sm">8:00 AM - 5:00 PM</Text>
          </View>
          <TouchableOpacity className="rounded-lg bg-primary px-4 py-2" onPress={handleBookNow}>
            <Text className="font-pbold text-white">Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const filteredMills = useCallback(() => {
    let filtered = oilMills;

    if (searchQuery) {
      filtered = filtered.filter(
        (mill) =>
          mill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mill.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return sortMills(filtered);
  }, [oilMills, searchQuery, sortMills]);

  return (
    <SafeAreaView className="flex-1 bg-off-100">
      <View className="flex-1 px-4">
        <View className="flex-row items-center justify-between py-4">
          <Text className="font-pbold text-2xl text-primary">Oil Mills</Text>
          <TouchableOpacity
            onPress={onSwitchView}
            className="rounded-lg bg-white px-4 py-2 shadow-sm">
            <MaterialCommunityIcons name="map" size={24} color="#59A60E" />
          </TouchableOpacity>
        </View>

        <View className="mb-4 flex-row items-center rounded-lg bg-white px-4 py-2 shadow-sm">
          <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
          <TextInput
            className="ml-2 flex-1 font-pregular text-base"
            placeholder="Search oil mills..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View className="mb-4 h-12">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center' }}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setActiveCategory(category.id)}
                className={`mr-3 rounded-full px-6 py-2.5 ${
                  activeCategory === category.id ? 'bg-primary' : 'bg-white'
                }`}>
                <Text
                  className={`font-pmedium text-sm leading-5 ${
                    activeCategory === category.id ? 'text-white' : 'text-gray-600'
                  }`}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredMills()}
          renderItem={({ item }) => <MillCard mill={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pt-10">
              <Text className="text-gray-500 font-pmedium">No oil mills found</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ListView;
