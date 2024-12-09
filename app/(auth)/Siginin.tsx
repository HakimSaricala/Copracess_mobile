/* eslint-disable prettier/prettier */
import { FontAwesome } from '@expo/vector-icons';
import { CheckBox } from '@rneui/themed';
import { Link } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Image, TouchableOpacity, View, Text, Alert } from 'react-native';

import CustomButton from '~/components/CustomButton';
import FormField from '~/components/FormField';
import { images } from '~/constants';
import { useAuth } from '~/context/AuthContext';
import { SignInForm } from '~/types/type';

const REMEMBER_ME_KEY = 'auth.remember_me';
const REMEMBERED_EMAIL_KEY = 'auth.remembered_email';

const SignIn = () => {
  const { onLogin, authState } = useAuth();

  const [form, setForm] = useState<SignInForm>({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        const [rememberedEmail, isRememberMe] = await Promise.all([
          SecureStore.getItemAsync(REMEMBERED_EMAIL_KEY),
          SecureStore.getItemAsync(REMEMBER_ME_KEY),
        ]);

        if (rememberedEmail && isRememberMe === 'true') {
          setForm((prev) => ({ ...prev, email: rememberedEmail }));
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading remembered email:', error);
      }
    };

    loadRememberedEmail();
  }, []);

  const handleRememberMe = async (value: boolean) => {
    setRememberMe(value);
    try {
      await SecureStore.setItemAsync(REMEMBER_ME_KEY, value.toString());
      if (!value) {
        await SecureStore.deleteItemAsync(REMEMBERED_EMAIL_KEY);
      }
    } catch (error) {
      console.error('Error saving remember me preference:', error);
    }
  };

  const validateForm = () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return false;
    }
    if (!form.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const submit = useCallback(async () => {
    try {
      setError(null);
      if (!validateForm()) return;

      setIsSubmitting(true);

      const result = await onLogin!(form.email, form.password);

      if (result.error) {
        setError(result.msg);
        Alert.alert('Error', result.msg);
        return;
      }

      if (rememberMe) {
        await SecureStore.setItemAsync(REMEMBERED_EMAIL_KEY, form.email);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [form, rememberMe]);

  const isFormDisabled = isSubmitting || !!authState?.authenticated;

  return (
    <SafeAreaView className="h-full bg-off-100">
      <ScrollView>
        <View className="my-6 h-full w-full justify-center px-4">
          <View className="mb-2 mt-10 flex-row justify-start">
            <Image source={images.logo} resizeMode="contain" className="h-[70px] w-[350px]" />
          </View>

          <View className="mt-5 flex-row items-center">
            <Text className="text-bold font-pbold text-xl">Log in</Text>
          </View>

          {error && <Text className="text-red-500 mt-2 font-pmedium">{error}</Text>}

          <FormField
            title="Email Address"
            value={form.email}
            handleChangeText={(e) => {
              setError(null);
              setForm({ ...form, email: e });
            }}
            otherStyles="mt-3"
            keyboardType="email-address"
            placeholder="Enter your email address"
            editable={!isFormDisabled}
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => {
              setError(null);
              setForm({ ...form, password: e });
            }}
            otherStyles="mt-7"
            placeholder="Enter password"
            editable={!isFormDisabled}
          />

          <View className="mt-3 flex-row items-center justify-between">
            <CheckBox
              title="Remember Me"
              checked={rememberMe}
              onPress={() => handleRememberMe(!rememberMe)}
              disabled={isFormDisabled}
              checkedColor="#59A60E"
              containerStyle={{
                backgroundColor: 'transparent',
                borderWidth: 0,
                padding: 0,
                margin: 0,
              }}
              textStyle={{
                fontFamily: 'Poppins-Regular',
                fontWeight: 'normal',
              }}
            />
            <TouchableOpacity
              disabled={isFormDisabled}
              onPress={() => {
                Alert.alert('Coming Soon', 'Forgot password functionality will be available soon.');
              }}>
              <Text className="text-primary">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <CustomButton
            title="Log In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="my-6 flex-row items-center">
            <View className="h-[1px] flex-1 bg-gray-100" />
            <Text className="mx-4 font-pmedium text-gray-100">or Continue with</Text>
            <View className="h-[1px] flex-1 bg-gray-100" />
          </View>

          <View className="space-y-4">
            <TouchableOpacity
              className="w-full flex-row items-center justify-center rounded-lg border border-gray-100 bg-white py-3"
              disabled={isFormDisabled}
              onPress={() => {
                Alert.alert('Coming Soon', 'Google sign in will be available soon.');
              }}>
              <FontAwesome name="google" size={20} color="#DB4437" />
              <Text className="ml-2 font-pmedium">Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full flex-row items-center justify-center rounded-lg border border-gray-100 bg-white py-3"
              disabled={isFormDisabled}
              onPress={() => {
                Alert.alert('Coming Soon', 'Facebook sign in will be available soon.');
              }}>
              <FontAwesome name="facebook" size={20} color="#4267B2" />
              <Text className="ml-2 font-pmedium">Continue with Facebook</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-5 flex-row items-center justify-center">
            <Text>Don't have an account?</Text>
            <Link href="/(auth)/Roleselect" className="ml-2 text-primary" disabled={isFormDisabled}>
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
