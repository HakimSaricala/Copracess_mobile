/* eslint-disable prettier/prettier */
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';

import ChartSection from '~/components/Millchart';
import PriceSection from '~/components/PriceSection';
import SummaryCard from '~/components/SummaryCard';

const CopraHome = () => {
  const [chartData, setChartData] = useState({
    expense_revenue: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
    },
  });

  const [totalTransaction, setTotalTransaction] = useState<number>(0);
  const [averagePrice, setAveragePrice] = useState<number>(0);
  const [dailyMarketPrice, setDailyMarketPrice] = useState<[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [chartSummaryData, setChartSummaryData] = useState({
    expense_revenue: [
      { label: 'Total Revenue', value: '₱0' },
      { label: 'Average Revenue', value: '₱0' },
    ],
  });

  const onRefresh = () => {
    setRefreshing(true);
    fetchRevenueData();
    fetchTotalTrasaction();
    fetchDailyMarketPrice();
    setRefreshing(false);
  };

  const fetchRevenueData = async () => {
    try {
      const response = await axios.get('/dashboard/coprahome');
      const { revenue } = response.data;
      setChartData({
        expense_revenue: {
          labels: revenue.labels,
          datasets: [{ data: revenue.datasets[0].data }],
        },
      });

      setChartSummaryData({
        expense_revenue: [
          { label: 'Total Revenue', value: revenue.summary.totalRevenue },
          { label: 'Average Revenue', value: revenue.summary.averageRevenue },
        ],
      });
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  const fetchTotalTrasaction = async () => {
    try {
      const response = await axios.get('/dashboard/coprahome/total-transaction');
      const { totalTransaction } = response.data;
      setTotalTransaction(totalTransaction);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  const fetchDailyMarketPrice = async () => {
    try {
      const response = await axios.get('/dashboard/coprahome/daily-market-price');
      const { prices, averageDailyPrice } = response.data;
      console.log('averageDailyPrice, ', averageDailyPrice);
      setDailyMarketPrice(prices);
      setAveragePrice(averageDailyPrice);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
    fetchTotalTrasaction();
    fetchDailyMarketPrice();
  }, []);

  return (
    <View className="flex-1 bg-off-100">
      <ScrollView refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}>
        <StatusBar style="dark" />
        <View className="px-4">
          <View className="pt-4">
            <SummaryCard
              title="TODAY'S SUMMARY"
              items={[
                {
                  label: 'TOTAL REVENUE',
                  value: chartSummaryData.expense_revenue[0].value,
                  unit: '',
                },
                {
                  label: 'TOTAL TRANSACTIONS',
                  value: totalTransaction ? totalTransaction.toString() : 'Loading ....',
                },
              ]}
            />
          </View>

          <View className="mt-4">
            <ChartSection
              tabs={[{ key: 'expense_revenue', label: 'Revenue' }]}
              chartData={chartData}
              summaryData={chartSummaryData}
            />
          </View>

          {dailyMarketPrice ? (
            <View className="mt-4">
              <PriceSection
                data={dailyMarketPrice}
                average={averagePrice ? averagePrice.toString() : '0'} // Add null check with default value
              />
            </View>
          ) : (
            'loading....'
          )}
          <View className="h-4" />
        </View>
      </ScrollView>
    </View>
  );
};

export default CopraHome;
