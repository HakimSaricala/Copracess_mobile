/* eslint-disable prettier/prettier */
// components/charts/ChartTooltip.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface TooltipProps {
  value: number;
  label: string;
}

export const ChartTooltip: React.FC<TooltipProps> = ({ value, label }) => (
  <View className="rounded-md bg-primary p-2">
    <Text className="font-pmedium text-white">{label}</Text>
    <Text className="text-white">₱{value.toLocaleString()}</Text>
  </View>
);
