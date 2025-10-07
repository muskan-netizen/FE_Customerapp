import React from 'react';
import { View } from 'react-native';
import ContentLoader from 'react-native-easy-content-loader';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
  height,
} from '../../styles/responsiveSize';

const Bar = ({
  height: h = moderateScaleVertical(44),
  radius = 12,
  style = {},
}) => (
  <ContentLoader
    active
    containerStyles={{ paddingHorizontal: 0, paddingVertical: 0, ...style }}
    pRows={0}
    title
    tHeight={h}
    tWidth={'100%'}
    titleStyles={{ marginLeft: 0, borderRadius: radius }}
    primaryColor={colors.greyNew}
    secondaryColor={'#DFDFDF'}
  />
);

const RowCard = ({ style = {} }) => (
  <ContentLoader
    active
    containerStyles={{ paddingHorizontal: 0, paddingVertical: 0, ...style }}
    pRows={0}
    title
    tHeight={moderateScaleVertical(66)}
    tWidth={'100%'}
    titleStyles={{ marginLeft: 0, borderRadius: moderateScale(12) }}
    primaryColor={colors.greyNew}
    secondaryColor={'#DFDFDF'}
  />
);

const GridCard = ({ cardWidth, cardHeight }) => (
  <ContentLoader
    active
    containerStyles={{ paddingHorizontal: 0, paddingVertical: 0, width: cardWidth }}
    pRows={0}
    title
    tHeight={cardHeight}
    tWidth={cardWidth}
    titleStyles={{ marginLeft: 0, borderRadius: moderateScale(12) }}
    primaryColor={colors.greyNew}
    secondaryColor={'#DFDFDF'}
  />
);

const TaxiHomeShimmer = () => {
  const horizontalPad = moderateScale(12);
  const gridGap = moderateScale(12);
  const gridCardWidth = (width - horizontalPad * 2 - gridGap * 3) / 4;
  const gridCardHeight = moderateScaleVertical(80);

  return (
    <View style={{ paddingHorizontal: horizontalPad }}>
      {/* Search bar placeholder */}
      <Bar style={{ marginTop: moderateScaleVertical(6), borderRadius: moderateScale(24) }} height={moderateScaleVertical(48)} />

      {/* Address rows placeholders */}
      <RowCard style={{ marginTop: moderateScaleVertical(12) }} />
      <RowCard style={{ marginTop: moderateScaleVertical(10) }} />

      {/* Categories header */}
      <Bar style={{ marginTop: moderateScaleVertical(16), width: width * 0.3 }} height={moderateScaleVertical(24)} />

      {/* Categories grid 4x1 (first row) */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: moderateScaleVertical(12),
        }}
      >
        <GridCard cardWidth={gridCardWidth} cardHeight={gridCardHeight} />
        <GridCard cardWidth={gridCardWidth} cardHeight={gridCardHeight} />
        <GridCard cardWidth={gridCardWidth} cardHeight={gridCardHeight} />
        <GridCard cardWidth={gridCardWidth} cardHeight={gridCardHeight} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: moderateScaleVertical(12),
        }}
      >
        <GridCard cardWidth={gridCardWidth} cardHeight={gridCardHeight} />
        <GridCard cardWidth={gridCardWidth} cardHeight={gridCardHeight} />
        <GridCard cardWidth={gridCardWidth} cardHeight={gridCardHeight} />
        <GridCard cardWidth={gridCardWidth} cardHeight={gridCardHeight} />
      </View>

      {/* Banner placeholder */}
      <Bar
        style={{
          marginTop: moderateScaleVertical(16),
          width: width - horizontalPad * 2,
          borderRadius: moderateScale(16),
        }}
        height={moderateScaleVertical(140)}
      />

      {/* Bottom spacer */}
      <View style={{ height: moderateScaleVertical(24) }} />
    </View>
  );
};

export default React.memo(TaxiHomeShimmer);


