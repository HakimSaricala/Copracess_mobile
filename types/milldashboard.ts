/* eslint-disable prettier/prettier */
import { MaterialIcons } from '@expo/vector-icons';

export interface QueueItem {
  id: string;
  owner: string;
  plateNumber: string;
  status: string;
  statusColor?: 'primary' | 'secondary';
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}
export interface ChartSummaryItem {
  label: string;
  value: string;
}

export interface DashboardResponse {
  expense: ChartData;
  weight: ChartData;
  chartSummaryData: {
    expense: ChartSummaryItem[];
    weight: ChartSummaryItem[];
  };
  unloadedTruck: number;
}
export interface TabOption {
  key: string;
  label: string;
}
