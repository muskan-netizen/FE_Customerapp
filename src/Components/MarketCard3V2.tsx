import React, { FC, useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Grayscale } from 'react-native-color-matrix-image-filters';
import { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getImageUrlNew } from '../utils/commonFunction';
import { getColorCodeWithOpactiyNumber, getImageUrl } from '../utils/helperFunctions';
import { getColorSchema } from '../utils/utils';

interface lineOfSightDistanceInterface {
  lineOfSightDistance?: string | number;
  is_vendor_closed?: boolean;
  timeofLineOfSightDistance?: string | number;
  closed_store_order_scheduled?: number;
  delaySlot?: string;
  product_avg_average_rating?: number;
  categoriesList?: string;
  path?: string | object | null;
  logo?: string | object | null;
  show_slot?: boolean | number;
  name?: string;
  banner?: string | object | null;
  promo_discount?: string;
  rating?: string | number;
  vendorRating?: string | number;
}

interface CompProps {
  data: lineOfSightDistanceInterface;
  onPress: () => {};
  extraStyles?: {};
  fastImageStyle?: {};
  isMaxSaftey?: true;
  index?: number;
}

const MarketCard3: FC<CompProps> = ({
  data,
  onPress,
  extraStyles,
  fastImageStyle,
  isMaxSaftey,
  index,
}: CompProps) => {
  const { appStyle, themeColors, themeColor, appData, themeToggle } = useSelector(
    (state: any) => state?.initBoot || {},
  );

  let vendorDistance: any = 0;
  if (!!data?.lineOfSightDistance) {
    vendorDistance =
      typeof data?.lineOfSightDistance == 'string'
        ? parseInt(data?.lineOfSightDistance.split(' ')[0])
        : data.lineOfSightDistance.toFixed(0);
  }

  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily, extraStyles, MyDarkTheme, isDarkMode });
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  const appMainData = useSelector(
    (state: any) => state?.home?.appMainData || {},
  );

  // banner shape differs per API:
  //   vendorAll / homeDataV2 → banner object { image_fit, proxy_url, image_path }
  //   some APIs              → banner / logo / path as plain relative string
  const bannerIsObject = !!data?.banner && typeof data.banner === 'object';

  // Case 1: banner is an object — use getImageUrl exactly like MarketCard3.js
  // image_fit/proxy_url is the imgproxy base, image_path is the encoded path tail
  // Result: "${image_fit}${h}/${w}${image_path}"
  const imageUrlFromObject = bannerIsObject
    ? getImageUrl(
        (data.banner as any).image_fit || (data.banner as any).proxy_url,
        (data.banner as any).image_path,
        `${((height * 2) / 2).toFixed(0)}/${width.toFixed(0)}`,
      )
    : null;

  // Case 2: banner/logo/path is a plain string — build via imgproxy prefix
  const rawStringPath = !bannerIsObject
    ? (typeof data?.banner === 'string' && data.banner ? data.banner : null)
      || (typeof data?.logo === 'string' && data.logo ? data.logo : null)
      || (typeof data?.path === 'string' && data.path ? data.path : null)
      || null
    : null;

  const imageUrlFromString = rawStringPath
    ? getImageUrlNew({
        url: rawStringPath,
        image_const_arr: appMainData?.image_prefix,
        type: 'image_fill',
        height: ((height * 2) / 2).toFixed(0),
        width: width.toFixed(0),
      })
    : null;

  const imageUrlNew = imageUrlFromObject || imageUrlFromString || '';

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={{
        ...styles.mainTouchContainer,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        margin: 6,
        backgroundColor: colors.white,
        borderRadius: moderateScale(14),
        overflow: 'hidden',
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <View>
        {!!data?.is_vendor_closed && !!data?.closed_store_order_scheduled ? (
          <View>
            <View style={{ justifyContent: 'center' }}>
              <FastImage
                source={{
                  uri: imageUrlNew,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={{
                  ...styles.mainImage,
                  ...fastImageStyle,
                  // opacity: 0.8,
                }}
              // resizeMode={FastImage.resizeMode.cover}
              />
              <View style={styles.vendorScheduledView}>
                <Text style={styles.vendorScheduledText}>
                  ` ${strings.WE_ARE_NOT_ACCEPTING} ${data?.delaySlot} `
                </Text>
              </View>
            </View>
          </View>
        ) : !!data?.is_vendor_closed &&
          data?.closed_store_order_scheduled == 0 ? (
          <Grayscale>
            <View
              style={{
                justifyContent: 'center',
                backgroundColor: colors.blackOpacity86,
              }}>
              <FastImage
                source={{
                  uri: imageUrlNew,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={{
                  ...styles.mainImage,
                  ...fastImageStyle,
                  opacity: 0.2,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Text style={{ ...styles.currentlyUnavailable }}>
                {strings.CURRENTLYUNAVAILABLE}
              </Text>
            </View>
          </Grayscale>
        ) : (
          <View>
            <FastImage
              source={{
                uri: imageUrlNew,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
              style={{
                ...styles.mainImage,
                ...fastImageStyle,
              }}
              resizeMode={FastImage.resizeMode.cover}></FastImage>
          </View>
        )}
      </View>
      {/* Card info bottom */}
      <View
        style={{
          paddingHorizontal: moderateScale(12),
          paddingTop: moderateScaleVertical(10),
          paddingBottom: moderateScaleVertical(12),
          backgroundColor:
            !!data?.is_vendor_closed && data?.closed_store_order_scheduled == 0
              ? getColorCodeWithOpactiyNumber(colors.textGreyLight.substring(1), 20)
              : colors.white,
        }}>

        {/* Vendor name */}
        <Text
          numberOfLines={1}
          style={{
            ...styles.categoryText,
            fontSize: textScale(14),
            width: '100%',
          }}>
          {data?.name}
        </Text>

        {/* Short description from categories */}
        {!!data?.categoriesList && (
          <Text
            numberOfLines={1}
            style={{
              color: colors.textGreyLight,
              fontSize: textScale(11),
              fontFamily: fontFamily.regular,
              marginTop: moderateScaleVertical(3),
            }}>
            {data?.categoriesList}
          </Text>
        )}

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: colors.greyColor || '#f0f0f0',
            marginTop: moderateScaleVertical(8),
            marginBottom: moderateScaleVertical(6),
          }}
        />

        {/* Book Now + Rating row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Book Now button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={{
              backgroundColor: themeColors?.primary_color || colors.black,
              paddingHorizontal: moderateScale(14),
              paddingVertical: moderateScale(5),
              borderRadius: moderateScale(20),
            }}>
            <Text style={{
              color: colors.white,
              fontSize: textScale(11),
              fontFamily: fontFamily.medium,
            }}>
              {strings.BOOK_NOW}
            </Text>
          </TouchableOpacity>

          {/* Rating badge */}
          {Number(data?.vendorRating || data?.rating) > 0 && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#e8f8f0',
              paddingHorizontal: moderateScale(8),
              paddingVertical: moderateScale(4),
              borderRadius: moderateScale(20),
              gap: moderateScale(4),
            }}>
              <Image
                style={{ tintColor: colors.green, width: moderateScale(11), height: moderateScale(11) }}
                source={imagePath.star}
                resizeMode="contain"
              />
              <Text style={{
                color: colors.green,
                fontSize: textScale(11),
                fontFamily: fontFamily.medium,
              }}>
                {Number(data?.vendorRating || data?.rating).toFixed(1)}
              </Text>
            </View>
          )}

        </View>

      </View>
    </TouchableOpacity>
    </Animated.View>
  );
};

export function stylesFunc({
  fontFamily,
  extraStyles,
  isDarkMode,
  MyDarkTheme,
}: any) {
  const styles = StyleSheet.create({
    mainTouchContainer: {
      borderRadius: moderateScale(14),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
      backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.white,
      margin: 6,
      overflow: 'hidden',
      ...extraStyles,
    },
    categoryText: {
      fontSize: textScale(14),
      color: colors.black,
      fontFamily: fontFamily.medium,
      width: '100%',
      textAlign: 'left',
    },
    mainImage: {
      height: moderateScaleVertical(115),
      width: '100%',
    },
    descView: {
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
      paddingVertical: moderateScale(4),
      paddingHorizontal: moderateScale(8),
      alignSelf: 'flex-end',
    },
    distanceView: {
      marginTop: moderateScale(5),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    distanceTimeStyle: {
      color: colors.blackOpacity70,
      fontSize: textScale(12),
      fontFamily: fontFamily.regular,
      textAlign: 'left',
      marginLeft: moderateScale(8),
    },
    currentlyUnavailable: {
      position: 'absolute',
      alignSelf: 'center',
      fontSize: textScale(16),
      color: colors.white,
      fontFamily: fontFamily?.bold,
    },
    vendorScheduledView: {
      position: 'absolute',
      bottom: moderateScaleVertical(1),
      // width: moderateScale(width / 1.2),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      // paddingHorizontal: moderateScale(6),
    },
    vendorScheduledText: {
      color: colors.white,
      fontSize: textScale(14),
      fontFamily: fontFamily.medium,
      textAlign: 'center',
      paddingHorizontal: moderateScaleVertical(4),
      backgroundColor: getColorCodeWithOpactiyNumber(
        colors.black.substring(1),
        60,
      ),
    },
  });
  return styles;
}
export default React.memo(MarketCard3);
