import React from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import DashedLine from 'react-native-dashed-line';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import {getImageUrl} from '../utils/helperFunctions';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../styles/theme';

export default function MarketCard3({
  data = {},
  onPress = () => {},
  extraStyles = {},
}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);

  const isDarkMode = theme;
  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, extraStyles});
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={styles.mainTouchContainer}>
      <FastImage
        style={{
          height: moderateScaleVertical(140),
          width: '100%',
          borderRadius: moderateScale(10),
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
      <View
        style={{
          marginTop: moderateScale(8),
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          numberOfLines={1}
          style={
            isDarkMode
              ? [styles.categoryText, {color: MyDarkTheme.colors.text}]
              : styles.categoryText
          }>
          {data.name}
        </Text>
        {data?.product_avg_average_rating && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{tintColor: colors.yellowC}}
              source={imagePath.star}
            />
            <Text
              style={{
                color: colors.yellowC,
                fontSize: textScale(11),
                fontFamily: fontFamily.medium,
              }}>
              {Number(data?.product_avg_average_rating).toFixed(1)}
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          marginTop: moderateScale(5),
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: moderateScale(3),
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={{tintColor: themeColors.primary_color}}
            source={imagePath.location2}
          />
          <Text
            style={{
              color: colors.greyLight,
              fontSize: textScale(11),
              fontFamily: fontFamily.medium,
              marginHorizontal: moderateScale(5),
            }}>
            0.2 km | 30 mins
          </Text>
        </View>

        {/* <Text numberOfLines={1} style={{color: colors.greenA}}>
          {strings.OPEN}
        </Text> */}
        <Text
          style={{
            ...commonStyles.mediumFont14Normal,
            fontSize: textScale(12),
            color: data?.show_slot
              ? colors.green
              : data?.slot && data?.slot.length
              ? colors.green
              : colors.redB,
          }}>
          {data?.show_slot
            ? 'Open'
            : data?.slot && data?.slot.length
            ? 'Open'
            : 'Close'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function stylesFunc({fontFamily, extraStyles}) {
  const styles = StyleSheet.create({
    mainTouchContainer: {
      marginTop: moderateScale(15),
      ...extraStyles,
    },
    categoryText: {
      fontSize: textScale(13),
      color: colors.black,
      fontFamily: fontFamily.medium,
      width: '85%',
    },
  });
  return styles;
}
