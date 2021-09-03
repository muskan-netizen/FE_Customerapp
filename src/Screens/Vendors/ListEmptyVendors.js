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
  listSize = 5,
  cardWidth = width - moderateScale(32),
  height = moderateScaleVertical(170),
  vendorContainerStyle = {},
}) {
  if (isLoading) {
    return (
      <CardLoader
        cardWidth={cardWidth}
        height={height}
        listSize={listSize}
        // pRows={2}
        containerStyle={{
          marginLeft: moderateScale(16),
          ...vendorContainerStyle,
        }}
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
