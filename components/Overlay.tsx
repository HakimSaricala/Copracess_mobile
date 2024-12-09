/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Dimensions } from 'react-native';

export default function Overlay() {
  const boxWidth = 230;
  const boxHeight = 230;
  const { height, width } = Dimensions.get('window');

  // Adjust the height of the overlays here
  const topOverlayHeight = (height - boxHeight) / 3;
  const bottomOverlayHeight = (height - boxHeight) / 3;
  const sideOverlayWidth = (width - boxWidth) / 2;

  return (
    <View className="absolute h-full w-full">
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: topOverlayHeight,
          backgroundColor: 'black',
          opacity: 0.7,
        }}
      />

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: bottomOverlayHeight,
          backgroundColor: 'black',
          opacity: 0.7,
        }}
      />

      <View
        style={{
          position: 'absolute',
          top: topOverlayHeight,
          bottom: bottomOverlayHeight,
          left: 0,
          width: sideOverlayWidth,
          backgroundColor: 'black',
          opacity: 0.7,
        }}
      />

      <View
        style={{
          position: 'absolute',
          top: topOverlayHeight,
          bottom: bottomOverlayHeight,
          right: 0,
          width: sideOverlayWidth,
          backgroundColor: 'black',
          opacity: 0.7,
        }}
      />

      <View
        style={{
          width: boxWidth,
          height: boxHeight,
          borderWidth: 2,
          borderColor: 'white',
          backgroundColor: 'transparent',
          position: 'absolute',
          top: topOverlayHeight,
          left: sideOverlayWidth,
        }}
      />
    </View>
  );
}
