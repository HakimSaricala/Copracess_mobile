/* eslint-disable prettier/prettier */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Geolocation {
  id: string;
  latitude: number;
  longitude: number;
}

interface Price {
  id: string;
  price: number;
  market_price: number;
  date: string;
  organizationId: string;
}

interface Organization {
  id: string;
  name: string;
  address: string;
  accessCode: string;
  createdAt: string;
  updatedAt: string;
  permit: string | null;
  isVerified: boolean;
  geolocationId: string | null;
  creatorId: string;
  geolocation: Geolocation;
  price: Price[];
  distance?: number;
}

interface OrganizationBottomSheetProps {
  organizations: Organization[];
  onOrganizationSelect: (organization: Organization) => void;
  onClose: () => void;
  visible?: boolean;
}

const OrganizationBottomSheet: React.FC<OrganizationBottomSheetProps> = ({
  organizations,
  onOrganizationSelect,
  onClose,
  visible = true,
}) => {
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
  const router = useRouter();

  const handleBooking = (organization: Organization) => {
    onClose();
    router.push({
      pathname: '/booking',
      params: {
        organizationId: organization.id,
      },
    });
  };
  const getLatestPrice = (prices: Price[]) => {
    if (!prices || prices.length === 0) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayPrice = prices.find((price) => {
      const priceDate = new Date(price.date);
      priceDate.setHours(0, 0, 0, 0);
      return priceDate.getTime() === today.getTime();
    });

    return todayPrice || null;
  };
  const renderOrganizationCard = ({ item }: { item: Organization }) => {
    const latestPrice = getLatestPrice(item.price);

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    };

    return (
      <View className="mb-3 rounded-lg bg-white p-4 shadow-sm">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="font-pbold text-lg text-primary">{item.name}</Text>
          <Text className="font-pmedium text-base text-secondary">
            ₱{latestPrice ? latestPrice.price.toFixed(2) : '0.00'}/kg
          </Text>
        </View>

        <Text className="text-gray-600 mb-2 font-pregular text-sm">{item.address}</Text>

        {item.distance !== undefined && (
          <Text className="mb-2 font-pmedium text-sm text-primary">
            {item.distance.toFixed(1)} km away
          </Text>
        )}

        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              className={`mr-2 h-2 w-2 rounded-full ${
                item.isVerified ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
            <Text className="text-gray-600 font-pmedium text-sm">
              {item.isVerified ? 'Verified' : 'Unverified'}
            </Text>
          </View>
          <Text className="text-gray-400 text-xs">Since {formatDate(item.createdAt)}</Text>
        </View>

        {latestPrice && latestPrice.market_price > 0 && (
          <View className="bg-gray-50 mt-2 rounded p-2">
            <Text className="text-gray-500 text-xs">
              Market Price: ₱{latestPrice.market_price.toFixed(2)}/kg
            </Text>
          </View>
        )}

        <View className="mt-4 flex-row justify-between space-x-2">
          <TouchableOpacity
            onPress={() => onOrganizationSelect(item)}
            className="flex-1 flex-row items-center justify-center rounded-md bg-primary/10 py-2">
            <MaterialCommunityIcons name="map-marker" size={20} color="#59A60E" />
            <Text className="ml-2 font-pmedium text-primary">View on Map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleBooking(item)}
            className="flex-1 flex-row items-center justify-center rounded-md bg-primary py-2">
            <MaterialCommunityIcons name="calendar-check" size={20} color="#FFFFFF" />
            <Text className="ml-2 font-pmedium text-white">Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!visible) return null;

  return (
    <BottomSheet snapPoints={snapPoints} enablePanDownToClose onClose={onClose} index={1}>
      <View className="flex-1 px-4">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-pbold text-xl">Oil Mills</Text>
          <TouchableOpacity onPress={onClose} className="p-2 ">
            <MaterialCommunityIcons name="close" size={20} color="#000000" />
          </TouchableOpacity>
        </View>

        <BottomSheetFlatList
          data={organizations}
          keyExtractor={(item) => item.id}
          renderItem={renderOrganizationCard}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </BottomSheet>
  );
};

export default OrganizationBottomSheet;
