import React from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import commonStylesFunc from '../styles/commonStyles';
import {textScale} from '../styles/responsiveSize';

export default function NoDataFound({
  isLoading = false,
  containerStyle = {},
  text = strings.NODATAFOUND,
  textStyle = {},
}) {
  if (!isLoading) {
    const styles = stylesData();
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={[styles.containerStyle, containerStyle]}>
          <Image source={imagePath.noDataFound2} />
          <Text style={{...styles.textStyle, ...textStyle}}>{text}</Text>
        </View>
      </SafeAreaView>
    );
  }
  return null;
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
