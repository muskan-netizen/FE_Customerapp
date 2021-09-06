import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import CardLoader from '../../Components/Loaders/CardLoader';
import NoDataFound from '../../Components/NoDataFound';
import imagePath from '../../constants/imagePath';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import LottieView from 'lottie-react-native';
import {noDataFound} from '../../Components/Loaders/AnimatedLoaderFiles';
import {useSelector} from 'react-redux';
import commonStylesFunc from '../../styles/commonStyles';

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
  rowContainerstyle = {},
  pWidth = 0,
}) {
  const styles = stylesData();
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
          pWidth={pWidth}
          rowContainerstyle={rowContainerstyle}
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
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <LottieView
        source={noDataFound}
        autoPlay
        loop
        style={{
          height: moderateScaleVertical(width / 2),
          width: moderateScale(width / 2),
        }}
      />
      <Text style={styles.textStyle}>{emptyText}</Text>
    </View>
    // <View>
    //   <Image source={imagePath.}/>
    // </View>
  );
}

export function stylesData(params) {
  const {themeColors, appStyle} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});

  const styles = StyleSheet.create({
    containerStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // marginVertical: moderateScaleVertical(height / 4),
    },
    textStyle: {
      ...commonStyles.mediumFont16,
      fontSize: textScale(18),
    },
  });
  return styles;
}
