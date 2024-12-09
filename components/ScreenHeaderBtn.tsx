/* eslint-disable prettier/prettier */
import { Image, TouchableOpacity } from 'react-native';

import { ScreenHeaderBtnProps } from '../types/type';

const ScreenHeaderBtn = ({ iconUrl, handlePress, width, height }: ScreenHeaderBtnProps) => {
  return (
    <TouchableOpacity className="items-center justify-center rounded" onPress={handlePress}>
      <Image source={iconUrl} resizeMode="contain" style={{ width, height }} />
    </TouchableOpacity>
  );
};

export default ScreenHeaderBtn;
