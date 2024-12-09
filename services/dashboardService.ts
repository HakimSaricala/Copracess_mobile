/* eslint-disable prettier/prettier */
// services/dashboardService.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { authService } from './authService';

import type { DashboardResponse } from '~/types/milldashboard';

const STORAGE_KEYS = {
  ACCESS_TOKEN: process.env.EXPO_PUBLIC_ACCESS_TOKEN_KEY || 'accessToken',
};

class DashboardService {
  private api;

  constructor() {
    this.api = authService.getApi();
  }

  async getOilMillDashboard(): Promise<DashboardResponse> {
    try {
      // Get the current access token
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);

      if (!token) {
        throw new Error('No access token available');
      }

      const response = await this.api.get('/api/mobile/dashboard/oilhome', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Dashboard fetch successful:', response.data);
      if (!response.data) {
        throw new Error('No data received from server');
      }

      return {
        expense: response.data.expense || { labels: [], datasets: [{ data: [] }] },
        weight: response.data.weight || { labels: [], datasets: [{ data: [] }] },
        chartSummaryData: response.data.chartSummaryData || {
          expense: [],
          weight: [],
        },
        unloadedTruck: response.data.unloadedTruck || 0,
      };
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        console.log('Token expired, attempting refresh...');
        try {
          await authService.init(); // This will handle token refresh
          return this.getOilMillDashboard(); // Retry the request
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw new Error('Authentication failed');
        }
      }

      console.error('Dashboard fetch error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
}

export const dashboardService = new DashboardService();
