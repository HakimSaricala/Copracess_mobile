/* eslint-disable prettier/prettier */
import React from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native';

interface LogoutModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isVisible, onCancel, onConfirm }) => {
  return (
    <Modal animationType="fade" transparent visible={isVisible} onRequestClose={onCancel}>
      <Pressable
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onPress={onCancel}>
        <View className="w-4/5 max-w-sm rounded-lg bg-white p-6" style={{ elevation: 5 }}>
          <Text className="mb-4 text-center font-pbold text-2xl text-primary">SIGN OUT !</Text>
          <Text className="mb-6 text-center font-pmedium text-lg">
            Are you sure you want{'\n'}to sign out?
          </Text>
          <View className="flex-row justify-between border-t border-gray-200">
            <TouchableOpacity className="flex-1 py-3" onPress={onCancel}>
              <Text className=" text-center font-pregular text-lg">Cancel</Text>
            </TouchableOpacity>
            <View className="border-r border-gray-200" />
            <TouchableOpacity className="flex-1 py-3" onPress={onConfirm}>
              <Text className="text-center font-pregular text-lg text-primary">Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default LogoutModal;
