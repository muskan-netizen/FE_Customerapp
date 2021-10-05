import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
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
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../styles/theme';
import BlurImages from './BlurImages';
import {
  getImageUrl,
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';

export default function MarketCard3({
  data = {},
  onPress = () => {},
  extraStyles = {},
  fastImageStyle = {},
  imageResizeMode = 'cover',
}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, extraStyles, MyDarkTheme, isDarkMode});
  const scaleInAnimated = new Animated.Value(0);
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={{
        ...styles.mainTouchContainer,
        ...getScaleTransformationStyle(scaleInAnimated),
      }}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}
      >
      <BlurImages
        isDarkMode={isDarkMode}
        themeColor={themeColors.primary_color}
        thumnailUrl={{
          uri: getImageUrl(
            data.banner.proxy_url || data.image.proxy_url,
            data.banner.image_path || data.image.image_path,
            '20/20',
          ),
        }}
        originalUrl={{
          uri: getImageUrl(
            data.banner.proxy_url || data.image.proxy_url,
            data.banner.image_path || data.image.image_path,
            '800/400',
          ),
        }}
        style={[styles.mainImage, {...fastImageStyle}]}
      />

      <View
        style={{
          padding: 8,
        }}>
        <View style={styles.descView}>
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
            <View style={styles.ratingView}>
              <Text
                style={{
                  ...styles.ratingTxt,
                  color: colors.white,
                  fontSize: textScale(9),
                }}>
                {Number(data?.product_avg_average_rating).toFixed(1)}
              </Text>
              <Image
                style={{
                  tintColor: colors.white,
                  marginLeft: 2,
                  width: 9,
                  height: 9,
                }}
                source={imagePath.star}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
        <Text
          numberOfLines={1}
          style={{
            color: colors.greyLight,
            fontSize: textScale(10),
            fontFamily: fontFamily.regular,
            textAlign: 'left',
            marginVertical: moderateScaleVertical(4),
            marginTop: moderateScaleVertical(6),
          }}>
          {data?.categoriesList}
        </Text>
        <View
          style={{
            height: 1,
            borderWidth: 0.5,
            borderColor: 'rgba(1,1,1,0.05)',
            marginTop: moderateScaleVertical(2),
          }}
        />
        <View style={styles.distanceView}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}>
            {data?.lineOfSightDistance && (
              <Image
                style={{tintColor: themeColors.primary_color}}
                source={imagePath.location2}
              />
            )}
            <Text
              style={{
                color: colors.greyLight,
                fontSize: textScale(10),
                fontFamily: fontFamily.regular,
                marginHorizontal: moderateScale(5),
                textAlign: 'left',
              }}>
              {data?.lineOfSightDistance}{' '}
              {!!data?.lineOfSightDistance && !!data?.timeofLineOfSightDistance
                ? '|'
                : ''}{' '}
              {data?.timeofLineOfSightDistance}{' '}
              {!!data?.timeofLineOfSightDistance ? 'mins' : ''}
            </Text>
          </View>

          <Text
            style={{
              ...commonStyles.mediumFont14Normal,
              fontSize: textScale(12),
              textAlign: 'left',
              color: data?.show_slot
                ? colors.green
                : data?.slot && data?.slot.length
                ? colors.green
                : colors.redB,
            }}>
            {data?.show_slot
              ? strings.OPEN
              : data?.slot && data?.slot.length
              ? strings.OPEN
              : strings.CLOSE}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function stylesFunc({fontFamily, extraStyles, isDarkMode, MyDarkTheme}) {
  const styles = StyleSheet.create({
    mainTouchContainer: {
      borderRadius: moderateScale(10),
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.15,
      shadowRadius: 1.84,
      elevation: 2,
      backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.white,
      margin: 6,
      ...extraStyles,
    },
    categoryText: {
      fontSize: textScale(14),
      color: colors.black,
      fontFamily: fontFamily.medium,
      width: '85%',
      textAlign: 'left',
    },
    mainImage: {
      height: moderateScaleVertical(140),
      width: '100%',
      borderTopRightRadius: moderateScale(9),
      borderTopLeftRadius: moderateScale(9),
    },
    descView: {
      marginTop: moderateScale(8),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    ratingTxt: {
      color: colors.yellowC,
      fontSize: textScale(11),
      fontFamily: fontFamily.medium,
      textAlign: 'left',
    },
    ratingView: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.green,
      borderRadius: moderateScale(4),
      paddingVertical: moderateScale(2),
      paddingHorizontal: moderateScale(4),
    },
    distanceView: {
      marginTop: moderateScale(5),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
  return styles;
}
