/* eslint-disable prettier/prettier */
// components/Millchart.tsx
import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';

import { ChartTabs } from './charts/ChartTabs';
import { ChartTooltip } from './charts/ChartTooltip';

import type { ChartSectionProps, ChartData } from '~/types/type';

const screenWidth = Dimensions.get('window').width;

const ChartSection: React.FC<ChartSectionProps> = ({
  tabs,
  chartData,
  summaryData,
  containerClassName = '',
  height = 220,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  if (isLoading) {
    return (
      <View className="items-center justify-center rounded-lg bg-white p-4">
        <ActivityIndicator size="large" color="#59A60E" />
      </View>
    );
  }

  const renderChart = (type: string, data: ChartData) => {
    const chartWidth = screenWidth - 56;

    const formattedData = data.labels.map((label, index) => ({
      value: data.datasets[0].data[index],
      label,
      dataPointText: `₱${data.datasets[0].data[index].toLocaleString()}`,
    }));

    const commonProps = {
      data: formattedData,
      height,
      width: chartWidth,
      spacing: 35,
      initialSpacing: 20,
      color: '#59A60E',
      textColor: '#59A60E',
      hideDataPoints: false,
      startOpacity: 0.9,
      endOpacity: 0.2,
      thickness: 2,
      xAxisLabelTextStyle: { fontSize: 10, fontFamily: 'Poppins-Regular' },
      yAxisTextStyle: { fontSize: 10, fontFamily: 'Poppins-Regular' },
      rulesColor: '#E5E7EB',
      rulesType: 'solid',
      yAxisColor: 'transparent',
      xAxisColor: 'transparent',
      pointerConfig: {
        pointerColor: '#59A60E',
        pointerStripHeight: height - 100,
        pointerStripColor: 'rgba(89, 166, 14, 0.1)',
        strokeDashArray: [2, 5],
        pointerLabelWidth: 100,
        pointerLabelHeight: 40,
        activatePointersOnLongPress: true,
        autoAdjustPointerLabelPosition: true,
        pointerLabelComponent: (items: any) => (
          <ChartTooltip value={items[0].value} label={items[0].label} />
        ),
      },
    };

    if (type === 'line') {
      return (
        <LineChart
          {...commonProps}
          areaChart
          curved
          startFillColor="rgba(89, 166, 14, 0.2)"
          endFillColor="rgba(89, 166, 14, 0.01)"
        />
      );
    }

    return (
      <BarChart
        {...commonProps}
        barWidth={22}
        spacing={40}
        roundedTop
        barBorderRadius={4}
        frontColor="#59A60E"
        gradientColor="#59A60E33"
        maxValue={Math.max(...data.datasets[0].data) * 1.2}
        isAnimated
        animationDuration={500}
      />
    );
  };

  return (
    <View className={`rounded-lg bg-white p-4 ${containerClassName}`}>
      <View className="mb-4 flex-row items-center justify-between">
        <ChartTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </View>

      <View>
        <View className="mb-4 flex-row justify-between">
          {summaryData[activeTab].map((item, index) => (
            <View key={index}>
              <Text className="text-gray-100">{item.label}</Text>
              <Text className="font-pbold text-lg text-primary">{item.value}</Text>
            </View>
          ))}
        </View>
        {renderChart(activeTab.includes('expense') ? 'line' : 'bar', chartData[activeTab])}
      </View>
    </View>
  );
};

export default ChartSection;
