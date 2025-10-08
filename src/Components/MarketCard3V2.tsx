import React, { FC } from 'react';
import {
  Animated,
  Image,
  ScrollView,
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
import { appIds } from '../utils/constants/DynamicAppKeys';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';
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
  const scaleInAnimated = new Animated.Value(0);

  const appMainData = useSelector(
    (state: any) => state?.home?.appMainData || {},
  );

  let imageUrl = getImageUrl(
    data?.banner?.proxy_url || data?.image?.proxy_url,
    data?.banner?.image_path || data?.image?.image_path,
    '700/300',
  );

  let imageUrlNew = getImageUrlNew({
    url: data?.banner || data?.path || data?.logo || null,
    image_const_arr: appMainData.image_prefix,
    type: 'image_fill',
    height: ((height * 2) / 2).toFixed(0),
    width: width.toFixed(0),
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={{
        ...styles.mainTouchContainer,
        ...getScaleTransformationStyle(scaleInAnimated),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 1.84,
        elevation: 2,
        margin: 6,
        backgroundColor: colors.white,
        borderRadius: moderateScale(24),

        // backgroundColor: colors.redB,
      }}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}>
      <View>
        {!!data?.is_vendor_closed && !!data?.closed_store_order_scheduled ? (
          <View>
            <View style={{ justifyContent: 'center' }}>
              <FastImage
                source={{
                  uri: imageUrl,
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
                  uri: imageUrl,
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
                uri: getBundleId() === appIds.spa ? imageUrl : imageUrlNew,
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
      <View
        style={{
          paddingHorizontal: moderateScale(16),
          backgroundColor:
            !!data?.is_vendor_closed && data?.closed_store_order_scheduled == 0
              ? getColorCodeWithOpactiyNumber(
                colors.textGreyLight.substring(1),
                20,
              )
              : colors.whiteOpacity15,

          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: moderateScaleVertical(8),
        }}>

        <View>

          <View style={styles.descView}>
            <Text
              numberOfLines={1}
              style={{
                ...styles.categoryText,
                fontSize: textScale(18),
              }}>
              {data?.name}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: moderateScale(8), alignItems: 'center' }}>
            {!!data?.lineOfSightDistance && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {!!data?.timeofLineOfSightDistance && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{

                        width: moderateScale(12),
                        height: moderateScale(12),
                        opacity: data?.is_vendor_closed ? 0.5 : 1,
                      }}
                      resizeMode="contain"
                      source={imagePath.icTime2}
                    />
                    <Text numberOfLines={1} style={styles.distanceTimeStyle}>
                      {data?.timeofLineOfSightDistance}
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    height: moderateScale(12),
                    borderRightWidth: 0.8,
                    marginHorizontal: moderateScale(8),
                    borderRightColor: colors.black,
                  }}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...styles.distanceTimeStyle,
                      marginLeft: moderateScale(0),
                    }}>
                    {vendorDistance} km
                  </Text>
                </View>

                {Number(data?.delivery_fee_minimum) == 0 && Number(data?.delivery_fee_maximum) == 0 && !!appData?.profile?.preferences?.static_delivey_fee && <View
                  style={{
                    height: moderateScale(12),
                    borderRightWidth: 0.8,
                    marginHorizontal: moderateScale(8),
                    borderRightColor: colors.black,
                  }}
                />}
                {Number(data?.delivery_fee_minimum) == 0 && Number(data?.delivery_fee_maximum) == 0 && !!appData?.profile?.preferences?.static_delivey_fee && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{

                        width: moderateScale(14),
                        height: moderateScale(14),
                        opacity: data?.is_vendor_closed ? 0.5 : 1,
                      }}
                      resizeMode="contain"
                      source={imagePath.scooter}
                    />
                    <Text numberOfLines={1} style={styles.distanceTimeStyle}>
                      {strings.FREE}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {!!data?.promo_discount ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(4), marginTop: moderateScaleVertical(8) }}>
              <Image tintColor={colors.blue} source={imagePath.ic_offersIcon} />
              <Text
                numberOfLines={1}
                style={{
                  color: colors.blackOpacity70,
                  fontSize: textScale(12),
                  fontFamily: fontFamily.medium,
                  textAlign: 'left',
                }}>
                {data?.promo_discount}
              </Text>
            </View>
          ) : null}
        </View>
        {!!data?.rating && (
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.green,
                paddingVertical: moderateScale(4),

                borderRadius: moderateScale(20),
                marginBottom: moderateScale(4),
                width: moderateScale(54),
                justifyContent: 'space-between',




              }}>
              <Text
                style={{
                  ...styles.ratingTxt,
                  color: colors.white,
                  fontSize: textScale(12),
                  fontFamily: fontFamily.medium,

                  marginLeft: moderateScale(10),
                }}>
                {Number(data?.rating).toFixed(1)}
              </Text>
              <View
                style={{
                  backgroundColor: colors.white,
                  borderRadius: moderateScale(10),
                  padding: moderateScale(3),
                  marginRight: moderateScale(4),
                }}>
                <Image
                  style={{
                    tintColor: colors.green,
                    width: moderateScale(12),
                    height: moderateScale(12),
                  }}
                  source={imagePath.star}
                  resizeMode="contain"
                />
              </View>
            </View>
            <Text
              style={{
                color: colors.textGreyLight,
                fontSize: textScale(8),
                fontFamily: fontFamily.regular,
              }}>
              For you
            </Text>
          </View>
        )}
      </View>
      <ScrollView horizontal contentContainerStyle={{ marginHorizontal: moderateScale(16), marginVertical: moderateScaleVertical(8), gap: moderateScale(8) }}>
        {<View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backGroundGreyD, paddingHorizontal: moderateScale(8), paddingVertical: moderateScale(4), borderRadius: moderateScale(12) }}>
          <Image source={imagePath.tick} tintColor={colors.green} style={{ marginRight: moderateScale(4), width: moderateScale(12), height: moderateScale(12), resizeMode: 'contain' }} />
          <Text style={{ fontSize: textScale(10), fontFamily: fontFamily.regular, color: colors.blackOpacity70 }}>{strings.ONTIME_PREPERATION}</Text>
        </View>}
        {index % 2 == 0 && <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backGroundGreyD, paddingHorizontal: moderateScale(8), paddingVertical: moderateScale(4), borderRadius: moderateScale(12) }}>
          <Image source={imagePath.tick} tintColor={colors.green} style={{ marginRight: moderateScale(4), width: moderateScale(12), height: moderateScale(12), resizeMode: 'contain' }} />
          <Text style={{ fontSize: textScale(10), fontFamily: fontFamily.regular, color: colors.blackOpacity70 }}>{strings.FREEQUENTLY_REORDERED}</Text>
        </View>}
      </ScrollView>
    </TouchableOpacity>
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
      borderRadius: moderateScale(10),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 1.84,
      elevation: 2,
      backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.white,
      margin: 6,
      ...extraStyles,
    },
    categoryText: {
      fontSize: textScale(16),
      color: colors.black,
      fontFamily: fontFamily.medium,
      width: '85%',
      textAlign: 'left',
    },
    mainImage: {
      height: moderateScaleVertical(180),
      width: '100%',
      borderTopRightRadius: moderateScale(20),
      borderTopLeftRadius: moderateScale(20),
      padding: moderateScaleVertical(12),
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
