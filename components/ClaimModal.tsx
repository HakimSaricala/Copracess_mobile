/* eslint-disable prettier/prettier */
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Alert, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import CustomButton from '~/components/CustomButton';
import PaymentNotFoundModal from '~/components/PaymentNotFoundModal';
import { PaymentModalProps } from '~/types/type';

interface PaymentMethod {
  id: string;
  channelCode: string;
  accountNumber: string;
}

const ClaimModal: React.FC<PaymentModalProps> = ({ visible, transaction, onConfirm, onClose }) => {
  const [form, setForm] = useState({
    discount: 0,
    totalAmount: transaction?.totalAmount ?? 0,
    paymentMethod: transaction?.paymentType ?? '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('CASH');
  const [isOnlinePayment, setIsOnlinePayment] = useState(false);

  useEffect(() => {
    if (visible && transaction) {
      fetchPaymentMethods();
    }
  }, [visible, transaction]);

  // Move null check here, after hooks
  if (!transaction) {
    return <PaymentNotFoundModal onClose={onClose} visible={visible} />;
  }

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(`/transactions/payment`);
      console.log('Payment Methods:', response.data);
      setPaymentMethods(response.data.methods || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      alert('Failed to load payment methods. Please try again.');
    }
  };
  const handleInputChange = (name: string, value: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    try {
      if (isOnlinePayment) {
        // Create online payout
        const response = await axios.post(`/transactions/payment?transactionID=${transaction.id}`);

        if (response.data.payoutResponse?.status === 'ACCEPTED') {
          // Update transaction with payout ID
          await axios.put(
            `/transactions/payment?transactionID=${transaction.id}&payoutID=${response.data.payoutResponse.id}`
          );
          Alert.alert('Success', 'Online payout processed successfully!');
        }
      } else {
        // Handle cash payment
        await axios.put(`/transactions/payment?transactionID=${transaction.id}`);
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
  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
    setIsOnlinePayment(method === 'ONLINE_PAYMENT');
    handleInputChange('paymentMethod', method);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <TouchableWithoutFeedback>
            <View className="w-full max-w-md rounded-lg bg-white p-6">
              <Text className="mb-4 text-lg font-bold">Copra Buyer Payment</Text>

              <Text>Plate Number: {transaction.plateNumber}</Text>
              <Text>Total Amount: {transaction.totalAmount} PHP</Text>

              <View className="mt-4 flex-row justify-between">
                <CustomButton
                  title="Claim with Cash"
                  handlePress={() => handlePaymentMethodChange('CASH')}
                  containerStyles={`w-1/2 mr-2 ${
                    selectedPaymentMethod === 'CASH' ? 'bg-primary' : 'bg-gray-200'
                  }`}
                  textStyles={selectedPaymentMethod === 'CASH' ? 'text-white' : 'text-black'}
                  isLoading={isSubmitting}
                />
                <CustomButton
                  title="Claim Online"
                  handlePress={() => handlePaymentMethodChange('ONLINE_PAYMENT')}
                  containerStyles={`w-1/2 ${
                    selectedPaymentMethod === 'ONLINE_PAYMENT' ? 'bg-primary' : 'bg-gray-200'
                  }`}
                  textStyles={
                    selectedPaymentMethod === 'ONLINE_PAYMENT' ? 'text-white' : 'text-black'
                  }
                  isLoading={isSubmitting}
                />
              </View>

              {isOnlinePayment && paymentMethods.length > 0 && (
                <View className="mt-4">
                  <Text className="text-base font-medium text-black">
                    Select Online Payment Method
                  </Text>
                  <Picker
                    selectedValue={form.paymentMethod}
                    onValueChange={(itemValue) => {
                      handleInputChange('paymentMethod', itemValue);
                    }}
                    style={{ width: '100%', height: 50 }}>
                    {paymentMethods.map((method, index) => (
                      <Picker.Item
                        key={index}
                        label={`${method.channelCode} - ${method.accountNumber}`}
                        value={method.id}
                      />
                    ))}
                  </Picker>
                </View>
              )}

              <View className="mt-4 space-y-4">
                <CustomButton
                  title={isSubmitting ? 'Processing...' : 'Confirm'}
                  handlePress={handleConfirmPayment}
                  containerStyles="mt-4"
                  isLoading={isSubmitting}
                />

                <TouchableOpacity
                  onPress={onClose}
                  className="bg-gray-500 mt-4 w-full rounded-lg py-3">
                  <Text className="text-center font-pbold text-white">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ClaimModal;
