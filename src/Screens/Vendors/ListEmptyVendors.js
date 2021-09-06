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
  pRows = 0,
  dotsLength = false,
}) {
  // const dotsView = () => {
  //   for (i = 0; i <= dotsLength, i++; ) {
  //     <View
  //       style={{
  //         backgroundColor: 'green',
  //         height: moderateScale(8),
  //         width: moderateScale(8),
  //         alignSelf: 'center',
  //       }}></View>;
  //   }
  // };

  const dotsView = () => {
    return (
      <View
        style={{
          backgroundColor: '#D6D6D6',
          height: moderateScale(8),
          width: moderateScale(8),
          alignSelf: 'center',
          margin: 2,
        }}></View>
    );
  };
  if (isLoading) {
    return (
      <>
        <CardLoader
          cardWidth={cardWidth}
          height={height}
          listSize={listSize}
          pRows={pRows}
          containerStyle={{
            marginLeft: moderateScale(16),
            ...vendorContainerStyle,
          }}
        />
        {dotsLength && (
          <View
            style={{
              alignSelf: 'center',
              flexDirection: 'row',
            }}>
            {dotsView()}
            {dotsView()}
            {dotsView()}
          </View>
        )}
      </>
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
