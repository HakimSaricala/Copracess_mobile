/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { View, Text, TextInput, KeyboardTypeOptions, TouchableOpacity, Image } from 'react-native';

import { icons } from '../constants';

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  editable = true,
  ...props
}: {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="font-pmedium text-base text-black">{title}</Text>

      <View className="flex h-16 w-full flex-row items-center rounded-2xl border-2 border-primary bg-white px-4 focus:border-secondary">
        <TextInput
          className="flex-1 font-pregular text-base text-black"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          {...props}
          editable={editable}
        />

        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="h-6 w-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
