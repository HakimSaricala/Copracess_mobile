/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { View, Image } from 'react-native';

import { images } from '../constants';

import { SplashScreenProps } from '~/types/type';

interface EnhancedSplashScreenProps extends SplashScreenProps {
  isFontsLoaded: boolean;
  isAppReady: boolean;
  onFinish: () => void;
}

const SplashScreenComponent: React.FC<EnhancedSplashScreenProps> = ({
  onFinish,
  isFontsLoaded,
  isAppReady,
}) => {
  useEffect(() => {
    if (isFontsLoaded || isAppReady) {
      const timer = setTimeout(() => {
        onFinish();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isFontsLoaded, isAppReady, onFinish]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image source={images.LogoSplash} className="h-64 w-64" resizeMode="contain" />
    </View>
  );
};

export default SplashScreenComponent;
