/* eslint-disable prettier/prettier */
// app/(protected)/oilhome.tsx
import axios from 'axios'; // Add this import
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StatusBar, Alert, RefreshControl } from 'react-native';

import QueueSection from '../../components/QueueSection';
import SummaryCard from '../../components/SummaryCard';

import ChartSection from '~/components/Millchart';
import type { ChartData, ChartSummaryItem, QueueItem, TabOption } from '~/types/milldashboard';

const OilHome = () => {
  const router = useRouter();

  const chartTabs: TabOption[] = [
    { key: 'expense', label: 'Expense' },
    { key: 'weight', label: 'Weight' },
  ];

  const [chartData, setChartData] = useState<{
    expense: ChartData;
    weight: ChartData;
  }>({
    expense: { labels: [], datasets: [{ data: [] }] },
    weight: { labels: [], datasets: [{ data: [] }] },
  });

  const [chartSummaryData, setChartSummaryData] = useState<{
    expense: ChartSummaryItem[];
    weight: ChartSummaryItem[];
  }>({
    expense: [],
    weight: [],
  });

  const [unloadedTruckCount, setUnloadedTruckCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [queueData, setQueueData] = useState<QueueItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/dashboard/oilhome');
      const { expense, weight, chartSummaryData, unloadedTruck } = response.data;
      console.log('Dashboard fetch successful:', response.data);

      setChartData({
        expense: expense || { labels: [], datasets: [{ data: [] }] },
        weight: weight || { labels: [], datasets: [{ data: [] }] },
      });
      setChartSummaryData(chartSummaryData || { expense: [], weight: [] });
      setUnloadedTruckCount(unloadedTruck || 0);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      Alert.alert('Error', 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQueue = async () => {
    try {
      const response = await axios.get('/queue');
      setQueueData(response.data.queue || []);
    } catch (error) {
      console.error('Error fetching queue:', error);
      setQueueData([]);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchDashboardData(), fetchQueue()]);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchQueue();
  }, []);

  const handleSeeAllPress = () => {
    router.replace('/queue');
  };

  const handleQueueItemPress = (item: QueueItem) => {
    console.log('Queue item pressed:', item);
  };

  return (
    <View className="flex-1 bg-off-100">
      <ScrollView refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}>
        <StatusBar barStyle="dark-content" />
        <View className="px-4 pt-4">
          <SummaryCard
            title="TODAY'S SUMMARY"
            items={[
              {
                label: 'TOTAL EXPENSE',
                value: chartSummaryData.expense[0]?.value || (isLoading ? 'loading...' : '₱0'),
              },
              {
                label: 'TOTAL WEIGHT',
                value: chartSummaryData.weight[0]?.value || (isLoading ? 'loading...' : '0 TONS'),
              },
              {
                label: 'UNLOADED TRUCKS',
                value: isLoading ? 'loading...' : unloadedTruckCount.toString(),
              },
            ]}
          />

          <View className="mt-4">
            <ChartSection
              tabs={chartTabs}
              chartData={chartData}
              summaryData={chartSummaryData}
              isLoading={isLoading}
            />
          </View>

          <View className="mt-4">
            <QueueSection
              title="Virtual Queue"
              data={queueData}
              onSeeAllPress={handleSeeAllPress}
              onItemPress={handleQueueItemPress}
              showAvatar
              emptyStateText="No vehicles in queue"
              seeAllText="View All"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OilHome;
