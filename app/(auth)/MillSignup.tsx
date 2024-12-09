/* eslint-disable prettier/prettier */
// app/(auth)/MillSignup.tsx
import { FontAwesome } from '@expo/vector-icons';
import { Button, Text, Input, CheckBox } from '@rneui/themed';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '~/constants';

const MillSignup = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    username: '',
    firstname: '',
    middlename: '',
    lastname: '',
    Org_name: '',
    position: '',
    address: '',
    phone: '',
    email: '',
    password: '',
  });
  const [agree, setAgree] = useState(false);

  const steps = ['Basic Info', 'Company Info', 'Business Location', 'Login Info'];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0:
        if (!form.username) newErrors.username = 'Username is required';
        if (!form.firstname) newErrors.firstname = 'First name is required';
        if (!form.lastname) newErrors.lastname = 'Last name is required';
        break;
      case 1:
        if (!form.Org_name) newErrors.Org_name = 'Business name is required';
        if (!form.position) newErrors.position = 'Position is required';
        if (!form.address) newErrors.address = 'Address is required';
        break;
      case 3:
        if (!form.email) newErrors.email = 'Email is required';
        if (!form.phone) newErrors.phone = 'Phone number is required';
        if (!form.password) newErrors.password = 'Password is required';
        if (form.password && form.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
        if (!agree) newErrors.agree = 'You must agree to the terms';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepIndicator = () => (
    <View className="mb-6 flex-row justify-between px-4">
      {steps.map((step, index) => (
        <View key={index} className="items-center">
          <View
            className={`h-8 w-8 items-center justify-center rounded-full 
              ${index === currentStep ? 'bg-primary' : 'bg-gray-200'}
              ${index < currentStep ? 'bg-primary' : ''}`}>
            <Text className={`font-bold ${index <= currentStep ? 'text-white' : 'text-gray-500'}`}>
              {index + 1}
            </Text>
          </View>
          <Text className="mt-1 text-xs">{step}</Text>
        </View>
      ))}
    </View>
  );

  const renderBasicInfo = () => (
    <View className="px-4">
      <Input
        label="Username"
        value={form.username}
        onChangeText={(text) => setForm({ ...form, username: text })}
        placeholder="Enter username"
        errorMessage={errors.username}
      />
      <View className="flex-row">
        <Input
          containerStyle={{ flex: 1, marginRight: 8 }}
          label="First Name"
          value={form.firstname}
          onChangeText={(text) => setForm({ ...form, firstname: text })}
          placeholder="Enter first name"
          errorMessage={errors.firstname}
        />
        <Input
          containerStyle={{ flex: 1 }}
          label="Middle Name"
          value={form.middlename}
          onChangeText={(text) => setForm({ ...form, middlename: text })}
          placeholder="Enter middle name"
        />
      </View>
      <Input
        label="Last Name"
        value={form.lastname}
        onChangeText={(text) => setForm({ ...form, lastname: text })}
        placeholder="Enter last name"
        errorMessage={errors.lastname}
      />
    </View>
  );

  const renderCompanyInfo = () => (
    <View className="px-4">
      <Input
        label="Business Name"
        value={form.Org_name}
        onChangeText={(text) => setForm({ ...form, Org_name: text })}
        placeholder="Enter business name"
        errorMessage={errors.Org_name}
      />
      <Input
        label="Position"
        value={form.position}
        onChangeText={(text) => setForm({ ...form, position: text })}
        placeholder="Enter position"
        errorMessage={errors.position}
      />
      <Input
        label="Address"
        value={form.address}
        onChangeText={(text) => setForm({ ...form, address: text })}
        placeholder="Enter business address"
        errorMessage={errors.address}
      />
      <Button
        title="Upload Business Permit"
        icon={<FontAwesome name="upload" size={15} color="white" style={{ marginRight: 10 }} />}
        buttonStyle={{ backgroundColor: '#59A60E', borderRadius: 8 }}
      />
    </View>
  );

  const renderBusinessLocation = () => (
    <View className="px-4">
      <Text className="mb-4 text-center font-bold">Map Component Placeholder</Text>
      <View style={{ height: 300, backgroundColor: '#f0f0f0', borderRadius: 8 }} />
    </View>
  );

  const renderLoginInfo = () => (
    <View className="px-4">
      <Input
        label="Email Address"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        placeholder="Enter email address"
        keyboardType="email-address"
        errorMessage={errors.email}
      />

      <Input
        label="Password"
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
        placeholder="Enter password"
        secureTextEntry
        errorMessage={errors.password}
      />
      <CheckBox
        title="I agree to the terms and conditions"
        checked={agree}
        onPress={() => setAgree(!agree)}
        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
        checkedColor="#59A60E"
      />
      {errors.agree && <Text className="text-red-500 ml-2">{errors.agree}</Text>}
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderCompanyInfo();
      case 2:
        return renderBusinessLocation();
      case 3:
        return renderLoginInfo();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-off-100">
      <ScrollView>
        <View className="p-4">
          <View className="mb-6 flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <FontAwesome name="angle-left" size={30} color="#59A60E" />
            </TouchableOpacity>
            <Image source={images.logo} className="h-[70px] w-[300px]" resizeMode="contain" />
          </View>

          <Text className="mb-6 text-xl font-bold">Create Oil Mill Account</Text>

          {renderStepIndicator()}
          {renderCurrentStep()}

          <View className="mt-6 flex-row justify-between px-4">
            {currentStep > 0 && (
              <Button
                title="Previous"
                onPress={() => setCurrentStep(currentStep - 1)}
                buttonStyle={{ backgroundColor: '#59A60E', width: 120 }}
              />
            )}
            <Button
              title={currentStep === 3 ? 'Submit' : 'Next'}
              onPress={handleNext}
              buttonStyle={{ backgroundColor: '#59A60E', width: 120 }}
            />
          </View>

          <View className="mt-6 flex-row items-center justify-center">
            <Text>Already Have an Account? </Text>
            <Link href="/Siginin" asChild>
              <TouchableOpacity>
                <Text className="text-primary">Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MillSignup;
