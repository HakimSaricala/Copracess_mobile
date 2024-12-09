/* eslint-disable prettier/prettier */
// PaymentModal.tsx
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from 'react-native';

import CustomButton from '~/components/CustomButton';
import FormField from '~/components/FormField';
import PaymentNotFoundModal from '~/components/PaymentNotFoundModal';
import { useAuth } from '~/context/AuthContext';
import { CopraOwnerTransaction, OilmillTransaction, PaymentModalProps } from '~/types/type';

interface PaymentFormState {
  totalAmount: number;
  remarks: string;
  paymentMethod: string;
  plateNumber: string;
  transactionID: string;
  actualWeight: number; // Change to number since we'll do calculations
  qualityGrade: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  transaction,
  onConfirm,
  onClose,
}) => {
  const { authState } = useAuth();
  const isCopraOwner = authState?.data.role === 'COPRA_BUYER';

  const [form, setForm] = useState<PaymentFormState>({
    totalAmount: transaction?.totalAmount || 0,
    remarks: transaction?.remarks || '',
    paymentMethod: transaction?.paymentType || '',
    plateNumber: transaction?.plateNumber || '',
    transactionID: transaction?.id || '',
    actualWeight: transaction?.actualWeight || 0,
    qualityGrade: transaction?.qualityGrade || 'Standard',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Move null check after hooks
  if (!transaction) {
    return <PaymentNotFoundModal onClose={onClose} visible={visible} />;
  }

  const handleInputChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTotalAmountChange = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');

    // Prevent multiple decimal points
    const parts = cleanValue.split('.');
    const sanitizedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');

    const amount = parseFloat(sanitizedValue);

    setForm((prev) => ({
      ...prev,
      totalAmount: isNaN(amount) ? 0 : amount,
    }));
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;

    const isDirty =
      form.totalAmount !== transaction.totalAmount ||
      form.remarks !== (transaction.remarks || '') ||
      form.paymentMethod !== transaction.paymentType;

    if (isDirty) {
      Alert.alert('Discard Changes', 'Are you sure you want to discard your changes?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: onClose },
      ]);
    } else {
      onClose();
    }
  };

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    try {
      if (form.paymentMethod === 'ONLINE_PAYMENT') {
        // For online payment
        const response = await axios.post(
          `/transactions/payment?transactionID=${transaction.id}`,
          { totalAmount: form.totalAmount } // Include totalAmount in body
        );

        if (response.data.payoutResponse?.status === 'ACCEPTED') {
          await axios.put(
            `/transactions/payment?transactionID=${transaction.id}&payoutID=${response.data.payoutResponse.id}`,
            {
              totalAmount: form.totalAmount,
              remarks: form.remarks,
              paymentMethod: form.paymentMethod,
            }
          );
          Alert.alert('Success', 'Online payment processed successfully!');
        } else {
          throw new Error('Payment not accepted');
        }
      } else {
        // For cash payment
        await axios.put(`/transactions/payment?transactionID=${transaction.id}`, {
          totalAmount: form.totalAmount,
          remarks: form.remarks,
          paymentMethod: form.paymentMethod,
        });
        Alert.alert('Success', 'Cash payment processed successfully!');
      }
      onConfirm();
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={handleCloseModal}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <TouchableWithoutFeedback>
            <View className="w-[90%] max-w-md rounded-2xl bg-white">
              {/* Header */}
              <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
                <Text className="font-pbold text-xl text-primary">Confirm Payment</Text>
                <TouchableOpacity
                  onPress={handleCloseModal}
                  className="rounded-full p-2 hover:bg-gray-100">
                  <Text className="text-gray-500 text-2xl">×</Text>
                </TouchableOpacity>
              </View>

              <ScrollView className="p-6">
                {/* Transaction Details Section */}
                <View className="bg-gray-50 mb-6 rounded-xl p-4">
                  <Text className="text-gray-500 mb-2 text-sm">Transaction Details</Text>
                  <Text className="mb-2 text-base">
                    <Text className="font-pmedium">Owner: </Text>
                    {isCopraOwner
                      ? (transaction as CopraOwnerTransaction).oilMillCompanyName
                      : (transaction as OilmillTransaction).copraOwnerName}
                  </Text>
                  <Text className="mb-2 text-base">
                    <Text className="font-pmedium">Plate Number: </Text>
                    {transaction.plateNumber}
                  </Text>

                  {/* Amount Field */}
                  {!isCopraOwner ? ( // If user is Oil Mill, show editable amount field
                    <FormField
                      title="Total Amount"
                      value={String(form.totalAmount)}
                      handleChangeText={handleTotalAmountChange}
                      placeholder="Enter amount"
                      otherStyles="mt-2"
                      keyboardType="numeric"
                    />
                  ) : (
                    // If user is Copra Buyer, show read-only amount
                    <Text className="text-base">
                      <Text className="font-pmedium">Amount: </Text>₱
                      {(form.totalAmount || 0).toLocaleString()}
                    </Text>
                  )}
                </View>

                {/* Payment Method Section */}
                <View className="mb-6">
                  <Text className="mb-2 font-pmedium text-base">Payment Method</Text>
                  <View className="overflow-hidden rounded-xl border-2 border-primary">
                    <Picker
                      selectedValue={form.paymentMethod}
                      onValueChange={(value) => handleInputChange('paymentMethod', value)}
                      style={{ height: 50 }}>
                      <Picker.Item label="Cash" value="CASH" />
                      <Picker.Item label="Online Payment" value="ONLINE_PAYMENT" />
                    </Picker>
                  </View>
                </View>

                {/* Remarks Section */}
                <FormField
                  title="Remarks"
                  value={form.remarks}
                  handleChangeText={(text) => handleInputChange('remarks', text)}
                  placeholder="Enter remarks (optional)"
                  otherStyles="mb-6"
                />

                {/* Action Buttons */}
                <View className="space-y-3">
                  <CustomButton
                    title={isSubmitting ? 'Processing...' : 'Confirm Payment'}
                    handlePress={handleConfirmPayment}
                    containerStyles="bg-primary"
                    textStyles="font-pbold"
                    isLoading={isSubmitting}
                  />
                  <TouchableOpacity
                    onPress={handleCloseModal}
                    className="rounded-xl bg-gray-100 py-3">
                    <Text className="text-gray-700 text-center font-pmedium">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PaymentModal;
