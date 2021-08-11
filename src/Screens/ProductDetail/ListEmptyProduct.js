import React from 'react';
import {Text, View} from 'react-native';
import CardLoader from '../../Components/Loaders/CardLoader';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';

export default function ListEmptyProduct({isLoading = false}) {
  if (isLoading) {
    return (
      <View style={{marginTop: moderateScaleVertical(20)}}>
        <CardLoader
          cardWidth={width - moderateScale(32)}
          height={moderateScaleVertical(200)}
          listSize={1}
          containerStyle={{marginLeft: moderateScale(16)}}
        />

        <CardLoader
          cardWidth={width / 4}
          height={moderateScaleVertical(40)}
          listSize={1}
          containerStyle={{marginLeft: moderateScale(16)}}
        />
        <CardLoader
          cardWidth={width / 2}
          height={moderateScaleVertical(40)}
          listSize={1}
          containerStyle={{marginLeft: moderateScale(16)}}
        />
        <CardLoader
          cardWidth={moderateScale(40)}
          height={moderateScaleVertical(40)}
          listSize={1}
          containerStyle={{marginLeft: moderateScale(16)}}
        />
        <CardLoader
          cardWidth={width - moderateScale(32)}
          height={moderateScaleVertical(200)}
          listSize={1}
          containerStyle={{marginLeft: moderateScale(16)}}
        />
        <CardLoader
          cardWidth={width / 2}
          height={moderateScaleVertical(40)}
          listSize={1}
          containerStyle={{marginLeft: moderateScale(16)}}
        />
        <CardLoader listSize={1} height={moderateScaleVertical(200)} isRow />
      </View>
    );
  }
  return (
    <View>
      <Text></Text>
    </View>
  );
}
