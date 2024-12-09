/* eslint-disable prettier/prettier */
import { SearchBar } from '@rneui/themed';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import ClaimModal from '~/components/ClaimModal';
import FilterModal from '~/components/FilterModal';
import PaymentModal from '~/components/PaymentModal';
import TransactionCard from '~/components/transactionCard';
import { images, icons } from '~/constants';
import { useAuth } from '~/context/AuthContext';
import type { Filters, OilmillTransaction, CopraOwnerTransaction } from '~/types/type';

const Transaction = () => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [transactions, setTransactions] = useState<(OilmillTransaction | CopraOwnerTransaction)[]>(
    []
  );
  const [filteredTransactions, setFilteredTransactions] = useState<
    (OilmillTransaction | CopraOwnerTransaction)[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    OilmillTransaction | CopraOwnerTransaction | null
  >(null);
  const [isBuyerModalVisible, setIsBuyerModalVisible] = useState(false);

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const fetchTransactions = async () => {
    if (!authState?.accessToken) {
      console.log('No access token available');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('/transactions');
      console.log('Transaction fetch successful', {
        status: response.status,
        dataLength: response.data?.transactions?.length,
      });
      setTransactions(response.data.transactions || []);
    } catch (error: any) {
      console.error('Transaction fetch error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        headers: error.config?.headers,
      });

      if (error.response?.status !== 401) {
        setRefreshing(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState?.authenticated && authState?.accessToken) {
      fetchTransactions();
    }
  }, [authState?.accessToken, authState?.authenticated]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredTransactions(transactions);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = transactions.filter((transaction) => {
      // Create utility function to safely get names based on transaction type
      const getTransactionName = (tx: OilmillTransaction | CopraOwnerTransaction) => {
        if ('copraOwner' in tx) {
          // OilmillTransaction
          return tx.copraOwner.name;
        } else {
          // CopraOwnerTransaction
          return tx.oilMillCompany.name;
        }
      };

      const searchableFields = {
        id: transaction.id || '',
        plateNumber: transaction.plateNumber || '',
        status: transaction.status || '',
        name: getTransactionName(transaction),
        weight: String(transaction.booking?.estimatedWeight || ''),
        paymentType: transaction.paymentType || '',
      };

      return Object.values(searchableFields).some((value) =>
        String(value).toLowerCase().includes(searchTerm)
      );
    });

    setFilteredTransactions(filtered);
  };
  const handleOpenFilterModal = () => setIsFilterModalVisible(true);
  const handleCloseFilterModal = () => setIsFilterModalVisible(false);

  const handleApplyFilters = (filters: Filters) => {
    console.log('Filters applied:', filters);
    // Implement filter logic here
    handleCloseFilterModal();
  };

  const handleTransactionPress = (transaction: OilmillTransaction | CopraOwnerTransaction) => {
    setSelectedTransaction(transaction);
    if (authState?.data.role === 'COPRA_BUYER') {
      setIsBuyerModalVisible(true);
    } else {
      setIsModalVisible(true);
    }
  };

  const handleConfirmPayment = () => {
    setIsModalVisible(false);
    setIsBuyerModalVisible(false);
    fetchTransactions(); // Refresh after payment
  };

  const renderHeader = () => (
    <View className="pt-4">
      <View className="flex w-full flex-row items-center space-x-2">
        <View className="flex-1">
          <SearchBar
            placeholder="Search transactions..."
            onChangeText={handleSearch}
            platform="android"
            containerStyle={{
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              borderBottomWidth: 0,
              paddingHorizontal: 0,
            }}
            inputContainerStyle={{
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#59A60E',
              borderRadius: 8,
            }}
            inputStyle={{
              color: '#000',
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
            }}
            searchIcon={{ color: '#59A60E' }}
            clearIcon={{ color: '#59A60E' }}
          />
        </View>
        <TouchableOpacity
          className="rounded-md border border-primary bg-white p-1.5"
          onPress={handleOpenFilterModal}>
          <Image source={icons.filter} className="h-7 w-7" style={{ tintColor: '#59A60E' }} />
        </TouchableOpacity>
      </View>
      <View className="my-5">
        <Text className="font-pbold text-3xl text-primary">Transaction History</Text>
      </View>
    </View>
  );
  const renderEmpty = () => (
    <View className="flex flex-col items-center justify-center">
      {!loading ? (
        <>
          <Image
            source={images.empty}
            className="h-40 w-40"
            alt="No transaction found"
            resizeMode="contain"
          />
          <Text className="text-sm">No transaction found</Text>
        </>
      ) : (
        <ActivityIndicator size="small" color="#59A60E" />
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-off-100">
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={item}
            isEditMode={false}
            onPress={() => handleTransactionPress(item)}
          />
        )}
        refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
        className="px-4 pb-24"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderHeader}
      />

      <PaymentModal
        visible={isModalVisible}
        transaction={selectedTransaction}
        onConfirm={handleConfirmPayment}
        onClose={() => setIsModalVisible(false)}
      />

      <ClaimModal
        visible={isBuyerModalVisible}
        transaction={selectedTransaction}
        onConfirm={handleConfirmPayment}
        onClose={() => setIsBuyerModalVisible(false)}
      />

      <FilterModal
        visible={isFilterModalVisible}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
      />
    </View>
  );
};

export default Transaction;
