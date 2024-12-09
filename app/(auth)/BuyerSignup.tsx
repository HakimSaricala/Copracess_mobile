/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FontAwesome } from '@expo/vector-icons';
import { Button, Input, Text, Divider } from '@rneui/themed';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '~/constants';

const BuyerSignUp = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'COPRA_BUYER',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    setErrorMessage('');
    if (!form.name || !form.email || !form.password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      Alert.alert('Success', 'Registration successful! Please check your email for activation.');
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('Registration failed. Please try again.');
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-off-100">
      <ScrollView>
        <View className="p-4">
          {/* Header */}
          <View className="mb-6 flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <FontAwesome name="angle-left" size={30} color="#59A60E" />
            </TouchableOpacity>
            <Image source={images.logo} className="h-[70px] w-[300px]" resizeMode="contain" />
          </View>

          <Text className="mb-6 text-xl font-bold">Create Copra Buyer Account</Text>

          {/* Form Fields */}
          <Input
            label="Full name"
            value={form.name}
            onChangeText={(e) => setForm({ ...form, name: e })}
            placeholder="Enter your name"
            labelStyle={{
              fontFamily: 'Poppins-Medium',
              fontSize: 14,
              color: '#91919F',
            }}
            inputStyle={{
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
            }}
            containerStyle={{
              paddingHorizontal: 0,
              marginBottom: 16,
            }}
          />

          <Input
            label="Email Address"
            value={form.email}
            onChangeText={(e) => setForm({ ...form, email: e })}
            placeholder="Enter email address"
            keyboardType="email-address"
            labelStyle={{
              fontFamily: 'Poppins-Medium',
              fontSize: 14,
              color: '#91919F',
            }}
            inputStyle={{
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
            }}
            containerStyle={{
              paddingHorizontal: 0,
              marginBottom: 16,
            }}
          />

          <Input
            label="Password"
            value={form.password}
            onChangeText={(e) => setForm({ ...form, password: e })}
            placeholder="Enter password"
            secureTextEntry
            labelStyle={{
              fontFamily: 'Poppins-Medium',
              fontSize: 14,
              color: '#91919F',
            }}
            inputStyle={{
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
            }}
            containerStyle={{
              paddingHorizontal: 0,
              marginBottom: 24,
            }}
          />

          <Button
            title="Register"
            onPress={handleSubmit}
            loading={isSubmitting}
            buttonStyle={{
              backgroundColor: '#59A60E',
              borderRadius: 8,
              padding: 16,
              marginBottom: 24,
            }}
            titleStyle={{
              fontFamily: 'Poppins-SemiBold',
            }}
          />

          <View className="my-6">
            <Divider
              subHeader="or Continue with"
              subHeaderStyle={{
                textAlign: 'center',
                color: '#91919F',
                fontFamily: 'Poppins-Regular',
              }}
            />
          </View>

          <Button
            title="Continue with Google"
            icon={
              <FontAwesome name="google" size={20} color="#DB4437" style={{ marginRight: 8 }} />
            }
            buttonStyle={{
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#91919F',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
            titleStyle={{
              color: 'black',
              fontFamily: 'Poppins-Medium',
            }}
          />

          <Button
            title="Continue with Facebook"
            icon={
              <FontAwesome name="facebook" size={20} color="#4267B2" style={{ marginRight: 8 }} />
            }
            buttonStyle={{
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#91919F',
              borderRadius: 8,
              padding: 12,
              marginBottom: 24,
            }}
            titleStyle={{
              color: 'black',
              fontFamily: 'Poppins-Medium',
            }}
          />

          <View className="mb-10 flex-row items-center justify-center">
            <Text className="font-pregular">Already Have an Account? </Text>
            <Link href="/Siginin" asChild>
              <TouchableOpacity>
                <Text className="font-pregular text-primary">Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BuyerSignUp;
