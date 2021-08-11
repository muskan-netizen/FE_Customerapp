import React from 'react';
import { Text, View } from 'react-native';
import CardLoader from '../../Components/Loaders/CardLoader';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width
} from '../../styles/responsiveSize';

export default function ListEmptySubscriptions({isLoading = false}) {
  if (isLoading) {
    return (
      <CardLoader
        cardWidth={width - moderateScale(20)}
        height={moderateScaleVertical(height/3)}
        listSize={5}
       
      />
    );
  }
  return (
    <View>
      <Text></Text>
    </View>
  );
}
