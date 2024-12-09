/* eslint-disable prettier/prettier */
// components/AssessmentModal.tsx
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';

import type { VirtualQueueItem } from '~/types/type';

interface AssessmentModalProps {
  visible: boolean;
  item: VirtualQueueItem;
  onClose: () => void;
  onSave: (details: { actualWeight: string; qualityGrade: string }) => void;
}

const QUALITY_GRADES = ['Premium', 'Standard', 'Low Grade', 'Reject'] as const;

const AssessmentModal: React.FC<AssessmentModalProps> = ({ visible, item, onClose, onSave }) => {
  const [actualWeight, setActualWeight] = useState('');
  const [qualityGrade, setQualityGrade] = useState<(typeof QUALITY_GRADES)[number]>('Standard');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!actualWeight.trim()) {
      Alert.alert('Error', 'Please enter actual weight');
      return false;
    }

    const weight = parseFloat(actualWeight);
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Error', 'Please enter a valid weight');
      return false;
    }

    if (!qualityGrade) {
      Alert.alert('Error', 'Please select quality grade');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const details = {
      actualWeight,
      qualityGrade,
    };

    onSave(details);
    resetForm();
  };

  const resetForm = () => {
    setActualWeight('');
    setQualityGrade('Standard');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="w-5/6 rounded-lg bg-white p-6">
          <Text className="mb-4 font-pbold text-lg text-primary">Assessment Details</Text>
          <Text className="mb-4 font-pbold text-lg">{item.owner}</Text>

          {/* Actual Weight Input */}
          <View className="mb-4">
            <Text className="font-psemibold text-sm">Actual Weight (kg):</Text>
            <TextInput
              value={actualWeight}
              onChangeText={setActualWeight}
              keyboardType="decimal-pad"
              placeholder="Enter Actual Weight"
              className="mt-2 rounded border border-gray-200 p-2"
            />
          </View>

          {/* Quality Grade Picker */}
          <View className="mb-4">
            <Text className="font-psemibold text-sm">Quality Grade:</Text>
            <View className="mt-2 rounded border border-gray-200">
              <Picker
                selectedValue={qualityGrade}
                onValueChange={(value) => setQualityGrade(value)}>
                {QUALITY_GRADES.map((grade) => (
                  <Picker.Item key={grade} label={grade} value={grade} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mt-4 flex-row justify-end">
            <TouchableOpacity onPress={onClose} className="bg-transparent mr-4 rounded px-4 py-2">
              <Text className="font-psemibold text-primary">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSubmitting}
              className="rounded bg-primary px-4 py-2">
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="font-psemibold text-white">Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AssessmentModal;
