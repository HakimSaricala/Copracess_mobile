/* eslint-disable prettier/prettier */
// components/PriceSection.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';

import { images } from '~/constants';
import type { PriceCardItem, PriceSectionProps } from '~/types/type';

const PriceCard = ({ item }: { item: PriceCardItem }) => (
  <View className="mb-3 flex-row items-center justify-between rounded-lg bg-white p-4">
    <View className="flex-row items-center space-x-3">
      <View className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
        <Image source={images.oilmill} className="h-full w-full" resizeMode="cover" />
      </View>
      <View>
        <Text className="font-pmedium text-base text-black">{item.millName}</Text>
        <Text className="text-sm text-gray-100">
          Previous: ₱{!item.subPrice ? 0 : item.subPrice}
        </Text>
      </View>
    </View>
    <View>
      <Text className="text-right font-pbold text-base text-primary">₱{item.price}</Text>
    </View>
  </View>
);

const PriceSection: React.FC<PriceSectionProps> = ({ data, average }) => {
  return (
    <View>
      <View className="mb-3 flex-row items-center justify-between">
        <View>
          <Text className="font-pbold text-lg text-black">Daily Market Price</Text>
          <Text className="text-sm text-gray-100">Average: ₱{average}/kg</Text>
        </View>
      </View>

      {data.map((item) => (
        <PriceCard key={item.id} item={item} />
      ))}
    </View>
  );
};

export default PriceSection;
