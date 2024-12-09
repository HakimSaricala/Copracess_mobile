/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text } from 'react-native';

import type { PriceCardProps } from '../types/type';

const PriceCard: React.FC<PriceCardProps> = ({ title, price, subtitle }) => (
  <View className="mb-2 mr-2 flex-1 rounded-lg border border-primary bg-white p-4 shadow-sm">
    <Text className="text-gray-600 mb-1 font-pbold text-xs">{title}</Text>
    <Text className="mb-1 font-pbold text-xl text-primary">₱{price}</Text>
    {subtitle && <Text className="text-gray-500 font-pregular text-xs">{subtitle}</Text>}
  </View>
);

export default PriceCard;
