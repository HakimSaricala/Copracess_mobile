/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Pressable } from 'react-native';

import type { SetPriceModalProps } from '../types/type';

const SetPriceModal: React.FC<SetPriceModalProps> = ({
  visible,
  onClose,
  onSetPrice,
  selectedDate,
  currentPrice,
}) => {
  const [price, setPrice] = useState(currentPrice?.toString() || '');

  useEffect(() => {
    // Update price input when currentPrice changes
    if (currentPrice) {
      setPrice(currentPrice.toString());
    }
  }, [currentPrice]);

  const handleSetPrice = () => {
    onSetPrice(selectedDate, parseFloat(price));
    setPrice('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable className="flex-1 items-center justify-center bg-black/30" onPress={onClose}>
        <Pressable
          className="w-11/12 max-w-sm rounded-2xl bg-white p-6"
          onPress={(e) => e.stopPropagation()}>
          <Text className="mb-4 font-pbold text-xl text-primary">
            {currentPrice ? 'Update' : 'Set'} Price for {selectedDate}
          </Text>
          {currentPrice ? (
            <Text className="text-gray-500 mb-2">Current price: ₱{currentPrice.toFixed(2)}</Text>
          ) : null}
          <TextInput
            className="border-gray-300 mb-4 rounded-lg border p-3 font-pregular text-lg"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price"
            placeholderTextColor="#A0AEC0"
          />
          <View className="flex-row justify-end">
            <TouchableOpacity onPress={onClose} className="mr-4 px-4 py-2">
              <Text className="text-gray-600 font-psemibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSetPrice} className="rounded-lg bg-primary px-4 py-2">
              <Text className="font-pbold text-white">{currentPrice ? 'Update' : 'Set'} Price</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SetPriceModal;
