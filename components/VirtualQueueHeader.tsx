/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import type { VirtualQueueHeaderProps } from '../types/type';

const VirtualQueueHeader: React.FC<VirtualQueueHeaderProps> = ({
  queueNumber,
  currentlyUnloading,
  totalTrucks,
  completed,
  onTheWay,
}) => {
  return (
    <View className="mb-2 rounded-lg bg-primary p-3">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-psemibold text-xs uppercase text-white">
          Virtual Queue #{queueNumber}
        </Text>
      </View>
      <View className="flex-row items-center">
        <View className="flex-1 border-r border-white/20">
          <Text className="font-pmedium text-[10px] uppercase text-white/80">
            Currently Unloading
          </Text>
          <Text className="mt-1 font-pbold text-base text-white">#{currentlyUnloading}</Text>
        </View>

        <View className="flex-1 border-r border-white/20 pl-3">
          <Text className="font-pmedium text-[10px] uppercase text-white/80">Total Trucks</Text>
          <Text className="mt-1 font-pbold text-base text-white">{totalTrucks}</Text>
        </View>

        <View className="flex-1 border-r border-white/20 pl-3">
          <Text className="font-pmedium text-[10px] uppercase text-white/80">Completed</Text>
          <Text className="mt-1 font-pbold text-base text-white">{completed}</Text>
        </View>

        <View className="flex-1 pl-3">
          <Text className="font-pmedium text-[10px] uppercase text-white/80">On The Way</Text>
          <Text className="mt-1 font-pbold text-base text-white">{onTheWay}</Text>
        </View>
      </View>
    </View>
  );
};

export default VirtualQueueHeader;
