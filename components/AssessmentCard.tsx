/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { VirtualQueueItem } from '~/types/type';

interface AssessmentCardProps {
  item: VirtualQueueItem;
  index: number;
  onPress: (item: any) => void;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ item, index, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className={`mb-2 flex-row rounded-lg bg-white p-3 ${
        index === 0 ? 'border-2 border-secondary-100' : ''
      }`}>
      {/* ID and Time Section */}
      <View className="w-1/5 justify-center">
        <Text className="text-lg font-bold text-primary">#{item.id}</Text>
        <Text className="text-gray-500 text-xs">{item.time}</Text>
      </View>

      {/* Owner and Plate Number Section */}
      <View className="w-2/5 justify-center">
        <Text className="text-sm font-semibold">{item.owner}</Text>
        <Text className="text-gray-500 text-xs">{item.plateNumber}</Text>
      </View>

      {/* Date and Status Section */}
      <View className="w-2/5 items-end justify-center">
        <Text className="text-sm">{item.date}</Text>
        {index === 0 && (
          <Text className="text-xs font-semibold text-secondary-200">Currently Unloading</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AssessmentCard;
