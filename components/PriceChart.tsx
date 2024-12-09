/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { icons } from '../constants';
import FilterModal from './FilterModal';
import type { Filters } from '../types/type';

const screenWidth = Dimensions.get('window').width;

const Header: React.FC<{ title: string; onOpenFilter: () => void }> = ({ title, onOpenFilter }) => (
  <View className="flex-row items-center justify-between p-2">
    <Text className="font-pbold text-lg text-primary">{title}</Text>
    <TouchableOpacity
      onPress={onOpenFilter}
      className="rounded-md border border-primary bg-white p-1">
      <Image source={icons.filter} className="h-5 w-5" style={{ tintColor: '#59A60E' }} />
    </TouchableOpacity>
  </View>
);

interface PriceChartProps {
  priceHistory: {
    date: string;
    price: number;
    market_price: number;
  }[];
  isLoading?: boolean;
}

const PriceChart: React.FC<PriceChartProps> = ({ priceHistory, isLoading = false }) => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  if (isLoading) {
    return (
      <View className="h-[300px] items-center justify-center rounded-lg bg-white p-4">
        <ActivityIndicator size="large" color="#59A60E" />
      </View>
    );
  }

  if (!priceHistory || priceHistory.length === 0) {
    return (
      <View className="h-[300px] items-center justify-center rounded-lg bg-white p-4">
        <Text className="text-gray-500 font-pregular">No price history available</Text>
      </View>
    );
  }

  const lastSevenDays = priceHistory.slice(-7);

  const formatChartData = () => {
    return {
      setPriceData: lastSevenDays.map((item) => ({
        value: item.price || 0,
        label: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        dataPointText: `₱${item.price?.toFixed(2) || '0.00'}`,
      })),
      marketPriceData: lastSevenDays.map((item) => ({
        value: item.market_price || 0,
        label: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        dataPointText: `₱${item.market_price?.toFixed(2) || '0.00'}`,
      })),
    };
  };

  const { setPriceData, marketPriceData } = formatChartData();

  return (
    <View className="rounded-lg bg-white p-4">
      <Header title="Price Chart" onOpenFilter={() => setIsFilterModalVisible(true)} />

      <View className="mt-4">
        <LineChart
          areaChart
          data={setPriceData}
          data2={marketPriceData}
          height={220}
          width={screenWidth - 56}
          spacing={35}
          initialSpacing={20}
          color1="#59A60E"
          color2="#FFC107"
          textColor1="#59A60E"
          textColor2="#FFC107"
          hideDataPoints={false}
          dataPointsColor1="#59A60E"
          dataPointsColor2="#FFC107"
          startFillColor1="rgba(89, 166, 14, 0.2)"
          startFillColor2="rgba(255, 193, 7, 0.2)"
          endFillColor1="rgba(89, 166, 14, 0.01)"
          endFillColor2="rgba(255, 193, 7, 0.01)"
          startOpacity={0.9}
          endOpacity={0.2}
          thickness={2}
          noOfSections={5}
          yAxisLabelPrefix="₱"
          xAxisLabelTextStyle={{ fontSize: 10, fontFamily: 'Poppins-Regular' }}
          yAxisTextStyle={{ fontSize: 10, fontFamily: 'Poppins-Regular' }}
          rulesColor="#E5E7EB"
          rulesType="solid"
          yAxisColor="transparent"
          xAxisColor="transparent"
          showVerticalLines={false}
          curved
        />
      </View>

      {/* Legend */}
      <View className="mt-4 flex-row items-center justify-center space-x-6">
        <View className="flex-row items-center">
          <View className="mr-2 h-2.5 w-2.5 rounded-full bg-primary" />
          <Text className="text-gray-700 font-pmedium text-xs">Set Price</Text>
        </View>
        <View className="flex-row items-center">
          <View className="mr-2 h-2.5 w-2.5 rounded-full bg-secondary" />
          <Text className="text-gray-700 font-pmedium text-xs">Market Average</Text>
        </View>
      </View>

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApplyFilters={(filters: Filters) => {
          console.log('Filters applied:', filters);
          setIsFilterModalVisible(false);
        }}
      />
    </View>
  );
};

export default PriceChart;
