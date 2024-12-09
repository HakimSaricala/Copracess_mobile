/* eslint-disable prettier/prettier */
// components/charts/ChartTabs.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { TabOption } from '~/types/milldashboard';

interface ChartTabsProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export const ChartTabs: React.FC<ChartTabsProps> = ({ tabs, activeTab, onTabChange }) => (
  <View className="flex-row">
    {tabs.map((tab) => (
      <TouchableOpacity
        key={tab.key}
        onPress={() => onTabChange(tab.key)}
        className={`mr-2 rounded-full px-3 py-1 ${
          activeTab === tab.key ? 'bg-primary' : 'border border-primary bg-white'
        }`}>
        <Text className={`${activeTab === tab.key ? 'text-white' : 'text-primary'} font-pmedium`}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);
