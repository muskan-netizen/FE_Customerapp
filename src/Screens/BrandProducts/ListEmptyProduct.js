import React from 'react';
import { Text, View } from 'react-native';
import CardLoader from '../../Components/Loaders/CardLoader';
import {
  moderateScale,
  moderateScaleVertical,
  width
} from '../../styles/responsiveSize';

export default function ListEmptyProduct({isLoading = false}) {
  if (isLoading) {
    return (
      <View style={{marginTop: moderateScaleVertical(20)}}>
        <CardLoader
          containerStyle={{marginHorizontal: moderateScale(8)}}
          cardWidth={width - moderateScale(18)}
          height={moderateScaleVertical(140)}
          listSize={1}
        />
        <CardLoader
          cardWidth={width - moderateScale(190)}
          height={moderateScaleVertical(30)}
          listSize={1}
          containerStyle={{marginHorizontal: moderateScale(90)}}
        />
        <CardLoader
          cardWidth={width - moderateScale(18)}
          height={moderateScaleVertical(40)}
          listSize={1}
          containerStyle={{marginHorizontal: moderateScale(8)}}
        />
        <CardLoader listSize={3} height={moderateScaleVertical(200)} isRow />
      </View>
    );
  }
  return (
    <View>
      <Text></Text>
    </View>
  );
}
