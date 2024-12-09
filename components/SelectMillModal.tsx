/* eslint-disable prettier/prettier */
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import { icons } from '~/constants';

interface Organization {
  id: string;
  name: string;
  address: string;
}

interface SelectOilMillModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (organization: Organization) => void;
  organizations: Organization[];
  selectedOrganization: Organization | null;
  isLoading?: boolean;
}

const SelectOilMillModal: React.FC<SelectOilMillModalProps> = ({
  visible,
  onClose,
  onSelect,
  organizations,
  selectedOrganization,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>(organizations);
  const searchTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setFilteredOrganizations(organizations);
  }, [organizations]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      const filtered = organizations.filter(
        (org) =>
          org.name.toLowerCase().includes(text.toLowerCase()) ||
          org.address.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredOrganizations(filtered);
    }, 300);
  };

  const handleSelect = (organization: Organization) => {
    onSelect(organization);
    onClose();
  };

  const renderOrganizationCard = ({ item }: { item: Organization }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      className={`mb-3 rounded-lg border-2 p-4 ${
        selectedOrganization?.id === item.id
          ? 'border-primary bg-primary/10'
          : 'border-gray-200 bg-white'
      }`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="font-pbold text-lg text-primary">{item.name}</Text>
          <Text className="text-gray-600 mt-1">{item.address}</Text>
        </View>
        {selectedOrganization?.id === item.id && (
          <View className="rounded-full bg-primary p-2">
            <FontAwesome name="check" size={16} color="white" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <TouchableWithoutFeedback>
            <View className="max-h-[80%] w-11/12 rounded-xl bg-white p-4">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="font-pbold text-xl">Select Oil Mill</Text>
                <TouchableOpacity onPress={onClose}>
                  <FontAwesome name="times" size={24} color="#59A60E" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <View className="flex-row items-center rounded-lg border border-gray-100 bg-white  px-3 py-2">
                  <Image
                    source={icons.search}
                    className="mr-2 h-5 w-5"
                    style={{ tintColor: '#59A60E' }}
                  />
                  <TextInput
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholder="Search by name or location"
                    className="flex-1 font-pregular"
                  />
                </View>
              </View>

              {isLoading ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size="large" color="#59A60E" />
                </View>
              ) : (
                <FlatList
                  data={filteredOrganizations}
                  renderItem={renderOrganizationCard}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={() => (
                    <View className="flex-1 items-center justify-center py-8">
                      <Text className="text-gray-500 font-pmedium">No oil mills found</Text>
                    </View>
                  )}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SelectOilMillModal;
