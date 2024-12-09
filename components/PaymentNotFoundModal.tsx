/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';

const PaymentNotFoundModal = ({ visible, onClose }: any) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 items-center justify-center bg-black/50 p-4">
          <View className="w-full max-w-md rounded-lg bg-white p-6">
            <Text className="mb-4 text-lg font-bold">Transaction Not Found</Text>
            <Text>Unable to load transaction details.</Text>
            <TouchableOpacity onPress={onClose} className="bg-red-500 mt-4 w-full rounded-lg py-3">
              <Text className="text-center font-pbold text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PaymentNotFoundModal;
