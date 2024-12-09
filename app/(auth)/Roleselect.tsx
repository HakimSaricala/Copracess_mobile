/* eslint-disable prettier/prettier */
import { router, Link } from 'expo-router';
import { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '~/constants';

const Roleselect = () => {
  const [selectedRole, setSelectedRole] = useState<'mill' | 'buyer' | null>(null);

  const handleContinue = () => {
    if (selectedRole === 'mill') {
      router.push('/(auth)/MillSignup');
    } else if (selectedRole === 'buyer') {
      router.push('/(auth)/BuyerSignup');
    }
  };

  return (
    <SafeAreaView className="h-full bg-off-100">
      <View className="h-full w-full justify-center px-4 py-2">
        {/* Logo Section */}
        <View className="mb-2 mt-10 flex-row justify-start">
          <Image source={images.logo} resizeMode="contain" className="h-[70px] w-[350px]" />
        </View>

        <Text className="mb-6 text-center font-pbold text-2xl">Choose Your Role</Text>

        <View className="space-y-6">
          {/* Oil Mill Option */}
          <TouchableOpacity
            onPress={() => setSelectedRole('mill')}
            className={`rounded-xl p-2 ${
              selectedRole === 'mill'
                ? 'border-2 border-primary bg-primary/10'
                : 'border-transparent border-2'
            }`}>
            <View className="h-48 items-center justify-center">
              <Image source={images.selectmill} className="h-full w-full" resizeMode="contain" />
            </View>
          </TouchableOpacity>

          {/* Buyer Option */}
          <TouchableOpacity
            onPress={() => setSelectedRole('buyer')}
            className={`rounded-xl p-2 ${
              selectedRole === 'buyer'
                ? 'border-2 border-primary bg-primary/10'
                : 'border-transparent border-2'
            }`}>
            <View className="h-48 items-center justify-center">
              <Image source={images.selectbuyer} className="h-full w-full" resizeMode="contain" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View className="mt-8 space-y-2">
          <TouchableOpacity
            className={`rounded-xl bg-primary py-4 ${!selectedRole ? 'opacity-50' : 'opacity-100'}`}
            onPress={handleContinue}
            disabled={!selectedRole}>
            <Text className="text-center font-pbold text-lg text-white">Continue</Text>
          </TouchableOpacity>

          <Link href="/Siginin" asChild>
            <TouchableOpacity className="py-3">
              <Text className="text-center font-pmedium text-black">Back to Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Roleselect;
