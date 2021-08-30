import React from 'react';
import {Text, View} from 'react-native';
import CardLoader from '../../Components/Loaders/CardLoader';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';

export default function ListEmptyOffers({isLoading = false}) {
  if (isLoading) {
    return (
      <CardLoader
        cardWidth={width - moderateScale(32)}
        height={moderateScaleVertical(209)}
        listSize={5}
        containerStyle={{marginLeft: moderateScale(16)}}
      />
    );
  }
  return (
    <NoDataFound
      text={text}
      isLoading={isLoading}
      containerStyle={containerStyle}
    />
  );
}
