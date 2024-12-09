/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

import type { BookingCalendarProps } from '../types/type';

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const markedDates = {
    [today]: {
      selected: true,
      selectedColor: '#FFC303',
      customStyles: {
        container: {
          borderRadius: 20,
        },
      },
    },
    [selectedDate]: {
      selected: true,
      selectedColor: '#ffffff',
      customStyles: {
        container: {
          borderRadius: 20,
        },
        text: {
          color: '#000000',
        },
      },
    },
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    onDateSelect(day.dateString);
  };

  return (
    <View className="rounded-lg bg-primary p-4">
      <Calendar
        theme={{
          calendarBackground: 'transparent',
          textSectionTitleColor: '#ffffff',
          dayTextColor: '#ffffff',
          todayTextColor: '#000000',
          selectedDayTextColor: '#000000',
          monthTextColor: '#ffffff',
          selectedDayBackgroundColor: '#ffffff',
          arrowColor: '#FFC303',
          textMonthFontSize: 20,
          textMonthFontWeight: 'bold',
        }}
        markedDates={markedDates}
        markingType="custom"
        enableSwipeMonths
        onDayPress={handleDayPress}
      />
    </View>
  );
};

export default BookingCalendar;
