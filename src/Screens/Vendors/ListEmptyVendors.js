import React from 'react';
import {Text, View} from 'react-native';
import CardLoader from '../../Components/Loaders/CardLoader';
import NoDataFound from '../../Components/NoDataFound';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';

export default function ListEmptyVendors({
  isLoading = false,
  emptyText = 'No Data Found',
  containerStyle = {},
}) {
  if (isLoading) {
    return (
      <CardLoader
        cardWidth={width - moderateScale(32)}
        height={moderateScaleVertical(170)}
        listSize={5}
        containerStyle={{marginLeft: moderateScale(16)}}
      />
    );
  }
  return (
    <NoDataFound
      text={emptyText}
      isLoading={isLoading}
      containerStyle={containerStyle}
    />
  );
}
