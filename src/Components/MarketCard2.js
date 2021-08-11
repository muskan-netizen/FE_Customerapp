import React from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import DashedLine from 'react-native-dashed-line';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import {getImageUrl} from '../utils/helperFunctions';

export default function MarketCard2({
  data = {},
  onPress = () => {},
  extraStyles = {},
}) {
  const {appStyle} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, extraStyles});
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={styles.mainTouchContainer}>
      <View style={{flex: 0.9}}>
        <Text style={styles.categoryText}>{data.name}</Text>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: moderateScaleVertical(4),
          }}>
          <Text
            style={{
              fontSize: textScale(12),
              color: colors.textGreyJ,
              fontFamily: fontFamily.regular,
            }}>
            Westheimer Road · 2.9 kms
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: textScale(12),
              color: colors.textGreyJ,
              fontFamily: fontFamily.regular,
            }}>
            German · Continental
          </Text>
        </View>
        <View
          style={{
            width: '90%',
            marginVertical: moderateScaleVertical(8),
          }}>
          <DashedLine
            dashLength={5}
            dashThickness={1}
            dashGap={2}
            dashColor={colors.borderColorD}
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image style={{tintColor: colors.black}} source={imagePath.star} />
          <Text
            style={{
              color: colors.blackC,
              fontSize: textScale(11),
              fontFamily: fontFamily.medium,
              marginHorizontal: moderateScale(5),
            }}>
            4.0 · 31 mins · $40 for two
          </Text>
        </View>
      </View>
      <FastImage
        style={{
          height: moderateScaleVertical(95),
          width: moderateScale(95),
          borderRadius: moderateScale(16),
          resizeMode: 'cover',
        }}
        source={{
          uri: getImageUrl(
            data.banner.proxy_url || data.image.proxy_url,
            data.banner.image_path || data.image.image_path,
            '800/400',
          ),
        }}
      />
    </TouchableOpacity>
  );
}

export function stylesFunc({fontFamily, extraStyles}) {
  const styles = StyleSheet.create({
    mainTouchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: moderateScale(5),
      ...extraStyles,
    },
    categoryText: {
      fontSize: textScale(16),
      color: colors.blackC,
      fontFamily: fontFamily.medium,
    },
  });
  return styles;
}
