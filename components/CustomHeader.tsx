/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { images, icons } from '../constants';
import ScreenHeaderBtn from './ScreenHeaderBtn';
import type { CustomHeaderProps } from '../types/type';

const CustomHeader: React.FC<CustomHeaderProps> = ({
  notificationCount,
  onNotificationPress,
  onProfilePress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="w-full bg-white">
      <View className="flex-row items-center justify-between px-4 py-2">
        <View className="flex-row items-center">
          <ScreenHeaderBtn iconUrl={images.logo} handlePress={() => {}} width={200} height={80} />
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity className="relative mr-4" onPress={onNotificationPress}>
            <Image source={icons.notification} className="h-6 w-6" />
            {notificationCount > 0 && (
              <View className="bg-red-500 absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full">
                <Text className="px-1 font-pbold text-xs text-primary">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={onProfilePress}>
            <View className="h-9 w-9 items-center justify-center rounded-full bg-primary">
              <Image source={icons.profile} className="h-5 w-5" tintColor="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CustomHeader;
