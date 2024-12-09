/* eslint-disable prettier/prettier */
import { ActivityIndicator, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';

interface CustomButtonProps {
  title: string;
  handlePress: (event: GestureResponderEvent) => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles = '',
  textStyles = '',
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`flex min-h-[62px] flex-row items-center justify-center rounded-xl bg-primary ${containerStyles} ${
        isLoading ? 'opacity-50' : ''
      }`}
      disabled={isLoading}>
      <Text className={`font-psemibold text-lg text-white ${textStyles}`}>{title}</Text>

      {isLoading && (
        <ActivityIndicator animating={isLoading} color="#fff" size="small" className="ml-2" />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
