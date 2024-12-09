/* eslint-disable prettier/prettier */
// components/SummaryCard.tsx
import React from 'react';
import { View, Text } from 'react-native';

import type { SummaryCardProps } from '../types/type';

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  items,
  titleClassName = '',
  containerClassName = '',
}) => {
  return (
    <View className={`rounded-lg bg-primary p-3 ${containerClassName}`}>
      <Text className={`mb-2 font-psemibold text-xs text-white ${titleClassName}`}>{title}</Text>
      <View className="flex-row items-center">
        {items.map((item, index) => (
          <View
            key={index}
            className={`flex-1 ${index !== items.length - 1 ? 'border-r border-white/20' : ''}`}>
            <View className={`${index !== 0 ? 'pl-3' : ''}`}>
              <Text className="font-pmedium text-[10px] uppercase text-white/80">{item.label}</Text>
              <Text className="mt-1 font-pbold text-base text-white">
                {item.unit && item.unit === '₱' ? `${item.unit} ` : ''}
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                {item.unit && item.unit !== '₱' ? ` ${item.unit}` : ''}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default SummaryCard;
