/* eslint-disable prettier/prettier */
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { Filters, FilterModalProps } from '../types/type';

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApplyFilters }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const periods = ['Today', 'This week', 'This month', 'Previous month', 'This year'];
  const statuses = ['Confirmed', 'Pending', 'Canceled'];

  const handleApply = () => {
    const filters: Filters = {
      selectedPeriod,
      startDate,
      endDate,
      selectedStatus,
    };
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    setSelectedPeriod('');
    setStartDate(new Date());
    setEndDate(new Date());
    setSelectedStatus([]);
  };

  const handleStartDateConfirm = (date: Date) => {
    setStartDatePickerVisible(false);
    setStartDate(date);
  };

  const handleEndDateConfirm = (date: Date) => {
    setEndDatePickerVisible(false);
    setEndDate(date);
  };

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 items-center justify-center bg-black/50 p-4">
          <TouchableWithoutFeedback>
            <View className="w-full max-w-md rounded-lg bg-white p-6">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="font-pbold text-xl">FILTERS</Text>
                <TouchableOpacity onPress={handleClear}>
                  <Text className="font-psemibold text-primary">CLEAR</Text>
                </TouchableOpacity>
              </View>

              <Text className="mb-2 font-pbold">PERIOD</Text>
              <View className="mb-4 flex-row flex-wrap">
                {periods.map((period) => (
                  <TouchableOpacity
                    key={period}
                    onPress={() => setSelectedPeriod(period)}
                    className={`mb-2 mr-2 rounded border px-3 py-1 ${
                      selectedPeriod === period ? 'border-primary bg-primary' : 'border-primary'
                    }`}>
                    <Text className={selectedPeriod === period ? 'text-white' : 'text-black'}>
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="mb-2 font-pbold">SELECT PERIOD</Text>
              <View className="mb-4 flex-row justify-between">
                <TouchableOpacity
                  onPress={() => setStartDatePickerVisible(true)}
                  className="flex-row items-center rounded border border-primary px-3 py-1">
                  <FontAwesome name="calendar" size={16} color="green" className="mr-2" />
                  <Text className="ml-2">{formatDate(startDate)}</Text>
                </TouchableOpacity>
                <Text className="self-center">-</Text>
                <TouchableOpacity
                  onPress={() => setEndDatePickerVisible(true)}
                  className="flex-row items-center rounded border border-primary px-3 py-1">
                  <FontAwesome name="calendar" size={16} color="green" className="mr-2" />
                  <Text className="ml-2">{formatDate(endDate)}</Text>
                </TouchableOpacity>
              </View>

              <Text className="mb-2 font-pbold">STATUS</Text>
              <View className="mb-4 flex-row flex-wrap">
                {statuses.map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => toggleStatus(status)}
                    className={`mb-2 mr-2 rounded border px-3 py-1 ${
                      selectedStatus.includes(status)
                        ? 'border-primary bg-primary'
                        : 'border-primary'
                    }`}>
                    <Text className={selectedStatus.includes(status) ? 'text-white' : 'text-black'}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleApply}
                className="mt-4 w-full rounded-lg bg-primary py-3">
                <Text className="text-center font-pbold text-white">Show results</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={() => setStartDatePickerVisible(false)}
      />

      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={() => setEndDatePickerVisible(false)}
      />
    </Modal>
  );
};

export default FilterModal;
