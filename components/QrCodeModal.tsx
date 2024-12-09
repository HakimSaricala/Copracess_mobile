/* eslint-disable prettier/prettier */
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, Share, Alert } from 'react-native';

import type { QRCodeModalProps } from '../types/type';

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isVisible, onClose, qrCodeData }) => {
  const handleShare = async () => {
    try {
      // Extract base64 data
      const base64Data = qrCodeData.split('base64,')[1];

      // Prepare upload data
      const formData = new FormData();
      formData.append('file', `data:image/png;base64,${base64Data}`);
      formData.append('upload_preset', process.env.EXPO_PUBLIC_UPLOAD_PRESET!);

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!data.secure_url) {
        throw new Error('Failed to upload image');
      }
      // Share message with URL
      const shareMessage = `Here is your Copracess booking QR code\n\nClick here to view: ${data.secure_url}`;

      await Share.share(
        {
          title: 'Copracess Booking QR Code',
          message: shareMessage,
          url: data.secure_url,
        },
        {
          dialogTitle: 'Share Booking QR Code',
          tintColor: '#59A60E',
        }
      );
    } catch (error) {
      console.error('Error sharing QR code:', error);
      Alert.alert('Error', 'Failed to share QR code. Please try again.');
    }
  };
  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        const filename = FileSystem.documentDirectory + 'qrcode.png';
        await FileSystem.writeAsStringAsync(filename, qrCodeData.split('base64,')[1], {
          encoding: FileSystem.EncodingType.Base64,
        });
        await MediaLibrary.saveToLibraryAsync(filename);
        alert('QR Code saved to gallery');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save QR Code');
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
      statusBarTranslucent>
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="mx-4 w-full max-w-md rounded-3xl bg-white p-6 shadow-lg">
          {/* Header */}
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="font-pbold text-xl text-primary">Booking QR Code</Text>
            <TouchableOpacity onPress={onClose} className="h-10 w-10 items-center justify-center">
              <Ionicons name="close" size={24} color="#59A60E" />
            </TouchableOpacity>
          </View>

          {/* QR Code Container */}
          <View className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <View className="aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white">
              <Image source={{ uri: qrCodeData }} className="h-full w-full" resizeMode="contain" />
            </View>
          </View>

          {/* Info Text */}
          <Text className="text-gray-600 mb-6 text-center font-pmedium">
            Present this QR code when entering the oil mill facility
          </Text>

          {/* Action Buttons */}
          <View className="flex-row justify-between space-x-3">
            <TouchableOpacity
              onPress={handleShare}
              className="flex-1 flex-row items-center justify-center rounded-2xl bg-primary/10 py-4">
              <Ionicons name="share-outline" size={20} color="#59A60E" />
              <Text className="ml-2 font-psemibold text-primary">Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDownload}
              className="flex-1 flex-row items-center justify-center rounded-2xl bg-primary py-4">
              <Ionicons name="download-outline" size={20} color="white" />
              <Text className="ml-2 font-psemibold text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default QRCodeModal;
