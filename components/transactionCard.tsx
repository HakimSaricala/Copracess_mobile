/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import { icons } from '~/constants';
import { useAuth } from '~/context/AuthContext';
import type { CopraOwnerTransaction, OilmillTransaction, TransactionCardProps } from '~/types/type';
const formatCurrency = (
  amount: number | null,
  currency: string = 'PHP'
): [string, number | null] => {
  if (amount === null || isNaN(amount)) {
    return ['₱0.00', null];
  }

  const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  try {
    const formatted = formatter.format(amount);
    return [formatted, amount];
  } catch {
    return ['₱0.00', null];
  }
};
const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, isEditMode, onPress }) => {
  const { authState } = useAuth();

  const [value] =
    transaction.totalAmount !== null ? formatCurrency(transaction.totalAmount, 'PHP') : ['N/A'];
  const isPaid = transaction.status === 'COMPLETED' || transaction.status === 'CLAIMED';

  const isCopraOwner = authState?.data.role === 'COPRA_BUYER';

  if (isCopraOwner) {
    return (
      <TouchableOpacity
        onPress={() => onPress(transaction)} // Fix: Pass transaction argument
        disabled={isPaid}
        className={`border-2 ${
          isEditMode ? 'border-secondary' : 'border-primary'
        } mb-3 rounded-lg bg-white p-4 shadow-sm shadow-gray-200`}>
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="font-pregular text-xs text-gray-100">
            CREATED: {transaction.date} {transaction.time}
          </Text>
          <Text className="text-green-600 font-psemibold text-lg text-primary">{value}</Text>
        </View>
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="font-psemibold text-xl">
            {isCopraOwner
              ? (transaction as CopraOwnerTransaction).oilMillCompanyName
              : (transaction as OilmillTransaction).copraOwnerName}
          </Text>
          {isEditMode && (
            <View className="rounded-full bg-secondary p-2">
              <Image source={icons.edit} className="h-4 w-4" style={{ tintColor: 'white' }} />
            </View>
          )}
        </View>
        <View className="flex-row justify-between">
          <View className="flex-2 ml-2 border-r-2 border-r-gray-200">
            <Text className="pr-2 font-psemibold text-sm text-primary">PLATE NUMBER</Text>
            <Text className="font-psemibold">{transaction.plateNumber}</Text>
          </View>
          <View className="flex-2 ml-2 border-r-2 border-r-gray-200">
            <Text className="pr-2 font-psemibold text-sm text-primary">WEIGHT</Text>
            <Text className="font-psemibold">{transaction.booking.estimatedWeight} tons</Text>
          </View>
          <View className="flex-2 ml-2 border-r-gray-200">
            <Text className="font-psemibold text-sm text-primary">PAYMENT METHOD</Text>
            <Text className="font-psemibold">{transaction.paymentType}</Text>
          </View>
        </View>
        <View className="mt-2 self-start">
          <TouchableOpacity
            disabled={isPaid}
            className={`mt-2 self-start rounded px-2 py-1 ${
              isPaid ? 'bg-gray-100' : 'bg-secondary'
            }`}>
            <Text className={`text-xs font-medium ${isPaid ? 'text-gray-200' : 'text-white'}`}>
              {transaction.status.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
        {isEditMode && (
          <Text className="mt-2 text-xs italic text-secondary">Tap to edit this transaction</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => onPress(transaction)} // Fix: Pass transaction argument
      disabled={isPaid}
      className={`border-2 ${
        isEditMode ? 'border-secondary' : 'border-primary'
      } mb-3 rounded-lg bg-white p-4 shadow-sm shadow-gray-200`}>
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-pregular text-xs text-gray-100">
          CREATED: {transaction.date} {transaction.time}
        </Text>
        <Text className="text-green-600 font-psemibold text-lg text-primary">{value}</Text>
      </View>
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-psemibold text-xl">
          {isCopraOwner
            ? (transaction as CopraOwnerTransaction).oilMillCompanyName
            : (transaction as OilmillTransaction).copraOwnerName}
        </Text>
        {isEditMode && (
          <View className="rounded-full bg-secondary p-2">
            <Image source={icons.edit} className="h-4 w-4" style={{ tintColor: 'white' }} />
          </View>
        )}
      </View>
      <View className="flex-row justify-between">
        <View className="flex-2 ml-2 border-r-2 border-r-gray-200">
          <Text className="pr-2 font-psemibold text-sm text-primary">PLATE NUMBER</Text>
          <Text className="font-psemibold">{transaction.plateNumber}</Text>
        </View>
        <View className="flex-2 ml-2 border-r-2 border-r-gray-200">
          <Text className="pr-2 font-psemibold text-sm text-primary">WEIGHT</Text>
          <Text className="font-psemibold">{transaction.booking.estimatedWeight} tons</Text>
        </View>
        <View className="flex-2 ml-2 border-r-gray-200">
          <Text className="font-psemibold text-sm text-primary">PAYMENT METHOD</Text>
          <Text className="font-psemibold">{transaction.paymentType}</Text>
        </View>
      </View>
      <View className="mt-2 self-start">
        <TouchableOpacity
          disabled={isPaid}
          className={`mt-2 self-start rounded px-2 py-1 ${
            isPaid ? 'bg-gray-100' : 'bg-secondary'
          }`}>
          <Text className={`text-xs font-medium ${isPaid ? 'text-gray-200' : 'text-white'}`}>
            {transaction.status.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
      {isEditMode && (
        <Text className="mt-2 text-xs italic text-secondary">Tap to edit this transaction</Text>
      )}
    </TouchableOpacity>
  );
};

export default TransactionCard;
